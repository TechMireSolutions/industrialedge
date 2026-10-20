"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Heart } from "lucide-react";

export interface TabProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  status: "none" | "discount" | "new";
  image: string;
  category: string;
  rating?: number;
}

const FEATURED_PAGE_1: TabProduct[] = [
  {
    id: "f1",
    name: "Slate 10 Tablet",
    price: 225,
    originalPrice: 300,
    status: "discount",
    image: "/images/featured_1.png",
    category: "Smartphones & Tablets",
    rating: 4.8,
  },
  {
    id: "f2",
    name: "Pulse Headphones",
    price: 379,
    status: "none",
    image: "/images/featured_3.png",
    category: "Audio & Video",
    rating: 4.7,
  },
  {
    id: "f3",
    name: "Lumo M10 Camera",
    price: 225,
    status: "none",
    image: "/images/featured_5.png",
    category: "Cameras & Photos",
    rating: 4.6,
  },
  {
    id: "f4",
    name: "Skylite Drone",
    price: 379,
    status: "new",
    image: "/images/featured_7.png",
    category: "Gadgets",
    rating: 4.9,
  },
  {
    id: "f5",
    name: "Pocket Player",
    price: 379,
    status: "new",
    image: "/images/featured_2.png",
    category: "Gadgets",
    rating: 4.5,
  },
  {
    id: "f6",
    name: "Fold Duo Phone",
    price: 225,
    originalPrice: 300,
    status: "discount",
    image: "/images/featured_4.png",
    category: "Smartphones & Tablets",
    rating: 4.7,
  },
  {
    id: "f7",
    name: "Nova X Phone",
    price: 379,
    status: "none",
    image: "/images/featured_6.png",
    category: "Smartphones & Tablets",
    rating: 4.4,
  },
  {
    id: "f8",
    name: "Charge 10K",
    price: 225,
    status: "none",
    image: "/images/featured_8.png",
    category: "Accessories",
    rating: 4.3,
  },
];

const FEATURED_PAGE_2: TabProduct[] = [
  {
    id: "f9",
    name: "MacBook Air M3",
    price: 1099,
    status: "new",
    image: "/images/banner_product.png",
    category: "Computers & Laptops",
    rating: 4.9,
  },
  {
    id: "f10",
    name: "Pixel Watch 2",
    price: 299,
    originalPrice: 349,
    status: "discount",
    image: "/images/popular_1.png",
    category: "Gadgets",
    rating: 4.6,
  },
  {
    id: "f11",
    name: "Wireless Speaker Pro",
    price: 189,
    status: "none",
    image: "/images/best_1.png",
    category: "Audio & Video",
    rating: 4.8,
  },
  {
    id: "f12",
    name: "Smart TV 55 4K",
    price: 649,
    originalPrice: 799,
    status: "discount",
    image: "/images/best_2.png",
    category: "TV & Audio",
    rating: 4.7,
  },
  {
    id: "f13",
    name: "Power Station Ultra",
    price: 499,
    status: "new",
    image: "/images/best_3.png",
    category: "Accessories",
    rating: 4.5,
  },
  {
    id: "f14",
    name: "Gaming Headset RGB",
    price: 129,
    originalPrice: 159,
    status: "discount",
    image: "/images/best_4.png",
    category: "Video Games & Consoles",
    rating: 4.4,
  },
  {
    id: "f15",
    name: "Smart Security Cam",
    price: 99,
    status: "new",
    image: "/images/best_5.png",
    category: "Gadgets",
    rating: 4.8,
  },
  {
    id: "f16",
    name: "Wireless Earbuds Air",
    price: 149,
    originalPrice: 199,
    status: "discount",
    image: "/images/best_6.png",
    category: "Audio & Video",
    rating: 4.7,
  },
];

const TABS = ["Featured", "On Sale", "Best Rated"] as const;
type TabType = (typeof TABS)[number];

interface TabbedProductGridProps {
  colSpan?: number;
}

