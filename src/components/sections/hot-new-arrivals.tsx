"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/products/product-card";
import { products } from "@/lib/products";

const FILTERS = ["Featured", "Audio & Video", "Laptops & Computers"];

export default function HotNewArrivals() {
  const [activeFilter, setActiveFilter] = useState("Featured");

  const categoryProducts = products.filter((p) => {
    if (activeFilter === "Featured") return p.status === "new" || p.status === "discount";
    if (activeFilter === "Audio & Video") return p.category === "Audio & Video" || p.category === "TV & Audio";
    return p.category === "Computers & Laptops" || p.category === "Accessories";
  });
  const otherProducts = products.filter((p) => !categoryProducts.includes(p));
  const displayProducts = [...categoryProducts, ...otherProducts].slice(0, 8);

  return (
    <section className="py-12 bg-white border-y border-[#e5e5e5]">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-black">Hot New Arrivals</h2>
            <p className="text-xs text-black/50">Freshly added electronics this week</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeFilter === f
                  ? "bg-[#0e8ce4] text-white shadow-[0_1px_5px_rgba(0,0,0,0.1)]"
                  : "bg-white border border-[#e5e5e5] text-black/50 hover:text-[#0e8ce4]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Main Grid: 8-card grid + featured tall promo card on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Featured tall promo card on the right */}
          <div className="lg:col-span-3">
            <div className="bg-[#f2f4f8] border border-[#e5e5e5] rounded-[5px] p-6 h-[400px] lg:h-[594px] flex flex-col justify-between relative overflow-hidden group">
              <div>
                <span className="text-[10px] uppercase text-[#df3b3b] font-medium tracking-wider mb-2 block">
                  New Arrival
                </span>
                <h3 className="text-xl font-medium text-[#212529] leading-tight mb-3">
                  Fold Duo Smartphone
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-medium text-[#df3b3b]">$460</span>
                  <span className="text-sm text-black/50 line-through">$530</span>
                </div>
                <p className="text-xs text-black/50 leading-relaxed">
                  Next generation dual screen with ultra-thin glass and 120Hz smooth refresh rate.
                </p>
              </div>

              <div className="my-auto flex justify-center py-6">
                <Image
                  src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&q=80"
                  alt="Fold Duo Phone"
                  width={200}
                  height={200}
                  className="w-44 h-44 object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <Link href="/product/p1">
                <button
                  type="button"
                  className="w-full h-[44px] bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white text-sm font-medium rounded-[5px] transition-colors cursor-pointer"
                >
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
