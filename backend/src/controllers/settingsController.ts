import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settingsService.js';
import { currencyService } from '../services/currencyService.js';

export const settingsController = {
  getPublicSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.getPublicSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Supported currency catalog. Served separately from the settings payload so
   * the admin dropdown is populated by the backend catalog — adding a currency
   * requires zero frontend changes.
   */
  getCurrencies: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [currencies, current] = await Promise.all([
        Promise.resolve(currencyService.getSupportedCurrencies()),
        currencyService.getCurrencySettings(),
      ]);

      res.json({ success: true, data: { currencies, current } });
    } catch (error) {
      next(error);
    }
  },

  getAdminSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.getAdminSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  },

  updateSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore - Assuming req.user is set by authenticate middleware
      const adminId = req.user?.id || 'system';
      const ip = req.ip || req.connection.remoteAddress || 'unknown';

      const result = await settingsService.updateSettings(req.body, adminId, ip);
      res.json({ message: 'Settings updated successfully', result });
    } catch (error) {
      next(error);
    }
  }
};
