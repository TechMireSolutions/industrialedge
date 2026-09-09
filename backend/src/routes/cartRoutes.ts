import { Router } from 'express';
import { cartController, wishlistController } from '../controllers/cartController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { cartItemSchema, updateCartItemSchema } from '../validators/schemas.js';
import { z } from 'zod';

const router = Router();

const productIdParamSchema = z.object({ productId: z.string().min(1) });

router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, validateBody(cartItemSchema), cartController.addItem);
router.put('/items/:productId', optionalAuth, validateParams(productIdParamSchema), validateBody(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:productId', optionalAuth, validateParams(productIdParamSchema), cartController.removeItem);
router.delete('/', optionalAuth, cartController.clearCart);
router.post('/merge', authenticate, cartController.mergeCart);
router.post('/validate', optionalAuth, cartController.validateCart);

router.get('/wishlist', authenticate, wishlistController.getWishlist);
router.get('/wishlist/count', authenticate, wishlistController.getWishlistCount);
router.post('/wishlist', authenticate, validateBody(cartItemSchema), wishlistController.addToWishlist);
router.get('/wishlist/:productId', authenticate, validateParams(productIdParamSchema), wishlistController.checkWishlist);
router.delete('/wishlist/:productId', authenticate, validateParams(productIdParamSchema), wishlistController.removeFromWishlist);
router.post('/wishlist/move-to-cart', authenticate, validateBody(cartItemSchema), wishlistController.moveToCart);

export default router;
