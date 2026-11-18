"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Truck,
  CheckCircle2,
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api";
import {
  formatPrice,
  DEFAULT_FREE_SHIPPING_THRESHOLD,
  DEFAULT_FLAT_SHIPPING,
} from "@/lib/currency";

const PAKISTAN_PROVINCES = [
  "Sindh",
  "Punjab",
  "Islamabad Capital Territory",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    cartTotal,
    storeSettings,
    appliedCoupon,
    setAppliedCoupon,
    shippingMethod,
    setShippingMethod,
  } = useStore();

  const freeShippingThreshold =
    storeSettings?.freeShippingThreshold || DEFAULT_FREE_SHIPPING_THRESHOLD;
  const flatShippingRate = storeSettings?.flatShippingRate || DEFAULT_FLAT_SHIPPING;

  // Shipping estimate state (Pakistan defaults)
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [shippingProvince, setShippingProvince] = useState("Sindh");
  const [shippingCity, setShippingCity] = useState("Karachi");
  const [tempProvince, setTempProvince] = useState("Sindh");
  const [tempCity, setTempCity] = useState("Karachi");
  const [tempZip, setTempZip] = useState("75500");

  // Coupon state
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || "");
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [updateCartMessage, setUpdateCartMessage] = useState<string | null>(null);

  const qualifiesForFreeShipping = cartTotal >= freeShippingThreshold;

  // Auto-select free shipping once threshold is met
  useEffect(() => {
    if (qualifiesForFreeShipping) {
      setShippingMethod("free");
    } else if (shippingMethod === "free" && !qualifiesForFreeShipping) {
      setShippingMethod("flat");
    }
  }, [qualifiesForFreeShipping, shippingMethod, setShippingMethod]);

  const shippingCost =
    shippingMethod === "free" && qualifiesForFreeShipping ? 0 : flatShippingRate;

  // Recalculate discount dynamically as cart changes
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round((cartTotal * appliedCoupon.value) / 100)
      : Math.min(cartTotal, appliedCoupon.value)
    : 0;

  const finalTotal = Math.max(0, cartTotal + shippingCost - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code (e.g. EDGE20, WELCOME10, FREESHIP).");
      return;
    }

    setVerifyingCoupon(true);
    try {
      const verified = await api.verifyCoupon(couponCode.trim(), cartTotal);
      setAppliedCoupon(verified);
      setCouponCode(verified.code);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(
        err instanceof Error
          ? err.message
          : "Invalid coupon code. Try EDGE20, WELCOME10, or FREESHIP."
      );
    } finally {
      setVerifyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  const handleUpdateCart = () => {
    setUpdateCartMessage("Cart totals and quantities are up to date!");
    setTimeout(() => {
      setUpdateCartMessage(null);
    }, 3000);
  };

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingProvince(tempProvince || "Sindh");
    setShippingCity(tempCity || "Karachi");
    setIsChangingAddress(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 sm:py-7">
        {/* 1. BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#64748b] mb-8">
          <Link href="/" className="hover:text-[#0ea57a] transition-colors">
            Home
          </Link>
          <span className="text-[#94a3b8] font-normal">&gt;</span>
          <span className="text-[#171145] font-medium">Cart</span>
        </nav>

        {/* 2. THREE-STEP PROGRESS BAR */}
        <div className="max-w-[760px] mx-auto my-4 sm:my-10 px-2 sm:px-0">
          <div className="relative flex items-center justify-between">
            <div className="relative flex-1 flex flex-col items-center z-10">
              <div className="absolute top-4 sm:top-5 left-0 right-1/2 h-[2px] sm:h-[2.5px] bg-[#0ea57a] -z-10" />
              <div className="absolute top-4 sm:top-5 left-1/2 right-0 h-[2px] bg-[#e4e4e7] -z-10" />
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0ea57a] text-white flex items-center justify-center shadow-sm ring-2 sm:ring-4 ring-white">
                <ShoppingCart className="w-3.5 h-3.5 sm:w-[19px] sm:h-[19px]" strokeWidth={2} />
              </div>
              <span className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-[14px] font-semibold text-center text-[#171145]">
                Shopping Cart
              </span>
            </div>

            <div className="relative flex-1 flex flex-col items-center z-10">
              <div className="absolute top-4 sm:top-5 left-0 right-0 h-[2px] bg-[#e4e4e7] -z-10" />
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#f4f4f5] text-[#94a3b8] border border-[#e4e4e7] flex items-center justify-center ring-2 sm:ring-4 ring-white">
                <Truck className="w-3.5 h-3.5 sm:w-[19px] sm:h-[19px]" strokeWidth={1.75} />
              </div>
              <span className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-[14px] font-medium text-center text-[#64748b]">
                Shipping &amp; Checkout
              </span>
            </div>

            <div className="relative flex-1 flex flex-col items-center z-10">
              <div className="absolute top-4 sm:top-5 left-0 right-1/2 h-[2px] bg-[#e4e4e7] -z-10" />
              <div className="absolute top-4 sm:top-5 left-1/2 right-0 h-[2px] bg-[#e4e4e7] -z-10" />
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#f4f4f5] text-[#94a3b8] border border-[#e4e4e7] flex items-center justify-center ring-2 sm:ring-4 ring-white">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-[19px] sm:h-[19px]" strokeWidth={1.75} />
              </div>
              <span className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-[14px] font-medium text-center text-[#64748b]">
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* 3. CART CONTENT */}
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-[#fafafa] rounded-[10px] border border-[#f0f0f0] my-8">
            <div className="w-20 h-20 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] mx-auto mb-4 shadow-xs">
              <ShoppingBag size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-[#171145] mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-[14px] text-[#64748b] max-w-[340px] mx-auto mb-6 leading-relaxed">
              Before you can checkout, add some products to your shopping cart.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-medium text-[14px] rounded-[6px] transition-all shadow-sm"
            >
              <span>Return to shop</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-10 mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: PRODUCT TABLE & COUPON */}
            <div className="lg:col-span-8">
              {updateCartMessage && (
                <div className="mb-4 p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13.5px] rounded-[6px] flex items-center gap-2">
                  <Check size={16} className="text-[#059669] shrink-0" />
                  <span>{updateCartMessage}</span>
                </div>
              )}

              <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] text-[14.5px] font-bold text-[#171145]">
                      <th className="pb-4 pt-1 pl-12 font-semibold">Product</th>
                      <th className="pb-4 pt-1 text-center font-semibold w-[140px]">Price</th>
                      <th className="pb-4 pt-1 text-center font-semibold w-[140px]">Quantity</th>
                      <th className="pb-4 pt-1 text-right font-semibold pr-4 w-[150px]">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {cart.map((item) => (
                      <tr key={item.id} className="group hover:bg-[#fbfcfd] transition-colors">
                        <td className="py-5 pr-4 align-middle">
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#9ca3af] hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                              title="Remove item"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X size={17} strokeWidth={2} />
                            </button>

                            <div className="relative w-[72px] h-[72px] rounded-[6px] border border-[#e5e7eb] bg-[#fbfcfd] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="72px"
                                className="object-contain p-1"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/product/${item.id}`}
                                className="text-[14.5px] font-semibold text-[#171145] hover:text-[#0ea57a] transition-colors leading-[1.35] line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-[12px] text-[#64748b] mt-0.5 sm:hidden">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-5 px-3 text-center align-middle whitespace-nowrap">
                          <span className="text-[14.5px] font-bold text-[#171145]">
                            {formatPrice(item.price)}
                          </span>
                        </td>

                        <td className="py-5 px-3 text-center align-middle">
                          <div className="inline-flex items-center border border-[#e4e4e7] rounded-full bg-white px-2 py-1 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, item.qty - 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[#64748b] hover:text-[#0ea57a] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                              title="Decrease quantity"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="w-7 text-center font-semibold text-[#171145] text-[13.5px] select-none">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, item.qty + 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[#64748b] hover:text-[#0ea57a] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                              title="Increase quantity"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>

                        <td className="py-5 pl-3 pr-4 text-right align-middle whitespace-nowrap">
                          <span className="text-[15px] font-bold text-[#0ea57a]">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Coupon Form & Update Cart */}
              <div className="mt-6 pt-5 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2.5 w-full sm:w-auto">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      if (couponError) setCouponError(null);
                    }}
                    placeholder="Coupon code (e.g. EDGE20)"
                    className="h-[42px] px-4 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] placeholder:text-[#94a3b8] focus:border-[#0ea57a] transition-colors w-full sm:w-[230px] font-mono uppercase"
                  />
                  <button
                    type="submit"
                    disabled={verifyingCoupon}
                    className="h-[42px] px-6 bg-[#171145] hover:bg-[#0ea57a] disabled:opacity-60 text-white font-semibold text-[13.5px] rounded-[5px] transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    {verifyingCoupon ? "Checking..." : "Apply Coupon"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleUpdateCart}
                  className="h-[42px] px-6 bg-slate-100 hover:bg-slate-200 text-[#171145] font-semibold text-[13.5px] rounded-[5px] transition-colors w-full sm:w-auto cursor-pointer"
                >
                  Update Cart
                </button>
              </div>

              {couponError && (
                <p className="mt-2.5 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} />
                  <span>{couponError}</span>
                </p>
              )}
              {appliedCoupon && (
                <div className="mt-2.5 text-xs text-emerald-700 flex items-center gap-2 font-medium">
                  <Check size={14} />
                  <span>
                    Coupon &quot;{appliedCoupon.code}&quot; applied! ({formatPrice(discountAmount)} discount)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-rose-600 hover:underline ml-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: CART TOTALS */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <h3 className="text-[19px] font-bold text-[#171145] mb-4">Cart totals</h3>

                <div className="py-3 flex items-center justify-between text-[14px] border-b border-[#f4f4f5]">
                  <span className="text-[#475569] font-medium">Subtotal</span>
                  <span className="font-semibold text-[#171145]">{formatPrice(cartTotal)}</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="py-2.5 flex items-center justify-between text-[14px] border-b border-[#f4f4f5] text-[#0ea57a]">
                    <span className="font-medium">Coupon ({appliedCoupon.code})</span>
                    <span className="font-semibold">−{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="py-4 border-b border-[#f4f4f5]">
                  <div className="flex items-start justify-between text-[14px] mb-2">
                    <span className="text-[#475569] font-medium pt-0.5">Shipping</span>
                    <div className="space-y-2 text-right">
                      <label className="flex items-center justify-end gap-2 text-[13.5px] text-[#171145] cursor-pointer">
                        <span className="text-[#334155]">
                          Flat rate: {formatPrice(flatShippingRate)}
                        </span>
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={shippingMethod === "flat"}
                          onChange={() => setShippingMethod("flat")}
                          className="accent-[#0ea57a] w-4 h-4 cursor-pointer"
                        />
                      </label>

                      <label
                        className={`flex items-center justify-end gap-2 text-[13.5px] ${
                          qualifiesForFreeShipping
                            ? "text-[#171145] cursor-pointer"
                            : "text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <span>
                          Free shipping{" "}
                          {!qualifiesForFreeShipping &&
                            `(over ${formatPrice(freeShippingThreshold)})`}
                        </span>
                        <input
                          type="radio"
                          name="shipping_method"
                          disabled={!qualifiesForFreeShipping}
                          checked={shippingMethod === "free" && qualifiesForFreeShipping}
                          onChange={() => setShippingMethod("free")}
                          className="accent-[#0ea57a] w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="text-right text-[12.5px] text-[#64748b] mt-2.5">
                    <div>
                      Shipping to{" "}
                      <span className="font-semibold text-[#171145]">
                        {shippingCity}, {shippingProvince}, Pakistan.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsChangingAddress((prev) => !prev)}
                      className="font-medium text-[#0ea57a] hover:underline cursor-pointer transition-colors mt-0.5 inline-block"
                    >
                      {isChangingAddress ? "Close" : "Change address"}
                    </button>

                    {isChangingAddress && (
                      <form
                        onSubmit={handleUpdateAddress}
                        className="mt-3 p-3 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] text-left space-y-2"
                      >
                        <div>
                          <label className="block text-[11px] font-semibold text-[#64748b] uppercase mb-1">
                            Province
                          </label>
                          <select
                            value={tempProvince}
                            onChange={(e) => setTempProvince(e.target.value)}
                            className="w-full h-8 px-2 border border-[#d4d4d8] rounded bg-white text-xs text-[#171145]"
                          >
                            {PAKISTAN_PROVINCES.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#64748b] uppercase mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={tempCity}
                            onChange={(e) => setTempCity(e.target.value)}
                            placeholder="e.g. Karachi, Lahore, Islamabad"
                            className="w-full h-8 px-2 border border-[#d4d4d8] rounded bg-white text-xs text-[#171145]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#64748b] uppercase mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={tempZip}
                            onChange={(e) => setTempZip(e.target.value)}
                            className="w-full h-8 px-2 border border-[#d4d4d8] rounded bg-white text-xs text-[#171145]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-[#171145] hover:bg-[#0ea57a] text-white text-xs font-semibold rounded cursor-pointer transition-colors mt-1"
                        >
                          Update
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                <div className="py-4 flex items-center justify-between text-[15px]">
                  <span className="font-bold text-[#171145]">Total</span>
                  <span className="text-[20px] font-bold text-[#0ea57a]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full mt-2 h-[48px] bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14.5px] rounded-[6px] flex items-center justify-center transition-colors shadow-xs"
                >
                  Proceed To Checkout
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 4. FREE SHIPPING BANNER */}
        <div className="mt-12 pt-6 border-t-[3px] border-[#0ea57a]">
          <div className="flex items-center gap-2.5 text-[13.5px] text-[#334155]">
            <Truck size={18} strokeWidth={1.75} className="text-[#0ea57a] shrink-0" />
            <span>
              {qualifiesForFreeShipping
                ? "Your order qualifies for free nationwide shipping across Pakistan!"
                : `Add ${formatPrice(freeShippingThreshold - cartTotal)} more to qualify for free shipping!`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
