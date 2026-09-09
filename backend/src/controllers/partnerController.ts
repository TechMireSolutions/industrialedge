import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const partnerController = {
  async getPartners(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active !== 'false';

      const partners = await prisma.partner.findMany({
        where: {
          deletedAt: null,
          ...(activeOnly ? { active: true } : {})
        },
        include: {
          logo: true,
          darkLogo: true
        },
        orderBy: {
          displayOrder: 'asc'
        }
      });

      res.json({ success: true, data: partners });
    } catch (error) {
      next(error);
    }
  },

  async getPartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const partner = await prisma.partner.findUnique({
        where: { id },
        include: { logo: true, darkLogo: true }
      });

      if (!partner || partner.deletedAt) {
        throw new AppError(404, 'Partner not found');
      }

      res.json({ success: true, data: partner });
    } catch (error) {
      next(error);
    }
  },

  async createPartner(req: Request, res: Response, next: NextFunction) {
    try {
      // Typically validate with Zod here
      const data = req.body;

      // Ensure slug uniqueness
      const existing = await prisma.partner.findUnique({ where: { slug: data.slug } });
      if (existing) {
        throw new AppError(400, 'Partner with this slug already exists');
      }

      const partner = await prisma.partner.create({ data });
      res.status(201).json({ success: true, data: partner });
    } catch (error) {
      next(error);
    }
  },

  async updatePartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const partner = await prisma.partner.findUnique({ where: { id } });
      if (!partner || partner.deletedAt) {
        throw new AppError(404, 'Partner not found');
      }

      if (data.slug && data.slug !== partner.slug) {
        const existing = await prisma.partner.findUnique({ where: { slug: data.slug } });
        if (existing) {
          throw new AppError(400, 'Partner with this slug already exists');
        }
      }

      const updated = await prisma.partner.update({
        where: { id },
        data
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  async deletePartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const partner = await prisma.partner.findUnique({ where: { id } });
      if (!partner || partner.deletedAt) {
        throw new AppError(404, 'Partner not found');
      }

      // Soft delete
      await prisma.partner.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      res.json({ success: true, message: 'Partner deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};
