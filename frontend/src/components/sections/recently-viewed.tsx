"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, X, Check, ShoppingCart } from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

interface RecentProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const FALLBACK_RECENT: RecentProduct[] = [
  { id: "bs-4", name: "Amazfit GTS 2 Smart Watch for Men Android iPhone", category: "Smartwatch", price: 37800, originalPrice: 50400, image: "/images/o_0601-540x540.webp", description: "AMOLED display, Bluetooth calling, 90 sports modes." },
  { id: "prd-ps5-dualsense", name: "PlayStation 5 DualSense Wireless Controller – Black", category: "Gaming Accessories", price: 19600, originalPrice: 24500, image: "/images/o_3201-540x540.webp", description: "Haptic feedback and adaptive triggers." },
  { id: "prd-bose-speaker", name: "Bose SoundLink Revolve+ II Bluetooth Speaker", category: "Audio Equipments", price: 55700, originalPrice: 69700, image: "/images/bose-speaker.png", description: "True 360-degree wireless sound." },
  { id: "prd-skytech-pc", name: "SkyTech Shadow 3.0 Gaming & Workstation PC – Ryzen 5", category: "Computers & Accessories", price: 223700, originalPrice: 265700, image: "/images/o_3701-540x540.webp", description: "AMD Ryzen 5, GTX 1660 Super, 1TB NVMe SSD, 16GB RAM." },
  { id: "prd-autofull-chair", name: "AutoFull C3 Ergonomic Gaming & Office Chair", category: "Game & Room Furniture", price: 68500, originalPrice: 84000, image: "/images/o_3101-600x600.webp", description: "High-density molded foam with lumbar & headrest support." },
  { id: "prd-beats-headphone", name: "Beats Studio Pro Wireless Over-Ear Headphones", category: "Headphone", price: 70000, originalPrice: 98000, image: "/images/beats-headphones.png", description: "Active Noise Cancelling with up to 40 hours battery." },
];

export default function RecentlyViewed() {
  const [catalog, setCatalog] = useState<RecentProduct[]>(FALLBACK_RECENT);
  const [quickViewProduct, setQuickViewProduct] = useState<RecentProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isWishlisted, toggleWishlist, addToCart, addToCompare, recentlyViewedIds } = useStore();

  useEffect(() => {
    api
      .getProducts()
      .then((all) => {
        if (Array.isArray(all) && all.length > 0) {
          setCatalog(all);
        }
      })
      .catch(() => {});
  }, []);

  const displayedItems = useMemo(() => {
    if (recentlyViewedIds.length > 0) {
      const matched = recentlyViewedIds
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is RecentProduct => Boolean(p));
      if (matched.length >= 6) return matched.slice(0, 6);
      const rest = catalog.filter((p) => !matched.some((m) => m.id === p.id));
      return [...matched, ...rest].slice(0, 6);
    }
    return catalog.slice(-6).reverse();
  }, [catalog, recentlyViewedIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2000);
  };

  const toStoreProduct = (product: RecentProduct): Product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    status: "none",
    image: product.image,
    category: product.category,
    description: product.description,
  });

  const handleAddToCart = (product: RecentProduct, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(toStoreProduct(product), 1);
    showToast("Added to cart!");
  };

  const handleToggleWishlist = (product: RecentProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasLiked = isWishlisted(product.id);
    toggleWishlist(product.id);
    showToast(wasLiked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: RecentProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(toStoreProduct(product));
    showToast("Added to compare!");
  };

  const handleQuickView = (product: RecentProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <section className="w-full bg-white pt-10 pb-8 sm:pt-12 sm:pb-10 select-none">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171145] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl flex flex-col md:flex-row gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 aspect-square relative bg-white flex items-center justify-center border border-gray-100 rounded-lg p-4">
              <Image
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                width={300}
                height={300}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-lg font-bold text-[#171145] leading-snug mb-3">
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
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {quickViewProduct.description ||
                    "Premium electronic device with high reliability, responsive design, and official manufacturer warranty included."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 bg-[#0ea57a] hover:bg-[#0b8462] text-white py-2.5 px-4 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                  className={`p-2.5 rounded border transition-colors cursor-pointer ${
                    isWishlisted(quickViewProduct.id)
                      ? "border-rose-500 text-rose-500 bg-rose-50"
                      : "border-gray-200 text-gray-700 hover:text-rose-500 hover:border-rose-300"
                  }`}
                  title="Wishlist"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isWishlisted(quickViewProduct.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#171145] tracking-tight">
            Recently Viewed
          </h2>
        </div>

        <div className="w-full border-b border-gray-200 mt-1 mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {displayedItems.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between select-none"
              >
                <div className="relative w-full aspect-square bg-white border border-gray-200/90 rounded-[4px] p-3 sm:p-4 flex items-center justify-center overflow-hidden mb-3">
                  <Link href={`/product/${product.id}`} className="flex items-center justify-center w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={180}
                      height={180}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 z-20">
                    <button
                      type="button"
                      onClick={(e) => handleQuickView(product, e)}
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

                  <div className="absolute bottom-2 inset-x-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-20">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-[#0ea57a] hover:bg-[#0b8462] text-white text-[12px] font-semibold py-2 rounded-[4px] shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] sm:text-[12px] text-[#64748b] font-normal leading-tight mb-1 block truncate">
                      {product.category}
                    </span>

                    <Link
                      href={`/product/${product.id}`}
                      className="text-[13px] font-medium text-[#171145] hover:text-[#0ea57a] leading-[1.3] line-clamp-2 mb-1.5 transition-colors duration-150 block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[14px] sm:text-[15px] font-bold text-[#0ea57a]">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] sm:text-[12px] text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
