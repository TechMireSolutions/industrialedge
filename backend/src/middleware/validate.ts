import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../middleware/errorHandler.js';

// Helper to format Zod errors cleanly
const handleValidationError = (error: unknown, next: NextFunction) => {
  if (error instanceof ZodError) {
    return next(
      new AppError(
        400,
        'Validation error',
        error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      )
    );
  }
  next(error);
};

export const validate = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };

export const validateBody = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };

export const validateQuery = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };

export const validateParams = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      handleValidationError(error, next);
    }
  };
