"use client";

import { Send } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="bg-white py-16 border-t border-[#e5e5e5]">
      <div className="container">
        <div className="bg-[#eff6fa] border border-[#e5e5e5] rounded-[5px] p-8 lg:p-12 overflow-hidden relative shadow-[0_1px_5px_rgba(0,0,0,0.03)]">
          {/* Decorative paper plane icon in background */}
          <div className="absolute -top-4 -right-4 p-8 text-[#0e8ce4] opacity-10 pointer-events-none">
            <Send size={96} strokeWidth={1.5} />
          </div>

          <div className="relative z-10 max-w-[800px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 lg:w-1/2">
                <div className="w-12 h-12 bg-white rounded-full shadow-[0_1px_5px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#0e8ce4] flex-shrink-0">
                  <Send size={22} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#212529] leading-tight">
                    Sign up for Newsletter
                  </h3>
                  <p className="text-xs text-black/50 mt-1">
                    …and receive 20% coupon for your first shopping.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex w-full lg:w-1/2 gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 h-[48px] bg-white border border-[#e5e5e5] rounded-[5px] px-4 text-sm text-[#212529] focus:outline-none focus:border-[#0e8ce4] shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white px-8 h-[48px] rounded-[5px] text-sm font-medium transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
