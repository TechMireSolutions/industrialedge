"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "@/components/products/product-card";
import { Filter, Grid, List } from "lucide-react";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
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
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

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
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#0e8ce4] text-white border-[#0e8ce4] shadow-[0_1px_5px_rgba(0,0,0,0.1)]"
                      : "border-[#e5e5e5] text-black/50 hover:text-[#0e8ce4] hover:border-[#0e8ce4]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-[5px] border border-[#e5e5e5] text-[#828282] ${view === "grid" ? "bg-[#0e8ce4] text-white border-[#0e8ce4]" : "bg-white"} hover:text-[#0e8ce4] transition-colors`}
                aria-label="Grid view"
              >
                <Grid size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-[5px] border border-[#e5e5e5] text-[#828282] ${view === "list" ? "bg-[#0e8ce4] text-white border-[#0e8ce4]" : "bg-white"} hover:text-[#0e8ce4] transition-colors`}
                aria-label="List view"
              >
                <List size={18} strokeWidth={2} />
              </button>
              <button className="px-4 py-2 rounded-[5px] border border-[#e5e5e5] text-sm text-black/50 hover:text-[#0e8ce4] transition-colors flex items-center gap-1">
                <Filter size={16} strokeWidth={2} /> Filter
              </button>
            </div>
          </div>

          {/* Product listing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
