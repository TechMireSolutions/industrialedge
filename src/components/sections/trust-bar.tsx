"use client";

import { Truck, CreditCard, ThumbsUp, ShieldCheck, PhoneCall } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    sub: "Doorstep dispatch across Pakistan",
  },
  {
    icon: PhoneCall,
    title: "Dedicated Support",
    sub: "Fast B2B procurement & query handling",
  },
  {
    icon: CreditCard,
    title: "Corporate Billing",
    sub: "Transparent invoicing & PO options",
  },
  {
    icon: ThumbsUp,
    title: "14+ Years Legacy",
    sub: "Trusted business partner since 2011",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    sub: "100% genuine products & warranty",
  },
];

export default function TrustBar() {
  return (
    <section className="pt-2 pb-14 bg-white select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 p-4 sm:p-4.5 rounded-lg border border-gray-200/90 bg-white hover:border-gray-300 transition-colors"
            >
              <div className="text-gray-700 shrink-0">
                <feature.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-bold text-[13px] sm:text-[14px] text-[#1e2d3b] leading-tight mb-1 truncate">
                  {feature.title}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-[#73787d] font-normal leading-tight line-clamp-2">
                  {feature.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
