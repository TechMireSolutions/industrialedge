"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty, cartTotal } = useStore();

  return (
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12">
        <div className="container">
          <h1 className="text-[28px] font-normal text-[#212529] mb-2">Shopping Cart</h1>
          <p className="text-sm text-black/50 mb-10">
            Review your selected items before checkout.
          </p>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#f2f4f8] rounded-full flex items-center justify-center mx-auto mb-4 text-[#828282]">
                <ShoppingBag size={24} strokeWidth={2} />
              </div>
              <h2 className="text-lg font-medium text-black mb-2">Your cart is empty</h2>
              <p className="text-black/50 mb-6">Looks like you haven't added anything yet.</p>
              <Link href="/shop">
                <button className="bg-[#0e8ce4] text-white px-8 py-3 rounded-[5px] font-medium hover:bg-[#0e8ce4]/80 transition-colors">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="border border-[#e5e5e5] rounded-[5px] overflow-hidden mb-10">
                <div className="bg-[#f2f4f8] px-6 py-4 border-b border-[#e5e5e5]">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4 font-medium text-sm text-black">Product</div>
                    <div className="col-span-2 font-medium text-sm text-black text-right">Price</div>
                    <div className="col-span-2 font-medium text-sm text-black text-center">Qty</div>
                    <div className="col-span-2 font-medium text-sm text-black text-right">Total</div>
                    <div className="col-span-2 font-medium text-sm text-black text-right">Action</div>
                  </div>
                </div>
                <div className="divide-y divide-[#e5e5e5]">
                  {cart.map((item) => (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#f2f4f8] rounded-[5px] flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-black">{item.name}</h3>
                        <p className="text-xs text-black/50">{item.category}</p>
                      </div>
                      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
                        <button
                          onClick={() => updateCartQty(item.id, Math.max(1, item.qty - 1))}
                          className="w-8 h-8 border border-[#e5e5e5] flex items-center justify-center text-xs"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium mx-1">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, item.qty + 1)}
                          className="w-8 h-8 border border-[#e5e5e5] flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                      <div className="lg:col-span-2 text-right text-sm font-medium text-black">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                      <div className="lg:col-span-2 text-right">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-[#df3b3b] hover:underline"
                        >
                          Remove <Trash2 size={14} strokeWidth={2} className="ml-1 inline" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:w-[400px] ml-auto border border-[#e5e5e5] rounded-[5px] p-6">
                <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Subtotal</span>
                    <span className="text-black font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Shipping</span>
                    <span className="text-black font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[#e5e5e1] pt-3">
                    <span className="text-black font-medium">Total</span>
                    <span className="text-[#0e8ce4] font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full h-[50px] bg-[#0e8ce4] text-white text-base font-medium rounded-[5px] hover:bg-[#0e8ce4]/80 transition-colors mb-4">
                  Proceed to Checkout
                </button>
                <p className="text-xs text-center text-black/50">
                  Secure payment by Visa, Mastercard, PayPal
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
