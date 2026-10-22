"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface SmartHomeProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const SMART_HOME_PAGE_1: SmartHomeProduct[] = [
  // Row 1
  {
    id: "sha-1",
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6'' Full HD IP...",
    category: "Acer",
    price: 529.75,
    image: "/images/o_3603-540x540.webp",
    description: "11th Gen Intel Core i3 processor, 15.6-inch Full HD IPS display with narrow bezels and all-day battery life.",
  },
  {
    id: "sha-2",
    name: "AirPods (2nd generation) with Wired Charging Case",
    category: "AirPods",
    price: 129.0,
    image: "/images/o_2003-540x540.webp",
    description: "Effortless setup, high-quality audio, hands-free Siri access, and over 24 hours of total listening time.",
  },
  {
    id: "sha-3",
    name: "AirPods (3rd generation) with Lightning Charging Case",
    category: "AirPods",
    price: 169.0,
    image: "/images/o_2101-540x540.webp",
    description: "Personalized Spatial Audio with dynamic head tracking, sweat and water resistance, and contoured design.",
  },
  {
    id: "sha-4",
    name: "Amazfit GTS 2 Smart Watch for Men Android iPhone, Bluetoo...",
    category: "Apple products",
    price: 134.99,
    image: "/images/o_0601-540x540.webp",
    description: "Curved 3D bezel-less design, all-round health tracking, 90 built-in sports modes, and Bluetooth phone call support.",
  },

  // Row 2
  {
    id: "sha-5",
    name: "Amazon Fire TV 50'' 4-Series 4K UHD smart TV",
    category: "Apple products",
    price: 299.99,
    image: "/images/product-fire-tv.webp",
    description: "Brilliant 4K Ultra HD, HDR 10, HLG, and Dolby Digital Plus with hands-free entertainment via Alexa Voice Remote.",
  },
  {
    id: "sha-6",
    name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
    category: "AirPods",
    price: 549.0,
    image: "/images/product-airpods-max.webp",
    description: "High-fidelity audio, Active Noise Cancellation with Transparency mode, and computational audio experience.",
  },
  {
    id: "sha-7",
    name: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
    category: "AirPods",
    price: 249.0,
    image: "/images/o_2101-540x540.webp",
    description: "Up to 2x more Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio with dynamic head tracking.",
  },
  {
    id: "sha-8",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold",
    category: "Apple products",
    price: 475.0,
    image: "/images/o_4901-540x540.webp",
    description: "Triple-camera system with Ultra Wide, Wide, and Telephoto cameras, Night mode, and stunning 6.5-inch Super Retina XDR OLED display.",
  },
];

const SMART_HOME_PAGE_2: SmartHomeProduct[] = [
  // Alternate Page for carousel navigation
  {
    id: "sha-9",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor with...",
    category: "Apple products",
    price: 99.91,
    originalPrice: 449.99,
    image: "/images/o_4701-540x540.webp",
    description: "Ultra-WQHD curved gaming monitor with 1000R curvature, 165Hz refresh rate, and 1ms response time.",
  },
  {
    id: "sha-10",
    name: "SAMSUNG SM-R830NZSAXAR Galaxy Watch Active2 40mm...",
    category: "Apple products",
    price: 78.5,
    image: "/images/o_4801-540x540.webp",
    description: "Track your fitness, heart rate, and sleep with precision. Sleek lightweight aluminum design.",
  },
  {
    id: "sha-11",
    name: "SKG Smart Watch Make/Answer Call for Men Android iPhone...",
    category: "Apple products",
    price: 29.19,
    originalPrice: 99.91,
    image: "/images/o_2901-540x540.webp",
    description: "Built-in Alexa, Bluetooth phone call, health monitoring, and IP68 waterproof design.",
  },
  {
    id: "sha-12",
    name: "Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life...",
    category: "Apple products",
    price: 193.13,
    image: "/images/o_5001-540x540.webp",
    description: "Sleek, contemporary design with 10.61-inch 2K IPS display, dual speakers, and all-day battery life.",
  },
  {
    id: "sha-13",
    name: "PlayStation 5 DualSense Wireless Controller – Black",
    category: "Apple products",
    price: 30.0,
    originalPrice: 69.99,
    image: "/images/o_3201-540x540.webp",
    description: "Haptic feedback, dynamic adaptive triggers, and built-in microphone in an iconic ergonomic design.",
  },
  {
    id: "sha-14",
    name: "Canon Mirrorless Camera [EOS M6 Mark II] for Vlogging + EF...",
    category: "Apple products",
    price: 898.0,
    originalPrice: 1598.0,
    image: "/images/o_3801-540x540.webp",
    description: "High image quality with 32.5 Megapixel CMOS sensor and 4K uncropped video recording.",
  },
  {
    id: "sha-15",
    name: "Canon EOS M50 Mark II Mirrorless Camera with 15-45mm...",
    category: "Apple products",
    price: 519.0,
    originalPrice: 839.95,
    image: "/images/o_3801-540x540.webp",
    description: "24.1 Megapixel CMOS sensor, improved Dual Pixel CMOS AF, and Vari-angle Touchscreen LCD.",
  },
  {
    id: "sha-16",
    name: "Amazon Fire HD 8 tablet, 2 GB RAM, 32 GB, Black",
    category: "Amazon",
    price: 99.99,
    originalPrice: 119.99,
    image: "/images/o_1101-540x540.webp",
    description: "8-inch HD display, 30% faster quad-core processor, and all-day battery life up to 12 hours.",
  },
];

