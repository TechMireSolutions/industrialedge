"use client";

import { Truck, RefreshCw, Headphones, CreditCard } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    sub: "Free shipping on orders over $99",
  },
  {
    icon: RefreshCw,
    title: "Money Guarantee",
    sub: "30 days money back guarantee",
  },
  {
    icon: Headphones,
    title: "Online Support 24/7",
    sub: "Dedicated technical & sales support",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    sub: "Pay with multiple secure methods",
  },
];

export default function TrustBar() {
  return (
    <section className="py-10 bg-white border-t border-gray-100 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50/80 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#f0f5fc] text-[#004ec3] flex items-center justify-center shrink-0">
                <feature.icon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-[#1e2d3b] mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#73787d]">{feature.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
