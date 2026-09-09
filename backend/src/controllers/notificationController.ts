import { Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService.js';
import { AuthRequest } from '../middleware/auth.js';

export const notificationController = {
  async getUnread(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.getUnreadNotifications();
      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await notificationService.getAllNotifications(page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.markAsRead(req.params.id);
      res.json({ success: true, data: notification });
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAllAsRead();
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  },
};
