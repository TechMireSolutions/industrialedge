"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface BestSellerItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const BEST_SELLER_ITEMS: BestSellerItem[] = [
  {
    id: "bs-1",
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6\" Full HD IPS Display – 11th Gen Intel i3",
    category: "Acer",
    price: 529.75,
    image: "/images/o_3603-540x540.webp",
    description: "Powerful 11th Gen Intel Core i3 processor, 15.6-inch Full HD IPS display with narrow bezels, ergonomic hinge, and all-day battery life.",
  },
  {
    id: "bs-2",
    name: "AirPods (2nd generation) with Wired Charging Case",
    category: "AirPods",
    price: 129.0,
    image: "/images/o_2003-540x540.webp",
    description: "Effortless setup, high-quality audio, hands-free Siri access, and over 24 hours of listening time with the charging case.",
  },
  {
    id: "bs-3",
    name: "AirPods (3rd generation) with Lightning Charging Case",
    category: "AirPods",
    price: 169.0,
    image: "/images/o_2101-540x540.webp",
    description: "Personalized Spatial Audio with dynamic head tracking, sweat and water resistance, and contoured design with force sensor control.",
  },
  {
    id: "bs-4",
    name: "Amazfit GTS 2 Smart Watch for Men Android iPhone, Bluetooth Phone Call",
    category: "Apple products",
    price: 134.99,
    originalPrice: 179.99,
    image: "/images/o_0601-540x540.webp",
    description: "Curved 3D bezel-less design, all-round health tracking, 90 built-in sports modes, and Bluetooth phone call support.",
  },
  {
    id: "bs-5",
    name: "Amazon Fire HD 8 tablet, 2 GB RAM, 32 GB, Black",
    category: "Amazon",
    price: 99.99,
    originalPrice: 119.99,
    image: "/images/o_1101-540x540.webp",
    description: "8-inch vibrant HD display, 30% faster quad-core processor, all-day battery life up to 12 hours, and enhanced USB-C charging.",
  },
  {
    id: "bs-6",
    name: "Amazon Fire TV 50\" 4-Series 4K UHD smart TV",
    category: "Apple products",
    price: 299.99,
    originalPrice: 449.99,
    image: "/images/o_1301-540x540.webp",
    description: "Stunning 4K Ultra HD, HDR 10, and HLG provide clear picture and vivid colors. Control entertainment hands-free with Alexa Voice Remote.",
  },
];

