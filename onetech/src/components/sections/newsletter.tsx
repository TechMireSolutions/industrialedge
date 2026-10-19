"use client";

import { Send } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="bg-white py-16 border-t border-[#e5e5e5]">
      <div className="container">
        <div className="bg-[#0e8ce4] rounded-[5px] p-8 lg:p-12 overflow-hidden relative">
          {/* Decorative paper plane icon in background */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Send size={64} strokeWidth={2} stroke="currentColor" opacity="0.15" />
          </div>

          <div className="relative z-10 max-w-[700px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-3 lg:w-1/2">
                <Send size={20} strokeWidth={2} className="text-[#df3b3b]" />
                <div>
                  <h3 className="text-lg font-medium text-black leading-tight">
                    Sign up for Newsletter
                  </h3>
                  <p className="text-xs text-black/50 mt-0.5">
                    …and receive %20 coupon for first shopping.
                  </p>
                </div>
              </div>

              <div className="flex w-full lg:w-1/2 gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-[44px] border border-[#e5e5e5] rounded-[5px] px-4 text-sm focus:outline-none focus:border-[#0e8ce4]"
                />
                <button className="bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white px-6 py-2 rounded-[5px] text-sm font-medium transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
