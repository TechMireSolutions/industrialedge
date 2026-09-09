import { settingsRepository } from '../repositories/settingsRepository.js';
import { AppError } from '../middleware/errorHandler.js';

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

    return settingsRepository.updateSettingsTransaction(data, adminId, ip);
  }
};
