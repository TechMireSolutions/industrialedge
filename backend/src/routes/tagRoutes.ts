import { Router } from 'express';
import { tagController } from '../controllers/tagController.js';
import { validateBody } from '../middleware/validate.js';
import { tagSchema } from '../validators/schemas.js';

export const adminTagRouter = Router();

// Protected admin routes (mounted under /api/admin/tags)
adminTagRouter.get('/', tagController.getAll);
adminTagRouter.get('/:id', tagController.getById);
adminTagRouter.post('/', validateBody(tagSchema), tagController.create);
adminTagRouter.put('/:id', validateBody(tagSchema), tagController.update);
adminTagRouter.delete('/:id', tagController.delete);

export const publicTagRouter = Router();

// Public routes (mounted under /api/tags)
publicTagRouter.get('/', tagController.getAll);
