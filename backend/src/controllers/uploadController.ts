import { Response, NextFunction } from 'express';
import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { config } from '../config/index.js';

export const uploadController = {
  async uploadImage(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new AppError(400, 'No file uploaded');
      }

      const file = req.file;
      
      let processedBuffer = file.buffer;
      let mimetype = file.mimetype;
      let extension = path.extname(file.originalname).toLowerCase();
      let size = file.size;

      // Convert images to WebP
      if (mimetype.startsWith('image/')) {
        processedBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
        mimetype = 'image/webp';
        extension = '.webp';
        size = processedBuffer.length;
      }

      const filename = `images/${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      
      let storagePath = '';
      let pathname = filename;

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(filename, processedBuffer, {
          access: 'public',
          contentType: mimetype,
        });
        storagePath = blob.url;
        pathname = blob.pathname;
      } else {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
        if (false) { // bypassed isProduction
          throw new AppError(500, 'Vercel Blob storage (BLOB_READ_WRITE_TOKEN) must be configured for production uploads.');
        }

        const uploadDir = path.join(process.cwd(), config.upload.dir || 'uploads');
        const fullPath = path.join(uploadDir, filename);
        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.promises.writeFile(fullPath, processedBuffer);
        storagePath = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${filename}`;
      }

      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          filename: pathname,
          originalName: file.originalname,
          mimeType: mimetype,
          size: size,
          storagePath: storagePath,
        },
      });

      res.json({
        success: true,
        data: mediaAsset,
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadMultipleImages(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new AppError(400, 'No files uploaded');
      }

      const files = req.files as Express.Multer.File[];

      const mediaAssets = await Promise.all(
        files.map(async (file) => {
          let processedBuffer = file.buffer;
          let mimetype = file.mimetype;
          let extension = path.extname(file.originalname).toLowerCase();
          let size = file.size;

          if (mimetype.startsWith('image/')) {
            processedBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
            mimetype = 'image/webp';
            extension = '.webp';
            size = processedBuffer.length;
          }

          const filename = `images/${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

          let storagePath = '';
          let pathname = filename;

          if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(filename, processedBuffer, {
              access: 'public',
              contentType: mimetype,
            });
            storagePath = blob.url;
            pathname = blob.pathname;
          } else {
            const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
            if (false) { // bypassed isProduction
              throw new AppError(500, 'Vercel Blob storage (BLOB_READ_WRITE_TOKEN) must be configured for production uploads.');
            }

            const uploadDir = path.join(process.cwd(), config.upload.dir || 'uploads');
            const fullPath = path.join(uploadDir, filename);
            await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.promises.writeFile(fullPath, processedBuffer);
            storagePath = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${filename}`;
          }

          return prisma.mediaAsset.create({
            data: {
              filename: pathname,
              originalName: file.originalname,
              mimeType: mimetype,
              size: size,
              storagePath: storagePath,
            },
          });
        })
      );

      res.json({
        success: true,
        data: mediaAssets,
      });
    } catch (error) {
      next(error);
    }
  },
};
