import { Router } from 'express';
import { homepageSectionController } from '../controllers/homepageSectionController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, homepageSectionController.getSections);
router.put('/', authenticate, authorize('ADMIN'), homepageSectionController.updateSections);

export default router;
