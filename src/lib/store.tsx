"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

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

const WISHLIST_KEY = "industrialedge_wishlist";
const CART_KEY = "industrialedge_cart";
const BASE_WISHLIST_OFFSET = 115;

const INITIAL_CART: CartItem[] = [];

const SERVER_WISHLIST: string[] = [];
let memoryWishlist: string[] = [];
let memoryCart: CartItem[] = INITIAL_CART;
let initialized = false;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function initMemory() {
  if (typeof window === "undefined" || initialized) return;
  try {
    const rawW = localStorage.getItem(WISHLIST_KEY) || localStorage.getItem("onetech_wishlist");
    if (rawW) memoryWishlist = JSON.parse(rawW);
    const rawC = localStorage.getItem(CART_KEY) || localStorage.getItem("onetech_cart");
    if (rawC) memoryCart = JSON.parse(rawC);
  } catch {
    // Ignore invalid JSON in storage
  }
  initialized = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = () => {
    try {
      const rawW = localStorage.getItem(WISHLIST_KEY);
      if (rawW) memoryWishlist = JSON.parse(rawW);
      const rawC = localStorage.getItem(CART_KEY);
      if (rawC) memoryCart = JSON.parse(rawC);
      listener();
    } catch {}
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getWishlistSnapshot() {
  initMemory();
  return memoryWishlist;
}

function getWishlistServerSnapshot() {
  return SERVER_WISHLIST;
}

function getCartSnapshot() {
  initMemory();
  return memoryCart;
}

function getCartServerSnapshot() {
  return INITIAL_CART;
}

interface StoreState {
  wishlist: string[];
  cart: CartItem[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const wishlist = useSyncExternalStore(
    subscribe,
    getWishlistSnapshot,
    getWishlistServerSnapshot
  );
  const cart = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const toggleWishlist = useCallback((id: string) => {
    const next = memoryWishlist.includes(id)
      ? memoryWishlist.filter((w) => w !== id)
      : [...memoryWishlist, id];
    memoryWishlist = next;
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    } catch {}
    notify();
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const qtyToAdd = Math.max(1, quantity);
    const existing = memoryCart.find((item) => item.id === product.id);
    let next: CartItem[];
    if (existing) {
      next = memoryCart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + qtyToAdd } : item
      );
    } else {
      next = [
        ...memoryCart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          qty: qtyToAdd,
          image: product.image,
        },
      ];
    }
    memoryCart = next;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
    notify();
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const next = memoryCart.filter((item) => item.id !== id);
    memoryCart = next;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
    notify();
  }, []);

  const updateCartQty = useCallback((id: string, qty: number) => {
    let next: CartItem[];
    if (qty <= 0) {
      next = memoryCart.filter((item) => item.id !== id);
    } else {
      next = memoryCart.map((item) => (item.id === id ? { ...item, qty } : item));
    }
    memoryCart = next;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
    notify();
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
