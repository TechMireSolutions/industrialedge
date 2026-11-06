"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, Truck, Check } from "lucide-react";
import { useStore } from "@/lib/store";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ShopProductItem {
  id: string;
  name: string;
  shortName: string;
  categoryLine: string;
  categories: string[];
  brand: string;
  price: number;
  originalPrice?: number;
  mainImage: string;
  thumbnails: string[];
  moreThumbnailsCount: number;
  rating: number;
  reviewsCount?: number;
  description: string;
  specs: ProductSpec[];
  deliveryDays?: string;
}

interface ShopProductCardProps {
  product: ShopProductItem;
  onQuickView?: (product: ShopProductItem) => void;
  onCompare?: (product: ShopProductItem) => void;
  forceHover?: boolean;
}

export default function ShopProductCard({
  product,
  onQuickView,
  onCompare,
  forceHover,
}: ShopProductCardProps) {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const liked = isWishlisted(product.id);
  const showHoverState = forceHover || isHovered;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 500);
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage || product.mainImage,
      category: product.categories?.[0] || "Electronics",
      status: "none",
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1800);
  };

  const handleThumbSelect = (src: string, index: number) => {
    setSelectedImage(src);
    setActiveThumbIndex(index);
  };

  const handleCycleImages = () => {
    if (product.thumbnails && product.thumbnails.length > 0) {
      const nextIndex = (activeThumbIndex + 1) % product.thumbnails.length;
      setSelectedImage(product.thumbnails[nextIndex]);
      setActiveThumbIndex(nextIndex);
    }
  };

  const isCardHovered =
    forceHover === true ? true : forceHover === false ? false : isHovered;

  return (
    <article
      className="group relative bg-white flex flex-col justify-between w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveTooltip(null);
      }}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      aria-label={product.name}
    >
      {/* ======================================================== */}
      {/* 1. UPPER STAGE: NORMAL IMAGE vs HOVER SPECS & ACTIONS     */}
      {/* ======================================================== */}
      <div className="relative w-full h-[275px] bg-white overflow-hidden rounded-[4px]">
        {/* NORMAL STATE: Centered Product Image */}
        <div
          className="absolute inset-0 flex items-center justify-center p-3 transition-all duration-300 ease-out"
          style={{
            opacity: isCardHovered ? 0 : 1,
            transform: isCardHovered ? "scale(0.96)" : "scale(1)",
            pointerEvents: isCardHovered ? "none" : "auto",
            zIndex: isCardHovered ? 0 : 10,
          }}
        >
          <Link
            href={`/product/${product.id}`}
            className="relative w-full h-full flex items-center justify-center group-hover:scale-102 transition-transform duration-300"
          >
            <div className="relative w-[210px] h-[210px]">
              <Image
                src={selectedImage || product.mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain transition-all duration-300"
                priority={product.id === "p-airpods-2nd-gen"}
              />
            </div>
          </Link>
        </div>

        {/* HOVER STATE: Interactive Specs + Floating Action Buttons + Delivery + Add to Cart */}
        <div
          className="absolute inset-0 bg-white flex flex-col justify-between py-1 transition-all duration-300 ease-out"
          style={{
            opacity: isCardHovered ? 1 : 0,
            transform: isCardHovered ? "translateY(0)" : "translateY(8px)",
            pointerEvents: isCardHovered ? "auto" : "none",
            visibility: isCardHovered ? "visible" : "hidden",
            zIndex: isCardHovered ? 20 : 0,
          }}
        >
          {/* Top Row: Key-Value Specs Table (Left) + 3 Floating Action Buttons (Right) */}
          <div className="flex items-start justify-between gap-2 pt-1">
            {/* Specs Table */}
            <div className="flex-1 min-w-0 pr-1 space-y-2 text-[12.5px] leading-snug">
              {product.specs?.slice(0, 5).map((spec, idx) => {
                const isTwoWordLabel =
                  spec.label.includes(" ") && spec.label.length > 12;
                return (
                  <div
                    key={spec.label}
                    className="grid grid-cols-[105px_1fr] items-start gap-1"
                    style={{
                      animationDelay: `${idx * 40}ms`,
                    }}
                  >
                    <span className="text-[#718096] font-normal leading-[1.25]">
                      {isTwoWordLabel ? (
                        <>
                          {spec.label.split(" ")[0]}
                          <br />
                          {spec.label.split(" ").slice(1).join(" ")}
                        </>
                      ) : (
                        spec.label
                      )}
                    </span>
                    <span
                      className="text-[#374151] font-normal truncate"
                      title={spec.value}
                    >
                      {spec.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 3 Circular Floating Action Buttons (Right) */}
            <div className="flex flex-col gap-2 shrink-0 relative">
              {/* Quick View Button */}
              <div className="relative flex items-center">
                {activeTooltip === "quickview" && (
                  <span className="absolute right-[44px] whitespace-nowrap bg-[#171145] text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-md pointer-events-none animate-fadeIn z-30">
                    Quick view
                  </span>
                )}
                <button
                  type="button"
                  title="Quick View"
                  aria-label="Quick View"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onQuickView) onQuickView(product);
                  }}
                  onMouseEnter={() => setActiveTooltip("quickview")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="w-[38px] h-[38px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#171145] hover:text-[#0ea57a] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-gray-100/60"
                  style={{ animationDelay: "50ms" }}
                >
                  <Eye size={17} strokeWidth={1.8} />
                </button>
              </div>

              {/* Wishlist Button */}
              <div className="relative flex items-center">
                {activeTooltip === "wishlist" && (
                  <span className="absolute right-[44px] whitespace-nowrap bg-[#171145] text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-md pointer-events-none animate-fadeIn z-30">
                    {liked ? "In wishlist" : "Add to wishlist"}
                  </span>
                )}
                <button
                  type="button"
                  title={liked ? "Remove from wishlist" : "Add to wishlist"}
                  aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                  onClick={handleHeartClick}
                  onMouseEnter={() => setActiveTooltip("wishlist")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className={`w-[38px] h-[38px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-gray-100/60 ${
                    liked
                      ? "text-[#0ea57a]"
                      : "text-[#171145] hover:text-[#0ea57a]"
                  } ${heartBurst ? "animate-heart-burst" : ""}`}
                  style={{ animationDelay: "100ms" }}
                >
                  <Heart
                    size={17}
                    strokeWidth={1.8}
                    className={liked ? "fill-[#0ea57a]" : "fill-none"}
                  />
                </button>
              </div>

              {/* Compare Button */}
              <div className="relative flex items-center">
                {activeTooltip === "compare" && (
                  <span className="absolute right-[44px] whitespace-nowrap bg-[#171145] text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-md pointer-events-none animate-fadeIn z-30">
                    Compare
                  </span>
                )}
                <button
                  type="button"
                  title="Compare"
                  aria-label="Compare"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onCompare) onCompare(product);
                  }}
                  onMouseEnter={() => setActiveTooltip("compare")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="w-[38px] h-[38px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#171145] hover:text-[#0ea57a] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-gray-100/60 group/btn"
                  style={{ animationDelay: "150ms" }}
                >
                  <ArrowLeftRight
                    size={16}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover/btn:rotate-180"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Middle: Subtle divider + Delivery Info */}
          <div className="pt-2 border-t border-[#edf0f2]">
            <div className="flex items-center gap-2.5 text-[13.5px] text-[#2d3748] font-normal">
              <Truck
                size={17}
                strokeWidth={1.6}
                className="text-[#2d3748] shrink-0"
              />
              <span>{product.deliveryDays || "2 day delivery"}</span>
            </div>
          </div>

          {/* Bottom: Red CTA "Add to cart" with interactive click animation */}
          <div className="pt-2 relative">
            {/* Floating +1 Particle Effect */}
            {addedAnimation && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0ea57a] text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-float-up pointer-events-none shadow-md">
                +1 Added
              </span>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full h-[42px] font-medium text-[14.5px] rounded-[6px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] ${
                addedAnimation
                  ? "bg-[#16a34a] hover:bg-[#15803d] text-white"
                  : "bg-[#0ea57a] hover:bg-[#0b8462] text-white hover:shadow-[0_4px_14px_rgba(14, 165, 122, 0.35)]"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check size={17} strokeWidth={2.4} className="animate-scaleIn" />
                  <span>Added to cart</span>
                </>
              ) : (
                <span>Add to cart</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THUMBNAILS STRIP (Both Normal & Hover State)           */}
      {/* ======================================================== */}
      <div className="flex items-center gap-2 mt-3.5 mb-2 px-0.5">
        {product.thumbnails?.slice(0, 3).map((thumbSrc, idx) => {
          const isActive =
            selectedImage === thumbSrc ||
            (activeThumbIndex === idx && selectedImage === thumbSrc);
          return (
            <button
              type="button"
              key={idx}
              onClick={() => handleThumbSelect(thumbSrc, idx)}
              onMouseEnter={() => handleThumbSelect(thumbSrc, idx)}
              className={`w-[42px] h-[42px] rounded-[3px] flex items-center justify-center p-1 bg-white transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-[1.5px] border-[#171145] ring-1 ring-[#171145]"
                  : "border border-[#e5e7eb] hover:border-gray-400 hover:scale-105"
              }`}
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={thumbSrc}
                  alt={`${product.name} thumb ${idx + 1}`}
                  fill
                  sizes="42px"
                  className="object-contain"
                />
              </div>
            </button>
          );
        })}

        {/* Extra Thumbnails Badge ("+2" or "+1") */}
        {product.moreThumbnailsCount > 0 && (
          <button
            type="button"
            onClick={handleCycleImages}
            title="Click to view more images"
            aria-label={`+${product.moreThumbnailsCount} more photos`}
            className="w-[42px] h-[42px] rounded-[3px] border border-[#e5e7eb] bg-[#f1f3f5] hover:bg-[#e2e8f0] flex items-center justify-center text-[15px] font-semibold text-[#374151] select-none transition-all duration-200 cursor-pointer active:scale-95"
          >
            +{product.moreThumbnailsCount}
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. PRODUCT INFO: CATEGORIES, TITLE, PRICE                 */}
      {/* ======================================================== */}
      <div className="pt-1 flex flex-col flex-1">
        {/* Category Tags Line (Gray, Muted, 2 lines matching screenshot) */}
        <p
          className="text-[12.5px] text-[#718096] leading-[1.35] mb-1 font-normal line-clamp-2"
          title={product.categoryLine}
        >
          {product.categoryLine}
        </p>

        {/* Product Title (Blue link, Semibold, matching screenshot) */}
        <h3 className="text-[15.5px] font-semibold leading-[1.35] mb-2 flex-1">
          <Link
            href={`/product/${product.id}`}
            className="text-[#171145] hover:text-[#0ea57a] hover:underline transition-colors block"
            title={product.name}
          >
            {product.name}
          </Link>
        </h3>

        {/* Price (Bold, Dark Charcoal / Navy, matching screenshot) */}
        <div className="text-[22px] font-bold text-[#171145] tracking-tight leading-none mt-1">
          ${product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </article>
  );
}
