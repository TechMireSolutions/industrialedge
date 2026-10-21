"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

interface BestSellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  badge?: string;
}

const BEST_SELLER_ITEMS: BestSellerProduct[] = [
  {
    id: "bs-1",
    name: "AirPods (2nd generation) with Wired Charging Case",
    category: "Headphones",
    price: 129.0,
    originalPrice: 159.0,
    rating: 5,
    image: "/images/o_2003-540x540.webp",
    badge: "-19%",
  },
  {
    id: "bs-2",
    name: "AirPods (3rd generation) with Lightning Charging Case",
    category: "Headphones",
    price: 169.0,
    rating: 5,
    image: "/images/o_2101-540x540.webp",
    badge: "HOT",
  },
  {
    id: "bs-3",
    name: "Amazfit GTS 2 Smart Watch for Men Android iPhone",
    category: "Smartwatches",
    price: 139.99,
    originalPrice: 179.99,
    rating: 4,
    image: "/images/o_4501-540x540.webp",
    badge: "-22%",
  },
  {
    id: "bs-4",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold",
    category: "Smartphones",
    price: 369.0,
    rating: 5,
    image: "/images/o_4901-540x540.webp",
  },
  {
    id: "bs-5",
    name: "Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life",
    category: "Tablets",
    price: 189.99,
    originalPrice: 229.0,
    rating: 5,
    image: "/images/o_5001-540x540.webp",
    badge: "-17%",
  },
  {
    id: "bs-6",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor",
    category: "Monitors",
    price: 499.0,
    rating: 5,
    image: "/images/o_4701-540x540.webp",
    badge: "SALE",
  },
];

export default function BestSellers() {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();

  return (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e2d3b] tracking-tight">
            Best Sellers
          </h2>
          <Link
            href="/shop"
            className="text-sm font-semibold text-[#004ec3] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Column Layout (Left Feature Banner + Right 6-Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Featured Large Product Banner (1/3 width = 4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#f2f6fa] to-[#e8eff5] rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#73787d] font-semibold mb-2 block">
                Laptop & Tablet
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1e2d3b] leading-tight mb-3">
                Acer Aspire 5 A515-56-347N Slim Laptop
              </h3>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-gray-400 text-sm line-through">$540.00</span>
                <span className="text-3xl font-bold text-[#004ec3]">$450.00</span>
              </div>
              <Link
                href="/product/acer-aspire-5"
                className="inline-flex items-center gap-2 bg-[#1e2d3b] hover:bg-[#004ec3] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Laptop Feature Image */}
            <div className="relative w-full h-[240px] mt-6 flex items-center justify-center">
              <Image
                src="/images/img-prd18.webp"
                alt="Acer Aspire 5 Slim Laptop"
                width={380}
                height={240}
                className="max-h-[220px] w-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
              />
            </div>
          </div>

          {/* Right: 6-Product Grid (2/3 width = 8 cols, 3x2 grid) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {BEST_SELLER_ITEMS.map((product) => {
              const liked = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-lg p-4 border border-gray-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-bold text-white bg-[#ff3d3d]">
                      {product.badge}
                    </span>
                  )}

                  {/* Image with Floating Actions */}
                  <div className="relative w-full h-[150px] flex items-center justify-center p-2 mb-3 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={140}
                      height={140}
                      className="max-h-[135px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Action Overlay */}
                    <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
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
                        className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className={`w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                          liked
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3]"
                        }`}
                        title="Wishlist"
                      >
                        <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#004ec3] hover:text-white hover:border-[#004ec3] transition-colors cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <span className="text-[11px] text-[#73787d] font-normal mb-1 block">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="text-xs font-semibold text-[#1e2d3b] hover:text-[#004ec3] leading-snug line-clamp-2 transition-colors mb-1.5 block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < product.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-1 border-t border-gray-100">
                      <span className="text-sm font-bold text-[#004ec3]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-gray-400 line-through">
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
      </div>
    </section>
  );
}
