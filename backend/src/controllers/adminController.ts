import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { orderService } from '../services/orderService.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const adminController = {
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await orderService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },

  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const role = req.query.role as string;

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { email: { contains: search } },
        ];
      }
      if (role) where.role = role;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, _count: { select: { orders: true } } },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({ success: true, data: users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, addresses: true, _count: { select: { orders: true, reviews: true, wishlist: true } } },
      });
      if (!user) throw new AppError(404, 'User not found');
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phone, role } = req.body;
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, passwordHash: hashedPassword, phone, role },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
      });
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, role, password } = req.body;
      const data: any = { name, email, phone, role };
      if (password) {
        const bcrypt = require('bcryptjs');
        data.passwordHash = await bcrypt.hash(password, 10);
      }
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data,
        select: { id: true, name: true, email: true, phone: true, role: true }
      });
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
      });
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.params.id === req.user!.id) throw new AppError(400, 'Cannot delete yourself');
      await prisma.user.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  },

  async getRecentOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } }, items: true },
      });
      res.json({ success: true, data: orders.map(orderService.formatOrder) });
    } catch (error) {
      next(error);
    }
  },

  async getLowStockProducts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const products = await prisma.product.findMany({
        where: { stock: { lte: threshold }, active: true },
        orderBy: { stock: 'asc' },
        include: { category: { select: { id: true, name: true } } },
      });
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  async getSalesReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate }, paymentStatus: 'PAID' },
        select: { total: true, createdAt: true },
      });

      const dailySales: Record<string, number> = {};
      orders.forEach(order => {
        const date = order.createdAt.toISOString().split('T')[0];
        dailySales[date] = (dailySales[date] || 0) + Number(order.total);
      });

      const chartData = Object.entries(dailySales).map(([date, total]) => ({ date, total }));
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

      res.json({ success: true, data: { chartData, totalRevenue, orderCount: orders.length } });
    } catch (error) {
      next(error);
    }
  },
};
