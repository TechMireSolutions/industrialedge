"use client";

import Image from "next/image";
import Link from "next/link";

export default function GameConsoleBanner() {
  return (
    <section className="w-full relative overflow-hidden select-none mb-10 sm:mb-14 lg:mb-16">
      <div
        className="w-full relative bg-black bg-cover bg-center overflow-hidden h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] flex items-center group"
        style={{
          backgroundImage: "url('/images/bg2-home01.webp')",
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto h-full relative flex items-center">
          {/* TV Display Container (88% of banner height, perfectly framed inside neon circle) */}
          <div className="absolute left-[3%] sm:left-[6%] md:left-[10%] lg:left-[13%] xl:left-[15%] top-1/2 -translate-y-1/2 h-[88%] w-auto aspect-[746/740] z-10 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105">
            <Image
              src="/images/img-prd8.webp"
              alt="GameConsole Destiny Special Edition"
              width={746}
              height={740}
              priority
              className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
            />

            {/* Red Circular SALE 70% Badge pinned to top-right of TV screen */}
            <div className="absolute top-[16%] right-[2%] z-20">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#ff3d3d] text-white flex flex-col items-center justify-center shadow-md shadow-red-600/50 select-none">
                <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5">
                  SALE
                </span>
                <span className="text-[10px] sm:text-[12px] md:text-[14px] font-bold leading-none">
                  70%
                </span>
              </div>
            </div>
          </div>

          {/* Right Text Block (Single-line title, strike price, yellow price, shop now) */}
          <div className="relative z-20 pl-[45%] sm:pl-[44%] md:pl-[45%] lg:pl-[46%] xl:pl-[47%] pr-4 sm:pr-8 flex flex-col items-start justify-center">
            {/* Title - on one line on desktop */}
            <h2 className="text-white text-base sm:text-xl md:text-2xl lg:text-[32px] xl:text-[35px] font-normal tracking-normal leading-tight mb-1 sm:mb-2 whitespace-nowrap drop-shadow-sm font-sans">
              GameConsole Destiny Special Edition
            </h2>

            {/* Old Price */}
            <div className="text-white/70 text-xs sm:text-sm md:text-base font-light line-through tracking-wider mb-0.5 sm:mb-1">
              $99.000
            </div>

            {/* Current Price in Vivid Yellow */}
            <div className="text-[#ffdc00] text-xl sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[40px] font-bold tracking-tight leading-none mb-2 sm:mb-3.5 drop-shadow-sm">
              $80.000
            </div>

            {/* Shop Now CTA */}
            <Link
              href="/product-category/tv-computer-screen"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#ffdc00] text-xs sm:text-sm md:text-base font-semibold transition-colors duration-200 group/btn"
            >
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover/btn:text-[#ffdc00] transition-all duration-300 group-hover/btn:translate-x-1"
                aria-hidden="true"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216.5 165.5c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l112 112c9.4 9.4 9.4 24.6 0 33.9l-112 112c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L302.1 256 216.5 165.5z" />
              </svg>
              <span>Shop Now</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
