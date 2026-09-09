import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { checkoutSchema } from '../validators/schemas.js';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({
    id: z.string().min(1)
});

router.post('/', authenticate, validateBody(checkoutSchema), orderController.createFromCart);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, validateParams(idParamSchema), orderController.getOrder);
router.post('/validate-coupon', optionalAuth, orderController.validateCoupon);

export const adminOrderRouter = Router();
adminOrderRouter.get('/', authenticate, authorize('ADMIN'), orderController.getAllOrders);
adminOrderRouter.put('/:id/status', authenticate, authorize('ADMIN'), validateParams(idParamSchema), orderController.updateOrderStatus);

export default router;
