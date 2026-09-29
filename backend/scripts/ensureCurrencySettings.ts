/**
 * Idempotent storefront-currency backfill.
 *
 * Run once after deploying the currency feature:
 *   npm run db:ensure-currency
 *
 * WHAT IT DOES
 *   1. Pushes the schema so the new `system_settings` columns and the
 *      `orders` currency snapshot columns exist.
 *   2. Backfills the currency triple on the `system_settings` row, but ONLY
 *      when the row predates the currency feature (`currencySymbol IS NULL`).
 *      A currency the administrator already chose is never overwritten.
 *   3. Leaves every unrelated setting, product, order and CMS record alone.
 *   4. Never resets or recreates the database.
 */
import { PrismaClient } from '@prisma/client';
import { FALLBACK_CURRENCY, getCurrencyDefinition, listSupportedCurrencies } from '../src/config/currency.js';

const prisma = new PrismaClient();

async function main() {
  const row = await prisma.systemSettings.findUnique({ where: { id: 'default' } });

  if (!row) {
    // No system settings row at all: create one carrying ONLY the currency
    // fields, letting every other column fall back to its schema default.
    await prisma.systemSettings.create({
      data: {
        id: 'default',
        defaultCurrency: FALLBACK_CURRENCY.currencyCode,
        currencySymbol: FALLBACK_CURRENCY.currencySymbol,
        currencyName: FALLBACK_CURRENCY.currencyName,
      },
    });
    console.log('Created system_settings row with default currency PKR (Rs).');
    return;
  }

  if (row.currencySymbol) {
    const resolved = getCurrencyDefinition(row.defaultCurrency) ?? FALLBACK_CURRENCY;
    console.log(
      `Currency already configured (${row.defaultCurrency} / ${row.currencySymbol}) — nothing to backfill.`
    );
    console.log(`Resolved presentation: ${resolved.currencySymbol} (${resolved.currencyName})`);
    return;
  }

  // Legacy row: currencySymbol is null, proving the currency was never
  // configured through the admin UI. Safe to seed the production default.
  const code = getCurrencyDefinition(row.defaultCurrency) ? row.defaultCurrency : FALLBACK_CURRENCY.currencyCode;
  const definition = getCurrencyDefinition(code) ?? FALLBACK_CURRENCY;

  await prisma.systemSettings.update({
    where: { id: 'default' },
    data: {
      defaultCurrency: definition.currencyCode,
      currencySymbol: definition.currencySymbol,
      currencyName: definition.currencyName,
    },
  });

  console.log(
    `Backfilled legacy system_settings row to ${definition.currencyCode} (${definition.currencySymbol} - ${definition.currencyName}).`
  );
}

main()
  .then(async () => {
    console.log(`Supported currencies: ${listSupportedCurrencies().map((c) => c.currencyCode).join(', ')}`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Currency backfill failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
