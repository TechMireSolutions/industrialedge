"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="bg-[#eff6fa] py-20 border-y border-[#e5e5e5]">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Image: MacBook / laptop spotlight */}
          <div className="flex justify-center lg:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop&q=80"
              alt="MacBook Air laptop"
              className="max-h-[300px] object-contain"
              width={600}
              height={400}
            />
          </div>

          {/* Content */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <span className="text-[10px] uppercase text-[#0e8ce4] font-medium tracking-wider mb-2">
              Limited Offer
            </span>
            <h2 className="text-[32px] font-normal text-[#212529] leading-tight mb-4">
              MacBook Air — Power that goes anywhere.
            </h2>
            <div className="flex items-center gap-2 text-xs text-black/50 mb-6">
              <Star size={14} strokeWidth={2} fill="#df3b3b" />
              <span>4.9</span>
              <span className="ml-1">(128 reviews)</span>
            </div>
            <Link href="/shop">
              <button className="w-fit bg-[#0e8ce4] text-white px-6 py-2.5 rounded-[5px] text-sm font-medium hover:bg-[#0e8ce4]/80 transition-colors">
                Explore
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
