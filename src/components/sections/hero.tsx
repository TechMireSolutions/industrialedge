"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface HeroProduct {
  id: string;
  name: string;
  category: string;
  categoryLink: string;
  price: number;
  image: string;
  description: string;
}

const HERO_SIDE_PRODUCTS: HeroProduct[] = [
  {
    id: "hero-airpods-max",
    name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
    category: "AirPods",
    categoryLink: "/category/headphones",
    price: 549.0,
    image: "/images/product-airpods-max.webp",
    description:
      "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise, so you can immerse yourself in music.",
  },
  {
    id: "hero-fire-tv",
    name: "Amazon Fire TV 50'' 4-Series 4K UHD smart TV",
    category: "Apple products",
    categoryLink: "/category/tv-audio",
    price: 299.99,
    image: "/images/product-fire-tv.webp",
    description:
      "Brilliant 4K entertainment - Bring movies and shows to life with support for vivid 4K Ultra HD, HDR 10, HLG, and Dolby Digital Plus.",
  },
];

export default function Hero() {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<HeroProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const handleAddToCart = (item: HeroProduct, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const storeProduct: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      status: "none",
      image: item.image,
      category: item.category,
      description: item.description,
    };
    addToCart(storeProduct, 1);
    showToast(`Added to cart!`);
  };

  const handleToggleWishlist = (item: HeroProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.id);
    const liked = isWishlisted(item.id);
    showToast(liked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (item: HeroProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added to compare list!`);
  };

  return (
    <section className="relative w-full bg-[#f1f3f5] bg-[url('/images/hero-bg-exact.webp')] bg-cover bg-center bg-no-repeat border-b border-gray-200/40">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2d3b] text-white px-4 py-2 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Banner Container - exact proportions from screenshot */}
      <div className="max-w-[1024px] mx-auto min-h-[245px] px-4 sm:px-6 flex items-center py-4 sm:py-5">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          
          {/* 1. Left: Dell G5 Gaming Laptop (Exact positioning & sizing) */}
          <div className="w-full md:w-[35%] flex justify-center md:justify-start items-center">
            <div className="relative w-[260px] sm:w-[285px] transition-transform duration-300 hover:scale-[1.02]">
              <Image
                src="/images/dell-g5-hero-exact.png"
                alt="Dell G5 Gaming Laptop"
                width={295}
                height={210}
                priority
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* 2. Center: Pricing & Headings (Exact Typography & Spacing) */}
          <div className="w-full md:w-[32%] flex flex-col items-center md:items-start text-center md:text-left justify-center pl-0 md:pl-2">
            <span className="text-[14px] sm:text-[15px] text-[#555e68] font-normal leading-tight mb-0.5">
              Price
            </span>

            <div className="text-[46px] sm:text-[54px] font-bold text-[#2854d9] tracking-tight leading-none mb-1.5">
              $450
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#555e68] font-normal leading-tight mb-2.5">
              Let power flow through you
            </p>

            <h1 className="text-[23px] sm:text-[27px] font-bold text-[#22262a] tracking-tight uppercase leading-[1.12]">
              DELL G5
              <br />
              GAMING LAPTOP
            </h1>
          </div>

          {/* 3. Right: Stack of 2 Compact Product Cards (Exact 227px x 82px) */}
          <div className="w-full md:w-[33%] flex flex-col gap-[20px] sm:gap-[22px] items-center md:items-end justify-center">
            {HERO_SIDE_PRODUCTS.map((product) => {
              const liked = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-[8px] w-[227px] sm:w-[230px] h-[82px] px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 flex items-center gap-2.5 select-none"
                >
                  {/* Left: Product Thumbnail */}
                  <div className="relative w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={52}
                      height={52}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Right: Category, Title & Bottom Swap Area */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    {/* Category */}
                    <Link
                      href={product.categoryLink}
                      className="text-[10px] text-[#73787d] font-normal hover:text-[#1a56db] transition-colors leading-none truncate block mb-0.5"
                    >
                      {product.category}
                    </Link>

                    {/* Title */}
                    <Link
                      href={`/product/${product.id}`}
                      className="text-[11px] font-semibold text-[#1a56db] leading-[1.25] line-clamp-2 hover:underline transition-colors block mb-1"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    {/* Bottom Swap: Price vs 4 Rounded Action Buttons */}
                    <div className="relative h-[22px] flex items-center">
                      {/* Normal Price */}
                      <div className="absolute inset-0 flex items-center transition-all duration-150 ease-in-out group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-1">
                        <span className="text-[13px] font-bold text-[#22262a]">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Hover Action Buttons */}
                      <div className="absolute inset-0 flex items-center gap-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-1 transition-all duration-150 ease-in-out">
                        {/* Quick View Button */}
                        <div className="relative group/btn">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="w-[22px] h-[22px] rounded-full bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center text-[#333e48] hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db] transition-colors shadow-2xs cursor-pointer"
                            aria-label="Quick View"
                          >
                            <Eye className="w-2.5 h-2.5 stroke-[1.8]" />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[9px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-150 z-30 shadow-md">
                            Quick View
                          </span>
                        </div>

                        {/* Wishlist Button */}
                        <div className="relative group/btn">
                          <button
                            type="button"
                            onClick={(e) => handleToggleWishlist(product, e)}
                            className={`w-[22px] h-[22px] rounded-full border transition-colors shadow-2xs flex items-center justify-center cursor-pointer ${
                              liked
                                ? "border-red-500 bg-red-50 text-red-500"
                                : "bg-[#f8f9fa] border-[#e5e7eb] text-[#333e48] hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db]"
                            }`}
                            aria-label="Wishlist"
                          >
                            <Heart
                              className="w-2.5 h-2.5 stroke-[1.8]"
                              fill={liked ? "currentColor" : "none"}
                            />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[9px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-150 z-30 shadow-md">
                            Wishlist
                          </span>
                        </div>

                        {/* Compare Button */}
                        <div className="relative group/btn">
                          <button
                            type="button"
                            onClick={(e) => handleCompare(product, e)}
                            className="w-[22px] h-[22px] rounded-full bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center text-[#333e48] hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db] transition-colors shadow-2xs cursor-pointer"
                            aria-label="Compare"
                          >
                            <ArrowLeftRight className="w-2.5 h-2.5 stroke-[1.8]" />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[9px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-150 z-30 shadow-md">
                            Compare
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="relative group/btn">
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(product, e)}
                            className="w-[22px] h-[22px] rounded-full bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center text-[#333e48] hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db] transition-colors shadow-2xs cursor-pointer"
                            aria-label="Add to cart"
                          >
                            <ShoppingCart className="w-2.5 h-2.5 stroke-[1.8]" />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[9px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-150 z-30 shadow-md">
                            Add to cart
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-5 relative shadow-xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-[120px] h-[120px] flex-shrink-0 flex items-center justify-center p-2 bg-gray-50 rounded-md">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  width={110}
                  height={110}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#73787d] font-semibold">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-[14px] font-bold text-[#22262a] mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2">
                  {quickViewProduct.description}
                </p>
                <div className="text-[16px] font-bold text-[#2854d9] mt-2">
                  ${quickViewProduct.price.toFixed(2)}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#1a56db] hover:bg-[#1442a8] text-white py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                    className="p-1.5 border border-gray-200 rounded text-gray-700 hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className="w-3.5 h-3.5"
                      fill={isWishlisted(quickViewProduct.id) ? "red" : "none"}
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
