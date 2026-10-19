"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/products";
import ProductCard from "@/components/products/product-card";
import { Grid, List, SearchX } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
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

function ShopContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const catParam = searchParams.get("cat") || "All";

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return CATEGORIES.includes(catParam) ? catParam : "All";
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (queryParam.trim()) {
      const q = queryParam.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [selectedCategory, queryParam, sortBy]);

  return (
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[32px] font-normal text-[#212529] mb-2 tracking-tight">Shop</h1>
              <p className="text-sm text-black/60">
                {queryParam
                  ? `Search results for "${queryParam}" (${filteredProducts.length} items)`
                  : "Browse our complete collection of electronics and cutting-edge devices."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="sort-select" className="text-xs text-black/60 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-[38px] border border-[#e5e5e5] rounded-[5px] px-3 text-xs bg-white text-black/80 focus:outline-none focus:border-[#0e8ce4] cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-4 border-b border-[#e5e5e5]/60">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0e8ce4] text-white border-[#0e8ce4] shadow-[0_2px_8px_rgba(14,140,228,0.25)]"
                      : "border-[#e5e5e5] text-black/60 hover:text-[#0e8ce4] hover:border-[#0e8ce4] bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`p-2 rounded-[5px] border text-[#828282] transition-colors cursor-pointer ${
                  view === "grid"
                    ? "bg-[#0e8ce4] text-white border-[#0e8ce4]"
                    : "bg-white border-[#e5e5e5] hover:text-[#0e8ce4]"
                }`}
                aria-label="Grid view"
              >
                <Grid size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`p-2 rounded-[5px] border text-[#828282] transition-colors cursor-pointer ${
                  view === "list"
                    ? "bg-[#0e8ce4] text-white border-[#0e8ce4]"
                    : "bg-white border-[#e5e5e5] hover:text-[#0e8ce4]"
                }`}
                aria-label="List view"
              >
                <List size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Product listing */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#f2f4f8] rounded-[5px] border border-[#e5e5e5] p-8">
              <SearchX size={48} className="text-[#828282] mx-auto mb-4" />
              <h2 className="text-lg font-medium text-black mb-2">No products found</h2>
              <p className="text-sm text-black/60 mb-6">
                Try clearing your search query or choosing a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                }}
                className="bg-[#0e8ce4] text-white px-6 py-2.5 rounded-[5px] text-sm font-medium hover:bg-[#0e8ce4]/80 transition-colors cursor-pointer"
              >
                View All Products
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#e5e5e5] rounded-[5px] p-4 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-[#f2f4f8] rounded-[5px] flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase text-[#0e8ce4] font-medium block mb-1">
                        {product.category}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-base font-medium text-black hover:text-[#0e8ce4] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-black/50 mt-1 line-clamp-1 max-w-md">
                        {product.description || "High performance electronics designed for optimal reliability."}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <span className="text-xl font-medium text-[#df3b3b]">${product.price}</span>
                    <Link href={`/product/${product.id}`}>
                      <button
                        type="button"
                        className="bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white px-5 py-2 rounded-[5px] text-xs font-medium transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-276px)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e8ce4]"></div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
