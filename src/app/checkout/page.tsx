"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Info,
  ChevronDown,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/store";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const orderParam = searchParams.get("order");

  const { cart, cartTotal } = useStore();

  // Stepper state: 2 (Checkout form) or 3 (Order received / Confirmation)
  const [currentStep, setCurrentStep] = useState<2 | 3>(
    stepParam === "confirmation" || orderParam ? 3 : 2
  );

  useEffect(() => {
    if (stepParam === "confirmation" || orderParam) {
      setCurrentStep(3);
    }
  }, [stepParam, orderParam]);

  // Coupon toggle & state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Shipping selection & different address toggle
  const [shippingMethod, setShippingMethod] = useState<"flat" | "free">("flat");
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"bacs" | "cheque" | "cod">("bacs");

  // Form fields state
  const [formData, setFormData] = useState({
    firstName: "Mir",
    lastName: "Alixfzzxfz",
    companyName: "",
    country: "Pakistan",
    streetAddress1: "Sindh 75950",
    streetAddress2: "",
    city: "Karachi",
    state: "Sindh",
    zipCode: "75950",
    phone: "343143",
    email: "mohibali.tms@gmail.com",
    orderNotes: "",
    // Ship to different address fields
    diffFirstName: "",
    diffLastName: "",
    diffCompany: "",
    diffCountry: "Pakistan",
    diffAddress1: "",
    diffAddress2: "",
    diffCity: "",
    diffState: "Sindh",
    diffZip: "",
  });

  const [orderId, setOrderId] = useState<string>(orderParam || "6535");
  const [orderDate] = useState("October 26, 2026");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setCouponError("Please enter a valid coupon code.");
      return;
    }
    const cleanCode = couponCode.trim().toUpperCase();
    if (["SAVE10", "INDUSTRIALEDGE", "ONSUS", "DISCOUNT", "OFF15"].includes(cleanCode)) {
      setAppliedCoupon(cleanCode);
      setCouponError(null);
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code. Try 'SAVE10' or 'INDUSTRIALEDGE'.");
    }
  };

  const effectiveCartTotal = cartTotal > 0 ? cartTotal : 258;
  const shippingCost = shippingMethod === "free" ? 0 : 10;
  const discountAmount = appliedCoupon ? 15 : 0;
  const finalTotal = Math.max(0, effectiveCartTotal + shippingCost - discountAmount);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId("6535");
    setCurrentStep(3); // Advance to Confirmation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Display items for the order
  const displayItems =
    cart.length > 0
      ? cart
      : [
          {
            id: "airpods-2nd-gen",
            name: "AirPods (2nd generation) with Wired Charging Case",
            price: 129,
            qty: 2,
            category: "Headphone",
            image: "/images/airpods-th1.jpg",
          },
        ];

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
          <span className="text-[#18181b] font-medium">Checkout</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. THREE-STEP CHECKOUT PROGRESS BAR (STEPPER)             */}
        {/* ========================================================= */}
        <div className="max-w-[760px] mx-auto my-6 sm:my-10">
          <div className="relative flex items-center justify-between">
            {/* Step 1: Shopping Cart */}
            <Link href="/cart" className="relative flex-1 flex flex-col items-center z-10 group cursor-pointer">
              {/* Line left (RED) */}
              <div className="absolute top-5 left-0 right-1/2 h-[2.5px] bg-[#ff3d3d] -z-10" />
              {/* Line right (RED) */}
              <div className="absolute top-5 left-1/2 right-0 h-[2.5px] bg-[#ff3d3d] -z-10" />

              <div className="w-11 h-11 rounded-full bg-[#ff3d3d] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(255,61,61,0.25)] ring-4 ring-white">
                <ShoppingCart size={19} strokeWidth={2} />
              </div>
              <span className="mt-2.5 text-[14px] font-medium text-[#71717a] group-hover:text-[#ff3d3d] transition-colors">
                Shopping Cart
              </span>
            </Link>

            {/* Step 2: Shopping & Checkout */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="relative flex-1 flex flex-col items-center z-10 cursor-pointer focus:outline-none"
            >
              {/* Line left (RED) */}
              <div className="absolute top-5 left-0 right-1/2 h-[2.5px] bg-[#ff3d3d] -z-10" />
              {/* Line right (RED if step 3, else GREY) */}
              <div
                className={`absolute top-5 left-1/2 right-0 h-[2.5px] -z-10 ${
                  currentStep === 3 ? "bg-[#ff3d3d]" : "bg-[#e4e4e7]"
                }`}
              />

              <div className="w-11 h-11 rounded-full bg-[#ff3d3d] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(255,61,61,0.25)] ring-4 ring-white">
                <ShoppingCart size={19} strokeWidth={2} />
              </div>
              <span
                className={`mt-2.5 text-[14px] ${
                  currentStep === 2 ? "font-semibold text-[#18181b]" : "font-medium text-[#71717a]"
                }`}
              >
                Shopping &amp; Checkout
              </span>
            </button>

            {/* Step 3: Confirmation */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="relative flex-1 flex flex-col items-center z-10 cursor-pointer focus:outline-none"
            >
              {/* Line left (RED if step 3, else GREY) */}
              <div
                className={`absolute top-5 left-0 right-1/2 h-[2.5px] -z-10 ${
                  currentStep === 3 ? "bg-[#ff3d3d]" : "bg-[#e4e4e7]"
                }`}
              />
              {/* Line right (RED if step 3, else GREY) */}
              <div
                className={`absolute top-5 left-1/2 right-0 h-[2.5px] -z-10 ${
                  currentStep === 3 ? "bg-[#ff3d3d]" : "bg-[#e4e4e7]"
                }`}
              />

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ring-4 ring-white ${
                  currentStep === 3
                    ? "bg-[#ff3d3d] text-white shadow-[0_4px_12px_rgba(255,61,61,0.25)]"
                    : "bg-[#f4f4f5] text-[#a1a1aa] border border-[#e4e4e7]"
                }`}
              >
                <ShoppingCart size={19} strokeWidth={2} />
              </div>
              <span
                className={`mt-2.5 text-[14px] ${
                  currentStep === 3 ? "font-semibold text-[#18181b]" : "font-medium text-[#71717a]"
                }`}
              >
                Confirmation
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. STEP 3: ORDER RECEIVED / CONFIRMATION VIEW             */}
        {/* ========================================================= */}
        {currentStep === 3 ? (
          <div className="max-w-[1440px] mx-auto mt-6 mb-20 animate-in fade-in duration-200">
            {/* Top Red Alert Banner (Matching Reference) */}
            <div className="bg-white border border-[#e5e7eb] rounded-[4px] flex items-center overflow-hidden mb-8 shadow-2xs">
              <div className="w-12 h-12 bg-[#ff3d3d] text-white flex items-center justify-center shrink-0">
                <Check size={22} strokeWidth={2.5} />
              </div>
              <div className="px-5 py-3 text-[14.5px] text-[#3f3f46]">
                Thank you. Your order has been received.
              </div>
            </div>

            {/* Order Metadata List (Matching Reference) */}
            <div className="space-y-1.5 mb-9 text-[13.5px]">
              <div>
                <span className="text-[#71717a]">Order number: </span>
                <strong className="text-[#18181b] font-bold">{orderId}</strong>
              </div>
              <div>
                <span className="text-[#71717a]">Date: </span>
                <strong className="text-[#18181b] font-bold">{orderDate}</strong>
              </div>
              <div>
                <span className="text-[#71717a]">Total: </span>
                <strong className="text-[#18181b] font-bold">
                  ${finalTotal.toFixed(2)}
                </strong>
              </div>
              <div>
                <span className="text-[#71717a]">Payment method: </span>
                <strong className="text-[#18181b] font-bold">
                  {paymentMethod === "bacs"
                    ? "Direct bank transfer"
                    : paymentMethod === "cheque"
                    ? "Check payments"
                    : "Cash on delivery"}
                </strong>
              </div>
            </div>

            {/* Order details Section (Matching Reference) */}
            <div className="mb-12">
              <h2 className="text-[22px] font-bold text-[#18181b] tracking-tight mb-4">
                Order details
              </h2>

              <div className="w-full">
                {/* Table Header */}
                <div className="flex items-center justify-between text-[14px] font-bold text-[#18181b] pb-3 border-b border-[#e5e7eb]">
                  <span>Product</span>
                  <span>Total</span>
                </div>

                {/* Table Body - Product Rows */}
                <div className="divide-y divide-[#f4f4f5]">
                  {displayItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3.5 flex items-center justify-between text-[14px]"
                    >
                      <Link
                        href={`/product/${item.id}`}
                        className="text-[#1e5bc6] hover:text-[#004085] hover:underline font-normal transition-colors"
                      >
                        {item.name} <span className="text-[#18181b] font-normal">× {item.qty}</span>
                      </Link>
                      <span className="font-normal text-[#18181b]">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal Row */}
                <div className="py-3.5 flex items-center justify-between text-[14px] border-t border-b border-[#f4f4f5]">
                  <span className="text-[#444444]">Subtotal:</span>
                  <span className="font-normal text-[#18181b]">${effectiveCartTotal.toFixed(2)}</span>
                </div>

                {/* Shipping Row */}
                <div className="py-3.5 flex items-center justify-between text-[14px] border-b border-[#f4f4f5]">
                  <span className="text-[#444444]">Shipping:</span>
                  <span className="text-[#444444]">
                    {shippingMethod === "free" ? "Free shipping" : "$10.00 via Flat rate"}
                  </span>
                </div>

                {/* Payment method Row */}
                <div className="py-3.5 flex items-center justify-between text-[14px] border-b border-[#f4f4f5]">
                  <span className="text-[#444444]">Payment method:</span>
                  <span className="text-[#444444]">
                    {paymentMethod === "bacs"
                      ? "Direct bank transfer"
                      : paymentMethod === "cheque"
                      ? "Check payments"
                      : "Cash on delivery"}
                  </span>
                </div>

                {/* Total Row */}
                <div className="py-4 flex items-center justify-between text-[14.5px] border-b border-[#e5e7eb]">
                  <span className="font-bold text-[#18181b]">Total:</span>
                  <span className="text-[17px] font-bold text-[#ff3d3d]">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Addresses Section (Two Columns - Matching Reference) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Billing address */}
              <div>
                <h3 className="text-[18px] font-bold text-[#18181b] mb-3">
                  Billing address
                </h3>
                <div className="italic text-[13.5px] text-[#555555] leading-[1.65]">
                  <div>Mir AlixfzzxfzSindh75950Pakistan</div>
                  <div>343143</div>
                  <div>mohibali.tms@gmail.com</div>
                </div>
              </div>

              {/* Shipping address */}
              <div>
                <h3 className="text-[18px] font-bold text-[#18181b] mb-3">
                  Shipping address
                </h3>
                <div className="italic text-[13.5px] text-[#555555] leading-[1.65]">
                  <div>Mir AlixfzzxfzSindh75950Pakistan</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* 4. STEP 2: BILLING FORM & YOUR ORDER VIEW                 */
          /* ========================================================= */
          <>
            {/* Coupon notice banner */}
            <div className="mb-10">
              <div className="bg-white border border-[#e5e7eb] rounded-[4px] flex items-center overflow-hidden">
                <div className="w-11 h-11 bg-[#ff3d3d] text-white flex items-center justify-center shrink-0">
                  <Info size={18} strokeWidth={2.5} />
                </div>
                <div className="px-4 py-2.5 text-[14px] text-[#3f3f46]">
                  Have a coupon?{" "}
                  <button
                    type="button"
                    onClick={() => setShowCouponInput((prev) => !prev)}
                    className="text-[#18181b] hover:text-[#ff3d3d] hover:underline font-normal cursor-pointer transition-colors"
                  >
                    Click here to enter your code
                  </button>
                </div>
              </div>

              {/* Collapsible Coupon Input */}
              {showCouponInput && (
                <form
                  onSubmit={handleApplyCoupon}
                  className="mt-3 p-4 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (couponError) setCouponError(null);
                    }}
                    placeholder="Coupon code"
                    className="h-[42px] px-4 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] bg-white focus:outline-none focus:border-[#18181b] transition-colors w-full sm:w-[260px]"
                  />
                  <button
                    type="submit"
                    className="h-[42px] px-6 bg-[#333e48] hover:bg-[#222a32] text-white font-semibold text-[13.5px] rounded-[5px] transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Apply Coupon
                  </button>
                  {couponError && <span className="text-xs text-[#ef4444]">{couponError}</span>}
                  {appliedCoupon && (
                    <span className="text-xs text-[#10b981] font-medium flex items-center gap-1">
                      <Check size={13} /> Applied &quot;{appliedCoupon}&quot; ($15.00 off)
                    </span>
                  )}
                </form>
              )}
            </div>

            {/* Main Checkout Form */}
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
              {/* LEFT COLUMN: BILLING DETAILS */}
              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-[20px] font-bold text-[#18181b] tracking-tight">
                  Billing details
                </h2>

                {/* First name & Last name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                      First name <span className="text-[#ff3d3d]">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                      Last name <span className="text-[#ff3d3d]">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                    />
                  </div>
                </div>

                {/* Company name (optional) */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    Company name (optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                  />
                </div>

                {/* Country / Region * */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    Country / Region <span className="text-[#ff3d3d]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 pr-10 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white appearance-none focus:outline-none focus:border-[#18181b] transition-colors cursor-pointer"
                    >
                      <option value="United States (US)">United States (US)</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
                  </div>
                </div>

                {/* Street address * */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    Street address <span className="text-[#ff3d3d]">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress1"
                    required
                    placeholder="House number and street name"
                    value={formData.streetAddress1}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] bg-white focus:outline-none focus:border-[#18181b] transition-colors mb-3"
                  />
                  <input
                    type="text"
                    name="streetAddress2"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={formData.streetAddress2}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                  />
                </div>

                {/* Town / City * */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    Town / City <span className="text-[#ff3d3d]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                  />
                </div>

                {/* State * */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    State <span className="text-[#ff3d3d]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 pr-10 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white appearance-none focus:outline-none focus:border-[#18181b] transition-colors cursor-pointer"
                    >
                      <option value="New York">New York</option>
                      <option value="Sindh">Sindh</option>
                      <option value="California">California</option>
                      <option value="Texas">Texas</option>
                      <option value="Florida">Florida</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
                  </div>
                </div>

                {/* ZIP Code * */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    ZIP Code <span className="text-[#ff3d3d]">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                  />
                </div>

                {/* Phone * */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    Phone <span className="text-[#ff3d3d]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                  />
                </div>

                {/* Email address * */}
                <div>
                  <label className="block text-[13px] font-medium text-[#27272a] mb-1.5">
                    Email address <span className="text-[#ff3d3d]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                  />
                </div>

                {/* Ship to a different address checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 text-[14.5px] font-semibold text-[#18181b] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shipToDifferentAddress}
                      onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                      className="accent-[#2563eb] w-4 h-4 rounded cursor-pointer"
                    />
                    <span>Ship to a different address?</span>
                  </label>
                </div>

                {/* Expandable Different Shipping Address Fields */}
                {shipToDifferentAddress && (
                  <div className="p-4 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#27272a] mb-1">First name</label>
                        <input
                          type="text"
                          name="diffFirstName"
                          value={formData.diffFirstName}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#27272a] mb-1">Last name</label>
                        <input
                          type="text"
                          name="diffLastName"
                          value={formData.diffLastName}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#27272a] mb-1">Street address</label>
                      <input
                        type="text"
                        name="diffAddress1"
                        placeholder="House number and street name"
                        value={formData.diffAddress1}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#27272a] mb-1">Town / City</label>
                        <input
                          type="text"
                          name="diffCity"
                          value={formData.diffCity}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#27272a] mb-1">ZIP Code</label>
                        <input
                          type="text"
                          name="diffZip"
                          value={formData.diffZip}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Order notes */}
                <div>
                  <textarea
                    rows={4}
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    className="w-full p-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] bg-white focus:outline-none focus:border-[#18181b] transition-colors resize-y"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: "YOUR ORDER" CARD */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sticky top-24">
                  {/* Title */}
                  <h3 className="text-[19px] font-bold text-[#18181b] mb-4">
                    Your Order
                  </h3>

                  {/* Order Table Header */}
                  <div className="flex items-center justify-between text-[13.5px] font-bold text-[#18181b] pb-3 border-b border-[#f4f4f5]">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-[#f4f4f5]">
                    {displayItems.map((item) => (
                      <div key={item.id} className="py-3 flex items-start justify-between gap-4 text-[13.5px]">
                        <Link
                          href={`/product/${item.id}`}
                          className="text-[#1e5bc6] hover:text-[#004085] hover:underline font-normal leading-[1.4] transition-colors"
                        >
                          {item.name} <span className="text-[#71717a] font-normal">× {item.qty}</span>
                        </Link>
                        <span className="font-semibold text-[#18181b] shrink-0">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal Row */}
                  <div className="py-3 flex items-center justify-between text-[14px] border-t border-b border-[#f4f4f5]">
                    <span className="text-[#52525b] font-medium">Subtotal</span>
                    <span className="font-semibold text-[#18181b]">${effectiveCartTotal.toFixed(2)}</span>
                  </div>

                  {/* Discount (if coupon applied) */}
                  {appliedCoupon && (
                    <div className="py-2.5 flex items-center justify-between text-[13.5px] border-b border-[#f4f4f5] text-[#10b981]">
                      <span className="font-medium">Coupon: {appliedCoupon}</span>
                      <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Shipping Section */}
                  <div className="py-4 border-b border-[#f4f4f5]">
                    <div className="flex items-start justify-between text-[14px]">
                      <span className="text-[#52525b] font-medium pt-0.5">Shipping</span>
                      <div className="space-y-2 text-right">
                        <label className="flex items-center justify-end gap-2 text-[13.5px] text-[#18181b] cursor-pointer">
                          <span className="text-[#3f3f46]">Flat rate: $10.00</span>
                          <input
                            type="radio"
                            name="checkout_shipping"
                            checked={shippingMethod === "flat"}
                            onChange={() => setShippingMethod("flat")}
                            className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                          />
                        </label>
                        <label className="flex items-center justify-end gap-2 text-[13.5px] text-[#18181b] cursor-pointer">
                          <span className="text-[#3f3f46]">Free shipping</span>
                          <input
                            type="radio"
                            name="checkout_shipping"
                            checked={shippingMethod === "free"}
                            onChange={() => setShippingMethod("free")}
                            className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Total Row */}
                  <div className="py-4 flex items-center justify-between text-[15px] border-b border-[#f4f4f5]">
                    <span className="font-bold text-[#18181b]">Total</span>
                    <span className="text-[20px] font-bold text-[#ff3d3d]">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Payment Options */}
                  <div className="py-4 space-y-3.5">
                    {/* Option 1: Direct bank transfer */}
                    <div>
                      <label className="flex items-center gap-2 text-[13.5px] font-semibold text-[#18181b] cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          value="bacs"
                          checked={paymentMethod === "bacs"}
                          onChange={() => setPaymentMethod("bacs")}
                          className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                        />
                        <span>Direct bank transfer</span>
                      </label>
                      {paymentMethod === "bacs" && (
                        <div className="mt-2 text-[12.5px] text-[#52525b] bg-[#fbfcfd] p-3 rounded border border-[#f0f0f0] leading-relaxed animate-in fade-in duration-150">
                          Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                        </div>
                      )}
                    </div>

                    {/* Option 2: Check payments */}
                    <div>
                      <label className="flex items-center gap-2 text-[13.5px] font-semibold text-[#18181b] cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cheque"
                          checked={paymentMethod === "cheque"}
                          onChange={() => setPaymentMethod("cheque")}
                          className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                        />
                        <span>Check payments</span>
                      </label>
                      {paymentMethod === "cheque" && (
                        <div className="mt-2 text-[12.5px] text-[#52525b] bg-[#fbfcfd] p-3 rounded border border-[#f0f0f0] leading-relaxed animate-in fade-in duration-150">
                          Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
                        </div>
                      )}
                    </div>

                    {/* Option 3: Cash on delivery */}
                    <div>
                      <label className="flex items-center gap-2 text-[13.5px] font-semibold text-[#18181b] cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                        />
                        <span>Cash on delivery</span>
                      </label>
                      {paymentMethod === "cod" && (
                        <div className="mt-2 text-[12.5px] text-[#52525b] bg-[#fbfcfd] p-3 rounded border border-[#f0f0f0] leading-relaxed animate-in fade-in duration-150">
                          Pay with cash upon delivery.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Privacy Disclaimer */}
                  <p className="text-[12px] text-[#71717a] leading-relaxed my-3">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                  </p>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 h-[48px] bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[14.5px] rounded-[6px] flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutContent />
    </Suspense>
  );
}
