"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Truck, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartDrawer() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateCartQty,
    isCartDrawerOpen,
    closeCartDrawer,
  } = useStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartDrawerOpen]);

  const qualifiesForFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingProgress = Math.min(
    100,
    Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <>
      {/* Dark Backdrop Overlay */}
      <div
        onClick={closeCartDrawer}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/45 backdrop-blur-[2px] z-[9998] transition-opacity duration-300 ${
          isCartDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your shopping cart"
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[390px] sm:max-w-[420px] bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.15)] z-[9999] flex flex-col transition-transform duration-300 ease-out ${
          isCartDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ======================================================== */}
        {/* 1. DRAWER HEADER                                         */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] bg-white shrink-0">
          <h2 className="text-[19px] font-bold text-[#1f2937] tracking-tight">
            Your cart
          </h2>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="p-1.5 text-[#64748b] hover:text-[#111827] hover:bg-[#f1f5f9] rounded-full transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 2. CART ITEMS LIST (SCROLLABLE)                          */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-[#f1f3f5]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] mb-4">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[16px] font-semibold text-[#1e293b] mb-1.5">
                Your cart is empty
              </h3>
              <p className="text-[13px] text-[#64748b] max-w-[220px] mb-6 leading-relaxed">
                Explore our store and add some cutting-edge products!
              </p>
              <Link
                href="/shop"
                onClick={closeCartDrawer}
                className="px-6 py-2.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-[13.5px] font-medium rounded-[6px] transition-colors shadow-sm"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="py-4 flex items-start gap-3.5 group transition-colors"
              >
                {/* Product Image */}
                <div className="relative w-[72px] h-[72px] rounded-[6px] border border-[#e5e7eb] bg-[#fbfcfd] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="72px"
                    className="object-contain p-1"
                  />
                </div>

                {/* Info Column */}
                <div className="flex-1 min-w-0 pr-1">
                  {/* Title */}
                  <Link
                    href={`/product/${item.id}`}
                    onClick={closeCartDrawer}
                    className="text-[13.5px] font-medium text-[#1e5bc6] hover:text-[#004085] hover:underline line-clamp-2 leading-[1.35] transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </Link>

                  {/* Price */}
                  <div className="text-[15px] font-bold text-[#1e293b] mt-1 leading-none">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity display and stepper controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[12.5px] text-[#64748b] mr-1">
                      × {item.qty}
                    </span>
                    <div className="inline-flex items-center border border-[#e2e8f0] rounded-[4px] bg-[#f8fafc] text-xs">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.qty - 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#64748b] hover:text-[#0ea57a] hover:bg-white transition-colors cursor-pointer"
                        title="Decrease quantity"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} strokeWidth={2.5} />
                      </button>
                      <span className="w-5 text-center font-medium text-[#1e293b] select-none text-[11px]">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.qty + 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#64748b] hover:text-[#0ea57a] hover:bg-white transition-colors cursor-pointer"
                        title="Increase quantity"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove 'X' button (Matching user screenshot) */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-[#9ca3af] hover:text-[#0ea57a] p-1 transition-colors cursor-pointer shrink-0 mt-0.5 rounded"
                  title="Remove product"
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. DRAWER FOOTER (SUBTOTAL, BUTTONS, SHIPPING)           */}
        {/* ======================================================== */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#f0f0f0] bg-white shrink-0">
            {/* Subtotal Row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-semibold text-[#1e293b]">
                Subtotal:
              </span>
              <span className="text-[18px] font-bold text-[#0ea57a]">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons: View cart (Dark) & Checkout (Red) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link
                href="/cart"
                onClick={closeCartDrawer}
                className="h-[44px] bg-[#333e48] hover:bg-[#222a32] text-white font-semibold text-[14px] rounded-[6px] flex items-center justify-center transition-colors shadow-xs active:scale-[0.99]"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="h-[44px] bg-[#0ea57a] hover:bg-[#0b8462] text-white font-semibold text-[14px] rounded-[6px] flex items-center justify-center transition-colors shadow-xs active:scale-[0.99]"
              >
                Checkout
              </Link>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="w-full h-[3px] bg-[#d1fae5] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#0ea57a] rounded-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>

            {/* Free Shipping Qualified Message */}
            <div className="flex items-center gap-2 text-[13px] text-[#4b5563]">
              <Truck size={17} strokeWidth={1.6} className="text-[#4b5563] shrink-0" />
              <span>
                {qualifiesForFreeShipping
                  ? "Your order qualifies for free shipping!"
                  : `Add $${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2)} more for free shipping!`}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
