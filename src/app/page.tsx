import Hero from "@/components/sections/hero";
import TrustBar from "@/components/sections/trust-bar";
import DealsOfTheWeek from "@/components/sections/deals-of-the-week";
import TabbedProductGrid from "@/components/sections/tabbed-product-grid";
import PopularCategories from "@/components/sections/popular-categories";
import PromoBanner from "@/components/sections/promo-banner";
import HotNewArrivals from "@/components/sections/hot-new-arrivals";
import BestSellers from "@/components/sections/best-sellers";
import TrendsRecentlyViewed from "@/components/sections/trends-recently-viewed";
import Newsletter from "@/components/sections/newsletter";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <TrustBar />
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <DealsOfTheWeek />
          <TabbedProductGrid colSpan={8} />
        </div>
      </div>
      <PopularCategories />
      <PromoBanner />
      <HotNewArrivals />
      <BestSellers />
      <TrendsRecentlyViewed />
      <Newsletter />
    </div>
  );
}
