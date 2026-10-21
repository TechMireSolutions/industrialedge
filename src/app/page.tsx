import Hero from "@/components/sections/hero";
import PartnerLogos from "@/components/sections/partner-logos";
import TrendingProducts from "@/components/sections/trending-products";
import GameConsoleBanner from "@/components/sections/game-console-banner";
import BestSellers from "@/components/sections/best-sellers";
import DualPromoBanners from "@/components/sections/dual-promo-banners";
import SmartHomeAppliances from "@/components/sections/smart-home-appliances";
import RecentlyViewed from "@/components/sections/recently-viewed";
import TrustBar from "@/components/sections/trust-bar";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* 1. Hero Section (Home 08 / Dell G5 Showcase with Card Hover States) */}
      <Hero />

      {/* 2. Partner / Brand Logos Row */}
      <PartnerLogos />

      {/* 3. Trending Products (Category Tabs & 4-Column Product Grid) */}
      <TrendingProducts />

      {/* 4. Full-Width Promo Banner: GameConsole Destiny Special Edition */}
      <GameConsoleBanner />

      {/* 5. Best Sellers (1/3 Featured Laptop Banner + 2/3 6-Product Grid) */}
      <BestSellers />

      {/* 6. Dual Camera Promo Banner: Shop & SAVE BIG */}
      <DualPromoBanners />

      {/* 7. Smart Home Appliances (2-Row Compact Horizontal Product Cards) */}
      <SmartHomeAppliances />

      {/* 8. Recently Viewed (6-Column Products Grid) */}
      <RecentlyViewed />

      {/* 9. Trust & Service Features Bar */}
      <TrustBar />
    </div>
  );
}
