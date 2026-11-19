import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  formatPrice,
  formatCurrency,
  formatCompactPrice,
  usdToPkr,
  CURRENCY_SYMBOL,
  CURRENCY_CODE,
} from "@/lib/currency";
import { getApiUrl } from "@/lib/api";

describe("PKR Currency Utilities", () => {
  it("formats prices with default Rs. currency symbol and en-PK grouping", () => {
    expect(formatPrice(126000)).toMatch(/Rs\.\s*126,000/);
    expect(formatPrice(450)).toMatch(/Rs\.\s*450/);
    expect(formatPrice(0)).toMatch(/Rs\.\s*0/);
    expect(formatPrice(null)).toMatch(/Rs\.\s*0/);
  });

  it("handles custom symbol and decimal options cleanly", () => {
    expect(formatPrice(1250.5, "PKR", 2)).toMatch(/PKR\s*1,250\.50/);
  });

  it("formats compact figures for charts and KPIs", () => {
    expect(formatCompactPrice(1250000)).toBe("Rs. 1.25M");
    expect(formatCompactPrice(126000)).toBe("Rs. 126k");
    expect(formatCompactPrice(500)).toMatch(/Rs\.\s*500/);
  });

  it("converts legacy USD prices to rounded PKR", () => {
    expect(usdToPkr(100)).toBe(28000);
    expect(usdToPkr(450)).toBe(126000);
  });

  it("exports standard PKR constants", () => {
    expect(CURRENCY_CODE).toBe("PKR");
    expect(CURRENCY_SYMBOL).toBe("Rs.");
  });
});

describe("API URL Resolver and Bridge", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;
  const originalBackend = process.env.BACKEND_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
    process.env.BACKEND_URL = originalBackend;
  });

  it("resolves relative /api paths cleanly", () => {
    expect(getApiUrl("products")).toContain("/api/products");
    expect(getApiUrl("/health")).toContain("/api/health");
  });

  it("passes full external URLs through unchanged", () => {
    expect(getApiUrl("https://example.com/api/test")).toBe("https://example.com/api/test");
  });
});

