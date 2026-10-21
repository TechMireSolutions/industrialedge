"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, Star } from "lucide-react";
import { useStore } from "@/lib/store";

interface RecentProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
}

const RECENTLY_VIEWED_ITEMS: RecentProduct[] = [
  {
    id: "rv-1",
    name: "Apple 2022 MacBook Air Laptop with M2 chip, 13.6-inch Liquid Retina Display",
    category: "Laptops",
    price: 1099.0,
    originalPrice: 1199.0,
    rating: 5,
    image: "/images/o_0701-540x540.webp",
  },
  {
    id: "rv-2",
    name: "DJI Phantom 3 Professional Quadcopter 4K UHD Video Camera Drone",
    category: "Drones",
    price: 799.0,
    rating: 5,
    image: "/images/o_0201-540x540.webp",
  },
  {
    id: "rv-3",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold",
    category: "Smartphones",
    price: 369.0,
    rating: 5,
    image: "/images/o_4901-540x540.webp",
  },
  {
    id: "rv-4",
    name: "ASUS ZenBook Flip 13 Ultra Slim Convertible Laptop, OLED FHD Touch Display",
    category: "Laptops",
    price: 849.0,
    originalPrice: 949.0,
    rating: 5,
    image: "/images/o_4601-540x540.webp",
  },
  {
    id: "rv-5",
    name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
    category: "Headphones",
    price: 549.0,
    rating: 5,
    image: "/images/product-airpods-max.webp",
  },
  {
    id: "rv-6",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor with 1000R Curved Screen",
    category: "Monitors",
    price: 499.0,
    rating: 5,
    image: "/images/o_4701-540x540.webp",
  },
];

export default function RecentlyViewed() {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();

  return (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e2d3b] tracking-tight">
            Recently Viewed
          </h2>
        </div>

        {/* 6-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {RECENTLY_VIEWED_ITEMS.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg p-3.5 border border-gray-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Thumbnail with Hover Action Buttons */}
                <div className="relative w-full h-[130px] flex items-center justify-center p-2 mb-2 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={110}
                    height={110}
                    className="max-h-[110px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Floating Actions */}
                  <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
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
                      className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                      title="Add to cart"
                    >
                      <ShoppingCart className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                        liked
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3]"
                      }`}
                      title="Wishlist"
                    >
                      <Heart className="w-3 h-3" fill={liked ? "currentColor" : "none"} />
                    </button>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[10px] text-[#73787d] font-normal mb-1 block">
                    {product.category}
                  </span>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-xs font-semibold text-[#1e2d3b] hover:text-[#004ec3] leading-snug line-clamp-2 transition-colors mb-1.5 block"
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          i < product.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 pt-1 border-t border-gray-100">
                    <span className="text-xs font-bold text-[#004ec3]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">
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
