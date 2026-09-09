import { Request, Response, NextFunction } from 'express';
import { collectionService } from '../services/collectionService.js';
import { AppError } from '../middleware/errorHandler.js';

export const collectionController = {
  getAllCollections: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collections = await collectionService.getAllCollections();
      res.json({ data: collections });
    } catch (error) {
      next(error);
    }
  },

  getActiveCollections: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collections = await collectionService.getActiveCollections();
      res.json({ data: collections });
    } catch (error) {
      next(error);
    }
  },

  getCollectionById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collection = await collectionService.getCollectionById(req.params.id);
      res.json({ data: collection });
    } catch (error) {
      next(error);
    }
  },

  getCollectionBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collection = await collectionService.getCollectionBySlug(req.params.slug);
      res.json({ data: collection });
    } catch (error) {
      next(error);
    }
  },

  createCollection: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collection = await collectionService.createCollection(req.body);
      res.status(201).json({ data: collection, message: 'Collection created successfully' });
    } catch (error) {
      next(error);
    }
  },

  updateCollection: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collection = await collectionService.updateCollection(req.params.id, req.body);
      res.json({ data: collection, message: 'Collection updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  deleteCollection: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await collectionService.deleteCollection(req.params.id);
      res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  assignProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productIds } = req.body;
      if (!Array.isArray(productIds)) {
        throw new AppError(400, 'productIds must be an array');
      }
      const collection = await collectionService.assignProducts(req.params.id, productIds);
      res.json({ data: collection, message: 'Products assigned successfully' });
    } catch (error) {
      next(error);
    }
  }
};
