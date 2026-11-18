"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api, type BannerSettings } from "@/lib/api";

export default function DualPromoBanners() {
  const [banner, setBanner] = useState<BannerSettings["dualPromoBanner"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBanners()
      .then((res) => {
        if (res?.dualPromoBanner) {
          setBanner(res.dualPromoBanner);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-[#f8f9fa] pb-12 lg:pb-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="h-[260px] rounded-2xl bg-slate-200/70 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!banner) return null;

  const titleParts =
    banner.titleHighlight && banner.title.includes(banner.titleHighlight)
      ? banner.title.split(banner.titleHighlight)
      : null;

  return (
    <section className="w-full bg-[#f8f9fa] pb-12 lg:pb-16 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#eef3f8] via-[#e2ebf4] to-[#d6e3f0] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-200/60 shadow-sm">
          <div className="max-w-md text-center md:text-left z-10">
            {banner.badgeText && (
              <div className="inline-flex items-center gap-1.5 bg-[#0ea57a] text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                <span>{banner.badgeText}</span>
              </div>
            )}

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
              href={banner.ctaLink || "/shop"}
              className="inline-flex items-center gap-2 bg-[#171145] hover:bg-[#0ea57a] text-white font-semibold px-8 py-3.5 rounded-full transition-colors duration-200 shadow-md"
            >
              <span>{banner.ctaText || "Shop Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-6 z-10 w-full max-w-lg">
            {banner.image1 && (
              <div className="relative w-28 sm:w-56 h-24 sm:h-48 flex items-center justify-center">
                <Image
                  src={banner.image1}
                  alt={banner.title}
                  width={240}
                  height={200}
                  className="w-full h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            {banner.image2 && (
              <div className="relative w-24 sm:w-52 h-20 sm:h-44 flex items-center justify-center">
                <Image
                  src={banner.image2}
                  alt={banner.title}
                  width={220}
                  height={180}
                  className="w-full h-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
