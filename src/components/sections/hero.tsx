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
  badge?: string;
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
    name: 'Amazon Fire TV 50" 4-Series 4K UHD smart TV',
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
    showToast(`Added "${item.name.substring(0, 24)}..." to cart!`);
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
    <section className="relative w-full bg-[#f6f7f9] bg-[url('/images/bg1-home08.webp')] bg-cover bg-top bg-no-repeat py-8 md:py-12 lg:py-14 border-b border-gray-200/50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2d3b] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Column 1 (Left): Dell G5 Gaming Laptop Image */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-start items-center">
            <div className="relative group w-full max-w-[420px] lg:max-w-[460px] transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/images/dell-g5-hero.png"
                alt="Dell G5 Gaming Laptop"
                width={560}
                height={380}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.14)]"
              />
            </div>
          </div>

          {/* Column 2 (Center): Pricing & Headings */}
          <div className="md:col-span-3 lg:col-span-3 text-center md:text-left flex flex-col justify-center">
            {/* Price label */}
            <span className="text-[17px] sm:text-[19px] lg:text-[21px] text-[#73787d] font-normal leading-tight mb-1">
              Price
            </span>

            {/* $450 in big bold royal blue */}
            <div className="text-[48px] sm:text-[56px] lg:text-[68px] font-bold text-[#004ec3] tracking-tight leading-none mb-3">
              $450
            </div>

            {/* Tagline */}
            <p className="text-[15px] sm:text-[17px] lg:text-[19px] text-[#333e48] font-light leading-snug mb-4 sm:mb-5">
              Let power flow through you
            </p>

            {/* DELL G5 GAMING LAPTOP */}
            <h1 className="text-[24px] sm:text-[28px] lg:text-[34px] font-bold text-[#1e2d3b] tracking-normal uppercase leading-[1.18]">
              DELL G5
              <br />
              GAMING LAPTOP
            </h1>
          </div>

          {/* Column 3 (Right): Stack of 2 Horizontal Product Cards with Hover Actions */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4 sm:gap-5 justify-center items-center md:items-end">
            {HERO_SIDE_PRODUCTS.map((product) => {
              const liked = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-lg p-3.5 sm:p-4 w-full max-w-[340px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Left: Product Thumbnail */}
                    <div className="relative w-[75px] h-[75px] sm:w-[85px] sm:h-[85px] flex-shrink-0 flex items-center justify-center p-1 bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={90}
                        height={90}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Right: Category, Title & Swap Area (Price vs Actions) */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      {/* Category */}
                      <Link
                        href={product.categoryLink}
                        className="text-[11px] sm:text-[12px] text-[#73787d] font-normal hover:text-[#004ec3] transition-colors leading-tight mb-1 truncate block"
                      >
                        {product.category}
                      </Link>

                      {/* Title */}
                      <Link
                        href={`/product/${product.id}`}
                        className="text-[12px] sm:text-[13px] font-medium text-[#004ec3] leading-[1.3] line-clamp-2 hover:underline mb-2 transition-colors block"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Bottom Area: Normal Price vs 4 Rounded Action Buttons on Hover */}
                      <div className="relative h-7 sm:h-8 flex items-center">
                        {/* Normal State: Price */}
                        <div className="absolute inset-0 flex items-center transition-all duration-200 ease-in-out group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-1">
                          <span className="text-[14px] sm:text-[15px] font-bold text-[#333e48]">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Hover State: 4 Rounded Action Buttons */}
                        <div className="absolute inset-0 flex items-center gap-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-1 transition-all duration-200 ease-in-out">
                          {/* 1. Quick View Button */}
                          <div className="relative group/btn">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuickViewProduct(product);
                              }}
                              className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors shadow-xs cursor-pointer"
                              aria-label="Quick View"
                            >
                              <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
                            </button>
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 text-[10px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 z-30 shadow-md">
                              Quick View
                              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-[#222222]" />
                            </span>
                          </div>

                          {/* 2. Wishlist Button */}
                          <div className="relative group/btn">
                            <button
                              type="button"
                              onClick={(e) => handleToggleWishlist(product, e)}
                              className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border transition-colors shadow-xs flex items-center justify-center cursor-pointer ${
                                liked
                                  ? "border-red-500 bg-red-50 text-red-500"
                                  : "border-gray-200 bg-white text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3]"
                              }`}
                              aria-label="Wishlist"
                            >
                              <Heart
                                className="w-3.5 h-3.5 stroke-[1.8]"
                                fill={liked ? "currentColor" : "none"}
                              />
                            </button>
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 text-[10px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 z-30 shadow-md">
                              {liked ? "Remove Wishlist" : "Wishlist"}
                              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-[#222222]" />
                            </span>
                          </div>

                          {/* 3. Compare Button */}
                          <div className="relative group/btn">
                            <button
                              type="button"
                              onClick={(e) => handleCompare(product, e)}
                              className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors shadow-xs cursor-pointer"
                              aria-label="Compare"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
                            </button>
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 text-[10px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 z-30 shadow-md">
                              Compare
                              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-[#222222]" />
                            </span>
                          </div>

                          {/* 4. Add to Cart Button */}
                          <div className="relative group/btn">
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(product, e)}
                              className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors shadow-xs cursor-pointer"
                              aria-label="Add to cart"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 stroke-[1.8]" />
                            </button>
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 text-[10px] font-medium text-white bg-[#222222] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 z-30 shadow-md">
                              Add to cart
                              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-[#222222]" />
                            </span>
                          </div>
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
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center p-2 bg-gray-50 rounded-lg">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <span className="text-xs uppercase tracking-wider text-[#73787d] font-semibold">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-base font-bold text-[#1e2d3b] mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {quickViewProduct.description}
                </p>
                <div className="text-xl font-bold text-[#004ec3] mt-3">
                  ${quickViewProduct.price.toFixed(2)}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#004ec3] hover:bg-[#003da0] text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                    className="p-2 border border-gray-200 rounded-md text-gray-700 hover:text-red-500 hover:border-red-400 transition-colors cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className="w-4 h-4"
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
