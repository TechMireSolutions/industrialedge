import { Router } from 'express';
import { productController, categoryController } from '../controllers/productController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validate.js';
import { productSchema, categorySchema, querySchema } from '../validators/schemas.js';
import { uploadSingle } from '../middleware/upload.js';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().min(1) });
const slugParamSchema = z.object({ slug: z.string().min(1) });

// Public category routes (at root level for direct access)
router.get('/categories', optionalAuth, categoryController.getAll);
router.get('/categories/:id', optionalAuth, validateParams(idParamSchema), categoryController.getById);
router.get('/categories/slug/:slug', optionalAuth, validateParams(slugParamSchema), categoryController.getBySlug);

// Public product routes
router.get('/', optionalAuth, validateQuery(querySchema), productController.getAll);
router.get('/featured', optionalAuth, productController.getFeatured);
router.get('/new-arrivals', optionalAuth, productController.getNewArrivals);
router.get('/top-selling', optionalAuth, productController.getTopSelling);
router.get('/bestsellers', optionalAuth, productController.getBestsellers);
router.get('/:id', optionalAuth, validateParams(idParamSchema), productController.getById);
router.get('/slug/:slug', optionalAuth, validateParams(slugParamSchema), productController.getBySlug);
router.get('/:id/related', optionalAuth, validateParams(idParamSchema), productController.getRelated);

// Admin product routes
export const adminProductRouter = Router();
adminProductRouter.use(authenticate, authorize('ADMIN'));

adminProductRouter.get('/', validateQuery(querySchema), productController.getAll);
adminProductRouter.get('/:id', validateParams(idParamSchema), productController.getById);
adminProductRouter.post('/import', uploadSingle('file'), productController.importProducts);
adminProductRouter.post('/', validateBody(productSchema), productController.create);
adminProductRouter.put('/:id', validateParams(idParamSchema), validateBody(productSchema.partial()), productController.update);
adminProductRouter.delete('/:id', validateParams(idParamSchema), productController.delete);

// Admin category routes
export const adminCategoryRouter = Router();
adminCategoryRouter.use(authenticate, authorize('ADMIN'));

adminCategoryRouter.get('/', categoryController.getAll);
adminCategoryRouter.get('/:id', validateParams(idParamSchema), categoryController.getById);
adminCategoryRouter.post('/', validateBody(categorySchema), categoryController.create);
adminCategoryRouter.put('/:id', validateParams(idParamSchema), validateBody(categorySchema.partial()), categoryController.update);
adminCategoryRouter.delete('/:id', validateParams(idParamSchema), categoryController.delete);

export default router;
