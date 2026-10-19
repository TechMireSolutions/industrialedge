"use client";

import { useState } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/sections/countdown-timer";

const DEALS = [
  {
    id: "d1",
    category: "Headphones",
    title: "Timber Studio",
    price: 225,
    originalPrice: 300,
    available: 6,
    sold: 28,
    progress: "22%",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=310&h=310&fit=crop&q=80",
  },
  {
    id: "d2",
    category: "Smartwatches",
    title: "Pixel Watch 2",
    price: 299,
    originalPrice: 349,
    available: 12,
    sold: 45,
    progress: "35%",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=310&h=310&fit=crop&q=80",
  },
  {
    id: "d3",
    category: "Smartphones",
    title: "Fold Duo Phone",
    price: 460,
    originalPrice: 530,
    available: 4,
    sold: 36,
    progress: "15%",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=310&h=310&fit=crop&q=80",
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
    <section className="lg:col-span-4 bg-white rounded-[5px] p-8 shadow-[0_10px_25px_rgba(0,0,0,0.1)] relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-black">Deals of the Week</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors cursor-pointer"
            aria-label="Previous deal"
          >
            <svg
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="shrink-0"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors cursor-pointer"
            aria-label="Next deal"
          >
            <svg
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="shrink-0"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Centered product image */}
      <div className="flex justify-center mb-6 h-[310px] items-center">
        <Image
          src={currentDeal.image}
          alt={currentDeal.title}
          width={310}
          height={310}
          className="w-[310px] h-[310px] object-contain transition-all duration-300"
          priority
        />
      </div>

      {/* Split metadata row 1 */}
      <div className="flex justify-between text-sm text-black/50 mb-1">
        <span>{currentDeal.category}</span>
        <span>${currentDeal.originalPrice}</span>
      </div>

      {/* Split metadata row 2 */}
      <div className="flex justify-between mb-6">
        <span className="text-2xl font-medium text-black">{currentDeal.title}</span>
        <span className="text-2xl font-medium text-[#df3b3b]">${currentDeal.price}</span>
      </div>

      {/* Scarcity progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span>
            Available: <span className="text-[#0e8ce4] font-medium">{currentDeal.available}</span>
          </span>
          <span>
            Already sold: <span className="text-[#0e8ce4] font-medium">{currentDeal.sold}</span>
          </span>
        </div>
        <div className="w-full h-[6px] bg-[#e8e8e8] rounded-full overflow-hidden">
          <div className="h-full bg-[#0e8ce4] rounded-full transition-all duration-300" style={{ width: currentDeal.progress }} />
        </div>
      </div>

      {/* Countdown timer */}
      <CountdownTimer targetDate={targetDate} />
    </section>
  );
}
