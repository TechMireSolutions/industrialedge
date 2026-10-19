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
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&q=80",
    category: "Smartphones & Tablets",
    rating: 4.8,
  },
  {
    id: "f2",
    name: "Pulse Headphones",
    price: 379,
    status: "none",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop&q=80",
    category: "Audio & Video",
    rating: 4.7,
  },
  {
    id: "f3",
    name: "Lumo M10 Camera",
    price: 225,
    status: "none",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop&q=80",
    category: "Cameras & Photos",
    rating: 4.6,
  },
  {
    id: "f4",
    name: "Skylite Drone",
    price: 379,
    status: "new",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&h=300&fit=crop&q=80",
    category: "Gadgets",
    rating: 4.9,
  },
  {
    id: "f5",
    name: "Pocket Player",
    price: 379,
    status: "new",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop&q=80",
    category: "Gadgets",
    rating: 4.5,
  },
  {
    id: "f6",
    name: "Fold Duo Phone",
    price: 225,
    originalPrice: 300,
    status: "discount",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop&q=80",
    category: "Smartphones & Tablets",
    rating: 4.7,
  },
  {
    id: "f7",
    name: "Nova X Phone",
    price: 379,
    status: "none",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop&q=80",
    category: "Smartphones & Tablets",
    rating: 4.4,
  },
  {
    id: "f8",
    name: "Charge 10K",
    price: 225,
    status: "none",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&q=80",
    category: "Computers & Laptops",
    rating: 4.9,
  },
  {
    id: "f10",
    name: "Pixel Watch 2",
    price: 299,
    originalPrice: 349,
    status: "discount",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&q=80",
    category: "Gadgets",
    rating: 4.6,
  },
  {
    id: "f11",
    name: "Gaming Console X",
    price: 499,
    status: "none",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=300&fit=crop&q=80",
    category: "Video Games & Consoles",
    rating: 4.8,
  },
  {
    id: "f12",
    name: "4K OLED TV 65\"",
    price: 1299,
    originalPrice: 1499,
    status: "discount",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&h=300&fit=crop&q=80",
    category: "TV & Audio",
    rating: 4.7,
  },
  {
    id: "f13",
    name: "Mechanical Keyboard",
    price: 145,
    status: "none",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&h=300&fit=crop&q=80",
    category: "Accessories",
    rating: 4.5,
  },
  {
    id: "f14",
    name: "Smart Home Hub",
    price: 79,
    originalPrice: 99,
    status: "discount",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300&h=300&fit=crop&q=80",
    category: "Gadgets",
    rating: 4.4,
  },
  {
    id: "f15",
    name: "Wireless Earbuds Pro",
    price: 129,
    status: "new",
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=300&h=300&fit=crop&q=80",
    category: "Audio & Video",
    rating: 4.8,
  },
  {
    id: "f16",
    name: "Ultrawide Monitor 34",
    price: 549,
    originalPrice: 649,
    status: "discount",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&h=300&fit=crop&q=80",
    category: "Computers & Laptops",
    rating: 4.7,
  },
];

const TABS = ["Featured", "On Sale", "Best Rated"] as const;
type TabType = (typeof TABS)[number];

interface TabbedProductGridProps {
  colSpan?: number;
}

export default function TabbedProductGrid({ colSpan = 8 }: TabbedProductGridProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Featured");
  const [currentPage, setCurrentPage] = useState(0);
  const { toggleWishlist, isWishlisted } = useStore();

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
                  ? "text-[#212529] font-bold border-b-2 border-[#0e8ce4] -mb-[1px]"
                  : "text-[#828282] font-medium border-b-2 border-transparent hover:text-[#0e8ce4]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4 cols x 2 rows segmented product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-[6px] border border-[#f0f0f0] overflow-hidden">
          {displayItems.slice(0, 8).map((product, index) => {
            const isRightBorder = index % 4 !== 3;
            const isBottomBorder = index < 4;
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className={`p-4 sm:p-5 relative group flex flex-col items-center justify-between transition-shadow hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:z-10 bg-white ${
                  isRightBorder ? "border-r border-[#f0f0f0]" : ""
                } ${isBottomBorder ? "border-b border-[#f0f0f0]" : ""}`}
              >
                {/* Status Badges */}
                {product.status === "discount" && (
                  <span className="absolute top-2.5 left-2.5 w-[26px] h-[26px] rounded-full bg-[#df3b3b] text-white text-[10px] font-bold flex items-center justify-center shadow-xs z-10">
                    -25%
                  </span>
                )}
                {product.status === "new" && (
                  <span className="absolute top-2.5 left-2.5 w-[26px] h-[26px] rounded-full bg-[#0e8ce4] text-white text-[9px] font-bold flex items-center justify-center shadow-xs z-10">
                    new
                  </span>
                )}

                {/* Wishlist Heart */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1 rounded-full transition-all duration-200 z-10 cursor-pointer ${
                    liked
                      ? "text-[#df3b3b] opacity-100"
                      : "text-[#d1d5db] opacity-0 group-hover:opacity-100 hover:text-[#df3b3b]"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={15} fill={liked ? "#df3b3b" : "none"} strokeWidth={2} />
                </button>

                {/* Thumbnail */}
                <Link href={`/product/${product.id}`} className="w-full flex justify-center">
                  <div className="h-[120px] w-full flex items-center justify-center my-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={110}
                      height={110}
                      className="max-h-[110px] max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Link>

                {/* Price */}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-center">
                  {product.status === "discount" ? (
                    <>
                      <span className="text-sm sm:text-base font-bold text-[#df3b3b]">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#828282] line-through font-normal">
                          ${product.originalPrice}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm sm:text-base font-bold text-[#212529]">
                      ${product.price}
                    </span>
                  )}
                </div>

                {/* Title */}
                <Link href={`/product/${product.id}`} className="block w-full text-center">
                  <h3 className="mt-1 text-xs text-[#212529] font-medium hover:text-[#0e8ce4] transition-colors truncate px-1">
                    {product.name}
                  </h3>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
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
