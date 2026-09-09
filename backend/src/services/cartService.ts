import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { Decimal } from '@prisma/client/runtime/library.js';
import { v4 as uuidv4 } from 'uuid';

export const cartService = {
  async getOrCreateCart(userId?: string, sessionId?: string) {
    if (userId) {
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: { items: { include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } } } },
        });
      }
      return cart;
    }

    if (sessionId) {
      let cart = await prisma.cart.findUnique({ where: { sessionId } });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { sessionId },
          include: { items: { include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } } } },
        });
      }
      return cart;
    }

    // For anonymous users without session, create a new session-based cart
    const newSessionId = uuidv4();
    const cart = await prisma.cart.create({
      data: { sessionId: newSessionId },
      include: { items: { include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } } } },
    });
    return cart;
  },

  async mergeCarts(userId: string, sessionId: string) {
    const sessionCart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!sessionCart) return;

    const userCart = await this.getOrCreateCart(userId);

    for (const item of sessionCart.items) {
      const existingItem = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: userCart.id, productId: item.productId } },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
        });
      }
    }

    await prisma.cart.delete({ where: { id: sessionCart.id } });
  },

  async addItem(cartId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true, stock: true, active: true },
    });

    if (!product) throw new AppError(404, 'Product not found');
    if (!product.active) throw new AppError(400, 'Product is not available');
    if (product.stock < quantity) throw new AppError(400, `Only ${product.stock} items in stock`);

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new AppError(400, `Only ${product.stock} items in stock`);
      }
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        unitPrice: product.price,
      },
      include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } },
    });
  },

  async updateItem(cartId: string, productId: string, quantity: number) {
    const item = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
      include: { product: { select: { stock: true, active: true } } },
    });

    if (!item) throw new AppError(404, 'Item not in cart');
    if (!item.product.active) throw new AppError(400, 'Product is not available');
    if (item.product.stock < quantity) throw new AppError(400, `Only ${item.product.stock} items in stock`);

    return prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
      include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } },
    });
  },

  async removeItem(cartId: string, productId: string) {
    const item = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });

    if (!item) throw new AppError(404, 'Item not in cart');

    await prisma.cartItem.delete({ where: { id: item.id } });
    return { success: true };
  },

  async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({ where: { cartId } });
    return { success: true };
  },

  async getCartSummary(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } } } },
    });

    if (!cart) return null;

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    );

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const shippingTotal = cart.items.reduce(
      (sum, item) => sum + (Number(item.product.shippingPrice) || 0) * item.quantity,
      0
    );

    return {
      items: cart.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.unitPrice) * item.quantity,
        product: {
          ...item.product,
          price: Number(item.product.price),
          oldPrice: item.product.oldPrice ? Number(item.product.oldPrice) : null,
          rating: Number(item.product.rating),
        },
      })),
      subtotal,
      shippingTotal,
      itemCount,
    };
  },

  async checkStock(items: { productId: string; quantity: number }[]) {
    const products = await prisma.product.findMany({
      where: { id: { in: items.map(i => i.productId) } },
      select: { id: true, stock: true, name: true },
    });

    const stockMap = new Map(products.map(p => [p.id, p.stock]));
    const errors: string[] = [];

    for (const item of items) {
      const available = stockMap.get(item.productId) || 0;
      if (available < item.quantity) {
        const product = products.find(p => p.id === item.productId);
        errors.push(`${product?.name || 'Product'}: only ${available} in stock`);
      }
    }

    return { valid: errors.length === 0, errors };
  },
};

export const wishlistService = {
  async getWishlist(userId: string) {
    return prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError(404, 'Product not found');

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      throw new AppError(409, 'Product already in wishlist');
    }

    return prisma.wishlistItem.create({
      data: { userId, productId },
      include: { product: { include: { category: { select: { id: true, name: true, slug: true } } } } },
    });
  },

  async removeFromWishlist(userId: string, productId: string) {
    const item = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!item) throw new AppError(404, 'Item not in wishlist');

    await prisma.wishlistItem.delete({ where: { id: item.id } });
    return { success: true };
  },

  async isInWishlist(userId: string, productId: string) {
    const item = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!item;
  },

  async getWishlistCount(userId: string) {
    return prisma.wishlistItem.count({ where: { userId } });
  },

  async moveToCart(userId: string, productId: string, cartId: string) {
    await this.removeFromWishlist(userId, productId);
    return cartService.addItem(cartId, productId, 1);
  },
};

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

const formatWishlistItem = (item: any) => ({
  ...item,
  product: {
    ...item.product,
    price: Number(item.product.price),
    oldPrice: item.product.oldPrice ? Number(item.product.oldPrice) : null,
    rating: Number(item.product.rating),
  },
});
