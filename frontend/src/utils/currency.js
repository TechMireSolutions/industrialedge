/**
 * ============================================================================
 *  CANONICAL STOREFRONT CURRENCY UTILITY  —  Industrial Edge
 * ============================================================================
 *
 *  THE single place where a monetary amount becomes a string.
 *
 *  Data flow:
 *    Database (system_settings)
 *      -> Backend Settings Service  (settingsRepository / currencyService)
 *      -> Public Settings API       (GET /api/settings/public  ->  .currency)
 *      -> SettingsContext           (central settings state)
 *      -> resolveCurrency()         (this module)
 *      -> formatCurrency()          (this module)
 *      -> every price component
 *
 *  RULES
 *   - No component may hardcode "PKR", "Rs", "$" or a number format.
 *   - No component may call the settings API on its own.
 *   - NO exchange-rate conversion is performed. The stored number is rendered
 *     verbatim; only its presentation changes.
 *   - Missing / malformed settings fall back to PKR / "Rs" and never throw.
 *
 *  The catalog below mirrors `backend/src/config/currency.ts`. The backend
 *  remains the source of truth: it serves the live catalog from
 *  `GET /api/settings/currency`, and this bundled copy is only the offline /
 *  first-paint fallback.
 */

const FALLBACK_CURRENCY = Object.freeze({
  currencyCode: 'PKR',
  currencySymbol: 'Rs',
  currencyName: 'Pakistani Rupee',
  currencyPosition: 'before',
  currencySpace: true,
  currencyDecimals: 2,
  locale: 'en-US',
});

export const DEFAULT_CURRENCY = FALLBACK_CURRENCY;

/**
 * Offline mirror of the backend catalog. Adding a currency on the server makes
 * it available here automatically through the API; this list only guarantees
 * the admin dropdown and the storefront still work if that request fails.
 */
export const CURRENCY_CATALOG = Object.freeze([
  { currencyCode: 'PKR', currencySymbol: 'Rs', currencyName: 'Pakistani Rupee', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'USD', currencySymbol: '$', currencyName: 'US Dollar', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'EUR', currencySymbol: '\u20AC', currencyName: 'Euro', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'GBP', currencySymbol: '\u00A3', currencyName: 'British Pound', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'AED', currencySymbol: '\u062F.\u0625', currencyName: 'UAE Dirham', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'SAR', currencySymbol: '\u0631.\u0633', currencyName: 'Saudi Riyal', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'CAD', currencySymbol: '$', currencyName: 'Canadian Dollar', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'AUD', currencySymbol: '$', currencyName: 'Australian Dollar', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'CHF', currencySymbol: 'CHF', currencyName: 'Swiss Franc', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'INR', currencySymbol: '\u20B9', currencyName: 'Indian Rupee', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'CNY', currencySymbol: '\u00A5', currencyName: 'Chinese Yuan', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'JPY', currencySymbol: '\u00A5', currencyName: 'Japanese Yen', currencyPosition: 'before', currencySpace: false, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'TRY', currencySymbol: '\u20BA', currencyName: 'Turkish Lira', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'QAR', currencySymbol: 'QR', currencyName: 'Qatari Riyal', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'OMR', currencySymbol: 'OMR', currencyName: 'Omani Rial', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'KWD', currencySymbol: 'KD', currencyName: 'Kuwaiti Dinar', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'BDT', currencySymbol: '\u09F3', currencyName: 'Bangladeshi Taka', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
  { currencyCode: 'LKR', currencySymbol: 'Rs', currencyName: 'Sri Lankan Rupee', currencyPosition: 'before', currencySpace: true, currencyDecimals: 2, locale: 'en-US' },
]);

const cleanString = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const clampDecimals = (value, fallback) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(4, Math.max(0, Math.trunc(parsed)));
};

/** Look a currency up in whichever catalog is available. */
export const getCurrencyDefinition = (code) => {
  const normalized = cleanString(code);
  if (!normalized) return null;
  const upper = normalized.toUpperCase();
  return (
    CURRENCY_CATALOG.find((currency) => currency.currencyCode === upper) ?? null
  );
};

/**
 * Turn any partial / legacy / malformed currency payload into a complete, valid
 * definition. Presentation metadata always comes from the catalog for the given
 * code so a saved currency can never produce an inconsistent layout.
 */
