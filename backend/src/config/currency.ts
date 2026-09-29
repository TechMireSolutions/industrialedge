/**
 * Canonical storefront currency catalog.
 *
 * This module is the SINGLE SOURCE OF TRUTH for how a monetary amount is
 * presented across the whole application (backend emails, error messages and
 * any server-rendered string).
 *
 * It is intentionally PURE: no database, no Prisma, no Express. That lets the
 * settings repository normalise the persisted configuration without creating
 * an import cycle, and lets the frontend mirror the exact same rules.
 *
 * Extending currency support is a one-line change HERE. No price component,
 * no page, and no admin form needs to be touched.
 */

export type CurrencyPosition = 'before' | 'after';

export interface CurrencyDefinition {
  /** ISO 4217 alphabetic code. Stored in `system_settings.defaultCurrency`. */
  currencyCode: string;
  /** Glyph rendered next to the amount. Stored in `system_settings.currencySymbol`. */
  currencySymbol: string;
  /** Human readable name. Stored in `system_settings.currencyName`. */
  currencyName: string;
  /** Whether the symbol leads or trails the amount. */
  currencyPosition: CurrencyPosition;
  /** Whether a space separates the symbol from the amount (`Rs 1,499` vs `$1,499`). */
  currencySpace: boolean;
  /** Maximum fraction digits used when the amount is not a whole number. */
  currencyDecimals: number;
  /** Locale driving digit grouping / separators. */
  locale: string;
}

/**
 * Production storefront default. Also the hard fallback used whenever the
 * persisted configuration is missing, empty, or corrupt â€” the application must
 * never crash because currency settings are absent.
 */
export const FALLBACK_CURRENCY: CurrencyDefinition = {
  currencyCode: 'PKR',
  currencySymbol: 'Rs',
  currencyName: 'Pakistani Rupee',
  currencyPosition: 'before',
  currencySpace: true,
  currencyDecimals: 2,
  locale: 'en-US',
};

export const DEFAULT_CURRENCY_CODE = FALLBACK_CURRENCY.currencyCode;

/**
 * Every entry deliberately shares the `en-US` number-formatting locale and a
 * 2-digit fraction scale.
 *
 * Rationale: this application performs NO exchange-rate conversion, so the
 * stored number is rendered verbatim. Grouping/decimal conventions must
 * therefore stay constant across the whole storefront when the admin switches
 * currency — otherwise the same value would read `Rs 1,49,999` in one currency
 * and `Rs 1,499` in another, which reads as a bug to customers.
 *
 * `locale` and `currencyDecimals` remain first-class fields so per-currency
 * tuning (or a future exchange-rate architecture) needs no component changes.
 */
export const SUPPORTED_CURRENCIES: readonly CurrencyDefinition[] = [
  {
    currencyCode: 'PKR',
    currencySymbol: 'Rs',
    currencyName: 'Pakistani Rupee',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'USD',
    currencySymbol: '$',
    currencyName: 'US Dollar',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'EUR',
    currencySymbol: '\u20AC',
    currencyName: 'Euro',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'GBP',
    currencySymbol: '\u00A3',
    currencyName: 'British Pound',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'AED',
    currencySymbol: '\u062F.\u0625',
    currencyName: 'UAE Dirham',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'SAR',
    currencySymbol: '\u0631.\u0633',
    currencyName: 'Saudi Riyal',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'CAD',
    currencySymbol: '$',
    currencyName: 'Canadian Dollar',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'AUD',
    currencySymbol: '$',
    currencyName: 'Australian Dollar',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'CHF',
    currencySymbol: 'CHF',
    currencyName: 'Swiss Franc',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'INR',
    currencySymbol: '\u20B9',
    currencyName: 'Indian Rupee',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'CNY',
    currencySymbol: '\u00A5',
    currencyName: 'Chinese Yuan',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'JPY',
    currencySymbol: '\u00A5',
    currencyName: 'Japanese Yen',
    currencyPosition: 'before',
    currencySpace: false,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'TRY',
    currencySymbol: '\u20BA',
    currencyName: 'Turkish Lira',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'QAR',
    currencySymbol: 'QR',
    currencyName: 'Qatari Riyal',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'OMR',
    currencySymbol: 'OMR',
    currencyName: 'Omani Rial',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'KWD',
    currencySymbol: 'KD',
    currencyName: 'Kuwaiti Dinar',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'BDT',
    currencySymbol: '\u09F3',
    currencyName: 'Bangladeshi Taka',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
  {
    currencyCode: 'LKR',
    currencySymbol: 'Rs',
    currencyName: 'Sri Lankan Rupee',
    currencyPosition: 'before',
    currencySpace: true,
    currencyDecimals: 2,
    locale: 'en-US',
  },
] as const;

/** Slug lookup used on every request; built once at module load. */
const CURRENCY_BY_CODE = new Map<string, CurrencyDefinition>(
  SUPPORTED_CURRENCIES.map((currency) => [currency.currencyCode, currency])
);

const cleanString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const clampDecimals = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(4, Math.max(0, Math.trunc(parsed)));
};

