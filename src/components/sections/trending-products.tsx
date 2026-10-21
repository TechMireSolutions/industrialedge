"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, Star } from "lucide-react";
import { useStore } from "@/lib/store";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  image: string;
  badge?: string;
  badgeType?: "sale" | "new";
}

const TRENDING_TABS = [
  "All",
  "Computers & Accessories",
  "Smartphones & Tablets",
  "Audio & Video",
  "Cameras & Photos",
];

const TRENDING_PRODUCTS: ProductItem[] = [
  {
    id: "tp-1",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold",
    category: "Smartphones & Tablets",
    price: 369.0,
    originalPrice: 420.0,
    rating: 5,
    ratingCount: 12,
    image: "/images/o_4901-540x540.webp",
    badge: "-12%",
    badgeType: "sale",
  },
  {
    id: "tp-2",
    name: "Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life – 10'' FHD",
    category: "Computers & Accessories",
    price: 189.99,
    originalPrice: 229.0,
    rating: 5,
    ratingCount: 8,
    image: "/images/o_5001-540x540.webp",
    badge: "-17%",
    badgeType: "sale",
  },
  {
    id: "tp-3",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor Curved Screen",
    category: "Computers & Accessories",
    price: 499.0,
    rating: 5,
    ratingCount: 15,
    image: "/images/o_4701-540x540.webp",
    badge: "NEW",
    badgeType: "new",
  },
  {
    id: "tp-4",
    name: "SAMSUNG SM-R830NZSAXAR Galaxy Watch Active2 40mm (Cloud Silver)",
    category: "Smartphones & Tablets",
    price: 149.0,
    originalPrice: 199.0,
    rating: 4,
    ratingCount: 6,
    image: "/images/o_4801-540x540.webp",
    badge: "-25%",
    badgeType: "sale",
  },
  {
    id: "tp-5",
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6'' Full HD IPS Display",
    category: "Computers & Accessories",
    price: 450.0,
    originalPrice: 520.0,
    rating: 5,
    ratingCount: 22,
    image: "/images/o_3603-540x540.webp",
    badge: "-13%",
    badgeType: "sale",
  },
  {
    id: "tp-6",
    name: "Sony PlayStation 4 Pro 1TB White (PS4) Special Bundle",
    category: "Audio & Video",
    price: 399.0,
    rating: 5,
    ratingCount: 19,
    image: "/images/o_0701-540x540.webp",
    badge: "NEW",
    badgeType: "new",
  },
  {
    id: "tp-7",
    name: "DJI Phantom 3 Professional Quadcopter 4K UHD Video Camera Drone",
    category: "Cameras & Photos",
    price: 799.0,
    originalPrice: 899.0,
    rating: 5,
    ratingCount: 9,
    image: "/images/o_0201-540x540.webp",
    badge: "-11%",
    badgeType: "sale",
  },
  {
    id: "tp-8",
    name: "ASUS ZenBook Flip 13 Ultra Slim Convertible Laptop, OLED Touch Display",
    category: "Computers & Accessories",
    price: 849.0,
    rating: 5,
    ratingCount: 14,
    image: "/images/o_4601-540x540.webp",
  },
];

export default function TrendingProducts() {
  const [activeTab, setActiveTab] = useState("All");
  const { isWishlisted, toggleWishlist, addToCart } = useStore();

  const filteredProducts =
    activeTab === "All"
      ? TRENDING_PRODUCTS
      : TRENDING_PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <section className="w-full bg-[#f8f9fa] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-8 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1e2d3b] tracking-tight">
              Trending Products
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-6">
            {TRENDING_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium transition-colors cursor-pointer pb-1 relative ${
                  activeTab === tab
                    ? "text-[#004ec3] font-semibold"
                    : "text-[#73787d] hover:text-[#004ec3]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#004ec3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid (4 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg p-5 border border-gray-100 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Badge */}
                {product.badge && (
                  <span
                    className={`absolute top-4 left-4 z-10 px-2 py-0.5 rounded text-[11px] font-semibold text-white ${
                      product.badgeType === "sale" ? "bg-[#ff3d3d]" : "bg-[#004ec3]"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Product Thumbnail with Hover Action Buttons */}
                <div className="relative w-full h-[200px] flex items-center justify-center p-3 mb-4 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="max-h-[170px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Floating Action Buttons Overlay */}
                  <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
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
                      className="w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                      title="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                        liked
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3]"
                      }`}
                      title="Wishlist"
                    >
                      <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
                    </button>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                      title="Compare"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-xs text-[#73787d] font-normal mb-1 block">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm font-semibold text-[#1e2d3b] hover:text-[#004ec3] leading-snug line-clamp-2 transition-colors mb-2 block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < product.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-[11px] text-gray-400 ml-1">
                        ({product.ratingCount})
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-2 border-t border-gray-100">
                    <span className="text-base font-bold text-[#004ec3]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
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
