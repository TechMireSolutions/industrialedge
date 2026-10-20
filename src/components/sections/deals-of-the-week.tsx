"use client";

import { useState } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/sections/countdown-timer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEALS = [
  {
    id: "d1",
    category: "Headphones",
    title: "Timber Studio",
    price: 225,
    originalPrice: 300,
    available: 6,
    sold: 28,
    progress: "18%",
    image: "/images/deals.png",
  },
  {
    id: "d2",
    category: "Smartphones",
    title: "Fold Duo Phone",
    price: 225,
    originalPrice: 300,
    available: 4,
    sold: 36,
    progress: "15%",
    image: "/images/featured_4.png",
  },
  {
    id: "d3",
    category: "Gadgets",
    title: "Skylite Drone",
    price: 379,
    originalPrice: 429,
    available: 8,
    sold: 22,
    progress: "27%",
    image: "/images/featured_7.png",
  },
];

export default function DealsOfTheWeek() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const targetDate = new Date("2026-10-26T23:59:59");
  const currentDeal = DEALS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? DEALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === DEALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="lg:col-span-4 bg-white rounded-[6px] p-6 lg:p-7 shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-[#e5e5e5]/80 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#212529] tracking-tight">Deals of the Week</h2>
        <div className="flex items-center gap-1 text-[#828282]">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 hover:text-[#0e8ce4] transition-colors cursor-pointer"
            aria-label="Previous deal"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 hover:text-[#0e8ce4] transition-colors cursor-pointer"
            aria-label="Next deal"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Centered product image */}
      <div className="flex justify-center items-center my-3 h-[270px]">
        <Image
          src={currentDeal.image}
          alt={currentDeal.title}
          width={280}
          height={280}
          className="max-h-[260px] max-w-[260px] object-contain transition-all duration-300"
          priority
        />
      </div>

      <div>
        {/* Split metadata row 1 */}
        <div className="flex justify-between items-baseline text-xs text-[#828282]">
          <span>{currentDeal.category}</span>
          <span className="line-through">${currentDeal.originalPrice}</span>
        </div>

        {/* Split metadata row 2 */}
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-xl font-bold text-[#212529]">{currentDeal.title}</span>
          <span className="text-xl font-bold text-[#df3b3b]">${currentDeal.price}</span>
        </div>

        {/* Scarcity progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-[#828282] mb-1.5 font-normal">
            <span>
              Available: <span className="text-[#212529] font-medium">{currentDeal.available}</span>
            </span>
            <span>
              Already sold: <span className="text-[#212529] font-medium">{currentDeal.sold}</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#e8e8e8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0e8ce4] rounded-full transition-all duration-300"
              style={{ width: currentDeal.progress }}
            />
          </div>
        </div>

        {/* Countdown timer */}
        <CountdownTimer targetDate={targetDate} />
      </div>
    </section>
  );
}
