"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function DualPromoBanners() {
  const [banner, setBanner] = useState({
    badgeText: "SAVE Rs. 22,400",
    title: "Shop and SAVE BIG",
    titleHighlight: "SAVE BIG",
    subtitle: "on the hottest professional 4K camera gear",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=Camera+%26+Video",
    image1: "/images/img-prd16.webp",
    image2: "/images/img-prd15.webp",
  });

  useEffect(() => {
    api
      .getBanners()
      .then((res) => {
        if (res?.dualPromoBanner) {
          setBanner((prev) => ({ ...prev, ...res.dualPromoBanner }));
        }
      })
      .catch(() => {});
  }, []);

  const titleParts =
    banner.titleHighlight && banner.title.includes(banner.titleHighlight)
      ? banner.title.split(banner.titleHighlight)
      : null;

  return (
    <section className="w-full bg-[#f8f9fa] pb-12 lg:pb-16 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#eef3f8] via-[#e2ebf4] to-[#d6e3f0] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-200/60 shadow-sm">
          {/* Left Text */}
          <div className="max-w-md text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#0ea57a] text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
              <span>{banner.badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171145] tracking-tight leading-tight mb-2">
              {titleParts ? (
                <>
                  {titleParts[0]}
                  <span className="text-[#0ea57a]">{banner.titleHighlight}</span>
                  {titleParts[1]}
                </>
              ) : (
                banner.title
              )}
            </h2>
            <p className="text-lg text-[#475569] font-normal mb-6">{banner.subtitle}</p>

            <Link
              href={banner.ctaLink || "/shop?cat=Camera+%26+Video"}
              className="inline-flex items-center gap-2 bg-[#171145] hover:bg-[#0ea57a] text-white font-semibold px-8 py-3.5 rounded-full transition-colors duration-200 shadow-md"
            >
              <span>{banner.ctaText || "Shop Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Dual Camera Images */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 z-10 w-full max-w-lg">
            <div className="relative w-28 sm:w-56 h-24 sm:h-48 flex items-center justify-center">
              <Image
                src={banner.image1 || "/images/img-prd16.webp"}
                alt="Camera Body"
                width={240}
                height={200}
                className="w-full h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative w-24 sm:w-52 h-20 sm:h-44 flex items-center justify-center">
              <Image
                src={banner.image2 || "/images/img-prd15.webp"}
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
