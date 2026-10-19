"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const TABS = ["Top 20", "Audio & Video", "Laptops & Computers"];

interface BestSellerItem {
  id: string;
  image: string;
  category: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  productId: string;
}

const BEST_SELLERS_DATA: Record<string, BestSellerItem[]> = {
  "Top 20": [
    {
      id: "bs1",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop&q=80",
      category: "Audio",
      title: "Studio Pro Headphones",
      price: 225,
      originalPrice: 300,
      rating: 4.7,
      productId: "p2",
    },
    {
      id: "bs2",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop&q=80",
      category: "Computers",
      title: "MacBook Air M3",
      price: 1099,
      rating: 4.9,
      productId: "p3",
    },
    {
      id: "bs3",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop&q=80",
      category: "Gadgets",
      title: "Pixel Watch 2",
      price: 299,
      originalPrice: 349,
      rating: 4.3,
      productId: "p4",
    },
    {
      id: "bs4",
      image: "https://images.unsplash.com/photo-1606181954474-675108d74477?w=300&h=200&fit=crop&q=80",
      category: "Gaming",
      title: "Gaming Console X",
      price: 499,
      rating: 4.8,
      productId: "p5",
    },
  ],
  "Audio & Video": [
    {
      id: "bs5",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop&q=80",
      category: "Audio",
      title: "Studio Pro Headphones",
      price: 225,
      originalPrice: 300,
      rating: 4.7,
      productId: "p2",
    },
    {
      id: "bs6",
      image: "https://images.unsplash.com/photo-1593358286211-6456f959b68f?w=300&h=200&fit=crop&q=80",
      category: "TV & Audio",
      title: '4K OLED TV 65"',
      price: 1299,
      originalPrice: 1499,
      rating: 4.6,
      productId: "p6",
    },
    {
      id: "bs7",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a889?w=300&h=200&fit=crop&q=80",
      category: "Audio",
      title: "Wireless Earbuds Pro",
      price: 129,
      rating: 4.5,
      productId: "p10",
    },
    {
      id: "bs8",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=300&h=200&fit=crop&q=80",
      category: "Gadgets",
      title: "Smart Home Audio Hub",
      price: 79,
      originalPrice: 99,
      rating: 4.2,
      productId: "p9",
    },
  ],
  "Laptops & Computers": [
    {
      id: "bs9",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop&q=80",
      category: "Computers",
      title: "MacBook Air M3",
      price: 1099,
      rating: 4.9,
      productId: "p3",
    },
    {
      id: "bs10",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942dacac?w=300&h=200&fit=crop&q=80",
      category: "Monitors",
      title: "Ultrawide Monitor 34",
      price: 549,
      originalPrice: 649,
      rating: 4.6,
      productId: "p11",
    },
    {
      id: "bs11",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b82a339?w=300&h=200&fit=crop&q=80",
      category: "Accessories",
      title: "Mechanical Keyboard",
      price: 145,
      rating: 4.4,
      productId: "p8",
    },
    {
      id: "bs12",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=200&fit=crop&q=80",
      category: "Smartphones",
      title: "Fold Duo Smartphone",
      price: 460,
      originalPrice: 530,
      rating: 4.5,
      productId: "p1",
    },
  ],
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} size={12} strokeWidth={1.5} fill="#df3b3b" className="text-[#df3b3b]" />
      ))}
      {half && <Star size={12} strokeWidth={1.5} fill="#df3b3b" className="text-[#df3b3b]" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={i} size={12} strokeWidth={1.5} className="text-[#e5e5e5]" />
      ))}
      <span className="ml-1 text-xs text-black/50">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState("Top 20");
  const items = BEST_SELLERS_DATA[activeTab] || BEST_SELLERS_DATA["Top 20"];

  return (
    <section className="bg-[#eff6fa] py-14 border-y border-[#e5e5e5]">
      <div className="container">
        <h2 className="text-lg font-medium text-black mb-8 text-center">Best Sellers</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeTab === t
                  ? "bg-[#0e8ce4] text-white shadow-[0_1px_5px_rgba(0,0,0,0.1)]"
                  : "bg-white border border-[#e5e5e5] text-black/50 hover:text-[#0e8ce4]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Horizontal media cards: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.productId}`}
              className="bg-white border border-[#e5e5e5] rounded-[5px] overflow-hidden flex hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all group"
            >
              <div className="w-[150px] h-[100px] flex-shrink-0 bg-[#f2f4f8] flex items-center justify-center p-3 border-r border-[#e5e5e5]">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  width={150}
                  height={100}
                />
              </div>
              <div className="p-4 flex flex-col justify-center">
                <span className="text-[10px] uppercase text-[#0e8ce4] font-medium block mb-1">
                  {item.category}
                </span>
                <h3 className="text-sm font-medium text-black leading-tight mb-2 group-hover:text-[#0e8ce4] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={item.rating} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-medium text-[#df3b3b]">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-black/50 line-through ml-1">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