export default function SmartHomeAppliances() {
  const [currentPage, setCurrentPage] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<SmartHomeProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isWishlisted, toggleWishlist, addToCart } = useStore();

  const pages = [SMART_HOME_PAGE_1, SMART_HOME_PAGE_2];
  const currentItems = pages[currentPage];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2000);
  };

  const handleAddToCart = (product: SmartHomeProduct, e?: React.MouseEvent) => {
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
    showToast(`Added "${product.name.slice(0, 24)}..." to cart!`);
  };

  const handleToggleWishlist = (product: SmartHomeProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    const liked = isWishlisted(product.id);
    showToast(liked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: SmartHomeProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added to compare list!`);
  };

  const handleQuickView = (product: SmartHomeProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
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

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl flex flex-col md:flex-row gap-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 aspect-square relative bg-white flex items-center justify-center border border-gray-100 rounded-lg p-4">
              <Image
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                width={300}
                height={300}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                  {quickViewProduct.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-[#22262a]">
                    ${quickViewProduct.price.toFixed(2)}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${quickViewProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  {quickViewProduct.description ||
                    "Premium electronic device with high reliability, responsive design, and official manufacturer warranty included."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 bg-[#ff3d3d] hover:bg-[#e62e2e] text-white py-2.5 px-4 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                  className={`p-2.5 rounded border transition-colors cursor-pointer ${
                    isWishlisted(quickViewProduct.id)
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-200 text-gray-700 hover:text-red-500 hover:border-red-300"
                  }`}
                  title="Wishlist"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isWishlisted(quickViewProduct.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header with Title on Left and Navigation Chevrons on Right */}
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e2d3b] tracking-tight">
            Smart Home Appliances
          </h2>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => (prev === 0 ? 1 : 0))}
              className="p-1 text-gray-400 hover:text-[#1e2d3b] transition-colors cursor-pointer select-none active:scale-90"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => (prev === 1 ? 0 : 1))}
              className="p-1 text-gray-400 hover:text-[#1e2d3b] transition-colors cursor-pointer select-none active:scale-90"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Thin Gray Divider Line */}
        <div className="w-full border-b border-gray-200 mt-1 mb-8" />

        {/* 2-Row × 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-10">
          {currentItems.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex items-start gap-4 select-none"
              >
                {/* Left: Product Image */}
                <div className="relative w-[85px] sm:w-[95px] h-[85px] sm:h-[95px] shrink-0 flex items-center justify-center bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={95}
                    height={95}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Right: Category, Title (turns Red on hover), and Price/Action Buttons Swap Row */}
                <div className="flex-1 min-w-0 flex flex-col justify-start pt-1">
                  {/* Category */}
                  <span className="text-[12px] text-[#73787d] font-normal leading-tight mb-1 block truncate">
                    {product.category}
                  </span>

                  {/* Title: turns red on card hover */}
                  <Link
                    href={`/product/${product.id}`}
                    className="text-[13px] sm:text-[14px] font-medium text-[#004ec3] group-hover:text-[#ff3d3d] leading-[1.35] line-clamp-2 mb-2 transition-colors duration-150 block"
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  {/* Price / Hover Buttons Swap Row */}
                  <div className="relative h-8 flex items-center">
                    {/* Normal State: Price */}
                    <div className="absolute inset-0 flex items-center transition-all duration-200 group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-1">
                      <span className="text-[15px] sm:text-[16px] font-bold text-[#22262a] leading-none">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Hover State: 4 Action Buttons replacing the price */}
                    <div className="absolute inset-0 flex items-center gap-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-1 transition-all duration-200">
                      {/* 1. Quick View */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickView(product, e)}
                        className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#ff3d3d] hover:border-[#ff3d3d] transition-colors cursor-pointer"
                        title="Quick View"
                        aria-label="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>

                      {/* 2. Wishlist */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className={`w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                          liked
                            ? "text-red-500 border-red-200"
                            : "text-gray-700 hover:text-white hover:bg-[#ff3d3d] hover:border-[#ff3d3d]"
                        }`}
                        title="Wishlist"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className="w-3.5 h-3.5 stroke-[1.8]"
                          fill={liked ? "currentColor" : "none"}
                        />
                      </button>

                      {/* 3. Compare */}
                      <button
                        type="button"
                        onClick={(e) => handleCompare(product, e)}
                        className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#ff3d3d] hover:border-[#ff3d3d] transition-colors cursor-pointer"
                        title="Compare"
                        aria-label="Compare"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>

                      {/* 4. Add to Cart */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#ff3d3d] hover:border-[#ff3d3d] transition-colors cursor-pointer"
                        title="Add to cart"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[1.8]" />
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
