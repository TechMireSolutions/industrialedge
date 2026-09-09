import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settingsService.js';

export const settingsController = {
  getPublicSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.getPublicSettings();
      res.json(settings);
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