function ProductCardItem({
  product,
  isMobileRightBorder,
  isMobileBottomBorder,
  isDesktopRightBorder,
  isDesktopBottomBorder,
  priority,
}: {
  product: TabProduct;
  isMobileRightBorder: boolean;
  isMobileBottomBorder: boolean;
  isDesktopRightBorder: boolean;
  isDesktopBottomBorder: boolean;
  priority?: boolean;
}) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const [selectedColor, setSelectedColor] = useState("#b19c83");
  const liked = isWishlisted(product.id);

  return (
    <div
      className={`relative h-[255px] ${
        isMobileRightBorder ? "border-r sm:border-r-0" : ""
      } ${isMobileBottomBorder ? "border-b sm:border-b-0" : ""} ${
        isDesktopRightBorder ? "sm:border-r" : "sm:border-r-0"
      } ${isDesktopBottomBorder ? "sm:border-b" : "sm:border-b-0"} border-[#f0f0f0]`}
    >
      <div className="group absolute top-0 left-0 right-0 bg-white hover:z-30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] rounded-[4px] p-4 flex flex-col items-center transition-all duration-150">
        {/* Status Badges */}
        {product.status === "discount" && (
          <span className="absolute top-2.5 left-2.5 w-[28px] h-[28px] rounded-full bg-[#df3b3b] text-white text-[10px] font-bold flex items-center justify-center shadow-xs z-10 select-none">
            -25%
          </span>
        )}
        {product.status === "new" && (
          <span className="absolute top-2.5 left-2.5 w-[28px] h-[28px] rounded-full bg-[#0e8ce4] text-white text-[9px] font-bold flex items-center justify-center shadow-xs z-10 select-none">
            new
          </span>
        )}

        {/* Wishlist Heart Button with circular white disc */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] border border-[#eeeeee] flex items-center justify-center transition-all duration-150 cursor-pointer z-20 ${
            liked
              ? "text-[#df3b3b] opacity-100"
              : "text-[#b0b0b0] opacity-0 group-hover:opacity-100 hover:text-[#df3b3b] hover:shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
          }`}
          aria-label="Wishlist"
        >
          <Heart size={15} fill={liked ? "#df3b3b" : "none"} strokeWidth={1.8} />
        </button>

        {/* Thumbnail */}
        <Link href={`/product/${product.id}`} className="w-full flex justify-center">
          <div className="h-[115px] w-full flex items-center justify-center mt-1 mb-2">
            <Image
              src={product.image}
              alt={product.name}
              width={115}
              height={115}
              className="max-h-[110px] max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-200"
              priority={priority}
            />
          </div>
        </Link>

        {/* Price */}
        <div className="mt-1 flex items-baseline justify-center gap-1.5 text-center">
          {product.status === "discount" ? (
            <>
              <span className="text-[17px] font-medium text-[#df3b3b]">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#828282] line-through font-normal ml-1">
                  ${product.originalPrice}
                </span>
              )}
            </>
          ) : (
            <span className="text-[17px] font-medium text-[#212529]">
              ${product.price}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block w-full text-center">
          <h3 className="mt-1 text-xs sm:text-[13px] text-[#212529] font-normal hover:text-[#0e8ce4] transition-colors truncate px-1">
            {product.name}
          </h3>
        </Link>

        {/* Extras revealed on hover */}
        <div className="w-full flex flex-col items-center max-h-0 opacity-0 overflow-hidden group-hover:max-h-[130px] group-hover:opacity-100 group-hover:overflow-visible transition-all duration-150 ease-in-out">
          {/* Color radio options */}
          <div className="flex items-center justify-center gap-2 mt-3 mb-3">
            {[
              { color: "#b19c83", label: "Gold / Beige" },
              { color: "#000000", label: "Black" },
              { color: "#999999", label: "Silver / Gray" },
            ].map((swatch) => (
              <button
                key={swatch.color}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(swatch.color);
                }}
                style={{ backgroundColor: swatch.color }}
                className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform hover:scale-125 relative flex items-center justify-center ${
                  selectedColor === swatch.color ? "ring-1 ring-offset-1 ring-[#2e6eb7]" : ""
                }`}
                aria-label={`Select ${swatch.label}`}
              />
            ))}
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-[calc(100%+2rem)] -mx-4 -mb-4 h-11 bg-[#2e6eb7] hover:bg-[#255b99] text-white text-sm font-medium flex items-center justify-center rounded-b-[4px] cursor-pointer transition-colors shadow-xs"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TabbedProductGrid({ colSpan = 8 }: TabbedProductGridProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Featured");
  const [currentPage, setCurrentPage] = useState(0);

  const allItems = [...FEATURED_PAGE_1, ...FEATURED_PAGE_2];

  let displayItems: TabProduct[] = [];
  if (activeTab === "Featured") {
    displayItems = currentPage === 0 ? FEATURED_PAGE_1 : FEATURED_PAGE_2;
  } else if (activeTab === "On Sale") {
    const saleItems = allItems.filter((p) => p.status === "discount");
    displayItems = saleItems.slice(currentPage * 8, (currentPage + 1) * 8);
    if (displayItems.length === 0) displayItems = saleItems.slice(0, 8);
  } else {
    // Best Rated
    const ratedItems = [...allItems].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    displayItems = ratedItems.slice(currentPage * 8, (currentPage + 1) * 8);
  }

  return (
    <section className={colSpan === 8 ? "lg:col-span-8 flex flex-col justify-between" : "lg:col-span-12 flex flex-col justify-between"}>
      <div>
        {/* Tab Header Bar */}
        <div className="flex items-center gap-8 border-b border-[#e5e5e5] mb-6">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(0);
              }}
              className={`pb-3 text-base transition-all relative cursor-pointer ${
                activeTab === tab
                  ? "text-[#212529] font-medium border-b-2 border-[#0e8ce4] -mb-[1px]"
                  : "text-[#828282] font-normal border-b-2 border-transparent hover:text-[#0e8ce4]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4 cols x 2 rows segmented product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-[4px] border border-[#f0f0f0]">
          {displayItems.slice(0, 8).map((product, index) => {
            const isMobileRightBorder = index % 2 === 0;
            const isMobileBottomBorder = index < 6;
            const isDesktopRightBorder = index % 4 !== 3;
            const isDesktopBottomBorder = index < 4;

            return (
              <ProductCardItem
                key={`${product.id}-${index}`}
                product={product}
                isMobileRightBorder={isMobileRightBorder}
                isMobileBottomBorder={isMobileBottomBorder}
                isDesktopRightBorder={isDesktopRightBorder}
                isDesktopBottomBorder={isDesktopBottomBorder}
                priority={index < 4}
              />
            );
          })}
        </div>
      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-10">
        <button
          type="button"
          onClick={() => setCurrentPage(0)}
          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
            currentPage === 0
              ? "bg-[#0e8ce4] scale-110"
              : "bg-[#d1d5db] hover:bg-[#b0b0b0]"
          }`}
          aria-label="Page 1"
        />
        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
            currentPage === 1
              ? "bg-[#0e8ce4] scale-110"
              : "bg-[#d1d5db] hover:bg-[#b0b0b0]"
          }`}
          aria-label="Page 2"
        />
      </div>
    </section>
  );
}
