"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useStore } from "@/lib/store";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty, cartTotal } = useStore();

  // Shipping selection state
  const [shippingMethod, setShippingMethod] = useState<"flat" | "free">("flat");
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [shippingState, setShippingState] = useState("NY");
  const [tempState, setTempState] = useState("NY");
  const [tempCity, setTempCity] = useState("New York");
  const [tempZip, setTempZip] = useState("10001");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [updateCartMessage, setUpdateCartMessage] = useState<string | null>(null);

  // Free shipping check
  const qualifiesForFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;

  // Shipping cost: if free selected or if qualifies and user selects free
  const shippingCost = shippingMethod === "free" ? 0 : 10;
  const discountAmount = appliedCoupon ? 15 : 0;
  const finalTotal = Math.max(0, cartTotal + shippingCost - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setCouponError("Please enter a valid coupon code.");
      return;
    }
    if (
      couponCode.trim().toUpperCase() === "SAVE10" ||
      couponCode.trim().toUpperCase() === "DISCOUNT" ||
      couponCode.trim().toUpperCase() === "OFF15" ||
      couponCode.trim().toUpperCase() === "ONSUS"
    ) {
      setAppliedCoupon(couponCode.trim().toUpperCase());
      setCouponError(null);
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code. Try 'SAVE10' or 'ONSUS'.");
    }
  };

  const handleUpdateCart = () => {
    setUpdateCartMessage("Cart updated successfully!");
    setTimeout(() => {
      setUpdateCartMessage(null);
    }, 3000);
  };

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingState(tempState || "NY");
    setIsChangingAddress(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 sm:py-7">
        {/* ========================================================= */}
        {/* 1. BREADCRUMBS                                            */}
        {/* ========================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#71717a] mb-8">
          <Link href="/" className="hover:text-[#ff3d3d] transition-colors">
            Home
          </Link>
          <span className="text-[#a1a1aa] font-normal">&gt;</span>
          <span className="text-[#18181b] font-medium">Cart</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. THREE-STEP CHECKOUT PROGRESS BAR (STEPPER)             */}
        {/* ========================================================= */}
        <div className="max-w-[760px] mx-auto my-6 sm:my-10">
          <div className="relative flex items-center justify-between">
            {/* Step 1: Shopping Cart (ACTIVE) */}
            <div className="relative flex-1 flex flex-col items-center z-10">
              {/* Connecting line on the left */}
              <div className="absolute top-5 left-0 right-1/2 h-[2.5px] bg-[#ff3d3d] -z-10" />
              {/* Connecting line on the right */}
              <div className="absolute top-5 left-1/2 right-0 h-[2px] bg-[#e4e4e7] -z-10" />

              <div className="w-11 h-11 rounded-full bg-[#ff3d3d] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(255,61,61,0.25)] ring-4 ring-white">
                <ShoppingCart size={19} strokeWidth={2} />
              </div>
              <span className="mt-2.5 text-[14px] font-semibold text-[#18181b]">
                Shopping Cart
              </span>
            </div>

            {/* Step 2: Shopping & Checkout */}
            <div className="relative flex-1 flex flex-col items-center z-10">
              {/* Connecting line left & right */}
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-[#e4e4e7] -z-10" />

              <div className="w-11 h-11 rounded-full bg-[#f4f4f5] text-[#a1a1aa] border border-[#e4e4e7] flex items-center justify-center ring-4 ring-white">
                <Truck size={19} strokeWidth={1.75} />
              </div>
              <span className="mt-2.5 text-[14px] font-medium text-[#71717a]">
                Shopping &amp; Checkout
              </span>
            </div>

            {/* Step 3: Confirmation */}
            <div className="relative flex-1 flex flex-col items-center z-10">
              {/* Connecting line on the left */}
              <div className="absolute top-5 left-0 right-1/2 h-[2px] bg-[#e4e4e7] -z-10" />
              {/* Connecting line on the right */}
              <div className="absolute top-5 left-1/2 right-0 h-[2px] bg-[#e4e4e7] -z-10" />

              <div className="w-11 h-11 rounded-full bg-[#f4f4f5] text-[#a1a1aa] border border-[#e4e4e7] flex items-center justify-center ring-4 ring-white">
                <CheckCircle2 size={19} strokeWidth={1.75} />
              </div>
              <span className="mt-2.5 text-[14px] font-medium text-[#71717a]">
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CART CONTENT                                           */}
        {/* ========================================================= */}
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-[#fafafa] rounded-[10px] border border-[#f0f0f0] my-8">
            <div className="w-20 h-20 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] mx-auto mb-4 shadow-xs">
              <ShoppingBag size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-[14px] text-[#6b7280] max-w-[340px] mx-auto mb-6 leading-relaxed">
              Before you can checkout, you must add some products to your shopping cart.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-medium text-[14px] rounded-[6px] transition-all shadow-sm hover:shadow active:scale-[0.99]"
            >
              <span>Return to shop</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-10 mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ===================================================== */}
            {/* LEFT COLUMN: PRODUCT TABLE & COUPON ACTIONS           */}
            {/* ===================================================== */}
            <div className="lg:col-span-8">
              {/* Success Notification on Update */}
              {updateCartMessage && (
                <div className="mb-4 p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13.5px] rounded-[6px] flex items-center gap-2 animate-in fade-in duration-200">
                  <Check size={16} className="text-[#059669] shrink-0" />
                  <span>{updateCartMessage}</span>
                </div>
              )}

              {/* Cart Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] text-[15px] font-bold text-[#18181b]">
                      <th className="pb-4 pt-1 pl-12 font-semibold">Product</th>
                      <th className="pb-4 pt-1 text-center font-semibold w-[120px]">Price</th>
                      <th className="pb-4 pt-1 text-center font-semibold w-[150px]">Quantity</th>
                      <th className="pb-4 pt-1 text-right font-semibold pr-4 w-[130px]">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {cart.map((item) => (
                      <tr key={item.id} className="group hover:bg-[#fbfcfd] transition-colors">
                        {/* Remove 'X' & Product Image + Title */}
                        <td className="py-5 pr-4 align-middle">
                          <div className="flex items-center gap-4">
                            {/* Remove '×' Button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#9ca3af] hover:text-[#ff3d3d] transition-colors p-1 cursor-pointer shrink-0"
                              title="Remove item"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X size={17} strokeWidth={2} />
                            </button>

                            {/* Product Image */}
                            <div className="relative w-[72px] h-[72px] rounded-[6px] border border-[#e5e7eb] bg-[#fbfcfd] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="72px"
                                unoptimized
                                className="object-contain p-1"
                              />
                            </div>

                            {/* Product Title */}
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/product/${item.id}`}
                                className="text-[14.5px] font-semibold text-[#18181b] hover:text-[#ff3d3d] transition-colors leading-[1.35] line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-[12px] text-[#71717a] mt-0.5 sm:hidden">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-5 px-3 text-center align-middle">
                          <span className="text-[15px] font-bold text-[#18181b]">
                            ${item.price.toFixed(2)}
                          </span>
                        </td>

                        {/* Quantity Stepper (Pill with - / + buttons) */}
                        <td className="py-5 px-3 text-center align-middle">
                          <div className="inline-flex items-center border border-[#e4e4e7] rounded-full bg-white px-2 py-1 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, item.qty - 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[#71717a] hover:text-[#ff3d3d] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                              title="Decrease quantity"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="w-7 text-center font-semibold text-[#18181b] text-[13.5px] select-none">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, item.qty + 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[#71717a] hover:text-[#ff3d3d] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                              title="Increase quantity"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>

                        {/* Subtotal */}
                        <td className="py-5 pl-3 pr-4 text-right align-middle">
                          <span className="text-[15px] font-bold text-[#18181b]">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Bar below Table: Coupon Code & Update Cart */}
              <div className="mt-6 pt-5 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: Coupon Code Form */}
                <form
                  onSubmit={handleApplyCoupon}
                  className="flex items-center gap-2.5 w-full sm:w-auto"
                >
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (couponError) setCouponError(null);
                    }}
                    placeholder="Coupon code"
                    className="h-[42px] px-4 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors w-full sm:w-[220px]"
                  />
                  <button
                    type="submit"
                    className="h-[42px] px-6 bg-[#333e48] hover:bg-[#222a32] text-white font-semibold text-[13.5px] rounded-[5px] transition-colors shrink-0 shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    Apply Coupon
                  </button>
                </form>

                {/* Right: Update Cart Button */}
                <button
                  type="button"
                  onClick={handleUpdateCart}
                  className="h-[42px] px-6 bg-[#333e48] hover:bg-[#222a32] text-white font-semibold text-[13.5px] rounded-[5px] transition-colors w-full sm:w-auto shadow-xs cursor-pointer active:scale-[0.99]"
                >
                  Update Cart
                </button>
              </div>

              {/* Coupon Feedback Message */}
              {couponError && (
                <p className="mt-2 text-xs text-[#ef4444]">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="mt-2 text-xs text-[#10b981] flex items-center gap-1 font-medium">
                  <Check size={13} />
                  Coupon &quot;{appliedCoupon}&quot; applied! ($15.00 discount)
                </p>
              )}
            </div>

            {/* ===================================================== */}
            {/* RIGHT COLUMN: "CART TOTALS" BOX                       */}
            {/* ===================================================== */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                {/* Heading */}
                <h3 className="text-[19px] font-bold text-[#18181b] mb-4">
                  Cart totals
                </h3>

                {/* Subtotal Row */}
                <div className="py-3 flex items-center justify-between text-[14px] border-b border-[#f4f4f5]">
                  <span className="text-[#52525b] font-medium">Subtotal</span>
                  <span className="font-semibold text-[#18181b]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Discount Row (if coupon applied) */}
                {appliedCoupon && (
                  <div className="py-2.5 flex items-center justify-between text-[14px] border-b border-[#f4f4f5] text-[#10b981]">
                    <span className="font-medium">Coupon ({appliedCoupon})</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Shipping Section */}
                <div className="py-4 border-b border-[#f4f4f5]">
                  <div className="flex items-start justify-between text-[14px] mb-2">
                    <span className="text-[#52525b] font-medium pt-0.5">Shipping</span>
                    <div className="space-y-2 text-right">
                      {/* Flat rate radio */}
                      <label className="flex items-center justify-end gap-2 text-[13.5px] text-[#18181b] cursor-pointer">
                        <span className="text-[#3f3f46]">Flat rate: $10.00</span>
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={shippingMethod === "flat"}
                          onChange={() => setShippingMethod("flat")}
                          className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                        />
                      </label>

                      {/* Free shipping radio */}
                      <label className="flex items-center justify-end gap-2 text-[13.5px] text-[#18181b] cursor-pointer">
                        <span className="text-[#3f3f46]">Free shipping</span>
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={shippingMethod === "free"}
                          onChange={() => setShippingMethod("free")}
                          className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Shipping to location & Change address */}
                  <div className="text-right text-[12.5px] text-[#71717a] mt-2.5">
                    <div>Shipping to <span className="font-semibold text-[#18181b]">{shippingState}.</span></div>
                    <button
                      type="button"
                      onClick={() => setIsChangingAddress((prev) => !prev)}
                      className="font-medium text-[#18181b] hover:text-[#ff3d3d] hover:underline cursor-pointer transition-colors mt-0.5 inline-block"
                    >
                      {isChangingAddress ? "Close" : "Change address"}
                    </button>

                    {/* Inline Change Address Form */}
                    {isChangingAddress && (
                      <form
                        onSubmit={handleUpdateAddress}
                        className="mt-3 p-3 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] text-left space-y-2 animate-in fade-in duration-150"
                      >
                        <div>
                          <label className="block text-[11px] font-semibold text-[#71717a] uppercase mb-1">
                            State / Province
                          </label>
                          <select
                            value={tempState}
                            onChange={(e) => setTempState(e.target.value)}
                            className="w-full h-8 px-2 border border-[#d4d4d8] rounded bg-white text-xs text-[#18181b]"
                          >
                            <option value="NY">New York (NY)</option>
                            <option value="CA">California (CA)</option>
                            <option value="TX">Texas (TX)</option>
                            <option value="FL">Florida (FL)</option>
                            <option value="IL">Illinois (IL)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#71717a] uppercase mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={tempCity}
                            onChange={(e) => setTempCity(e.target.value)}
                            className="w-full h-8 px-2 border border-[#d4d4d8] rounded bg-white text-xs text-[#18181b]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#71717a] uppercase mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={tempZip}
                            onChange={(e) => setTempZip(e.target.value)}
                            className="w-full h-8 px-2 border border-[#d4d4d8] rounded bg-white text-xs text-[#18181b]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-[#333e48] hover:bg-[#222a32] text-white text-xs font-semibold rounded cursor-pointer transition-colors mt-1"
                        >
                          Update
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Total Row */}
                <div className="py-4 flex items-center justify-between text-[15px]">
                  <span className="font-bold text-[#18181b]">Total</span>
                  <span className="text-[20px] font-bold text-[#ff3d3d]">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Proceed To Checkout Button */}
                <button
                  type="button"
                  onClick={() => {
                    alert("Proceeding to checkout with order total: $" + finalTotal.toFixed(2));
                  }}
                  className="w-full mt-2 h-[48px] bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[14.5px] rounded-[6px] flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-[0.99]"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. RED ACCENT BAR & FREE SHIPPING QUALIFIED BANNER        */}
        {/* ========================================================= */}
        <div className="mt-12 pt-6 border-t-[3px] border-[#ff3d3d]">
          <div className="flex items-center gap-2.5 text-[13.5px] text-[#333e48]">
            <Truck size={18} strokeWidth={1.75} className="text-[#333e48] shrink-0" />
            <span>
              {qualifiesForFreeShipping
                ? "Your order qualifies for free shipping!"
                : `Add $${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2)} more to qualify for free shipping!`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
