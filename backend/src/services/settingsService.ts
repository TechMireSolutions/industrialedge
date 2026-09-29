import { settingsRepository } from '../repositories/settingsRepository.js';
import { AppError } from '../middleware/errorHandler.js';
import { getCurrencyDefinition } from '../config/currency.js';

export const settingsService = {
  async getPublicSettings() {
    return settingsRepository.getPublicSettings();
  },

  async getAdminSettings() {
    return settingsRepository.getAdminSettings();
  },

  async updateSettings(data: any, adminId: string, ip: string) {
    if (!adminId) {
      throw new AppError(401, 'Unauthorized to update settings');
    }

    // Validate data through service layer before sending to repository
    // Optional: we can add Zod parsing here if not done in middleware.

    const payload = this.withNormalizedCurrency(data);

    return settingsRepository.updateSettingsTransaction(payload, adminId, ip);
  },

  /**
   * Keep the persisted currency triple internally consistent.
   *
   * The admin sends a currency code; the symbol and name are resolved from the
   * canonical catalog so a saved configuration can never pair, say, code "PKR"
   * with the symbol "$". Stale/partial values are backfilled here rather than
   * relying on a migration having run.
   */
  withNormalizedCurrency(data: any) {
    if (!data?.system) return data;

    const system = { ...data.system };
    const code = typeof system.defaultCurrency === 'string'
      ? system.defaultCurrency.trim().toUpperCase()
      : null;

    const definition = getCurrencyDefinition(code);

    if (!definition) {
      // Unknown/missing code: let Zod decide. Nothing is silently rewritten.
      return data;
    }

    system.defaultCurrency = definition.currencyCode;
    system.currencySymbol = definition.currencySymbol;
    system.currencyName = definition.currencyName;

    return { ...data, system };
  },
};
