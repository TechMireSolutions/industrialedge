"use client";

import { useState } from "react";
import ProductCard from "@/components/products/product-card";
import { products } from "@/lib/products";

const TABS = ["Featured", "On Sale", "Best Rated"] as const;

function getProductsForTab(tab: (typeof TABS)[number]) {
  switch (tab) {
    case "Featured":
      return products.filter((p) => p.status === "new" || p.status === "none");
    case "On Sale":
      return products.filter((p) => p.status === "discount");
    case "Best Rated":
      return products.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return products;
  }
}

interface TabbedProductGridProps {
  colSpan?: number;
}

export default function TabbedProductGrid({ colSpan = 8 }: TabbedProductGridProps) {
  const [activeTab, setActiveTab] = useState<TAB_TYPE>("Featured");

  const tabProducts = getProductsForTab(activeTab);

  return (
    <section className={`lg:col-span-${colSpan}`}>
      {/* Tab bar */}
      <div className="flex border-b border-[#e5e5e5] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 border-b-2 ${
              activeTab === tab
                ? "text-black border-[#0e8ce4] font-medium"
                : "text-black/50 border-transparent hover:text-[#0e8ce4] hover:border-[#0e8ce4]/20"
            } transition-all`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product grid: 4 cols x 2 rows = 8 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {tabProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

type TAB_TYPE = (typeof TABS)[number];
