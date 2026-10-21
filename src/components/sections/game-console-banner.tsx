"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GameConsoleBanner() {
  return (
    <section className="w-full bg-[#f8f9fa] pb-12 lg:pb-16 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#181d24] via-[#212832] to-[#12161c] text-white p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          {/* Subtle Ambient Light Effect */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#004ec3]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Block */}
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#ff3d3d] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <span>SALE</span>
              <span>70%</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              GameConsole Destiny
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Special Edition
              </span>
            </h2>

            <div className="flex items-baseline justify-center md:justify-start gap-4 mb-6">
              <span className="text-gray-400 text-lg line-through">$99.00</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00c389]">$80.00</span>
            </div>

            <Link
              href="/category/video-games"
              className="inline-flex items-center gap-2 bg-[#004ec3] hover:bg-[#003da0] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Showcase Image */}
          <div className="relative z-10 w-full max-w-[440px] flex items-center justify-center">
            <Image
              src="/images/img-prd8.webp"
              alt="GameConsole Destiny Special Edition"
              width={480}
              height={320}
              className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
