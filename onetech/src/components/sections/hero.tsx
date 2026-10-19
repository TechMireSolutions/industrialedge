"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-[#eff6fa] to-[#f9fcff] min-h-[480px] flex items-center py-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          {/* Text Column */}
          <div className="lg:pr-12">
            <h1 className="uppercase text-[36px] lg:text-[52px] font-normal text-[#212529] leading-tight mb-6">
              NEW ERA OF SMARTPHONES
            </h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[#212529] line-through mr-3 text-2xl">$530</span>
              <span className="text-[#df3b3b] text-3xl font-medium">$460</span>
            </div>
            <p className="text-black/50 mt-1 text-sm mb-6">Fold Duo Phone</p>
            <Link href="/shop">
              <button className="mt-6 inline-block bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white px-8 py-3 rounded-[5px] font-medium transition-colors">
                Shop Now
              </button>
            </Link>
          </div>

          {/* Image Column */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop&q=80"
              alt="Fold Duo Smartphone"
              className="max-h-[450px] object-contain"
              width={800}
              height={600}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
