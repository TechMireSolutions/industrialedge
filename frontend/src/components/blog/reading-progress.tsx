"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setProgress(percent);
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#0ea57a] via-[#f97316] to-[#0ea57a] transition-all duration-75 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
