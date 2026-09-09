import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const mediaController = {
  async getMediaAssets(req: Request, res: Response, next: NextFunction) {
    try {
      // Allow searching, filtering by folder, pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;

      const whereClause: any = {
        deletedAt: null
      };

      if (search) {
        whereClause.OR = [
          { filename: { contains: search } },
          { originalName: { contains: search } },
          { altText: { contains: search } }
        ];
      }

      const [assets, total] = await Promise.all([
        prisma.mediaAsset.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.mediaAsset.count({ where: whereClause })
      ]);

      res.json({
        success: true,
        data: assets,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteMediaAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const asset = await prisma.mediaAsset.findUnique({ where: { id } });

      if (!asset) {
        throw new AppError(404, 'Media asset not found');
      }

      // Soft delete
      await prisma.mediaAsset.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      res.json({ success: true, message: 'Media asset deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateMediaAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { altText, caption, folderId } = req.body;

      const asset = await prisma.mediaAsset.update({
        where: { id },
        data: { altText, caption, folderId }
      });

      res.json({ success: true, data: asset });
    } catch (error) {
      next(error);
    }
  }
};
