"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Handcrafted SVG icons matching the exact visual style in the reference image
function SmartphoneIcon({ className = "w-10 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer Phone Body */}
      <rect x="7" y="3" width="30" height="58" rx="4" />
      {/* Top Earpiece / Speaker */}
      <line x1="18" y1="8" x2="26" y2="8" />
      {/* Top Divider / Bezel Line */}
      <line x1="7" y1="13" x2="37" y2="13" />
      {/* Bottom Divider / Bezel Line */}
      <line x1="7" y1="51" x2="37" y2="51" />
      {/* Bottom Home Button */}
      <circle cx="22" cy="56" r="2.5" />
    </svg>
  );
}

function ComputerIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Monitor Outer Frame */}
      <rect x="6" y="8" width="52" height="36" rx="2" />
      {/* Bottom Bezel line */}
      <line x1="6" y1="36" x2="58" y2="36" />
      {/* Center Bezel Notch */}
      <line x1="30" y1="39" x2="34" y2="39" strokeWidth="2" />
      {/* Two Diagonal Glare Slashes in top portion */}
      <line x1="19" y1="21" x2="25" y2="14" />
      <line x1="26" y1="21" x2="32" y2="14" />
      {/* Stand Neck */}
      <path d="M26 44 L24 53" />
      <path d="M38 44 L40 53" />
      {/* Stand Base Foot */}
      <line x1="16" y1="53" x2="48" y2="53" strokeWidth="2.5" />
    </svg>
  );
}

function GadgetsIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 68 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* MP3 Player Body */}
      <rect x="5" y="7" width="31" height="51" rx="4" />
      {/* Display Screen */}
      <rect x="10" y="12" width="21" height="17" rx="1.5" />
      {/* Screen diagonal slash */}
      <line x1="14" y1="25" x2="23" y2="16" strokeWidth="1.8" />
      {/* Click Wheel */}
      <circle cx="20.5" cy="43.5" r="9.5" />
      <circle cx="20.5" cy="43.5" r="3.5" />

      {/* Headphone wire coming from player */}
      <path d="M36 13 C43 13 46 17 46 23" />
      {/* Left earbud */}
      <rect x="43" y="23" width="6" height="11" rx="3" />
      <line x1="46" y1="34" x2="46" y2="44" />
      <path d="M43 27 H41" strokeWidth="2.5" />

      {/* Right earbud wire branching */}
      <path d="M46 21 C53 21 56 25 56 29" />
      {/* Right earbud */}
      <rect x="53" y="29" width="6" height="11" rx="3" />
      <line x1="56" y1="40" x2="56" y2="48" />
      <path d="M53 33 H51" strokeWidth="2.5" />
    </svg>
  );
}

function VideoGamesIcon({ className = "w-12 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 52 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Console Body */}
      <rect x="7" y="4" width="38" height="56" rx="5" />
      {/* Screen Frame */}
      <rect x="13" y="10" width="26" height="20" rx="2" />
      {/* D-Pad (+) on the left */}
      <path d="M19 40 V48 M15 44 H23" strokeWidth="2.4" />
      {/* Action Buttons on the right (two dots arranged diagonally) */}
      <circle cx="31.5" cy="44.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="36" cy="40.5" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AccessoriesIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Headband Arch */}
      <path d="M12 36 V27 C12 16 21 7 32 7 C43 7 52 16 52 27 V36" />
      {/* Left Earcup */}
      <rect x="7" y="32" width="10" height="22" rx="4" />
      <line x1="13" y1="36" x2="13" y2="50" strokeWidth="1.8" />
      {/* Right Earcup */}
      <rect x="47" y="32" width="10" height="22" rx="4" />
      <line x1="51" y1="36" x2="51" y2="50" strokeWidth="1.8" />
    </svg>
  );
}

function CameraIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 20 H20 L23 14 H41 L44 20 H54 C56.2 20 58 21.8 58 24 V50 C58 52.2 56.2 54 54 54 H10 C7.8 54 6 52.2 6 50 V24 C6 21.8 7.8 20 10 20 Z" />
      <circle cx="32" cy="37" r="10" />
      <circle cx="32" cy="37" r="4" />
      <circle cx="48" cy="27" r="2" fill="currentColor" />
    </svg>
  );
}

function TvIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="6" y="10" width="52" height="36" rx="2" />
      <line x1="6" y1="40" x2="58" y2="40" />
      <line x1="22" y1="46" x2="16" y2="54" />
      <line x1="42" y1="46" x2="48" y2="54" />
      <circle cx="32" cy="43" r="1" fill="currentColor" />
    </svg>
  );
}

interface CategoryItem {
  id: string;
  lines: string[];
  icon: React.ComponentType<{ className?: string }>;
  slug: string;
}

const ALL_CATEGORIES: CategoryItem[] = [
  {
    id: "smartphones",
    lines: ["Smartphones", "& Tablets"],
    icon: SmartphoneIcon,
    slug: "smartphones-tablets",
  },
  {
    id: "computers",
    lines: ["Computers &", "Laptops"],
    icon: ComputerIcon,
    slug: "computers-laptops",
  },
  {
    id: "gadgets",
    lines: ["Gadgets"],
    icon: GadgetsIcon,
    slug: "gadgets",
  },
  {
    id: "videogames",
    lines: ["Video Games", "& Consoles"],
    icon: VideoGamesIcon,
    slug: "video-games",
  },
  {
    id: "accessories",
    lines: ["Accessories"],
    icon: AccessoriesIcon,
    slug: "accessories",
  },
  {
    id: "cameras",
    lines: ["Cameras &", "Photos"],
    icon: CameraIcon,
    slug: "cameras-photos",
  },
  {
    id: "tv-audio",
    lines: ["TV &", "Audio"],
    icon: TvIcon,
    slug: "tv-audio",
  },
];

export default function PopularCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 200;
    scrollRef.current.scrollBy({ left: -(cardWidth + 24), behavior: "smooth" });
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 200;
    scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
  };

  return (
    <section className="py-14 bg-white select-none">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-10">
          {/* Left Column: Heading, Carousel Controls & Full Catalog Link */}
          <div className="w-full lg:w-[220px] xl:w-[240px] shrink-0 flex flex-col justify-between py-2">
            <div>
              <h2 className="text-[34px] sm:text-[38px] font-bold text-[#111111] leading-[1.12] tracking-tight">
                Popular
                <br />
                Categories
              </h2>

              {/* Slider Arrows */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!canScrollLeft}
                  aria-label="Previous categories"
                  className="w-10 h-10 rounded-full border border-[#ececec] bg-white flex items-center justify-center text-[#999999] hover:text-[#111111] hover:border-[#cccccc] disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-[0_1px_4px_rgba(0,0,0,0.04)] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canScrollRight}
                  aria-label="Next categories"
                  className="w-10 h-10 rounded-full border border-[#ececec] bg-white flex items-center justify-center text-[#999999] hover:text-[#111111] hover:border-[#cccccc] disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-[0_1px_4px_rgba(0,0,0,0.04)] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Bottom Link: FULL CATALOG */}
            <div className="mt-8 lg:mt-auto pt-4">
              <Link
                href="/shop"
                className="text-[12px] font-bold tracking-wider text-[#0e8ce4] hover:text-[#0a6cb0] uppercase transition-colors inline-block"
              >
                FULL CATALOG
              </Link>
            </div>
          </div>

          {/* Right Column: Cards with Alternating Backgrounds */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth gap-5 sm:gap-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {ALL_CATEGORIES.map((cat, index) => {
                const IconComponent = cat.icon;
                // Alternating background pattern: 1st (index 0) is blue, 2nd (index 1) is white, 3rd is blue, etc.
                const isBlueBg = index % 2 === 0;

                return (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className={`shrink-0 w-[calc((100%-1*20px)/2)] sm:w-[calc((100%-2*24px)/3)] md:w-[calc((100%-3*24px)/4)] lg:w-[calc((100%-4*24px)/5)] h-[275px] flex flex-col items-center justify-center text-center px-4 py-8 rounded-none transition-all duration-200 group cursor-pointer ${
                      isBlueBg
                        ? "bg-[#eff6fa] hover:bg-[#e4eff6]"
                        : "bg-white hover:bg-gray-50/70"
                    }`}
                  >
                    {/* Icon Container */}
                    <div className="h-[76px] flex items-center justify-center text-[#111111] group-hover:scale-105 transition-transform duration-200">
                      <IconComponent />
                    </div>

                    {/* Category Label */}
                    <div className="mt-7 text-[14px] sm:text-[15px] font-medium text-[#1a1a1a] leading-snug group-hover:text-[#0e8ce4] transition-colors">
                      {cat.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


