"use client";

import { useState } from "react";

import { useStore } from "@/lib/store";
import { products } from "@/lib/products";
import ProductCard from "@/components/products/product-card";
import Link from "next/link";
import { Filter, Grid, List } from "lucide-react";

export default function ShopPage() {
  const { addToCart } = useStore();
  const [view, setView] = useState<"grid" | "list">("grid");

  const categories = [
    "All",
    "Smartphones & Tablets",
    "Computers & Laptops",
    "Audio & Video",
    "Gadgets",
    "Video Games & Consoles",
    "Accessories",
    "Cameras & Photos",
    "TV & Audio",
    "Car Electronics",
  ];

  return (
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12">
        <div className="container">
          <h1 className="text-[28px] font-normal text-[#212529] mb-2">Shop</h1>
          <p className="text-sm text-black/50 mb-8">
            Browse our complete collection of electronics and gadgets.
          </p>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="whitespace-nowrap px-4 py-2 rounded-full border border-[#e5e5e5] text-sm text-black/50 hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-[5px] border border-[#e5e5e5] text-[#828282] ${view === "grid" ? "bg-[#0e8ce4] text-white border-[#0e8ce4]" : "bg-white"} hover:text-[#0e8ce4] transition-colors`}
              >
                <Grid size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-[5px] border border-[#e5e5e5] text-[#828282] ${view === "list" ? "bg-[#0e8ce4] text-white border-[#0e8ce4]" : "bg-white"} hover:text-[#0e8ce4] transition-colors`}
              >
                <List size={18} strokeWidth={2} />
              </button>
              <button className="px-4 py-2 rounded-[5px] border border-[#e5e5e5] text-sm text-black/50 hover:text-[#0e8ce4] transition-colors">
                <Filter size={18} strokeWidth={2} /> Filter
              </button>
            </div>
          </div>

          {/* Product listing */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${view === "list" ? "flex-col" : ""}`}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group block"
              >
                <div className="relative">
                  <ProductCard product={product} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