export default function BestSellers() {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<BestSellerItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState(3);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleColumns(1);
      } else if (width < 1024) {
        setVisibleColumns(2);
      } else {
        setVisibleColumns(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, BEST_SELLER_ITEMS.length - visibleColumns);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }
    setTouchStartX(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2200);
  };

  const handleAddToCart = (product: BestSellerItem, e?: React.MouseEvent) => {
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

  const handleToggleWishlist = (product: BestSellerItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    const liked = isWishlisted(product.id);
    showToast(liked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: BestSellerItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added to compare list!`);
  };

  // Helper to render individual product card matching reference screenshot
  const renderProductCard = (product: BestSellerItem) => {
    const liked = isWishlisted(product.id);

    return (
      <div
        key={product.id}
        className="group relative flex flex-col justify-between bg-white h-full transition-all duration-200 select-none"
      >
        {/* 1. Image Stage with Hover Overlay: Top-Right Icons + Bottom Red Button */}
        <div className="relative w-full h-[180px] sm:h-[190px] flex items-center justify-center p-2 mb-2 bg-white overflow-hidden">
          {/* Product Image */}
          <Image
            src={product.image}
            alt={product.name}
            width={180}
            height={180}
            className="max-h-[165px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Top-Right Vertical Stack of 3 Round Action Buttons on Hover */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-20">
            {/* Quick View Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#004ec3] transition-colors cursor-pointer"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>

            {/* Wishlist Button */}
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

            {/* Compare Button */}
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
          <div className="absolute bottom-1 inset-x-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20">
            <button
              type="button"
              onClick={(e) => handleAddToCart(product, e)}
              className="w-full bg-[#ff3d3d] hover:bg-[#e62e2e] text-white text-[12px] font-semibold py-2 rounded-[4px] shadow-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              Add to cart
            </button>
          </div>
        </div>

        {/* 2. Text Details: Category, Title, Price */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            {/* Category */}
            <span className="text-[11px] text-[#73787d] font-normal leading-tight mb-1 block truncate">
              {product.category}
            </span>

            {/* Product Title */}
            <Link
              href={`/product/${product.id}`}
              className="text-[12px] sm:text-[13px] font-medium text-[#004ec3] leading-[1.3] line-clamp-2 hover:underline mb-1.5 transition-colors block"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[14px] sm:text-[15px] font-bold text-[#22262a]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] sm:text-[12px] text-[#888888] line-through font-normal">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-white py-8 sm:py-10 select-none overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2d3b] text-white px-4 py-2 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header: Title on left, Carousel controls on right (clean white space underneath matching screenshot) */}
        <div className="flex items-center justify-between pb-1 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e2d3b] tracking-tight">
            Best Sellers
          </h2>

          {/* Interactive Slider Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 text-gray-400 hover:text-[#1e2d3b] transition-colors cursor-pointer select-none active:scale-90"
              aria-label="Previous Best Sellers"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 text-gray-400 hover:text-[#1e2d3b] transition-colors cursor-pointer select-none active:scale-90"
              aria-label="Next Best Sellers"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* 2-Column Section Layout: Left Dell G5 Banner + Right Product Carousel */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Left: Dell G5 Featured Promo Banner */}
          <Link
            href="/product-category/laptop-tablet"
            className="w-full lg:w-[350px] xl:w-[370px] shrink-0 h-[285px] sm:h-[295px] relative rounded-[6px] border border-gray-200/70 overflow-hidden bg-cover bg-center p-6 sm:p-7 group transition-shadow duration-300 hover:shadow-md cursor-pointer block"
            style={{
              backgroundImage: "url('/images/bg2-home04.webp')",
              backgroundColor: "#f7f8fa",
            }}
          >
            {/* Banner Typography */}
            <div className="relative z-10">
              <span className="text-[13px] text-[#73787d] font-normal block mb-1">
                Price
              </span>
              <span className="text-[36px] sm:text-[40px] font-bold text-[#004ec3] leading-none block mb-3.5 tracking-tight">
                $450
              </span>
              <span className="text-[13px] text-[#555a60] font-normal block mb-1">
                Let power flow through you
              </span>
              <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1e2d3b] leading-[1.2] block max-w-[190px]">
                Dell G5 Gaming Laptop
              </h3>
            </div>

            {/* Laptop Cutout Image positioned exactly at bottom-right */}
            <div className="absolute right-0 bottom-0 w-[230px] sm:w-[255px] h-[155px] sm:h-[170px] pointer-events-none flex items-end justify-end">
              <Image
                src="/images/img-prd18.webp"
                alt="Dell G5 Gaming Laptop"
                width={360}
                height={220}
                className="w-full h-full object-contain object-right-bottom transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Right: 3-Product Carousel Slider Track */}
          <div
            className="flex-1 min-w-0 relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(BEST_SELLER_ITEMS.length / visibleColumns) * 100}%`,
                transform: `translateX(-${currentIndex * (100 / BEST_SELLER_ITEMS.length)}%)`,
              }}
            >
              {BEST_SELLER_ITEMS.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 px-2.5 sm:px-3 flex flex-col justify-between"
                  style={{
                    width: `${100 / BEST_SELLER_ITEMS.length}%`,
                  }}
                >
                  {renderProductCard(product)}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Product Image Stage */}
              <div className="w-full h-[240px] sm:h-[280px] bg-[#f8f9fa] rounded-lg p-4 flex items-center justify-center">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  width={260}
                  height={260}
                  className="max-h-[240px] w-auto object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#004ec3] font-semibold uppercase tracking-wider block mb-1">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e2d3b] leading-snug mb-3">
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
                    className="flex-1 bg-[#ff3d3d] hover:bg-[#e62e2e] text-white font-semibold py-2.5 px-4 rounded-[4px] text-sm transition-colors cursor-pointer shadow-sm text-center"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                    className="p-2.5 rounded-[4px] border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
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
