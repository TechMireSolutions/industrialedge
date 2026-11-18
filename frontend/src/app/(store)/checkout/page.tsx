"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Truck,
  CheckCircle2,
  Info,
  ChevronDown,
  Check,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api, type OrderItem } from "@/lib/api";
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

function CheckoutContent() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");

  const {
    cart,
    cartTotal,
    clearCart,
    customerUser,
    storeSettings,
    appliedCoupon,
    setAppliedCoupon,
    shippingMethod,
    setShippingMethod,
  } = useStore();

  const freeShippingThreshold =
    storeSettings?.freeShippingThreshold || DEFAULT_FREE_SHIPPING_THRESHOLD;
  const flatShippingRate = storeSettings?.flatShippingRate || DEFAULT_FLAT_SHIPPING;

  const [currentStep, setCurrentStep] = useState<2 | 3>(2);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || "");
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bacs" | "cheque">("cod");

  // Form fields state (clean defaults, auto-populated from account/saved address)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Pakistan",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "Sindh",
    zipCode: "",
    phone: "",
    email: "",
    orderNotes: "",
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

  // Load existing order by query param ?order=ORD-XXXX if provided
  useEffect(() => {
    if (!orderParam) return;
    api
      .getOrder(orderParam)
      .then((ord) => {
        if (ord) {
          setCompletedOrder(ord);
          setCurrentStep(3);
        }
      })
      .catch(() => {});
  }, [orderParam]);

  // Pre-fill billing form from logged-in customer or saved address
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem("industrialedge_saved_address");
      const saved = savedRaw ? JSON.parse(savedRaw) : null;
      const nameParts = (customerUser?.name || "").trim().split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || saved?.firstName || nameParts[0] || "",
        lastName: prev.lastName || saved?.lastName || nameParts.slice(1).join(" ") || "",
        email: prev.email || saved?.email || customerUser?.email || "",
        phone: prev.phone || saved?.phone || "",
        streetAddress1: prev.streetAddress1 || saved?.streetAddress1 || "",
        streetAddress2: prev.streetAddress2 || saved?.streetAddress2 || "",
        city: prev.city || saved?.city || "",
        state: saved?.state || prev.state,
        zipCode: prev.zipCode || saved?.zipCode || "",
        country: saved?.country || prev.country,
      }));
    } catch {}
  }, [customerUser]);

  const qualifiesForFreeShipping = cartTotal >= freeShippingThreshold;

  useEffect(() => {
    if (qualifiesForFreeShipping) {
      setShippingMethod("free");
    } else if (shippingMethod === "free" && !qualifiesForFreeShipping) {
      setShippingMethod("flat");
    }
  }, [qualifiesForFreeShipping, shippingMethod, setShippingMethod]);

  const shippingCost =
    shippingMethod === "free" && qualifiesForFreeShipping ? 0 : flatShippingRate;

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round((cartTotal * appliedCoupon.value) / 100)
      : Math.min(cartTotal, appliedCoupon.value)
    : 0;

  const finalTotal = Math.max(0, cartTotal + shippingCost - discountAmount);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError("Please enter a valid coupon code.");
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
        err instanceof Error ? err.message : "Invalid coupon code. Try EDGE20 or WELCOME10."
      );
    } finally {
      setVerifyingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (cart.length === 0) {
      setSubmitError("Your cart is empty. Add products before placing an order.");
      return;
    }

    setSubmitting(true);
    try {
      const paymentLabel =
        paymentMethod === "bacs"
          ? "Direct Bank Transfer (BACS)"
          : paymentMethod === "cheque"
          ? "Check Payment"
          : "Cash on Delivery";

      const orderPayload: Partial<OrderItem> = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: [formData.streetAddress1, formData.streetAddress2].filter(Boolean).join(", "),
          city: formData.city.trim(),
          state: formData.state,
          zip: formData.zipCode.trim(),
          country: formData.country,
        },
        ...(shipToDifferentAddress
          ? {
              shippingAddress: {
                name: `${formData.diffFirstName} ${formData.diffLastName}`.trim(),
                address: [formData.diffAddress1, formData.diffAddress2].filter(Boolean).join(", "),
                city: formData.diffCity.trim(),
                state: formData.diffState,
                zip: formData.diffZip.trim(),
                country: formData.diffCountry,
              },
            }
          : {}),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
          image: item.image,
        })),
        subtotal: Math.round(cartTotal),
        shipping: shippingCost,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        total: Math.round(finalTotal),
        paymentMethod: paymentLabel,
        notes: formData.orderNotes,
      };

      const created = await api.createOrder(orderPayload);

      // Save billing address for customer convenience
      try {
        localStorage.setItem(
          "industrialedge_saved_address",
          JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            streetAddress1: formData.streetAddress1,
            streetAddress2: formData.streetAddress2,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          })
        );
      } catch {}

      setCompletedOrder(created);
      clearCart();
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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
          <span className="text-[#171145] font-medium">Checkout</span>
        </nav>

        {/* 2. THREE-STEP PROGRESS BAR */}
        <div className="max-w-[760px] mx-auto my-4 sm:my-10 px-2 sm:px-0">
          <div className="relative flex items-center justify-between">
            <Link href="/cart" className="relative flex-1 flex flex-col items-center z-10 group cursor-pointer">
              <div className="absolute top-4 sm:top-5 left-0 right-1/2 h-[2px] sm:h-[2.5px] bg-[#0ea57a] -z-10" />
              <div className="absolute top-4 sm:top-5 left-1/2 right-0 h-[2px] sm:h-[2.5px] bg-[#0ea57a] -z-10" />
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0ea57a] text-white flex items-center justify-center shadow-sm ring-2 sm:ring-4 ring-white">
                <ShoppingCart className="w-3.5 h-3.5 sm:w-[19px] sm:h-[19px]" strokeWidth={2} />
              </div>
              <span className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-[14px] font-medium text-center text-[#64748b] group-hover:text-[#0ea57a] transition-colors">
                Shopping Cart
              </span>
            </Link>

            <div className="relative flex-1 flex flex-col items-center z-10">
              <div className="absolute top-4 sm:top-5 left-0 right-1/2 h-[2px] sm:h-[2.5px] bg-[#0ea57a] -z-10" />
              <div
                className={`absolute top-4 sm:top-5 left-1/2 right-0 h-[2px] sm:h-[2.5px] -z-10 ${
                  currentStep === 3 ? "bg-[#0ea57a]" : "bg-[#e4e4e7]"
                }`}
              />
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0ea57a] text-white flex items-center justify-center shadow-sm ring-2 sm:ring-4 ring-white">
                <Truck className="w-3.5 h-3.5 sm:w-[19px] sm:h-[19px]" strokeWidth={2} />
              </div>
              <span
                className={`mt-1.5 sm:mt-2.5 text-[11px] sm:text-[14px] text-center ${
                  currentStep === 2 ? "font-semibold text-[#171145]" : "font-medium text-[#64748b]"
                }`}
              >
                Shipping &amp; Checkout
              </span>
            </div>

            <div className="relative flex-1 flex flex-col items-center z-10">
              <div
                className={`absolute top-4 sm:top-5 left-0 right-1/2 h-[2px] sm:h-[2.5px] -z-10 ${
                  currentStep === 3 ? "bg-[#0ea57a]" : "bg-[#e4e4e7]"
                }`}
              />
              <div
                className={`absolute top-4 sm:top-5 left-1/2 right-0 h-[2px] sm:h-[2.5px] -z-10 ${
                  currentStep === 3 ? "bg-[#0ea57a]" : "bg-[#e4e4e7]"
                }`}
              />
              <div
                className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ring-2 sm:ring-4 ring-white ${
                  currentStep === 3
                    ? "bg-[#0ea57a] text-white shadow-sm"
                    : "bg-[#f4f4f5] text-[#94a3b8] border border-[#e4e4e7]"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-[19px] sm:h-[19px]" strokeWidth={2} />
              </div>
              <span
                className={`mt-1.5 sm:mt-2.5 text-[11px] sm:text-[14px] text-center ${
                  currentStep === 3 ? "font-semibold text-[#171145]" : "font-medium text-[#64748b]"
                }`}
              >
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* 3. STEP 3: ORDER CONFIRMATION */}
        {currentStep === 3 && completedOrder ? (
          <div className="max-w-[1100px] mx-auto mt-6 mb-20">
            <div className="bg-white border border-emerald-200 rounded-[6px] flex items-center overflow-hidden mb-8 shadow-2xs">
              <div className="w-12 h-12 bg-[#0ea57a] text-white flex items-center justify-center shrink-0">
                <Check size={22} strokeWidth={2.5} />
              </div>
              <div className="px-5 py-3 text-[14.5px] text-[#171145] font-medium">
                Thank you, <strong>{completedOrder.customer?.name}</strong>! Your order has been received and logged for dispatch.
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl mb-9 text-[13.5px]">
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Order number</span>
                <strong className="text-[#171145] font-bold">{completedOrder.id}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Date</span>
                <strong className="text-[#171145] font-bold">
                  {new Date(completedOrder.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Total</span>
                <strong className="text-[#0ea57a] font-bold">
                  {formatPrice(completedOrder.total)}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Payment method</span>
                <strong className="text-[#171145] font-bold">{completedOrder.paymentMethod}</strong>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-[20px] font-bold text-[#171145] tracking-tight mb-4">
                Order details
              </h2>

              <div className="w-full border border-slate-200 rounded-xl p-5 bg-white">
                <div className="flex items-center justify-between text-[14px] font-bold text-[#171145] pb-3 border-b border-[#e5e7eb]">
                  <span>Product</span>
                  <span>Total</span>
                </div>

                <div className="divide-y divide-[#f4f4f5]">
                  {completedOrder.items.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="py-3.5 flex items-center justify-between text-[14px]">
                      <Link
                        href={`/product/${item.id}`}
                        className="text-[#171145] hover:text-[#0ea57a] hover:underline font-medium transition-colors"
                      >
                        {item.name} <span className="text-slate-500 font-normal">× {item.qty}</span>
                      </Link>
                      <span className="font-semibold text-[#171145]">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="py-3 flex items-center justify-between text-[14px] border-t border-b border-[#f4f4f5]">
                  <span className="text-[#475569]">Subtotal:</span>
                  <span className="font-semibold text-[#171145]">
                    {formatPrice(completedOrder.subtotal)}
                  </span>
                </div>

                {completedOrder.discount > 0 && (
                  <div className="py-3 flex items-center justify-between text-[14px] border-b border-[#f4f4f5] text-[#0ea57a]">
                    <span>Discount{completedOrder.couponCode ? ` (${completedOrder.couponCode})` : ""}:</span>
                    <span className="font-semibold">−{formatPrice(completedOrder.discount)}</span>
                  </div>
                )}

                <div className="py-3 flex items-center justify-between text-[14px] border-b border-[#f4f4f5]">
                  <span className="text-[#475569]">Shipping:</span>
                  <span className="text-[#334155]">
                    {completedOrder.shipping === 0
                      ? "Free shipping"
                      : `${formatPrice(completedOrder.shipping)} via Flat rate`}
                  </span>
                </div>

                <div className="py-4 flex items-center justify-between text-[15px]">
                  <span className="font-bold text-[#171145]">Total:</span>
                  <span className="text-[18px] font-bold text-[#0ea57a]">
                    {formatPrice(completedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Real Billing & Shipping Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-[16px] font-bold text-[#171145] mb-3">Billing address</h3>
                <div className="text-[13.5px] text-[#475569] leading-[1.7]">
                  <div className="font-semibold text-[#171145]">{completedOrder.customer?.name}</div>
                  <div>{completedOrder.customer?.address}</div>
                  <div>
                    {[completedOrder.customer?.city, completedOrder.customer?.state, completedOrder.customer?.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                  <div>{completedOrder.customer?.country || "Pakistan"}</div>
                  <div className="mt-1">{completedOrder.customer?.phone}</div>
                  <div>{completedOrder.customer?.email}</div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-[16px] font-bold text-[#171145] mb-3">Shipping address</h3>
                <div className="text-[13.5px] text-[#475569] leading-[1.7]">
                  {completedOrder.shippingAddress?.address ? (
                    <>
                      <div className="font-semibold text-[#171145]">
                        {completedOrder.shippingAddress.name || completedOrder.customer?.name}
                      </div>
                      <div>{completedOrder.shippingAddress.address}</div>
                      <div>
                        {[
                          completedOrder.shippingAddress.city,
                          completedOrder.shippingAddress.state,
                          completedOrder.shippingAddress.zip,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      <div>{completedOrder.shippingAddress.country || "Pakistan"}</div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-[#171145]">{completedOrder.customer?.name}</div>
                      <div>{completedOrder.customer?.address}</div>
                      <div>
                        {[completedOrder.customer?.city, completedOrder.customer?.state, completedOrder.customer?.zip]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      <div>{completedOrder.customer?.country || "Pakistan"}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/my-account"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 hover:border-[#171145] text-[#171145] text-sm font-semibold rounded-lg transition-colors"
              >
                <span>View My Orders</span>
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart Guard on Checkout */
          <div className="text-center py-20 bg-[#fafafa] rounded-[10px] border border-[#f0f0f0] my-8">
            <div className="w-20 h-20 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] mx-auto mb-4 shadow-xs">
              <ShoppingBag size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-[#171145] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[14px] text-[#64748b] max-w-[340px] mx-auto mb-6 leading-relaxed">
              Add items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-medium text-[14px] rounded-[6px] transition-all shadow-sm"
            >
              <span>Browse Shop</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* 4. STEP 2: BILLING FORM & ORDER SUMMARY */
          <>
            {/* Coupon Notice Banner */}
            <div className="mb-10">
              <div className="bg-white border border-[#e5e7eb] rounded-[4px] flex items-center overflow-hidden">
                <div className="w-11 h-11 bg-[#0ea57a] text-white flex items-center justify-center shrink-0">
                  <Info size={18} strokeWidth={2.5} />
                </div>
                <div className="px-4 py-2.5 text-[14px] text-[#334155]">
                  Have a coupon?{" "}
                  <button
                    type="button"
                    onClick={() => setShowCouponInput((prev) => !prev)}
                    className="text-[#171145] hover:text-[#0ea57a] underline font-medium cursor-pointer transition-colors"
                  >
                    Click here to enter your code
                  </button>
                </div>
              </div>

              {showCouponInput && (
                <form
                  onSubmit={handleApplyCoupon}
                  className="mt-3 p-4 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] flex flex-col sm:flex-row items-center gap-3"
                >
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      if (couponError) setCouponError(null);
                    }}
                    placeholder="Coupon code (e.g. EDGE20)"
                    className="h-[42px] px-4 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] placeholder:text-[#94a3b8] bg-white focus:border-[#0ea57a] transition-colors w-full sm:w-[260px] font-mono uppercase"
                  />
                  <button
                    type="submit"
                    disabled={verifyingCoupon}
                    className="h-[42px] px-6 bg-[#171145] hover:bg-[#0ea57a] disabled:opacity-60 text-white font-semibold text-[13.5px] rounded-[5px] transition-colors shrink-0 cursor-pointer"
                  >
                    {verifyingCoupon ? "Verifying..." : "Apply Coupon"}
                  </button>
                  {couponError && <span className="text-xs text-rose-600 font-medium">{couponError}</span>}
                  {appliedCoupon && (
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <Check size={13} /> Applied &quot;{appliedCoupon.code}&quot; ({formatPrice(discountAmount)} off)
                    </span>
                  )}
                </form>
              )}
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
              {/* LEFT COLUMN: BILLING DETAILS */}
              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-[20px] font-bold text-[#171145] tracking-tight">
                  Billing details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                      First name <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="e.g. Tariq"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white focus:border-[#0ea57a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                      Last name <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="e.g. Mahmood"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white focus:border-[#0ea57a] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                    Company name (optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="For B2B / corporate invoicing"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white focus:border-[#0ea57a] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                    Country / Region <span className="text-[#0ea57a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 pr-10 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white appearance-none focus:border-[#0ea57a] transition-colors cursor-pointer"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                    Street address <span className="text-[#0ea57a]">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress1"
                    required
                    placeholder="House / plot number and street name"
                    value={formData.streetAddress1}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] placeholder:text-[#94a3b8] bg-white focus:border-[#0ea57a] transition-colors mb-3"
                  />
                  <input
                    type="text"
                    name="streetAddress2"
                    placeholder="Apartment, floor, phase, or block (optional)"
                    value={formData.streetAddress2}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] placeholder:text-[#94a3b8] bg-white focus:border-[#0ea57a] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                      Town / City <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Karachi, Lahore, Islamabad"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white focus:border-[#0ea57a] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                      Province / State <span className="text-[#0ea57a]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full h-[44px] px-3.5 pr-10 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white appearance-none focus:border-[#0ea57a] transition-colors cursor-pointer"
                      >
                        {PAKISTAN_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                      Postal Code <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      placeholder="e.g. 75500"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white focus:border-[#0ea57a] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                      Phone / WhatsApp <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white focus:border-[#0ea57a] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#334155] mb-1.5">
                    Email address <span className="text-[#0ea57a]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] bg-white focus:border-[#0ea57a] transition-colors"
                  />
                </div>

                {/* Different Shipping Address */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 text-[14.5px] font-semibold text-[#171145] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shipToDifferentAddress}
                      onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                      className="accent-[#0ea57a] w-4 h-4 rounded cursor-pointer"
                    />
                    <span>Ship to a different address?</span>
                  </label>
                </div>

                {shipToDifferentAddress && (
                  <div className="p-4 bg-[#fafafa] border border-[#e5e7eb] rounded-[6px] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#334155] mb-1">First name</label>
                        <input
                          type="text"
                          name="diffFirstName"
                          required={shipToDifferentAddress}
                          value={formData.diffFirstName}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#334155] mb-1">Last name</label>
                        <input
                          type="text"
                          name="diffLastName"
                          required={shipToDifferentAddress}
                          value={formData.diffLastName}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1">Street address</label>
                      <input
                        type="text"
                        name="diffAddress1"
                        required={shipToDifferentAddress}
                        placeholder="House number and street name"
                        value={formData.diffAddress1}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#334155] mb-1">City</label>
                        <input
                          type="text"
                          name="diffCity"
                          required={shipToDifferentAddress}
                          value={formData.diffCity}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-[#e4e4e7] rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#334155] mb-1">Province</label>
                        <select
                          name="diffState"
                          value={formData.diffState}
                          onChange={handleInputChange}
                          className="w-full h-10 px-2 border border-[#e4e4e7] rounded bg-white text-xs"
                        >
                          {PAKISTAN_PROVINCES.map((prov) => (
                            <option key={prov} value={prov}>
                              {prov}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#334155] mb-1">Postal Code</label>
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

                <div>
                  <textarea
                    rows={4}
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Notes about your order, e.g. special delivery instructions or corporate PO reference."
                    className="w-full p-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#171145] placeholder:text-[#94a3b8] bg-white focus:border-[#0ea57a] transition-colors resize-y"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: YOUR ORDER CARD */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sticky top-24">
                  <h3 className="text-[19px] font-bold text-[#171145] mb-4">Your Order</h3>

                  <div className="flex items-center justify-between text-[13.5px] font-bold text-[#171145] pb-3 border-b border-[#f4f4f5]">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </div>

                  <div className="divide-y divide-[#f4f4f5]">
                    {cart.map((item) => (
                      <div key={item.id} className="py-3 flex items-start justify-between gap-4 text-[13.5px]">
                        <Link
                          href={`/product/${item.id}`}
                          className="text-[#171145] hover:text-[#0ea57a] hover:underline leading-[1.4] transition-colors"
                        >
                          {item.name} <span className="text-[#64748b] font-normal">× {item.qty}</span>
                        </Link>
                        <span className="font-semibold text-[#171145] shrink-0">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="py-3 flex items-center justify-between text-[14px] border-t border-b border-[#f4f4f5]">
                    <span className="text-[#475569] font-medium">Subtotal</span>
                    <span className="font-semibold text-[#171145]">{formatPrice(cartTotal)}</span>
                  </div>

                  {appliedCoupon && discountAmount > 0 && (
                    <div className="py-2.5 flex items-center justify-between text-[13.5px] border-b border-[#f4f4f5] text-[#0ea57a]">
                      <span className="font-medium">Coupon: {appliedCoupon.code}</span>
                      <span className="font-semibold">−{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="py-4 border-b border-[#f4f4f5]">
                    <div className="flex items-start justify-between text-[14px]">
                      <span className="text-[#475569] font-medium pt-0.5">Shipping</span>
                      <div className="space-y-2 text-right">
                        <label className="flex items-center justify-end gap-2 text-[13.5px] text-[#171145] cursor-pointer">
                          <span>Flat rate: {formatPrice(flatShippingRate)}</span>
                          <input
                            type="radio"
                            name="checkout_shipping"
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
                          <span>Free shipping</span>
                          <input
                            type="radio"
                            name="checkout_shipping"
                            disabled={!qualifiesForFreeShipping}
                            checked={shippingMethod === "free" && qualifiesForFreeShipping}
                            onChange={() => setShippingMethod("free")}
                            className="accent-[#0ea57a] w-4 h-4 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="py-4 flex items-center justify-between text-[15px] border-b border-[#f4f4f5]">
                    <span className="font-bold text-[#171145]">Total</span>
                    <span className="text-[20px] font-bold text-[#0ea57a]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  {/* Payment Options */}
                  <div className="py-4 space-y-3.5">
                    <div>
                      <label className="flex items-center gap-2 text-[13.5px] font-semibold text-[#171145] cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-[#0ea57a] w-4 h-4 cursor-pointer"
                        />
                        <span>Cash on Delivery (Pakistan Nationwide)</span>
                      </label>
                      {paymentMethod === "cod" && (
                        <div className="mt-2 text-[12.5px] text-[#475569] bg-[#f8fafc] p-3 rounded border border-slate-200/70 leading-relaxed">
                          Pay with cash in PKR upon doorstep delivery via TCS / Leopards Courier.
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-[13.5px] font-semibold text-[#171145] cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          value="bacs"
                          checked={paymentMethod === "bacs"}
                          onChange={() => setPaymentMethod("bacs")}
                          className="accent-[#0ea57a] w-4 h-4 cursor-pointer"
                        />
                        <span>Direct Bank Transfer (IBFT / Raast)</span>
                      </label>
                      {paymentMethod === "bacs" && (
                        <div className="mt-2 text-[12.5px] text-[#475569] bg-[#f8fafc] p-3 rounded border border-slate-200/70 leading-relaxed">
                          Transfer directly to IndustrialEdge.pk corporate bank account using your Order ID as reference.
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-[13.5px] font-semibold text-[#171145] cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cheque"
                          checked={paymentMethod === "cheque"}
                          onChange={() => setPaymentMethod("cheque")}
                          className="accent-[#0ea57a] w-4 h-4 cursor-pointer"
                        />
                        <span>Corporate Cheque / Purchase Order</span>
                      </label>
                      {paymentMethod === "cheque" && (
                        <div className="mt-2 text-[12.5px] text-[#475569] bg-[#f8fafc] p-3 rounded border border-slate-200/70 leading-relaxed">
                          Available for registered corporate procurement partners in Karachi, Lahore &amp; Islamabad.
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[12px] text-[#64748b] leading-relaxed my-3">
                    Your personal data will be used strictly to process your order and coordinate delivery updates.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 h-[48px] bg-[#0ea57a] hover:bg-[#0b8462] disabled:opacity-60 text-white font-bold text-[14.5px] rounded-[6px] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    {submitting ? "Placing Order..." : `Place Order (${formatPrice(finalTotal)})`}
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
