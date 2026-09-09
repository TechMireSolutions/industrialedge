import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { cartApi, CartSummary, WishlistItem } from '../services';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartSummary | null;
  wishlist: WishlistItem[];
  wishlistCount: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  checkWishlist: (productId: string) => Promise<boolean>;
  moveToCart: (productId: string) => Promise<void>;
  mergeCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      const response = await cartApi.getCart();
      setCart(response.data);
    } catch (error: any) {
      if (error.status !== 400 && error.status !== 401) {
        console.error('Failed to fetch cart:', error);
      }
      setCart({ items: [], subtotal: 0, itemCount: 0 });
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setWishlistCount(0);
      return;
    }
    try {
      const [wishlistResponse, countResponse] = await Promise.all([
        cartApi.getWishlist(),
        cartApi.getCount(),
      ]);
      setWishlist(wishlistResponse.data);
      setWishlistCount(countResponse.data.count);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error('Failed to fetch wishlist:', error);
      }
      setWishlist([]);
      setWishlistCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
    if (user) {
      fetchWishlist();
    }
  }, [fetchCart, fetchWishlist, user]);

  const addToCart = async (productId: string, quantity = 1) => {
    setLoading(true);
    try {
      await cartApi.addItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      await cartApi.updateItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      await cartApi.removeItem(productId);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await cartApi.clearCart();
      await fetchCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await cartApi.addToWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await cartApi.removeFromWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async (productId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const response = await cartApi.checkWishlist(productId);
      return response.data.inWishlist;
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
      return false;
    }
  };

  const moveToCart = async (productId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await cartApi.moveToCart(productId);
      await Promise.all([fetchCart(), fetchWishlist()]);
    } catch (error) {
      console.error('Failed to move item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const mergeCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await cartApi.mergeCart();
      await fetchCart();
    } catch (error) {
      console.error('Failed to merge cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        wishlistCount,
        loading,
        fetchCart,
        fetchWishlist,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        checkWishlist,
        moveToCart,
        mergeCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}