// 🟢 Import your base Axios/fetch client instance (api)
import { api } from './api';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice: number | null;
    sku: string;
    stock: number;
    badge: string | null;
    images: string[];
    rating: number;
    reviewCount: number;
    category: { id: string; name: string; slug: string };
  };
  total: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice: number | null;
    sku: string;
    stock: number;
    badge: string | null;
    images: string[];
    rating: number;
    reviewCount: number;
    category: { id: string; name: string; slug: string };
  };
  createdAt: string;
}

export const wishlistApi = {
  getWishlist: () => api.get<WishlistItem[]>('/cart/wishlist'),

  getCount: () => api.get<{ count: number }>('/cart/wishlist/count'),

  addToWishlist: (productId: string) => api.post<WishlistItem>('/cart/wishlist', { productId }),

  checkWishlist: (productId: string) => api.get<{ inWishlist: boolean }>(`/cart/wishlist/${productId}`),

  removeFromWishlist: (productId: string) => api.delete(`/cart/wishlist/${productId}`),

  moveToCart: (productId: string) => api.post<CartSummary>('/cart/wishlist/move-to-cart', { productId }),
};

export const cartApi = {
  getCart: () => api.get<CartSummary>('/cart'),

  addItem: (productId: string, quantity = 1) =>
    api.post<CartSummary>('/cart/items', { productId, quantity }),

  updateItem: (productId: string, quantity: number) =>
    api.put<CartSummary>(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: string) =>
    api.delete<CartSummary>(`/cart/items/${productId}`),

  clearCart: () => api.delete<CartSummary>('/cart'),

  mergeCart: () => api.post('/cart/merge'),

  validateCart: () => api.post<{ valid: boolean; errors: string[] }>('/cart/validate'),

  // 🟢 Forwarding ALL wishlist methods through cartApi
  getWishlist: () => wishlistApi.getWishlist(),
  getCount: () => wishlistApi.getCount(),
  addToWishlist: (productId: string) => wishlistApi.addToWishlist(productId),
  checkWishlist: (productId: string) => wishlistApi.checkWishlist(productId),
  removeFromWishlist: (productId: string) => wishlistApi.removeFromWishlist(productId),
  moveToCart: (productId: string) => wishlistApi.moveToCart(productId),
};