"use client";

import { Truck, RefreshCw, Wallet, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Delivery",
    sub: "from $50",
  },
  {
    icon: RefreshCw,
    title: "99% Positive",
    sub: "Feedbacks",
  },
  {
    icon: Wallet,
    title: "365 Days",
    sub: "for free return",
  },
  {
    icon: ShieldCheck,
    title: "Payment Secure System",
    sub: "",
  },
];

export default function TrustBar() {
  return (
    <section className="py-10 border-y border-[#e5e5e5] bg-white">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="h-[100px] bg-white border border-[#e8e8e8] rounded-[5px] shadow-[0_1px_5px_rgba(0,0,0,0.05)] flex items-center px-8 gap-5"
            >
              <div className="w-8 h-8 flex-shrink-0 text-[#0e8ce4]">
                <feature.icon size={20} strokeWidth={2} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-sm text-black">{feature.title}</h3>
                {feature.sub && (
                  <p className="text-xs text-black/50">{feature.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
