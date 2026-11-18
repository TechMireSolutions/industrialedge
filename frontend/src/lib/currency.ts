// Shared PKR Currency Formatting & Logistics Constants for IndustrialEdge.pk

export const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs.";
export const CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY || "PKR";
export const CURRENCY_LOCALE = "en-PK";
export const USD_TO_PKR_RATE = 280;
export const DEFAULT_FREE_SHIPPING_THRESHOLD = 25000;
export const DEFAULT_FLAT_SHIPPING = 500;

const pkrNumberFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric PKR amount cleanly using en-PK locale, e.g. 126000 -> "Rs. 126,000"
 */
export function formatPrice(
  amount: number | undefined | null,
  symbol = CURRENCY_SYMBOL,
  decimals = 0
): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return `${symbol} 0`;
  if (decimals === 0) {
    return `${symbol} ${pkrNumberFormatter.format(Math.round(num))}`;
  }
  const formatted = new Intl.NumberFormat(CURRENCY_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
  return `${symbol} ${formatted}`;
}

/**
 * Standard Intl.NumberFormat currency helper defaulting to PKR ("en-PK").
 */
export function formatCurrency(
  amount: number | undefined | null,
  options?: { currency?: string; decimals?: number; symbol?: string }
): string {
  const currency = options?.currency || CURRENCY_CODE;
  const decimals = options?.decimals ?? 0;
  if (currency === "PKR") {
    return formatPrice(amount, options?.symbol || CURRENCY_SYMBOL, decimals);
  }
  const num = Number(amount);
  const safe = Number.isFinite(num) ? num : 0;
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safe);
}

/**
 * Formats compact PKR figures for charts/tooltips, e.g. 1250000 -> "Rs. 1.25M" or 126000 -> "Rs. 126k"
 */
export function formatCompactPrice(
  amount: number | undefined | null,
  symbol = CURRENCY_SYMBOL
): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return `${symbol} 0`;
  if (Math.abs(num) >= 1_000_000) {
    return `${symbol} ${(num / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `${symbol} ${Math.round(num / 1_000)}k`;
  }
  return formatPrice(num, symbol);
}

/**
 * Converts a legacy USD numeric value to a cleanly rounded PKR value (nearest 100).
 */
export function usdToPkr(usd: number): number {
  return Math.round((usd * USD_TO_PKR_RATE) / 100) * 100;
}
