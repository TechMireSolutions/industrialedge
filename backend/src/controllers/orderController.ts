import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const orderController = {
  async createFromCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { cartId, ...checkoutData } = req.body;
      const order = await orderService.createFromCart(req.user!.id, { ...checkoutData, cartId });
      res.status(201).json({ success: true, data: orderService.formatOrder(order) });
    } catch (error) {
      next(error);
    }
  },

  async getOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getById(req.params.id, req.user!.id, req.user?.role === 'ADMIN');
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await orderService.getUserOrders(req.user!.id, page, limit);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  },

  async getAllOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await orderService.getAllOrders(req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const order = await orderService.updateStatus(req.params.id, status);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  async validateCoupon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { code, subtotal } = req.body;
      const coupon = await orderService.validateCoupon(code, subtotal);
      let discount = 0;
      if (coupon.type === 'PERCENTAGE') {
        discount = subtotal * Number(coupon.value) / 100;
      } else {
        discount = Number(coupon.value);
      }
      if (coupon.maximumDiscount && discount > Number(coupon.maximumDiscount)) {
        discount = Number(coupon.maximumDiscount);
      }
      res.json({ success: true, data: { coupon, discount } });
    } catch (error) {
      next(error);
    }
  },
};
