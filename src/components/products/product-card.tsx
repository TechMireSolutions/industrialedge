"use client";

import { useState } from "react";

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
  const [selectedColor, setSelectedColor] = useState<string>("");

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
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
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
        className={heartClasses}
        onClick={handleHeartClick}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} strokeWidth={2.5} fill={liked ? "#df3b3b" : "none"} />
      </button>

      {/* Thumbnail stage */}
      <div className="h-[140px] flex items-center justify-center px-4 mx-auto mt-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-[115px] h-[115px] object-contain"
          loading="lazy"
        />
      </div>

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
        <h3 className="mt-1 text-sm font-normal text-black hover:text-[#0e8ce4] transition-colors truncate px-1">
          {product.name}
        </h3>
      </div>

      {/* Hover-reveal action drawer */}
      {showDrawerOnHover ? (
        <div
          className="absolute left-0 top-full w-full bg-white pt-3 shadow-[0_15px_25px_rgba(0,0,0,0.1)] rounded-b-[5px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20"
        >
          <div className="px-4 pb-4">
            {/* Color swatches */}
            <div className="flex items-center justify-center gap-3 mb-3">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.value}
                  onClick={() => setSelectedColor(swatch.value)}
                  className={[
                    "w-3.5 h-3.5 rounded-full cursor-pointer ring-offset-2 transition-all",
                    selectedColor === swatch.value
                      ? "ring-2 ring-[#0e8ce4]"
                      : "ring-transparent hover:ring-2 ring-[#0e8ce4]/40",
                    "bg-[".concat(swatch.value, "]"),
                  ].join(" ")}
                  aria-label={swatch.label}
                />
              ))}
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className="mt-3 w-full h-[44px] bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white text-base font-normal rounded-b-[5px] transition-colors cursor-pointer flex items-center justify-center gap-2"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={18} strokeWidth={2} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
