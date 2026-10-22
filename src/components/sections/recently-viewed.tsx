"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, X, Check, ShoppingCart } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface RecentProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const RECENTLY_VIEWED_ITEMS: RecentProduct[] = [
  {
    id: "rv-1",
    name: "SKG Smart Watch Make/Answer Call for Men...",
    category: "Apple products",
    price: 29.19,
    originalPrice: 99.91,
    image: "/images/o_2901-540x540.webp",
    description: "Built-in Alexa, Bluetooth call support, all-day health monitoring, and IP68 waterproof design.",
  },
  {
    id: "rv-2",
    name: "Xbox Wireless Core Controller – White",
    category: "Apple products",
    price: 51.84,
    image: "/images/xbox-controller.png",
    description: "Experience the modernized design of the Xbox Wireless Controller, featuring sculpted surfaces and refined geometry.",
  },
  {
    id: "rv-3",
    name: "Bose Portable Smart Speaker — Wireless Bluetooth Speaker ...",
    category: "Apple products",
    price: 129.0,
    originalPrice: 399.0,
    image: "/images/bose-speaker.png",
    description: "All-in-one wireless home speaker, portable Bluetooth speaker, and voice-controlled speaker in one.",
  },
  {
    id: "rv-4",
    name: "SkyTech Shadow 3.0 Gaming Computer PC Desktop – Ryze...",
    category: "Apple products",
    price: 682.9,
    originalPrice: 944.53,
    image: "/images/o_4102-540x540.webp",
    description: "AMD Ryzen processor, NVIDIA GeForce graphics, high-speed NVMe SSD, and vivid RGB liquid cooling.",
  },
  {
    id: "rv-5",
    name: "AutoFull C3 Gaming Chair Office Chair Ergonomic...",
    category: "Game & Room Furniture",
    price: 600.0,
    originalPrice: 628.79,
    image: "/images/o_3101-600x600.webp",
    description: "Ergonomic gaming chair with high-density sponge, 2D armrests, headrest and lumbar support pillows.",
  },
  {
    id: "rv-6",
    name: "Beats Solo3 Wireless On-Ear Headphones, Apple W1...",
    category: "Apple products",
    price: 133.49,
    image: "/images/beats-headphones.png",
    description: "High-performance wireless Bluetooth headphones with Apple W1 chip and up to 40 hours of battery life.",
  },
];

export default function RecentlyViewed() {
  const [quickViewProduct, setQuickViewProduct] = useState<RecentProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isWishlisted, toggleWishlist, addToCart } = useStore();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2000);
  };

  const handleAddToCart = (product: RecentProduct, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const storeProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      status: "none",
      image: product.image,
      category: product.category,
      description: product.description,
    };
    addToCart(storeProduct, 1);
    showToast(`Added to cart!`);
  };

  const handleToggleWishlist = (product: RecentProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    const liked = isWishlisted(product.id);
    showToast(liked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: RecentProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added to compare list!`);
  };

  const handleQuickView = (product: RecentProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <section className="w-full bg-white pt-10 pb-8 sm:pt-12 sm:pb-10 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2d3b] text-white px-4 py-2 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl flex flex-col md:flex-row gap-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
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
                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                  {quickViewProduct.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-[#22262a]">
                    ${quickViewProduct.price.toFixed(2)}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${quickViewProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
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
                  className="flex-1 bg-[#ff3d3d] hover:bg-[#e62e2e] text-white py-2.5 px-4 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                  className={`p-2.5 rounded border transition-colors cursor-pointer ${
                    isWishlisted(quickViewProduct.id)
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-200 text-gray-700 hover:text-red-500 hover:border-red-300"
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
        {/* Section Header */}
        <div className="pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e2d3b] tracking-tight">
            Recently Viewed
          </h2>
        </div>

        {/* Thin Divider Line */}
        <div className="w-full border-b border-gray-200 mt-1 mb-8" />

        {/* 6-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {RECENTLY_VIEWED_ITEMS.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between select-none"
              >
                {/* Product Image Square Container with Hover State Elements */}
                <div className="relative w-full aspect-square bg-white border border-gray-200/90 rounded-[4px] p-3 sm:p-4 flex items-center justify-center overflow-hidden mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Top-Right 3 Floating Circular Action Buttons (Quick View, Wishlist, Compare) */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 z-20">
                    {/* Quick View */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickView(product, e)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#004ec3] transition-colors cursor-pointer"
                      title="Quick View"
                      aria-label="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>

                    {/* Wishlist */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                        liked ? "text-red-500" : "text-gray-700 hover:text-[#004ec3]"
                      }`}
                      title="Wishlist"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className="w-3.5 h-3.5 stroke-[1.8]"
                        fill={liked ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Compare */}
                    <button
                      type="button"
                      onClick={(e) => handleCompare(product, e)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#004ec3] transition-colors cursor-pointer"
                      title="Compare"
                      aria-label="Compare"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                  </div>

                  {/* Bottom Full-Width Red "Add to cart" Button on Hover */}
                  <div className="absolute bottom-2 inset-x-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-20">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-[#ff3d3d] hover:bg-[#e62e2e] text-white text-[12px] font-semibold py-2 rounded-[4px] shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>

                {/* Details: Category, Title (turns Red on hover), Price */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category */}
                    <span className="text-[11px] sm:text-[12px] text-[#73787d] font-normal leading-tight mb-1 block truncate">
                      {product.category}
                    </span>

                    {/* Title: turns red on hover */}
                    <Link
                      href={`/product/${product.id}`}
                      className="text-[13px] font-medium text-[#004ec3] group-hover:text-[#ff3d3d] leading-[1.3] line-clamp-2 mb-1.5 transition-colors duration-150 block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-[14px] sm:text-[15px] font-bold text-[#22262a]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] sm:text-[12px] text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
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
