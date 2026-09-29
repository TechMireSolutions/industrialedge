import {
  CurrencyDefinition,
  CurrencySettings,
  FALLBACK_CURRENCY,
  formatCurrencyAmount,
  FormatCurrencyOptions,
  getCurrencyDefinition,
  listSupportedCurrencies,
  normalizeCurrencySettings,
  toCurrencySettings,
} from '../config/currency.js';
import { settingsRepository } from '../repositories/settingsRepository.js';

/**
 * Database-backed currency facade.
 *
 * Reads through the EXISTING settings repository so the storefront currency
 * shares the settings cache (and its invalidation on admin save) with every
 * other settings module. There is deliberately no separate currency table and
 * no second settings query path.
 */
export const currencyService = {
  /**
   * Resolve the storefront currency from persisted system settings.
   * Always returns a complete definition — never throws, never returns null.
   */
  async getCurrencySettings(): Promise<CurrencySettings> {
    try {
      const publicSettings = await settingsRepository.getPublicSettings();
      const resolved = (publicSettings as any)?.currency;

      if (!resolved) {
        return toCurrencySettings(FALLBACK_CURRENCY);
      }

      return toCurrencySettings(resolved);
    } catch (error) {
      console.error('Failed to resolve storefront currency, using fallback:', error);
      return toCurrencySettings(FALLBACK_CURRENCY);
    }
  },

  /** Catalog powering the admin dropdown. Adding a currency requires no UI change. */
  getSupportedCurrencies(): CurrencyDefinition[] {
    return listSupportedCurrencies();
  },

  getCurrencyDefinition(code?: unknown): CurrencyDefinition | null {
    return getCurrencyDefinition(code);
  },

  /**
   * Resolve the currency an order was purchased in.
   *
   * Orders store a currency snapshot at purchase time. Historical orders that
   * predate this feature have no snapshot, so they fall back to the current
   * storefront currency — the safest backward-compatible behaviour, and one
   * that never rewrites a historical financial record.
   */
  async getOrderCurrency(snapshot?: { currencyCode?: string | null; currencySymbol?: string | null } | null): Promise<CurrencySettings> {
    const current = await this.getCurrencySettings();

    if (!snapshot?.currencyCode) {
      return current;
    }

    return toCurrencySettings({
      currencyCode: snapshot.currencyCode,
      currencySymbol: snapshot.currencySymbol,
    });
  },

  normalizeCurrencySettings,

  /**
   * Format an amount using an explicit currency (or the live storefront
   * currency when none is supplied). Presentation only — never converts.
   */
  async formatAmount(amount: unknown, currency?: any, options?: FormatCurrencyOptions): Promise<string> {
    const resolved = currency
      ? normalizeCurrencySettings(currency)
      : await this.getCurrencySettings();

    return formatCurrencyAmount(amount, resolved, options);
  },

  /** Synchronous variant for call sites that already hold the settings. */
  formatAmountWith(amount: unknown, currency: any, options?: FormatCurrencyOptions): string {
    return formatCurrencyAmount(amount, normalizeCurrencySettings(currency), options);
  },
};
