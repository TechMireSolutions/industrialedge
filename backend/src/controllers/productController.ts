import { Request, Response, NextFunction } from 'express';
import { productService, categoryService } from '../services/productService.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { Decimal } from '@prisma/client/runtime/library.js';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { prisma } from '../config/database.js';

const formatProduct = (product: any) => ({
  ...product,
  price: Number(product.price),
  oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
  rating: Number(product.rating),
});

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll(req.query as any);
      res.json({
        success: true,
        data: result.data.map(formatProduct),
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      res.json({ success: true, data: formatProduct(product) });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      res.json({ success: true, data: formatProduct(product) });
    } catch (error) {
      next(error);
    }
  },

  async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      const related = await productService.getRelated(product.id, product.categoryId);
      res.json({ success: true, data: related.map(formatProduct) });
    } catch (error) {
      next(error);
    }
  },

  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await productService.getFeatured(limit);
      res.json({ success: true, data: products.map(formatProduct) });
    } catch (error) {
      next(error);
    }
  },

  async getNewArrivals(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await productService.getNewArrivals(limit);
      res.json({ success: true, data: products.map(formatProduct) });
    } catch (error) {
      next(error);
    }
  },

  async getTopSelling(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await productService.getTopSelling(limit);
      res.json({ success: true, data: products.map(formatProduct) });
    } catch (error) {
      next(error);
    }
  },

  async getBestsellers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await productService.getBestsellers(limit);
      res.json({ success: true, data: products.map(formatProduct) });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ success: true, data: formatProduct(product) });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json({ success: true, data: formatProduct(product) });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await productService.delete(req.params.id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async importProducts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError(400, 'No CSV file uploaded');
      }

      const results: any[] = [];
      const errors: any[] = [];
      let successCount = 0;
      let failureCount = 0;

      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      await new Promise<void>((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        const rowIndex = i + 2; // Assuming header is row 1
        try {
          if (!row.name || !row.price || !row.category) {
            throw new Error('Missing required fields (name, price, category)');
          }

          // Find category by name or slug
          const category = await prisma.category.findFirst({
            where: {
              OR: [
                { name: { equals: row.category } },
                { slug: { equals: row.category } },
              ]
            }
          });

          if (!category) {
            throw new Error(`Category not found: ${row.category}`);
          }

          await productService.create({
            name: row.name,
            description: row.description || '',
            shortDescription: row.shortDescription || '',
            price: Number(row.price),
            oldPrice: row.oldPrice ? Number(row.oldPrice) : null,
            shippingPrice: row.shippingPrice ? Number(row.shippingPrice) : 0,
            stock: row.stock ? Number(row.stock) : 0,
            categoryId: category.id,
            sku: row.sku || undefined,
            slug: row.slug || undefined,
            images: row.images ? row.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
            badge: row.badge || undefined,
          });

          successCount++;
        } catch (err: any) {
          failureCount++;
          errors.push({ row: rowIndex, message: err.message });
        }
      }

      res.json({
        success: true,
        data: {
          successCount,
          failureCount,
          errors,
        }
      });

    } catch (error) {
      next(error);
    }
  },
};

export const categoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active === 'true';
      const categories = await categoryService.getAll(activeOnly);
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getById(req.params.id);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getBySlug(req.params.slug);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(req.params.id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};
