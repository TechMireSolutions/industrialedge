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
    categoryLink: "/shop?cat=Headphone",
    price: 549.0,
    image: "/images/product-airpods-max.webp",
    description:
      "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise, so you can immerse yourself in music.",
  },
  {
    id: "hero-fire-tv",
    name: 'Amazon Fire TV 50" 4-Series 4K UHD smart TV',
    category: "Apple products",
    categoryLink: "/shop?cat=TV+%26+Computer+Screen",
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
    <section className="relative w-full bg-[#f4f6f8] bg-[url('/images/hero-bg-exact.webp')] bg-cover bg-center bg-no-repeat py-10 sm:py-14 lg:py-16 border-b border-gray-200/50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171145] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Matches Header Width (max-w-[1440px] px-6 lg:px-12) */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[380px] lg:min-h-[440px]">
          
          {/* 1. Left: Dell G5 Gaming Laptop (Large, Prominent, Clean Transparent PNG) */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-start items-center">
            <div className="relative group w-full max-w-[420px] lg:max-w-[500px] xl:max-w-[540px] transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/images/dell-g5-hero.png"
                alt="Dell G5 Gaming Laptop"
                width={540}
                height={387}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>

          {/* 2. Center: Pricing & Headings (Spacious, Bold, Perfect Alignment) */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left justify-center pl-0 lg:pl-2">
            <span className="text-[17px] sm:text-[19px] lg:text-[21px] text-[#73787d] font-normal leading-tight mb-1">
              Price
            </span>

            <div className="text-[52px] sm:text-[62px] lg:text-[72px] font-bold text-[#0ea57a] tracking-tight leading-none mb-3">
              $450
            </div>

            <p className="text-[15px] sm:text-[17px] lg:text-[19px] text-[#333e48] font-light leading-snug mb-4 sm:mb-5">
              Let power flow through you
            </p>

            <h1 className="text-[26px] sm:text-[30px] lg:text-[36px] font-bold text-[#171145] tracking-normal uppercase leading-[1.18]">
              DELL G5
              <br />
              GAMING LAPTOP
            </h1>
          </div>

          {/* 3. Right: Stack of 2 Horizontal Product Cards (Spacious, Matching Screenshot) */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4 sm:gap-5 justify-center items-center md:items-end">
            {HERO_SIDE_PRODUCTS.map((product) => {
              const liked = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-xl p-3.5 sm:p-4 w-full max-w-[340px] lg:max-w-[360px] h-[105px] lg:h-[115px] shadow-[0_2px_14px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-3.5 sm:gap-4 select-none"
                >
                  {/* Left: Product Thumbnail */}
                  <div className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] flex-shrink-0 flex items-center justify-center p-1 bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Right: Category, Title & Swap Area (Price vs Actions) */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    {/* Category */}
                    <Link
                      href={product.categoryLink}
                      className="text-[11px] sm:text-[12px] text-[#73787d] font-normal hover:text-[#0ea57a] transition-colors leading-tight mb-1 truncate block"
                    >
                      {product.category}
                    </Link>

                    {/* Title */}
                    <Link
                      href={`/product/${product.id}`}
                      className="text-[12px] sm:text-[13px] font-semibold text-[#0ea57a] leading-[1.3] line-clamp-2 hover:underline mb-1.5 transition-colors block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    {/* Bottom Area: Normal Price vs 4 Rounded Action Buttons on Hover */}
                    <div className="relative h-7 sm:h-8 flex items-center">
                      {/* Normal State: Price */}
                      <div className="absolute inset-0 flex items-center transition-all duration-200 ease-in-out group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-1">
                        <span className="text-[14px] sm:text-[15px] lg:text-[16px] font-bold text-[#22262a]">
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
                            className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a] transition-colors shadow-xs cursor-pointer"
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
                                : "border-gray-200 bg-white text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a]"
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
                            className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a] transition-colors shadow-xs cursor-pointer"
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
                            className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a] transition-colors shadow-xs cursor-pointer"
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
                <h3 className="text-base font-bold text-[#171145] mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {quickViewProduct.description}
                </p>
                <div className="text-xl font-bold text-[#0ea57a] mt-3">
                  ${quickViewProduct.price.toFixed(2)}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#0ea57a] hover:bg-[#0b8462] text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
