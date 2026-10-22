"use client";

import Image from "next/image";
import Link from "next/link";

export default function GameConsoleBanner() {
  return (
    <section className="w-full relative overflow-hidden select-none mb-10 sm:mb-14 lg:mb-16">
      {/* Banner Container with exact background image matching Onsus demo reference */}
      <div
        className="w-full relative bg-black bg-cover bg-center overflow-hidden min-h-[250px] sm:min-h-[290px] md:min-h-[320px] lg:min-h-[350px] flex items-center group"
        style={{
          backgroundImage: "url('/images/bg2-home01.webp')",
        }}
      >
        {/* Full-width interactive wrapper */}
        <div className="w-full max-w-[1920px] mx-auto relative px-4 sm:px-8 lg:px-14 py-8 sm:py-10 flex items-center justify-between">
          
          {/* Left TV Showcase with SALE 70% Badge (positioned over neon circle) */}
          <div className="absolute left-[2%] sm:left-[5%] md:left-[8%] lg:left-[11%] xl:left-[13%] bottom-[-8px] sm:bottom-[-14px] md:bottom-[-18px] lg:bottom-[-22px] w-[200px] sm:w-[280px] md:w-[350px] lg:w-[420px] xl:w-[460px] z-10 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            {/* Red Circular SALE 70% Badge pinned to top-right of the TV */}
            <div className="absolute top-[8%] right-[8%] sm:right-[7%] z-20">
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#ff3d3d] text-white flex flex-col items-center justify-center shadow-md shadow-red-600/40 select-none">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5">
                  SALE
                </span>
                <span className="text-[11px] sm:text-[13px] md:text-[15px] font-bold leading-none">
                  70%
                </span>
              </div>
            </div>

            {/* Curved TV Display Image */}
            <Image
              src="/images/img-prd8.webp"
              alt="GameConsole Destiny Special Edition"
              width={746}
              height={740}
              priority
              className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Right Text Content Block */}
          <div className="relative z-20 w-full pl-[190px] sm:pl-[275px] md:pl-[44%] lg:pl-[47%] xl:pl-[48%] flex flex-col items-start justify-center">
            {/* Title */}
            <h2 className="text-white text-base sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[36px] font-normal sm:font-medium tracking-tight leading-tight sm:leading-snug mb-1 sm:mb-2 max-w-xl">
              GameConsole Destiny Special Edition
            </h2>

            {/* Old Strike-through Price */}
            <div className="text-white/80 text-xs sm:text-sm md:text-base font-light line-through tracking-wider mb-0.5 sm:mb-1">
              $99.000
            </div>

            {/* Current Price in Vibrant Yellow */}
            <div className="text-[#ffdc00] text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight leading-none mb-2.5 sm:mb-4">
              $80.000
            </div>

            {/* Call To Action: Shop Now with Chevron Circle Right Icon */}
            <Link
              href="/product-category/tv-computer-screen"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#ffdc00] text-xs sm:text-sm md:text-base font-semibold transition-colors duration-200 group/btn py-1"
            >
              {/* Exact FontAwesome fa-chevron-circle-right SVG icon matching original theme */}
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
