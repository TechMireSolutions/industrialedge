"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import { api, type ProductItem } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

interface FeatureProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  status?: string;
  isFeaturedTab?: boolean;
  description?: string;
}

type TabType = "feature" | "toprate" | "onsale";

export default function FeatureTabs() {
  const { isWishlisted, toggleWishlist, addToCart, addToCompare } = useStore();
  const [catalog, setCatalog] = useState<FeatureProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("feature");
  const [quickViewProduct, setQuickViewProduct] = useState<FeatureProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .getProducts()
      .then((prods: ProductItem[]) => {
        if (Array.isArray(prods) && prods.length > 0) {
          setCatalog(prods);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayedProducts = useMemo(() => {
    if (activeTab === "toprate") {
      return [...catalog].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
    }
    if (activeTab === "onsale") {
      const onSale = catalog.filter(
        (p) => p.status === "discount" || p.status === "sale" || (p.originalPrice && p.originalPrice > p.price)
      );
      return (onSale.length > 0 ? onSale : catalog).slice(0, 5);
    }
    const featured = catalog.filter((p) => p.isFeaturedTab);
    return (featured.length > 0 ? featured : catalog).slice(0, 5);
  }, [catalog, activeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2200);
  };

  const toStoreProduct = (product: FeatureProduct): Product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    status: "none",
    image: product.image,
    category: product.category,
    description: product.description,
  });

  const handleAddToCart = (product: FeatureProduct, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(toStoreProduct(product), 1);
    showToast("Added to cart!");
  };

  const handleToggleWishlist = (product: FeatureProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasLiked = isWishlisted(product.id);
    toggleWishlist(product.id);
    showToast(wasLiked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: FeatureProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(toStoreProduct(product));
    showToast("Added to compare!");
  };

  const renderProductCard = (product: FeatureProduct) => {
    const liked = isWishlisted(product.id);

    return (
      <div
        key={product.id}
        className="group relative flex flex-col justify-between bg-white h-full transition-all duration-200 select-none"
      >
        <div className="relative w-full h-[180px] sm:h-[190px] flex items-center justify-center p-2 mb-3 bg-white overflow-hidden">
          <Link href={`/product/${product.id}`} className="flex items-center justify-center w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              width={180}
              height={180}
              className="max-h-[165px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#0ea57a] transition-colors cursor-pointer"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>

            <button
              type="button"
              onClick={(e) => handleToggleWishlist(product, e)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                liked ? "text-rose-500" : "text-gray-700 hover:text-[#0ea57a]"
              }`}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 stroke-[1.8]" fill={liked ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={(e) => handleCompare(product, e)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#0ea57a] transition-colors cursor-pointer"
              title="Compare"
              aria-label="Compare"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>

          <div className="absolute bottom-1 inset-x-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20">
            <button
              type="button"
              onClick={(e) => handleAddToCart(product, e)}
              className="w-full bg-[#0ea57a] hover:bg-[#0b8462] text-white text-[12px] font-semibold py-2 rounded-[4px] shadow-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              Add to cart
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div>
            <span className="text-[11px] text-[#64748b] font-normal leading-tight mb-1 block truncate">
              {product.category}
            </span>

            <Link
              href={`/product/${product.id}`}
              className="text-[12px] sm:text-[13px] font-medium text-[#171145] hover:text-[#0ea57a] leading-[1.3] line-clamp-2 hover:underline mb-1.5 transition-colors block"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
            <span className="text-[14px] sm:text-[15px] font-bold text-[#0ea57a]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-[12px] text-[#888888] line-through font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "feature", label: "Feature" },
    { id: "toprate", label: "Toprate" },
    { id: "onsale", label: "On sale" },
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-12 select-none overflow-hidden">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171145] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200/80 pb-3 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-[20px] sm:text-[22px] transition-colors cursor-pointer select-none ${
                  isActive
                    ? "font-bold text-[#171145] border-b-2 border-[#0ea57a] pb-3 -mb-[13px]"
                    : "font-normal text-[#64748b] hover:text-[#171145]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 lg:gap-x-6 gap-y-8">
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-[260px] rounded-xl bg-slate-100 animate-pulse" />
              ))
            : displayedProducts.map((product) => renderProductCard(product))}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="w-full h-[240px] sm:h-[280px] bg-[#f8f9fa] rounded-lg p-4 flex items-center justify-center">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  width={260}
                  height={260}
                  className="max-h-[240px] w-auto object-contain"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#0ea57a] font-semibold uppercase tracking-wider block mb-1">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#171145] leading-snug mb-3">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-[#0ea57a]">
                      {formatPrice(quickViewProduct.price)}
                    </span>
                    {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(quickViewProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                  {quickViewProduct.description && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {quickViewProduct.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-semibold py-2.5 px-4 rounded-[4px] text-sm transition-colors cursor-pointer shadow-sm text-center"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                    className="p-2.5 rounded-[4px] border border-gray-200 hover:border-rose-400 text-gray-600 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Wishlist"
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isWishlisted(quickViewProduct.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
