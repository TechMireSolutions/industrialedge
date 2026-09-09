import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', notificationController.getAll);
router.get('/unread', notificationController.getUnread);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);

export default router;
