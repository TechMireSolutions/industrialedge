"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

export default function GameConsoleBanner() {
  const [data, setData] = useState({
    title: "GameConsole Destiny Special Edition",
    originalPrice: "$99.000",
    currentPrice: "$80.000",
    saleBadge: "SALE 70%",
    image: "/images/img-prd8.webp",
    backgroundImage: "/images/bg2-home01.webp",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=TV+%26+Computer+Screen",
  });

  useEffect(() => {
    api.getBanners().then((res) => {
      if (res?.gameConsoleBanner) {
        setData((prev) => ({ ...prev, ...res.gameConsoleBanner }));
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="w-full relative overflow-hidden select-none mb-10 sm:mb-14 lg:mb-16">
      <div
        className="w-full relative bg-black bg-cover bg-center overflow-hidden h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[520px] flex items-center group"
        style={{
          backgroundImage: `url('${data.backgroundImage || "/images/bg2-home01.webp"}')`,
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto h-full relative flex items-center">
          {/* TV Display Container (88% of banner height, perfectly framed inside neon circle) */}
          <div className="absolute left-[3%] sm:left-[6%] md:left-[10%] lg:left-[12%] xl:left-[14%] top-1/2 -translate-y-1/2 h-[88%] w-auto aspect-[746/740] z-10 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105">
            <Image
              src={data.image || "/images/img-prd8.webp"}
              alt={data.title}
              width={746}
              height={740}
              priority
              className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
            />

            {/* Circular SALE 70% Badge pinned to top-right of TV screen */}
            <div className="absolute top-[16%] right-[2%] z-20">
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full bg-[#0ea57a] text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/40 select-none">
                <span className="text-[8px] sm:text-[9px] md:text-[11px] font-bold uppercase tracking-wider leading-none mb-0.5">
                  SALE
                </span>
                <span className="text-[11px] sm:text-[13px] md:text-[16px] font-bold leading-none">
                  {data.saleBadge?.replace("SALE ", "") || "70%"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Text Block (Single-line title, strike price, yellow price, shop now) */}
          <div className="relative z-20 pl-[48%] sm:pl-[44%] md:pl-[45%] lg:pl-[46%] xl:pl-[47%] pr-3 sm:pr-8 flex flex-col items-start justify-center">
            {/* Title */}
            <h2 className="text-white text-[15px] sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-normal tracking-normal leading-tight mb-1 sm:mb-2.5 whitespace-normal sm:whitespace-nowrap drop-shadow-sm font-sans line-clamp-2 sm:line-clamp-none">
              {data.title}
            </h2>

            {/* Old Price */}
            <div className="text-white/70 text-[11px] sm:text-sm md:text-base lg:text-lg font-light line-through tracking-wider mb-0.5 sm:mb-1.5">
              {data.originalPrice}
            </div>

            {/* Current Price in Vivid Yellow */}
            <div className="text-[#ffdc00] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px] font-bold tracking-tight leading-none mb-3 sm:mb-4 lg:mb-5 drop-shadow-sm">
              {data.currentPrice}
            </div>

            {/* Shop Now CTA */}
            <Link
              href={data.ctaLink || "/shop?cat=TV+%26+Computer+Screen"}
              className="inline-flex items-center gap-2 text-white hover:text-[#ffdc00] text-xs sm:text-sm md:text-base lg:text-lg font-semibold transition-colors duration-200 group/btn"
            >
              <span>{data.ctaText || "Shop Now"}</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#ffdc00] transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
