"use client";

import Link from "next/link";
import { Smartphone, Laptop, Package, Gamepad2, Clock } from "lucide-react";

const CATEGORIES = [
  { label: "Smartphones & Tablets", icon: Smartphone },
  { label: "Computers & Laptops", icon: Laptop },
  { label: "Gadgets", icon: Package },
  { label: "Video Games & Consoles", icon: Gamepad2 },
  { label: "Accessories", icon: Clock },
];

export default function PopularCategories() {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-black">Popular Categories</h2>
            <p className="text-xs text-black/50">Browse our top electronics categories</p>
          </div>
          <Link href="/shop">
            <span className="text-sm text-[#0e8ce4] font-medium hover:underline">Full Catalog →</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.label}
              href="/shop"
              className="group relative aspect-[1] bg-white border border-[#e5e5e5] rounded-[5px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#f2f4f8] flex items-center justify-center transition-colors group-hover:bg-[#0e8ce4]/10">
                <cat.icon size={22} strokeWidth={2} className="text-[#0e8ce4] group-hover:text-[#0e8ce4] transition-colors" />
              </div>
              <span className="absolute bottom-2 left-2 text-xs font-medium text-black bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
