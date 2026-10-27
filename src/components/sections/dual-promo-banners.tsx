"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DualPromoBanners() {
  return (
    <section className="w-full bg-[#f8f9fa] pb-12 lg:pb-16 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#eef3f8] via-[#e2ebf4] to-[#d6e3f0] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-200/60 shadow-sm">
          {/* Left Text */}
          <div className="max-w-md text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#004ec3] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <span>SAVE</span>
              <span>$80.00</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e2d3b] tracking-tight leading-tight mb-2">
              Shop and <span className="text-[#004ec3]">SAVE BIG</span>
            </h2>
            <p className="text-lg text-[#555e68] font-normal mb-6">
              on the hottest professional 4K camera gear
            </p>

            <Link
              href="/shop?cat=Camera+%26+Video"
              className="inline-flex items-center gap-2 bg-[#1e2d3b] hover:bg-[#004ec3] text-white font-semibold px-8 py-3.5 rounded-full transition-colors duration-200 shadow-md"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Dual Camera Images */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 z-10 w-full max-w-lg">
            <div className="relative w-28 sm:w-56 h-24 sm:h-48 flex items-center justify-center">
              <Image
                src="/images/img-prd16.webp"
                alt="Camera Body"
                width={240}
                height={200}
                className="w-full h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative w-24 sm:w-52 h-20 sm:h-44 flex items-center justify-center">
              <Image
                src="/images/img-prd15.webp"
                alt="Camera Lens"
                width={220}
                height={180}
                className="w-full h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
