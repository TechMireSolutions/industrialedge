"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Heart } from "lucide-react";

const TRENDS = [
  {
    id: "t1",
    name: "Smartphone X",
    price: 699,
    status: "discount" as const,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop&q=80",
  },
  {
    id: "t2",
    name: "Headphones Pro",
    price: 199,
    status: "new" as const,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&q=80",
  },
  {
    id: "t3",
    name: "Smart Watch",
    price: 249,
    status: "none" as const,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80",
  },
  {
    id: "t4",
    name: "Camera EOS",
    price: 899,
    status: "new" as const,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b2440326?w=200&h=200&fit=crop&q=80",
  },
  {
    id: "t5",
    name: "Gaming Console",
    price: 499,
    status: "discount" as const,
    image: "https://images.unsplash.com/photo-1606181954474-675108d74477?w=200&h=200&fit=crop&q=80",
  },
  {
    id: "t6",
    name: "Earbuds Mini",
    price: 129,
    status: "none" as const,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a889?w=200&h=200&fit=crop&q=80",
  },
];

const BADGE_CLASS: Record<string, string> = {
  discount: "bg-[#df3b3b]",
  new: "bg-[#0e8ce4]",
};

export default function TrendsRecentlyViewed() {
  const { toggleWishlist, isWishlisted } = useStore();

  return (
    <section className="py-12 bg-white border-y border-[#e5e5e5]">
      <div className="container">
        <h2 className="text-lg font-medium text-black mb-8 text-center">Trends & Recently Viewed</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRENDS.map((item) => {
            const liked = isWishlisted(item.id);
            const badgeClass = item.status !== "none" ? BADGE_CLASS[item.status] : "";
            const heartClass = `absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-[0_1px_5px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer transition-all ${liked ? "opacity-100 visible text-[#df3b3b]" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible text-[#cccccc] hover:text-[#df3b3b]"}`;

            return (
              <div
                key={item.id}
                className="relative group flex flex-col items-center gap-2"
              >
                <Link href="/shop" className="block">
                  <div className="relative w-[100px] h-[100px] bg-[#f2f4f8] rounded-[5px] overflow-hidden border border-[#e5e5e5]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      width={100}
                      height={100}
                    />
                    {item.status !== "none" && (
                      <div className={`absolute top-2 left-2 w-[28px] h-[28px] rounded-full flex items-center justify-center text-xs font-medium text-white ${badgeClass}`}>
                        {item.status === "discount" ? "-25%" : "new"}
                      </div>
                    )}
                  </div>
                </Link>
                <Link href="/shop">
                  <span className="text-xs font-medium text-black text-center w-[90px] truncate block hover:text-[#0e8ce4] transition-colors">
                    {item.name}
                  </span>
                </Link>
                <span className="text-xs text-[#df3b3b] font-medium">${item.price}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className={heartClass}
                  aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={12} strokeWidth={2} fill={liked ? "#df3b3b" : "none"} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