export const getCurrencyDefinition = (code?: unknown): CurrencyDefinition | null => {
  const normalized = cleanString(code);
  if (!normalized) return null;
  return CURRENCY_BY_CODE.get(normalized.toUpperCase()) ?? null;
};

export const isSupportedCurrencyCode = (code?: unknown): boolean =>
  getCurrencyDefinition(code) !== null;

export const listSupportedCurrencies = (): CurrencyDefinition[] =>
  SUPPORTED_CURRENCIES.map((currency) => ({ ...currency }));

/**
 * Coerce any partial/legacy/corrupt currency payload into a complete, valid
 * definition. Presentation metadata (position, spacing, decimals, locale) is
 * always derived from the catalog for the given code so a saved currency can
 * never produce an inconsistent layout.
 */
export const normalizeCurrencySettings = (input?: any): CurrencyDefinition => {
  if (!input || typeof input !== 'object') {
    return { ...FALLBACK_CURRENCY };
  }

  const definition = getCurrencyDefinition(input.currencyCode ?? input.defaultCurrency);

  if (!definition) {
    // Unknown or missing code: keep whatever label was stored so the admin
    // still sees their data, but fall back to the safe production default.
    return {
      ...FALLBACK_CURRENCY,
      currencySymbol: cleanString(input.currencySymbol) ?? FALLBACK_CURRENCY.currencySymbol,
      currencyName: cleanString(input.currencyName) ?? FALLBACK_CURRENCY.currencyName,
    };
  }

  return {
    currencyCode: definition.currencyCode,
    currencySymbol: cleanString(input.currencySymbol) ?? definition.currencySymbol,
    currencyName: cleanString(input.currencyName) ?? definition.currencyName,
    currencyPosition: definition.currencyPosition,
    currencySpace: definition.currencySpace,
    currencyDecimals: definition.currencyDecimals,
    locale: definition.locale,
  };
};

/** Public shape emitted by the settings API and consumed by the storefront. */
export interface CurrencySettings extends CurrencyDefinition {
  /** Always true â€” no exchange-rate conversion is performed anywhere. */
  conversionApplied: false;
}

export const toCurrencySettings = (input?: any): CurrencySettings => ({
  ...normalizeCurrencySettings(input),
  conversionApplied: false,
});

/**
 * Coerce Prisma Decimal instances, numeric strings, `null` and `NaN` into a
 * finite number. Returns `null` when the value cannot be interpreted so the
 * caller can decide on a placeholder instead of rendering `NaN`.
 */
export const toFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  // Prisma.Decimal / BigInt / objects exposing toString()/valueOf()
  if (typeof value === 'object') {
    const candidate = value as { toString?: () => string; s?: number; e?: number; d?: number[] };
    if (typeof candidate.toString === 'function') {
      const parsed = Number(candidate.toString());
      return Number.isFinite(parsed) ? parsed : null;
    }
  }

  return null;
};

export interface FormatCurrencyOptions {
  /** Force a fixed number of decimals instead of the whole/fractional rule. */
  decimals?: number;
  /** Text used when the amount cannot be interpreted. Defaults to the fallback symbol + 0. */
  fallbackText?: string;
}

/**
 * THE canonical formatter. Presentation only â€” the numeric value is rendered
 * as-is, never converted.
 *
 * Precision rule (professional storefront output):
 *   whole amount      -> no fraction digits   (1500   -> "Rs 1,500")
 *   fractional amount -> currency decimals     (125999.5 -> "Rs 125,999.50")
 */
export const formatCurrencyAmount = (
  amount: unknown,
  currency?: any,
  options: FormatCurrencyOptions = {}
): string => {
  const resolved = normalizeCurrencySettings(currency);

  const numeric = toFiniteNumber(amount);

  if (numeric === null) {
    return options.fallbackText ?? `${resolved.currencySymbol} 0`;
  }

  const forcedDecimals =
    options.decimals === undefined ? null : clampDecimals(options.decimals, resolved.currencyDecimals);

  const fractionDigits =
    forcedDecimals !== null
      ? forcedDecimals
      : Number.isInteger(numeric)
        ? 0
        : resolved.currencyDecimals;

  let grouped: string;
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
