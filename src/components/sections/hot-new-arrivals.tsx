"use client";

import { useState } from "react";

import ProductCard from "@/components/products/product-card";
import { products } from "@/lib/products";

const FILTERS = ["Featured", "Audio & Video", "Laptops & Computers"];

export default function HotNewArrivals() {
  const [activeFilter, setActiveFilter] = useState("Featured");

  const filtered =
    activeFilter === "Featured"
      ? products.filter((p) => p.status === "new")
      : activeFilter === "Audio & Video"
      ? products.filter((p) => p.category === "Audio & Video")
      : products.filter((p) => p.category === "Computers & Laptops");

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
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f
                  ? "bg-[#0e8ce4] text-white shadow-[0_1px_5px_rgba(0,0,0,0.1)]"
                  : "bg-white border border-[#e5e5e5] text-black/50 hover:text-[#0e8ce4]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 8-card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Featured tall promo card on the right */}
        <div className="mt-10 lg:mt-0 lg:ml-8 lg:w-[320px]">
          <div className="bg-[#f2f4f8] border border-[#e5e5e5] rounded-[5px] p-6 h-[320px] flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] uppercase text-[#df3b3b] font-medium mb-2 block">New Arrival</span>
              <h3 className="text-xl font-medium text-[#212529] leading-tight mb-3">Fold Duo Smartphone</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium text-[#df3b3b]">$460</span>
                <span className="text-sm text-black/50 line-through ml-2">$530</span>
              </div>
            </div>
            <div className="absolute bottom-6 right-6">
              <img
                src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop&q=80"
                alt="Phone"
                className="w-20 h-20 object-contain opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
