"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";

interface SmartHomeProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
}

const SMART_HOME_ITEMS: SmartHomeProduct[] = [
  {
    id: "sha-1",
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6'' Full HD IPS",
    category: "Computers",
    price: 450.0,
    image: "/images/o_3603-540x540.webp",
  },
  {
    id: "sha-2",
    name: "AirPods (2nd generation) with Wired Charging Case",
    category: "Audio",
    price: 129.0,
    originalPrice: 159.0,
    image: "/images/o_2003-540x540.webp",
  },
  {
    id: "sha-3",
    name: "AirPods (3rd generation) with Lightning Charging Case",
    category: "Audio",
    price: 169.0,
    image: "/images/o_2101-540x540.webp",
  },
  {
    id: "sha-4",
    name: "Amazfit GTS 2 Smart Watch for Men Android iPhone",
    category: "Gadgets",
    price: 139.99,
    originalPrice: 179.99,
    image: "/images/o_4501-540x540.webp",
  },
  {
    id: "sha-5",
    name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
    category: "AirPods",
    price: 549.0,
    image: "/images/product-airpods-max.webp",
  },
  {
    id: "sha-6",
    name: "Amazon Fire TV 50'' 4-Series 4K UHD smart TV",
    category: "TV & Audio",
    price: 299.99,
    image: "/images/product-fire-tv.webp",
  },
  {
    id: "sha-7",
    name: "SAMSUNG SM-R830NZSAXAR Galaxy Watch Active2 40mm",
    category: "Smartwatches",
    price: 149.0,
    originalPrice: 199.0,
    image: "/images/o_4801-540x540.webp",
  },
  {
    id: "sha-8",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor",
    category: "Monitors",
    price: 499.0,
    image: "/images/o_4701-540x540.webp",
  },
];

export default function SmartHomeAppliances() {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();

  return (
    <section className="w-full bg-[#f8f9fa] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e2d3b] tracking-tight">
            Smart Home Appliances
          </h2>
        </div>

        {/* 2-Row Grid of Horizontal Compact Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SMART_HOME_ITEMS.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-3 select-none"
              >
                {/* Left Thumbnail */}
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center p-1 bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Right Info & Swap Row */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <span className="text-[11px] text-[#73787d] font-normal leading-tight mb-0.5 truncate block">
                    {product.category}
                  </span>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-xs font-semibold text-[#004ec3] leading-[1.3] line-clamp-2 hover:underline mb-1 transition-colors block"
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  {/* Swap Row: Normal Price vs 4 Hover Action Buttons */}
                  <div className="relative h-6 flex items-center">
                    {/* Normal Price */}
                    <div className="absolute inset-0 flex items-center gap-1.5 transition-all duration-150 group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-1">
                      <span className="text-xs font-bold text-[#22262a]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Hover Action Buttons */}
                    <div className="absolute inset-0 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-1 transition-all duration-150">
                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            status: "none",
                            image: product.image,
                            category: product.category,
                          })
                        }
                        className="w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className={`w-6 h-6 rounded-full border transition-colors flex items-center justify-center cursor-pointer ${
                          liked
                            ? "border-red-500 bg-red-50 text-red-500"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3]"
                        }`}
                        title="Wishlist"
                      >
                        <Heart className="w-3 h-3" fill={liked ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        className="w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                        title="Compare"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className="w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
