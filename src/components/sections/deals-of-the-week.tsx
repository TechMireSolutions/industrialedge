"use client";

import CountdownTimer from "@/components/sections/countdown-timer";

export default function DealsOfTheWeek() {
  const targetDate = new Date("2026-10-26T23:59:59"); // fixed future date: 7 days from now

  return (
    <section className="lg:col-span-4 bg-white rounded-[5px] p-8 shadow-[0_10px_25px_rgba(0,0,0,0.1)] relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-black">Deals of the Week</h2>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors">
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
          <button className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors">
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
      <div className="flex justify-center mb-6">
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=310&h=310&fit=crop&q=80"
          alt="Studio Pro Headphones"
          className="w-[310px] h-[310px] object-contain"
        />
      </div>

      {/* Split metadata row 1 */}
      <div className="flex justify-between text-sm text-black/50 mb-1">
        <span>Headphones</span>
        <span>$300</span>
      </div>

      {/* Split metadata row 2 */}
      <div className="flex justify-between mb-6">
        <span className="text-2xl font-medium text-black">Timber Studio</span>
        <span className="text-2xl font-medium text-[#df3b3b]">$225</span>
      </div>

      {/* Scarcity progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span>
            Available: <span className="text-[#0e8ce4] font-medium">6</span>
          </span>
          <span>
            Already sold: <span className="text-[#0e8ce4] font-medium">28</span>
          </span>
        </div>
        <div className="w-full h-[6px] bg-[#e8e8e8] rounded-full overflow-hidden">
          <div className="h-full bg-[#0e8ce4] rounded-full" style={{ width: "22%" }} />
        </div>
      </div>

      {/* Countdown timer */}
      <CountdownTimer targetDate={targetDate} />
    </section>
  );
}
