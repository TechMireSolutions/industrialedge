import { Router } from 'express';
import { partnerController } from '../controllers/partnerController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, partnerController.getPartners);
router.get('/:id', optionalAuth, partnerController.getPartner);

// Admin routes
router.use(authenticate, authorize('ADMIN'));
router.post('/', partnerController.createPartner);
router.put('/:id', partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

export default router;
