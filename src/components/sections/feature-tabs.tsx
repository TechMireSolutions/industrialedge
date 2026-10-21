"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface FeatureProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const FEATURE_PRODUCTS: FeatureProduct[] = [
  {
    id: "ft-1",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold (Copy)",
    category: "Apple products",
    price: 475.0,
    image: "/images/o_4901-540x540.webp",
    description: "Fully unlocked and compatible with any carrier of choice. Stunning 6.5-inch Super Retina XDR OLED display.",
  },
  {
    id: "ft-2",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold",
    category: "Apple products",
    price: 475.0,
    image: "/images/o_4901-540x540.webp",
    description: "Triple-camera system with 12MP Ultra Wide, Wide, and Telephoto cameras; Night mode and 4K video.",
  },
  {
    id: "ft-3",
    name: "Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life – 10\" FH...",
    category: "Apple products",
    price: 193.13,
    image: "/images/o_5001-540x540.webp",
    description: "Sleek, contemporary design with 10.61-inch 2K IPS display, dual speakers, and all-day battery life.",
  },
  {
    id: "ft-4",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor with...",
    category: "Apple products",
    price: 99.91,
    originalPrice: 449.99,
    image: "/images/o_4701-540x540.webp",
    description: "Ultra-WQHD curved gaming monitor with 1000R curvature, 165Hz refresh rate, and 1ms response time.",
  },
  {
    id: "ft-5",
    name: "SAMSUNG SM-R830NZSAXAR Galaxy Watch Active2 40mm...",
    category: "Apple products",
    price: 78.5,
    image: "/images/o_4801-540x540.webp",
    description: "Track your fitness, heart rate, and sleep with precision. Sleek lightweight aluminum design.",
  },
];

const TOPRATE_PRODUCTS: FeatureProduct[] = [
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

const ONSALE_PRODUCTS: FeatureProduct[] = [
  {
    id: "os-1",
    name: "SAMSUNG 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor with...",
    category: "Apple products",
    price: 99.91,
    originalPrice: 449.99,
    image: "/images/o_4701-540x540.webp",
    description: "Ultra-WQHD curved gaming monitor with 1000R curvature, 165Hz refresh rate, and 1ms response time.",
  },
  {
    id: "os-2",
    name: "Canon Mirrorless Camera [EOS M6 Mark II] for Vlogging + EF...",
    category: "Apple products",
    price: 898.0,
    originalPrice: 1598.0,
    image: "/images/o_3801-540x540.webp",
    description: "High image quality with 32.5 Megapixel CMOS (APS-C) sensor, high-speed continuous shooting up to 14 fps.",
  },
  {
    id: "os-3",
    name: "Canon EOS M50 Mark II Mirrorless Camera with 15-...",
    category: "Apple products",
    price: 519.0,
    originalPrice: 839.95,
    image: "/images/o_3901-540x540.webp",
    description: "Crisp 24.1 Megapixel APS-C CMOS sensor with eye-detection AF and vertical 4K video capability.",
  },
  {
    id: "os-4",
    name: "Echo Dot (3rd Gen, 2018 release) – Smart speaker with Alexa",
    category: "Apple products",
    price: 24.99,
    originalPrice: 49.99,
    image: "/images/o_4501-540x540.webp",
    description: "Voice control your music and smart home devices. Rich, clear sound with compact design.",
  },
  {
    id: "os-5",
    name: "PlayStation 5 DualSense Wireless Controller – Black",
    category: "Apple products",
    price: 30.0,
    originalPrice: 69.99,
    image: "/images/o_3201-540x540.webp",
    description: "Haptic feedback, dynamic adaptive triggers, and built-in microphone integrated into an iconic design.",
  },
];

type TabType = "feature" | "toprate" | "onsale";

export default function FeatureTabs() {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>("feature");
  const [quickViewProduct, setQuickViewProduct] = useState<FeatureProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getProducts = () => {
    switch (activeTab) {
      case "toprate":
        return TOPRATE_PRODUCTS;
      case "onsale":
        return ONSALE_PRODUCTS;
      default:
        return FEATURE_PRODUCTS;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2200);
  };

  const handleAddToCart = (product: FeatureProduct, e?: React.MouseEvent) => {
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

  const handleToggleWishlist = (product: FeatureProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    const liked = isWishlisted(product.id);
    showToast(liked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: FeatureProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added to compare list!`);
  };

  const renderProductCard = (product: FeatureProduct) => {
    const liked = isWishlisted(product.id);

    return (
      <div
        key={product.id}
        className="group relative flex flex-col justify-between bg-white h-full transition-all duration-200 select-none"
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
          <div className="absolute bottom-1 inset-x-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20">
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
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "feature", label: "Feature" },
    { id: "toprate", label: "Toprate" },
    { id: "onsale", label: "On sale" },
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-12 select-none overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e2d3b] text-white px-4 py-2 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Tab Headers: Feature, Toprate, On sale + Divider Line */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200/80 pb-3 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-[20px] sm:text-[22px] transition-colors cursor-pointer select-none ${
                  isActive
                    ? "font-bold text-[#1e2d3b]"
                    : "font-normal text-[#73787d] hover:text-[#1e2d3b]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 5-Column Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 lg:gap-x-6 gap-y-8">
          {getProducts().map((product) => renderProductCard(product))}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Product Image Stage */}
              <div className="w-full h-[240px] sm:h-[280px] bg-[#f8f9fa] rounded-lg p-4 flex items-center justify-center">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  width={260}
                  height={260}
                  className="max-h-[240px] w-auto object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#004ec3] font-semibold uppercase tracking-wider block mb-1">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e2d3b] leading-snug mb-3">
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
                  {quickViewProduct.description && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {quickViewProduct.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#ff3d3d] hover:bg-[#e62e2e] text-white font-semibold py-2.5 px-4 rounded-[4px] text-sm transition-colors cursor-pointer shadow-sm text-center"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                    className="p-2.5 rounded-[4px] border border-gray-200 hover:border-red-400 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                    title="Wishlist"
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isWishlisted(quickViewProduct.id) ? "currentColor" : "none"}
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
