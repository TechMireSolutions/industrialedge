"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";

export type ProductStatus = "none" | "discount" | "new";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  status: ProductStatus;
  image: string;
  category: string;
  rating?: number;
  description?: string;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  image: string;
}

const WISHLIST_KEY = "onetech_wishlist";
const CART_KEY = "onetech_cart";

const EMPTY_WISHLIST: string[] = [];
const EMPTY_CART: CartItem[] = [];

function loadWishlist(): string[] {
  if (typeof window === "undefined") return EMPTY_WISHLIST;
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : EMPTY_WISHLIST;
  } catch {
    return EMPTY_WISHLIST;
  }
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

interface StoreState {
  wishlist: string[];
  cart: CartItem[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlistState] = useState<string[]>(() => loadWishlist());
  const [cart, setCartState] = useState<CartItem[]>(() => loadCart());

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlistState((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCartState((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, category: product.category, price: product.price, qty: 1, image: product.image },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartState((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateCartQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCartState((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCartState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const wishlistCount = wishlist.length;

  const value: StoreState = {
    wishlist,
    cart,
    isWishlisted,
    toggleWishlist,
    addToCart,
    removeFromCart,
    updateCartQty,
    cartCount,
    cartTotal,
    wishlistCount,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
