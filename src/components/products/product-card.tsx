"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { Heart, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showDrawerOnHover?: boolean;
}

const COLOR_SWATCHES = [
  { value: "#b19c83", label: "Taupe" },
  { value: "#000000", label: "Black" },
  { value: "#999999", label: "Silver" },
];

export default function ProductCard({ product, showDrawerOnHover = true }: ProductCardProps) {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [selectedColor, setSelectedColor] = useState<string>("#b19c83");

  const liked = isWishlisted(product.id);
  const heartClasses = [
    "absolute top-[18px] right-[18px] w-[36px] h-[36px] rounded-full bg-white shadow-[0_1px_5px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer transition-all duration-200 z-10",
    liked
      ? "opacity-100 visible text-[#df3b3b]"
      : "opacity-0 invisible group-hover:opacity-100 group-hover:visible text-[#cccccc] hover:text-[#df3b3b]",
  ].join(" ");

  const badgeClasses = [
    "absolute top-[18px] left-[18px] w-[36px] h-[36px] rounded-full flex items-center justify-center text-xs font-medium text-white z-10",
    product.status === "discount"
      ? "bg-[#df3b3b]"
      : product.status === "new"
      ? "bg-[#0e8ce4]"
      : "hidden",
  ].join(" ");

  const priceClasses = [
    "mt-3 text-base font-medium",
    product.status === "discount" ? "text-[#df3b3b]" : "text-black",
  ].join(" ");

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <article
      className={[
        "group relative bg-white pt-[25px] text-center transition-shadow duration-200",
        "hover:z-20 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-t-[5px]",
      ].join(" ")}
      style={{ height: "285px" }}
    >
      {/* Right divider border */}
      <div
        className="absolute top-[25px] right-0 w-[1px] h-[calc(100%-50px)] bg-[#e5e5e5] group-hover:opacity-0 transition-opacity"
      />

      {/* Status badge */}
      <div className={badgeClasses}>
        {product.status === "discount" ? "-25%" : "new"}
      </div>

      {/* Wishlist heart */}
      <button
        type="button"
        className={heartClasses}
        onClick={handleHeartClick}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} strokeWidth={2.5} fill={liked ? "#df3b3b" : "none"} />
      </button>

      {/* Thumbnail stage */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="h-[140px] flex items-center justify-center px-4 mx-auto mt-3">
          <Image
            src={product.image}
            alt={product.name}
            width={115}
            height={115}
            className="w-[115px] h-[115px] object-contain group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      {/* Price & Title */}
      <div className="px-3">
        <div className="flex justify-between items-baseline mt-3">
          <span className={priceClasses}>${product.price}</span>
          {product.status === "discount" && product.originalPrice && (
            <span className="text-xs font-normal text-black/50 line-through ml-2">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="mt-1 text-sm font-normal text-black hover:text-[#0e8ce4] transition-colors truncate px-1 text-left">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Hover-reveal action drawer */}
      {showDrawerOnHover ? (
        <div
          className="absolute left-0 top-full w-full bg-white shadow-[0_15px_25px_rgba(0,0,0,0.12)] rounded-b-[4px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 pt-3 pb-0"
        >
          {/* Color swatches */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                type="button"
                key={swatch.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(swatch.value);
                }}
                style={{ backgroundColor: swatch.value }}
                className={[
                  "w-3 h-3 rounded-full cursor-pointer ring-offset-1 transition-all",
                  selectedColor === swatch.value
                    ? "ring-2 ring-[#2b6cb0]"
                    : "ring-transparent hover:ring-1 hover:ring-gray-400",
                ].join(" ")}
                aria-label={swatch.label}
              />
            ))}
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full h-[40px] bg-[#2b6cb0] hover:bg-[#205493] text-white text-sm font-medium rounded-b-[4px] flex items-center justify-center transition-colors cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      ) : null}
    </article>
  );
}
