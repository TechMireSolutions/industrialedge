import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updateSettingsSchema } from '../validators/schemas.js';

const router = Router();

// Public route for frontend
router.get('/public', optionalAuth, settingsController.getPublicSettings);

// Admin routes
router.use('/admin', authenticate, authorize('ADMIN'));
router.get('/admin', settingsController.getAdminSettings);
router.put('/admin', validateBody(updateSettingsSchema), settingsController.updateSettings);

export default router;
