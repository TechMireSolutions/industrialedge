import { Router } from 'express';
import { mediaController } from '../controllers/mediaController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Require admin for all media management for now
router.use(authenticate, authorize('ADMIN'));

router.get('/', mediaController.getMediaAssets);
router.put('/:id', mediaController.updateMediaAsset);
router.delete('/:id', mediaController.deleteMediaAsset);

export default router;
