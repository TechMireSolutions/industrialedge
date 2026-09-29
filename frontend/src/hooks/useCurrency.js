import { useCallback, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  createCurrencyFormatter,
  formatCurrency as formatCurrencyAmount,
  resolveCurrency as resolveCurrencySettings,
  resolveOrderCurrency as resolveOrderCurrencySettings,
  DEFAULT_CURRENCY,
} from '../utils/currency';

/**
 * THE accessor for currency in the storefront and the admin panel.
 *
 * Data flow (no component ever calls the settings API itself):
 *   Database -> Settings Service -> Public Settings API -> SettingsContext
 *            -> useCurrency() -> formatPrice()
 *
 * Every consumer gets the same formatter, so a single Admin Settings save
 * updates every price in the application at once.
 *
 * @param {object} [override] explicit currency, e.g. an order's purchase-time
 *                            snapshot. Historical orders keep their original
 *                            currency; omit it to use the live storefront one.
 */
export const useCurrency = (override) => {
  const settingsContext = useSettings();

  const storefrontCurrency = useMemo(() => {
    const fromApi = settingsContext?.settings?.currency;
    const fromAdmin = settingsContext?.settings?.system;

    return resolveCurrencySettings(fromApi ?? fromAdmin);
  }, [settingsContext?.settings]);

  const currency = useMemo(
    () => (override ? resolveCurrencySettings(override) : storefrontCurrency),
    [override, storefrontCurrency]
  );

  const formatPrice = useCallback(
    (amount, options) => formatCurrencyAmount(amount, currency, options),
    [currency]
  );

  /** Formatter bound to this currency, handy for `map`/template callbacks. */
  const formatter = useMemo(() => createCurrencyFormatter(currency), [currency]);

  return {
    currency,
    storefrontCurrency,
    formatPrice,
    formatCurrency: formatter,
    isLoading: Boolean(settingsContext?.loading),
  };
};

/**
 * Currency for a historical order.
 *
 * Prefers the snapshot stored on the order at purchase time and only falls back
 * to the current storefront setting when the order predates the feature, so a
 * later Admin currency change never rewrites what a past order was sold for.
 *
 * @param {object} order
 * @returns {{ currency: object, formatPrice: (amount, options?) => string }}
 */
export const useOrderCurrency = (order) => {
  const settingsContext = useSettings();

  const storefrontCurrency = useMemo(
    () =>
      resolveCurrencySettings(
        settingsContext?.settings?.currency ?? settingsContext?.settings?.system
      ),
    [settingsContext?.settings]
  );

  const currency = useMemo(
    () => resolveOrderCurrencySettings(order, storefrontCurrency),
    [order, storefrontCurrency]
  );

  const formatPrice = useCallback(
    (amount, options) => formatCurrencyAmount(amount, currency, options),
    [currency]
  );

  return { currency, formatPrice };
};

export { DEFAULT_CURRENCY };
