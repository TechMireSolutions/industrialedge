"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Text component for each slide
  const renderTextBlock = (slideIndex: number, extraClasses = "") => (
    <div
      className={`w-full max-w-[420px] lg:max-w-[460px] shrink-0 flex flex-col justify-center py-6 z-10 ${extraClasses}`}
    >
      <span className="text-[13px] text-[#828282] font-normal mb-2 tracking-normal block">
        Cameras
      </span>
      <h2 className="text-3xl sm:text-[34px] lg:text-[36px] font-bold text-[#111111] leading-tight mb-3 tracking-tight">
        Lumo M10 Camera
      </h2>
      <p className="text-[13px] sm:text-[14px] text-[#8e8e8e] leading-relaxed max-w-sm mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fermentum laoreet.
      </p>

      {/* Star Rating: 4 filled, 1 outline */}
      <div className="flex items-center gap-1.5 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-[#f8be14] text-[#f8be14]" />
        ))}
        <Star className="w-3.5 h-3.5 text-[#f8be14]" strokeWidth={2} />
      </div>

      {/* Explore Button */}
      <div>
        <Link
          href="/shop?category=cameras-photos"
          className="inline-block bg-[#2b6cb0] hover:bg-[#205493] text-white px-8 py-2.5 rounded-[4px] text-sm font-medium transition-colors shadow-sm"
        >
          Explore
        </Link>
      </div>

      {/* 3 Pagination Dots */}
      <div className="flex items-center gap-2.5 mt-8 sm:mt-10">
        {[0, 1, 2].map((idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="cursor-pointer transition-all flex items-center justify-center p-0.5"
            >
              {isActive ? (
                <span className="w-4 h-4 rounded-full border-2 border-[#2b6cb0] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#2b6cb0]" />
                </span>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section
      className="relative w-full h-[430px] sm:h-[460px] lg:h-[480px] bg-[#f2f6fd] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Split: Left is light pale blue (#f2f6fd), Right is soft cornflower periwinkle (#acc5fb) */}
      <div
        className="absolute inset-y-0 right-0 w-full bg-[#acc5fb] pointer-events-none"
        style={{
          clipPath: "polygon(68% 0%, 100% 0%, 100% 100%, 57% 100%)",
        }}
      />

      {/* Main Container */}
      <div
        ref={containerRef}
        className="container relative h-full flex items-center overflow-hidden"
      >
        {/* Carousel Sliding Track */}
        <div
          className="flex items-center h-full transition-transform duration-700 ease-out"
          style={{
            // At slide 0: Text 1 is on the left, Camera 1 is on the right
            // At slide 1: Camera 1 is on the left, Text 2 is in the middle, Camera 2 enters from the right (exact match to Image 2!)
            // At slide 2: Camera 2 is on the left, Text 3 is in the middle, Camera 3 enters from the right
            transform: `translateX(-${currentSlide * 44}%)`,
          }}
        >
          {/* Block 0: Slide 1 Text Block */}
          {renderTextBlock(0, "pr-4 sm:pr-8")}

          {/* Block 1: Camera 1 Image */}
          <div className="w-[460px] sm:w-[520px] lg:w-[560px] shrink-0 flex items-center justify-center relative">
            <Image
              src="/images/banner_2_product.png"
              alt="Lumo M10 Camera"
              width={650}
              height={400}
              priority
              className="max-h-[290px] sm:max-h-[330px] lg:max-h-[365px] w-auto object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            />
          </div>

          {/* Block 2: Slide 2 Text Block (shown in center during Slide 2) */}
          {renderTextBlock(1, "px-4 sm:px-8")}

          {/* Block 3: Camera 2 Image */}
          <div className="w-[460px] sm:w-[520px] lg:w-[560px] shrink-0 flex items-center justify-center relative">
            <Image
              src="/images/banner_2_product.png"
              alt="Lumo M10 Camera"
              width={650}
              height={400}
              className="max-h-[290px] sm:max-h-[330px] lg:max-h-[365px] w-auto object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            />
          </div>

          {/* Block 3: Slide 3 Text Block */}
          {renderTextBlock(2, "px-4 sm:px-8")}

          {/* Block 5: Camera 3 Image */}
          <div className="w-[460px] sm:w-[520px] lg:w-[560px] shrink-0 flex items-center justify-center relative">
            <Image
              src="/images/banner_2_product.png"
              alt="Lumo M10 Camera"
              width={650}
              height={400}
              className="max-h-[290px] sm:max-h-[330px] lg:max-h-[365px] w-auto object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