export const resolveCurrency = (input) => {
  if (!input || typeof input !== 'object') {
    return { ...FALLBACK_CURRENCY };
  }

  const definition = getCurrencyDefinition(
    input.currencyCode ?? input.defaultCurrency
  );

  if (!definition) {
    return {
      ...FALLBACK_CURRENCY,
      currencySymbol:
        cleanString(input.currencySymbol) ?? FALLBACK_CURRENCY.currencySymbol,
      currencyName:
        cleanString(input.currencyName) ?? FALLBACK_CURRENCY.currencyName,
    };
  }

  return {
    currencyCode: definition.currencyCode,
    currencySymbol:
      cleanString(input.currencySymbol) ?? definition.currencySymbol,
    currencyName: cleanString(input.currencyName) ?? definition.currencyName,
    currencyPosition: definition.currencyPosition,
    currencySpace: definition.currencySpace,
    currencyDecimals: definition.currencyDecimals,
    locale: definition.locale,
  };
};

/**
 * Coerce numbers, numeric strings, Prisma Decimal instances, `null`, `''` and
 * `NaN` into a finite number. Returns `null` when the value is uninterpretable
 * so callers get a safe placeholder instead of "NaN" on screen.
 */
export const toFiniteNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  // Prisma.Decimal / BigInt / anything with a usable toString()
  if (typeof value === 'object') {
    const candidate = value;
    if (typeof candidate.toString === 'function') {
      const parsed = Number(candidate.toString());
      return Number.isFinite(parsed) ? parsed : null;
    }
  }

  return null;
};

/**
 * THE formatter every price display must use.
 *
 * @param {unknown} amount    number, numeric string, Decimal, or nullish
 * @param {object}  currency  resolved currency; omit to use the PKR fallback
 * @param {object}  [options]
 * @param {number}  [options.decimals]      force a fixed number of decimals
 * @param {string}  [options.fallbackText] text for uninterpretable values
 *
 * Precision (professional storefront output):
 *   whole amount      -> no fraction digits   1500     -> "Rs 1,500"
 *   fractional amount -> configured decimals   1299.99  -> "Rs 1,299.99"
 *
 * Examples with PKR: "Rs 1,499" | "Rs 25,000" | "Rs 125,999.50"
 */
export const formatCurrency = (amount, currency, options = {}) => {
  const resolved = resolveCurrency(currency);
  const numeric = toFiniteNumber(amount);

  if (numeric === null) {
    return options.fallbackText ?? `${resolved.currencySymbol} 0`;
  }

  const forcedDecimals =
    options.decimals === undefined
      ? null
      : clampDecimals(options.decimals, resolved.currencyDecimals);

  const fractionDigits =
    forcedDecimals !== null
      ? forcedDecimals
      : Number.isInteger(numeric)
        ? 0
        : resolved.currencyDecimals;

  let grouped;
  try {
    grouped = new Intl.NumberFormat(resolved.locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(Math.abs(numeric));
  } catch {
    grouped = Math.abs(numeric).toFixed(fractionDigits);
  }

  const sign = numeric < 0 ? '-' : '';
  const separator = resolved.currencySpace ? ' ' : '';

  return resolved.currencyPosition === 'after'
    ? `${sign}${grouped}${separator}${resolved.currencySymbol}`
    : `${sign}${resolved.currencySymbol}${separator}${grouped}`;
};

/**
 * Resolve the currency an order was purchased in.
 *
 * Orders carry a currency snapshot from purchase time. When that snapshot is
 * missing (orders placed before this feature existed) we fall back to the live
 * storefront currency — historical records are never rewritten.
 */
export const resolveOrderCurrency = (order, storefrontCurrency) => {
  const snapshotCode =
    order?.currency?.currencyCode ?? order?.currencyCode ?? null;

  if (!snapshotCode) {
    return resolveCurrency(storefrontCurrency);
  }

  return resolveCurrency({
    currencyCode: snapshotCode,
    currencySymbol:
      order?.currency?.currencySymbol ?? order?.currencySymbol ?? null,
  });
};

/** Compact adapter so a component never has to know the signature. */
export const createCurrencyFormatter = (currency) => {
  const resolved = resolveCurrency(currency);
  const format = (amount, options) => formatCurrency(amount, resolved, options);
  format.currency = resolved;
  return format;
};
