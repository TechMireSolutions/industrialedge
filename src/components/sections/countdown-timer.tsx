"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
  subLabel?: string;
}

export default function CountdownTimer({
  targetDate,
  label = "Hurry Up",
  subLabel = "Offer ends in:",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, expired: false });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center justify-between pt-1">
      <div className="text-left">
        <span className="text-sm font-bold text-[#212529] block leading-tight">{label}</span>
        <span className="text-xs text-[#828282] block mt-0.5">{subLabel}</span>
      </div>
      <div>
        <div className="border border-[#e0e0e0] rounded-[3px] flex divide-x divide-[#e0e0e0] bg-white">
          {[
            { value: pad(timeLeft.hours), label: "hours" },
            { value: pad(timeLeft.minutes), label: "mins" },
            { value: pad(timeLeft.seconds), label: "secs" },
          ].map((seg, i) => (
            <div key={i} className="px-3 py-1 flex items-center justify-center min-w-[38px]">
              <span className="text-base font-bold text-[#212529] leading-none">{seg.value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1 mt-1 text-[8px] uppercase tracking-wider text-[#828282] font-semibold">
          <span>HOURS</span>
          <span>MINS</span>
          <span>SECS</span>
        </div>
      </div>
    </div>
  );
}
