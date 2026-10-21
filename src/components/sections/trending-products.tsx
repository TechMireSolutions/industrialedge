"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const TRENDING_12_PRODUCTS: TrendingItem[] = [
  // Row 1
  {
    id: "tr-1",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold (Copy)",
    category: "Apple products",
    price: 475.0,
    image: "/images/o_4901-540x540.webp",
    description: "Fully unlocked and compatible with any carrier of choice. Stunning 6.5-inch Super Retina XDR OLED display.",
  },
  {
    id: "tr-2",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold",
    category: "Apple products",
    price: 475.0,
    image: "/images/o_4901-540x540.webp",
    description: "Triple-camera system with 12MP Ultra Wide, Wide, and Telephoto cameras; Night mode and 4K video.",
  },
  {
    id: "tr-3",
    name: "Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life – 1...",
    category: "Apple products",
    price: 193.13,
    image: "/images/o_5001-540x540.webp",
    description: "Sleek, contemporary design with 10.61-inch 2K IPS display, dual speakers, and all-day battery life.",
  },
  {
    id: "tr-4",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor...",
    category: "Apple products",
    price: 99.91,
    originalPrice: 449.99,
    image: "/images/o_4701-540x540.webp",
    description: "Ultra-WQHD curved gaming monitor with 1000R curvature, 165Hz refresh rate, and 1ms response time.",
  },
  {
    id: "tr-5",
    name: "SAMSUNG SM-R830NZSAXAR Galaxy Watch Active2 40mm...",
    category: "Apple products",
    price: 78.5,
    image: "/images/o_4801-540x540.webp",
    description: "Track your fitness, heart rate, and sleep with precision. Sleek lightweight aluminum design.",
  },
  {
    id: "tr-6",
    name: 'Samsung Galaxy Tab S4 (10.5") Wi-Fi Model SM-T830...',
    category: "Apple products",
    price: 74.91,
    originalPrice: 844.53,
    image: "/images/o_4601-540x540.webp",
    description: "Transform your tablet into a PC with Samsung DeX and included S Pen for maximum productivity.",
  },

  // Row 2
  {
    id: "tr-7",
    name: "Canon Mirrorless Camera [EOS M6 Mark II] for Vlogging + EF...",
    category: "Apple products",
    price: 898.0,
    originalPrice: 1598.0,
    image: "/images/o_3801-540x540.webp",
    description: "High image quality with 32.5 Megapixel CMOS (APS-C) sensor, high-speed continuous shooting up to 14 fps.",
  },
  {
    id: "tr-8",
    name: "Canon EOS M50 Mark II Mirrorless Camera with 15-...",
    category: "Apple products",
    price: 519.0,
    originalPrice: 839.95,
    image: "/images/o_3901-540x540.webp",
    description: "Crisp 24.1 Megapixel APS-C CMOS sensor with eye-detection AF and vertical 4K video capability.",
  },
  {
    id: "tr-9",
    name: "ASUS ZenBook Flip 13 Ultra Slim Convertible Laptop, 13.3...",
    category: "Apple products",
    price: 1082.72,
    image: "/images/o_4001-540x540.webp",
    description: "13.3-inch OLED FHD Touch Display with 360 ErgoLift hinge, Intel Core i5 processor, and 512GB SSD.",
  },
  {
    id: "tr-10",
    name: 'Acer Aspire 5 A515-56-347N Slim Laptop – 15.6" Full HD IP...',
    category: "Acer",
    price: 529.75,
    image: "/images/o_3603-540x540.webp",
    description: "Powerful 11th Gen Intel Core processor, 15.6-inch Full HD IPS display with narrow bezels.",
  },
  {
    id: "tr-11",
    name: "PlayStation 5 DualSense Wireless Controller – Black",
    category: "Apple products",
    price: 30.0,
    originalPrice: 69.99,
    image: "/images/o_3201-540x540.webp",
    description: "Haptic feedback, dynamic adaptive triggers, and built-in microphone integrated into an iconic design.",
  },
  {
    id: "tr-12",
    name: "SKG Smart Watch Make/Answer Call for Men...",
    category: "Apple products",
    price: 29.19,
    originalPrice: 99.91,
    image: "/images/o_2901-540x540.webp",
    description: "Bluetooth calling smartwatch with fitness tracker, heart rate monitor, sleep tracking, and IP68 waterproof.",
  },
];

export default function TrendingProducts() {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<TrendingItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2200);
  };

  const handleAddToCart = (product: TrendingItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const storeProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      status: "none",
      image: product.image,
      category: product.category,
      description: product.description,
    };
    addToCart(storeProduct, 1);
    showToast(`Added to cart!`);
  };

  const handleToggleWishlist = (product: TrendingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    const liked = isWishlisted(product.id);
    showToast(liked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: TrendingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added to compare list!`);
  };

  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-14 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2d3b] text-white px-4 py-2 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header: Title on left, Carousel controls on right */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e2d3b] tracking-tight">
            Trending Products
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#1e2d3b] transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#1e2d3b] transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* 6-Column Product Grid (2 rows of 6 products = 12 total) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-5 lg:gap-x-6 gap-y-10">
          {TRENDING_12_PRODUCTS.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-white transition-all duration-200"
              >
                {/* 1. Image Stage with Hover Overlay: Top-Right Icons + Bottom Red Button */}
                <div className="relative w-full h-[180px] sm:h-[190px] flex items-center justify-center p-2 mb-3 bg-white overflow-hidden">
                  {/* Product Image */}
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="max-h-[165px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Top-Right Vertical Stack of 3 Round Action Buttons on Hover */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-20">
                    {/* Quick View Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#004ec3] transition-colors cursor-pointer"
                      title="Quick View"
                      aria-label="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                        liked ? "text-red-500" : "text-gray-700 hover:text-[#004ec3]"
                      }`}
                      title="Wishlist"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className="w-3.5 h-3.5 stroke-[1.8]"
                        fill={liked ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Compare Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCompare(product, e)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#004ec3] transition-colors cursor-pointer"
                      title="Compare"
                      aria-label="Compare"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                  </div>

                  {/* Bottom Full-Width Red "Add to cart" Button on Hover */}
                  <div className="absolute bottom-1 inset-x-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-[#ff3d3d] hover:bg-[#e62e2e] text-white text-[12px] font-semibold py-2 rounded-[4px] shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>

                {/* 2. Text Details: Category, Title, Price */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    {/* Category */}
                    <span className="text-[11px] text-[#73787d] font-normal leading-tight mb-1 block truncate">
                      {product.category}
                    </span>

                    {/* Product Title */}
                    <Link
                      href={`/product/${product.id}`}
                      className="text-[12px] sm:text-[13px] font-medium text-[#004ec3] leading-[1.3] line-clamp-2 hover:underline mb-1.5 transition-colors block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                  </div>

                  {/* Price Row: Current Price + Strikethrough Old Price */}
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-[14px] sm:text-[15px] font-bold text-[#22262a]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] sm:text-[12px] text-[#888888] line-through font-normal">
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

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center p-2 bg-gray-50 rounded-lg">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <span className="text-xs uppercase tracking-wider text-[#73787d] font-semibold">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-base font-bold text-[#1e2d3b] mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {quickViewProduct.description}
                </p>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-xl font-bold text-[#004ec3]">
                    ${quickViewProduct.price.toFixed(2)}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${quickViewProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#ff3d3d] hover:bg-[#e62e2e] text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                    className="p-2 border border-gray-200 rounded-md text-gray-700 hover:text-red-500 hover:border-red-400 transition-colors cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={isWishlisted(quickViewProduct.id) ? "red" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
