"use client";

import { createContext, useContext, useCallback, useState, useEffect, useSyncExternalStore } from "react";
import { api, type AuthUser, type StoreSettings } from "@/lib/api";

export type ProductStatus = "none" | "discount" | "new" | "hot" | "sale";

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
  specs?: Record<string, string>;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  image: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  discountAmount: number;
}

const WISHLIST_KEY = "industrialedge_wishlist";
const CART_KEY = "industrialedge_cart";
const COMPARE_KEY = "industrialedge_compare";
const RECENT_KEY = "industrialedge_recent";
const CUSTOMER_USER_KEY = "industrialedge_customer_user";
const CUSTOMER_TOKEN_KEY = "industrialedge_customer_token";

const INITIAL_CART: CartItem[] = [];
const SERVER_WISHLIST: string[] = [];
const SERVER_COMPARE: Product[] = [];
const SERVER_RECENT: string[] = [];

let memoryWishlist: string[] = [];
let memoryCart: CartItem[] = INITIAL_CART;
let memoryCompare: Product[] = [];
let memoryRecent: string[] = [];
let memoryCustomer: AuthUser | null = null;
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
    const rawCmp = localStorage.getItem(COMPARE_KEY);
    if (rawCmp) memoryCompare = JSON.parse(rawCmp);
    const rawRec = localStorage.getItem(RECENT_KEY);
    if (rawRec) memoryRecent = JSON.parse(rawRec);
    const rawUser = localStorage.getItem(CUSTOMER_USER_KEY);
    if (rawUser) memoryCustomer = JSON.parse(rawUser);
  } catch {
    // Ignore invalid JSON in storage
  }
  initialized = true;
}

export function _resetStoreForTesting() {
  memoryWishlist = [];
  memoryCart = [];
  memoryCompare = [];
  memoryRecent = [];
  memoryCustomer = null;
  initialized = true;
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(WISHLIST_KEY);
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(COMPARE_KEY);
      localStorage.removeItem(RECENT_KEY);
      localStorage.removeItem(CUSTOMER_USER_KEY);
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    } catch {}
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = () => {
    try {
      const rawW = localStorage.getItem(WISHLIST_KEY);
      if (rawW) memoryWishlist = JSON.parse(rawW);
      const rawC = localStorage.getItem(CART_KEY);
      if (rawC) memoryCart = JSON.parse(rawC);
      const rawCmp = localStorage.getItem(COMPARE_KEY);
      if (rawCmp) memoryCompare = JSON.parse(rawCmp);
      const rawRec = localStorage.getItem(RECENT_KEY);
      if (rawRec) memoryRecent = JSON.parse(rawRec);
      const rawUser = localStorage.getItem(CUSTOMER_USER_KEY);
      memoryCustomer = rawUser ? JSON.parse(rawUser) : null;
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

function getCompareSnapshot() {
  initMemory();
  return memoryCompare;
}
function getCompareServerSnapshot() {
  return SERVER_COMPARE;
}

function getRecentSnapshot() {
  initMemory();
  return memoryRecent;
}
function getRecentServerSnapshot() {
  return SERVER_RECENT;
}

function getCustomerSnapshot() {
  initMemory();
  return memoryCustomer;
}
function getCustomerServerSnapshot(): AuthUser | null {
  return null;
}

interface StoreState {
  wishlist: string[];
  cart: CartItem[];
  compareList: Product[];
  recentlyViewedIds: string[];
  customerUser: AuthUser | null;
  storeSettings: StoreSettings | null;
  appliedCoupon: AppliedCoupon | null;
  shippingMethod: "flat" | "free";
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  addToCompare: (product: Product, openModal?: boolean) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isCompared: (id: string) => boolean;
  trackRecentlyViewed: (id: string) => void;
  setCustomerUser: (user: AuthUser | null) => void;
  logoutCustomer: () => void;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  setShippingMethod: (method: "flat" | "free") => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: "login" | "register") => void;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const wishlist = useSyncExternalStore(subscribe, getWishlistSnapshot, getWishlistServerSnapshot);
  const cart = useSyncExternalStore(subscribe, getCartSnapshot, getCartServerSnapshot);
  const compareList = useSyncExternalStore(subscribe, getCompareSnapshot, getCompareServerSnapshot);
  const recentlyViewedIds = useSyncExternalStore(subscribe, getRecentSnapshot, getRecentServerSnapshot);
  const customerUser = useSyncExternalStore(subscribe, getCustomerSnapshot, getCustomerServerSnapshot);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"flat" | "free">("flat");
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    api
      .getSettings()
      .then((s) => {
        if (s) setStoreSettings(s);
      })
      .catch(() => {});
  }, []);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);
  const openCompareModal = useCallback(() => setIsCompareModalOpen(true), []);
  const closeCompareModal = useCallback(() => setIsCompareModalOpen(false), []);

  const openAuthModal = useCallback((tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

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

  const addToCart = useCallback((product: Product, quantity = 1, openDrawer = true) => {
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
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
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

  const clearCart = useCallback(() => {
    memoryCart = [];
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(CART_KEY);
    } catch {}
    notify();
  }, []);

  const isCompared = useCallback((id: string) => compareList.some((p) => p.id === id), [compareList]);

  const addToCompare = useCallback((product: Product, openModal = true) => {
    const exists = memoryCompare.some((p) => p.id === product.id);
    if (!exists) {
      // Keep max 4 products in comparison tray
      memoryCompare = [product, ...memoryCompare].slice(0, 4);
      try {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(memoryCompare));
      } catch {}
      notify();
    }
    if (openModal) {
      setIsCompareModalOpen(true);
    }
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    memoryCompare = memoryCompare.filter((p) => p.id !== id);
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(memoryCompare));
    } catch {}
    notify();
  }, []);

  const clearCompare = useCallback(() => {
    memoryCompare = [];
    try {
      localStorage.removeItem(COMPARE_KEY);
    } catch {}
    notify();
  }, []);

  const trackRecentlyViewed = useCallback((id: string) => {
    if (!id) return;
    const next = [id, ...memoryRecent.filter((r) => r !== id)].slice(0, 12);
    memoryRecent = next;
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
    notify();
  }, []);

  const setCustomerUser = useCallback((user: AuthUser | null) => {
    memoryCustomer = user;
    try {
      if (user) {
        localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CUSTOMER_USER_KEY);
      }
    } catch {}
    notify();
  }, []);

  const logoutCustomer = useCallback(() => {
    memoryCustomer = null;
    try {
      localStorage.removeItem(CUSTOMER_USER_KEY);
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    } catch {}
    notify();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const wishlistCount = wishlist.length;

  const value: StoreState = {
    wishlist,
    cart,
    compareList,
    recentlyViewedIds,
    customerUser,
    storeSettings,
    appliedCoupon,
    shippingMethod,
    isWishlisted,
    toggleWishlist,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isCompared,
    trackRecentlyViewed,
    setCustomerUser,
    logoutCustomer,
    setAppliedCoupon,
    setShippingMethod,
    cartCount,
    cartTotal,
    wishlistCount,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
    isCompareModalOpen,
    openCompareModal,
    closeCompareModal,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    setAuthModalTab,
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
