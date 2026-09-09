import { Router } from 'express';
import { collectionController } from '../controllers/collectionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', collectionController.getActiveCollections);
router.get('/:slug', collectionController.getCollectionBySlug);

// Admin routes
router.use('/admin', authenticate, authorize('ADMIN'));
router.get('/admin', collectionController.getAllCollections);
router.get('/admin/:id', collectionController.getCollectionById);
router.post('/admin', collectionController.createCollection);
router.put('/admin/:id', collectionController.updateCollection);
router.delete('/admin/:id', collectionController.deleteCollection);
router.post('/admin/:id/products', collectionController.assignProducts);

export default router;
