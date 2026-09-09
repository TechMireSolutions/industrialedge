import { Router } from 'express';
import { menuController } from '../controllers/menuController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

import { validateBody } from '../middleware/validate.js';
import { menuItemSchema } from '../validators/schemas.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, menuController.getMenus);
router.get('/:slug/active', optionalAuth, menuController.getActiveMenu);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), menuController.createMenu);
router.post('/:menuId/items', authenticate, authorize('ADMIN'), validateBody(menuItemSchema), menuController.addMenuItem);
router.put('/items/:id', authenticate, authorize('ADMIN'), validateBody(menuItemSchema), menuController.updateMenuItem);
router.delete('/items/:id', authenticate, authorize('ADMIN'), menuController.deleteMenuItem);
router.patch('/:menuId/reorder', authenticate, authorize('ADMIN'), menuController.reorderMenuItems);

export default router;
