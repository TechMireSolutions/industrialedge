import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { StoreProvider, useStore, Product, _resetStoreForTesting } from "@/lib/store";

const mockProduct: Product = {
  id: "test-prod-1",
  name: "Industrial Sensor Probe",
  price: 150,
  originalPrice: 180,
  status: "new",
  image: "/images/sensor.jpg",
  category: "Sensors",
  rating: 4.8,
  description: "High accuracy industrial temperature sensor.",
};

const mockProduct2: Product = {
  id: "test-prod-2",
  name: "PLC Logic Controller",
  price: 320,
  status: "none",
  image: "/images/plc.jpg",
  category: "Automation",
};

describe("Store / Business State Management", () => {
  beforeEach(() => {
    localStorage.clear();
    _resetStoreForTesting();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <StoreProvider>{children}</StoreProvider>
  );

  describe("Cart Operations", () => {
    it("should start with an empty cart", () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      expect(result.current.cart).toEqual([]);
      expect(result.current.cartCount).toBe(0);
      expect(result.current.cartTotal).toBe(0);
    });

    it("should add a new product to cart", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1, false);
      });

      expect(result.current.cart.length).toBe(1);
      expect(result.current.cart[0].id).toBe("test-prod-1");
      expect(result.current.cart[0].qty).toBe(1);
      expect(result.current.cartCount).toBe(1);
      expect(result.current.cartTotal).toBe(150);
    });

    it("should increment quantity when adding an already existing product", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1, false);
      });
      act(() => {
        result.current.addToCart(mockProduct, 2, false);
      });

      expect(result.current.cart.length).toBe(1);
      expect(result.current.cart[0].qty).toBe(3);
      expect(result.current.cartCount).toBe(3);
      expect(result.current.cartTotal).toBe(150 * 3);
    });

    it("should update quantity directly with updateCartQty", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1, false);
      });
      act(() => {
        result.current.updateCartQty("test-prod-1", 5);
      });

      expect(result.current.cart[0].qty).toBe(5);
      expect(result.current.cartCount).toBe(5);
      expect(result.current.cartTotal).toBe(150 * 5);
    });

    it("should remove item when updateCartQty is set to 0 or less", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2, false);
      });
      act(() => {
        result.current.updateCartQty("test-prod-1", 0);
      });

      expect(result.current.cart.length).toBe(0);
      expect(result.current.cartCount).toBe(0);
      expect(result.current.cartTotal).toBe(0);
    });

    it("should remove item directly with removeFromCart", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 1, false);
        result.current.addToCart(mockProduct2, 1, false);
      });

      expect(result.current.cart.length).toBe(2);

      act(() => {
        result.current.removeFromCart("test-prod-1");
      });

      expect(result.current.cart.length).toBe(1);
      expect(result.current.cart[0].id).toBe("test-prod-2");
      expect(result.current.cartTotal).toBe(320);
    });
  });

  describe("Wishlist Operations", () => {
    it("should start with an empty wishlist", () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      expect(result.current.wishlist).toEqual([]);
      expect(result.current.wishlistCount).toBe(0);
      expect(result.current.isWishlisted("prod-1")).toBe(false);
    });

    it("should toggle product into wishlist", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      act(() => {
        result.current.toggleWishlist("prod-1");
      });

      expect(result.current.wishlist).toContain("prod-1");
      expect(result.current.isWishlisted("prod-1")).toBe(true);
      expect(result.current.wishlistCount).toBe(1);
    });

    it("should toggle product out of wishlist when already present", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      act(() => {
        result.current.toggleWishlist("prod-1");
      });
      expect(result.current.isWishlisted("prod-1")).toBe(true);

      act(() => {
        result.current.toggleWishlist("prod-1");
      });
      expect(result.current.isWishlisted("prod-1")).toBe(false);
      expect(result.current.wishlistCount).toBe(0);
    });
  });

  describe("Modal & Drawer UI State", () => {
    it("should control cart drawer open/close states", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      expect(result.current.isCartDrawerOpen).toBe(false);

      act(() => {
        result.current.openCartDrawer();
      });
      expect(result.current.isCartDrawerOpen).toBe(true);

      act(() => {
        result.current.closeCartDrawer();
      });
      expect(result.current.isCartDrawerOpen).toBe(false);
    });

    it("should control auth modal tab and visibility", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      expect(result.current.isAuthModalOpen).toBe(false);

      act(() => {
        result.current.openAuthModal("register");
      });
      expect(result.current.isAuthModalOpen).toBe(true);
      expect(result.current.authModalTab).toBe("register");

      act(() => {
        result.current.setAuthModalTab("login");
      });
      expect(result.current.authModalTab).toBe("login");

      act(() => {
        result.current.closeAuthModal();
      });
      expect(result.current.isAuthModalOpen).toBe(false);
    });
  });
});
