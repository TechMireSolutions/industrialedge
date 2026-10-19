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
    <div className="flex items-center gap-4">
      <div className="text-left">
        <span className="text-sm font-medium text-black">{label}</span>
        <span className="text-xs text-black/50 block mt-0.5">{subLabel}</span>
      </div>
      <div className="border border-[#cccccc] rounded-[5px] flex divide-x divide-[#cccccc]">
        {[
          { value: pad(timeLeft.hours), label: "hours" },
          { value: pad(timeLeft.minutes), label: "mins" },
          { value: pad(timeLeft.seconds), label: "secs" },
        ].map((seg, i) => (
          <div key={i} className="px-3 py-1 flex flex-col items-center min-w-[44px]">
            <span className="text-xl font-medium text-black">{seg.value}</span>
            <span className="text-[10px] uppercase text-black/50">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
