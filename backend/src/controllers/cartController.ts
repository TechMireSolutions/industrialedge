import { Request, Response, NextFunction } from 'express';
import { cartService, wishlistService } from '../services/cartService.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

const formatCartItem = (item: any) => ({
  ...item,
  unitPrice: Number(item.unitPrice),
  total: Number(item.unitPrice) * item.quantity,
  product: {
    ...item.product,
    price: Number(item.product.price),
    oldPrice: item.product.oldPrice ? Number(item.product.oldPrice) : null,
    rating: Number(item.product.rating),
  },
});

export const cartController = {
  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.cookies?.cartSessionId;
      const cart = await cartService.getOrCreateCart(userId, sessionId);
      const summary = await cartService.getCartSummary(cart.id);

      if (!res.headersSent) {
        if (!req.user && !sessionId) {
          res.cookie('cartSessionId', cart.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
        }
        res.json({ success: true, data: summary });
      }
    } catch (error) {
      next(error);
    }
  },

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.cookies?.cartSessionId;
      const cart = await cartService.getOrCreateCart(userId, sessionId);

      const { productId, quantity } = req.body;
      const item = await cartService.addItem(cart.id, productId, quantity);

      const summary = await cartService.getCartSummary(cart.id);
      res.status(201).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.cookies?.cartSessionId;
      const cart = await cartService.getOrCreateCart(userId, sessionId);

      const { productId } = req.params;
      const { quantity } = req.body;
      const item = await cartService.updateItem(cart.id, productId, quantity);

      const summary = await cartService.getCartSummary(cart.id);
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.cookies?.cartSessionId;
      const cart = await cartService.getOrCreateCart(userId, sessionId);

      const { productId } = req.params;
      await cartService.removeItem(cart.id, productId);

      const summary = await cartService.getCartSummary(cart.id);
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.cookies?.cartSessionId;
      const cart = await cartService.getOrCreateCart(userId, sessionId);

      await cartService.clearCart(cart.id);
      res.json({ success: true, data: { items: [], subtotal: 0, itemCount: 0 } });
    } catch (error) {
      next(error);
    }
  },

  async mergeCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.cookies?.cartSessionId;
      if (sessionId) {
        await cartService.mergeCarts(req.user!.id, sessionId);
        res.clearCookie('cartSessionId');
      }
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },

  async validateCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const sessionId = req.cookies?.cartSessionId;
      const cart = await cartService.getOrCreateCart(userId, sessionId);

      const summary = await cartService.getCartSummary(cart.id);
      if (!summary) {
        return res.json({ success: true, data: { valid: true, errors: [] } });
      }
      const { valid, errors } = await cartService.checkStock(
        summary.items.map(item => ({ productId: item.productId, quantity: item.quantity }))
      );

      res.json({ success: true, data: { valid, errors } });
    } catch (error) {
      next(error);
    }
  },
};

export const wishlistController = {
  async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const items = await wishlistService.getWishlist(req.user!.id);
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  },

  async addToWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;
      const item = await wishlistService.addToWishlist(req.user!.id, productId);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  async removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      await wishlistService.removeFromWishlist(req.user!.id, productId);
      res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
      next(error);
    }
  },

  async checkWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const inWishlist = await wishlistService.isInWishlist(req.user!.id, productId);
      res.json({ success: true, data: { inWishlist } });
    } catch (error) {
      next(error);
    }
  },

  async getWishlistCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const count = await wishlistService.getWishlistCount(req.user!.id);
      res.json({ success: true, data: { count } });
    } catch (error) {
      next(error);
    }
  },

  async moveToCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;
      const sessionId = req.cookies?.cartSessionId;
      const cart = await cartService.getOrCreateCart(req.user!.id, sessionId);
      await wishlistService.moveToCart(req.user!.id, productId, cart.id);

      const summary = await cartService.getCartSummary(cart.id);
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },
};
