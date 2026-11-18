// Shared PKR Currency Formatting & Logistics Constants for IndustrialEdge.pk

export const CURRENCY_SYMBOL = "Rs.";
export const CURRENCY_CODE = "PKR";
export const USD_TO_PKR_RATE = 280;
export const DEFAULT_FREE_SHIPPING_THRESHOLD = 25000;
export const DEFAULT_FLAT_SHIPPING = 500;

/**
 * Formats a numeric PKR amount cleanly, e.g. 126000 -> "Rs. 126,000"
 */
export function formatPrice(amount: number | undefined | null, symbol = CURRENCY_SYMBOL): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return `${symbol} 0`;
  const rounded = Math.round(num);
  return `${symbol} ${rounded.toLocaleString("en-PK")}`;
}

/**
 * Formats compact PKR figures for charts/tooltips, e.g. 1250000 -> "Rs. 1.25M" or 126000 -> "Rs. 126k"
 */
export function formatCompactPrice(amount: number | undefined | null, symbol = CURRENCY_SYMBOL): string {
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
 * Converts a USD numeric value to a cleanly rounded PKR value (nearest 100).
 */
export function usdToPkr(usd: number): number {
  return Math.round((usd * USD_TO_PKR_RATE) / 100) * 100;
}

