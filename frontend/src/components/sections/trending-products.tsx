"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const FALLBACK_TRENDING: TrendingItem[] = [
  { id: "tr-1", name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold", category: "Apple products", price: 133000, originalPrice: 167700, image: "/images/o_4901-540x540.webp", description: "Fully unlocked 6.5-inch Super Retina XDR OLED display with A13 Bionic chip." },
  { id: "tr-7", name: "Canon Mirrorless Camera [EOS M6 Mark II] + EF-M 15-45mm", category: "Camera & Video", price: 251400, originalPrice: 447400, image: "/images/o_3801-540x540.webp", description: "32.5 Megapixel CMOS (APS-C) sensor with Dual Pixel CMOS AF." },
  { id: "tr-2", name: "Apple iPhone 11 Pro Max, US Version, 64GB, Space Gray", category: "Apple products", price: 133000, originalPrice: 173600, image: "/images/o_4901-540x540.webp", description: "Triple-camera system with Night mode and 4K video." },
  { id: "tr-8", name: "Canon EOS M50 Mark II Mirrorless Camera with 15-45mm Lens", category: "Camera & Video", price: 145300, originalPrice: 195700, image: "/images/o_3801-540x540.webp", description: "24.1 Megapixel APS-C CMOS sensor with Eye Detection AF." },
  { id: "prd-lenovo-tab-m10", name: "Lenovo Tab M10 Plus (3rd Gen) – 10.6\" 2K FHD Tablet", category: "Laptop & Tablet", price: 54100, originalPrice: 64100, image: "/images/o_5001-540x540.webp", description: "10.61-inch 2K IPS display with quad Dolby Atmos speakers." },
  { id: "prd-asus-zenbook-13", name: "ASUS ZenBook Flip 13 Ultra Slim Convertible Laptop, 13.3\" OLED", category: "Laptop & Tablet", price: 294800, originalPrice: 335000, image: "/images/o_4001-540x540.webp", description: "13.3-inch OLED FHD Touch Display with Intel Core i5 and 512GB SSD." },
  { id: "prd-samsung-odyssey-g5", name: "Samsung 34-Inch Odyssey G5 Ultra-Wide Gaming Monitor", category: "TV & Computer Screen", price: 98000, originalPrice: 126000, image: "/images/o_4701-540x540.webp", description: "Ultra-WQHD 1000R curved gaming monitor with 165Hz refresh rate." },
  { id: "bs-1", name: 'Acer Aspire 5 A515-56-347N Slim Laptop – 15.6" Full HD IPS', category: "Laptop & Tablet", price: 148300, originalPrice: 182000, image: "/images/o_3603-540x540.webp", description: "11th Gen Intel Core i3 with 8GB RAM and 256GB NVMe SSD." },
  { id: "bs-2", name: "AirPods (2nd generation) with Wired Charging Case", category: "Headphone", price: 36100, originalPrice: 44500, image: "/images/o_2003-540x540.webp", description: "Effortless setup, Apple H1 chip, over 24 hours listening time." },
  { id: "prd-ps5-dualsense", name: "PlayStation 5 DualSense Wireless Controller – Midnight Black", category: "Gaming Accessories", price: 19600, originalPrice: 24500, image: "/images/o_3201-540x540.webp", description: "Haptic feedback and dynamic adaptive triggers." },
  { id: "prd-beats-headphone", name: "Beats Studio Pro Wireless Over-Ear Headphones – Deep Black", category: "Headphone", price: 70000, originalPrice: 98000, image: "/images/beats-headphones.png", description: "Active Noise Cancelling and up to 40 hours battery life." },
  { id: "prd-bose-speaker", name: "Bose SoundLink Revolve+ II Bluetooth Speaker – 360 Sound", category: "Audio Equipments", price: 55700, originalPrice: 69700, image: "/images/bose-speaker.png", description: "True 360-degree sound with IP55 water resistance." },
];

export default function TrendingProducts() {
  const { isWishlisted, toggleWishlist, addToCart, addToCompare } = useStore();
  const [products, setProducts] = useState<TrendingItem[]>(FALLBACK_TRENDING);
  const [quickViewProduct, setQuickViewProduct] = useState<TrendingItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState(6);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    api
      .getProducts()
      .then((all) => {
        if (Array.isArray(all) && all.length > 0) {
          const trending = all.filter((p) => p.isTrending);
          const list = trending.length >= 6 ? trending : all;
          setProducts(list);
        }
      })
      .catch(() => {});
  }, []);

  const columns = useMemo(() => {
    const pairs: Array<{ top: TrendingItem; bottom?: TrendingItem }> = [];
    for (let i = 0; i < products.length; i += 2) {
      pairs.push({ top: products[i], bottom: products[i + 1] });
    }
    return pairs;
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleColumns(2);
      else if (width < 768) setVisibleColumns(3);
      else if (width < 1024) setVisibleColumns(4);
      else setVisibleColumns(6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectiveVisible = Math.min(visibleColumns, Math.max(1, columns.length));
  const maxIndex = Math.max(0, columns.length - effectiveVisible);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  const handleNext = () => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 50) handlePrev();
    else if (diff < -50) handleNext();
    setTouchStartX(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2200);
  };

  const toStoreProduct = (product: TrendingItem): Product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    status: "none",
    image: product.image,
    category: product.category,
    description: product.description,
  });

  const handleAddToCart = (product: TrendingItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(toStoreProduct(product), 1);
    showToast("Added to cart!");
  };

  const handleToggleWishlist = (product: TrendingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasLiked = isWishlisted(product.id);
    toggleWishlist(product.id);
    showToast(wasLiked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: TrendingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(toStoreProduct(product));
    showToast("Added to compare!");
  };

  const renderProductCard = (product: TrendingItem) => {
    const liked = isWishlisted(product.id);

    return (
      <div
        key={product.id}
        className="group relative flex flex-col justify-between bg-white transition-all duration-200 select-none"
      >
        <div className="relative w-full h-[175px] sm:h-[185px] flex items-center justify-center p-2 mb-2 bg-white overflow-hidden">
          <Link href={`/product/${product.id}`} className="flex items-center justify-center w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              width={175}
              height={175}
              className="max-h-[160px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#0ea57a] transition-colors cursor-pointer"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>

            <button
              type="button"
              onClick={(e) => handleToggleWishlist(product, e)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                liked ? "text-rose-500" : "text-gray-700 hover:text-[#0ea57a]"
              }`}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 stroke-[1.8]" fill={liked ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={(e) => handleCompare(product, e)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#0ea57a] transition-colors cursor-pointer"
              title="Compare"
              aria-label="Compare"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>

          <div className="absolute bottom-1 inset-x-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20">
            <button
              type="button"
              onClick={(e) => handleAddToCart(product, e)}
              className="w-full bg-[#0ea57a] hover:bg-[#0b8462] text-white text-[12px] font-semibold py-2 rounded-[4px] shadow-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              Add to cart
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div>
            <span className="text-[11px] text-[#64748b] font-normal leading-tight mb-1 block truncate">
              {product.category}
            </span>

            <Link
              href={`/product/${product.id}`}
              className="text-[12px] sm:text-[13px] font-medium text-[#171145] hover:text-[#0ea57a] leading-[1.3] line-clamp-2 hover:underline mb-1.5 transition-colors block"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
            <span className="text-[14px] sm:text-[15px] font-bold text-[#0ea57a]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-[12px] text-[#888888] line-through font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-14 select-none overflow-hidden">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171145] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between pb-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#171145] tracking-tight">
            Trending Products
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 text-gray-500 hover:text-[#171145] transition-colors cursor-pointer select-none"
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 text-gray-500 hover:text-[#171145] transition-colors cursor-pointer select-none"
              aria-label="Next Products"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        <div
          className="relative w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${(columns.length / effectiveVisible) * 100}%`,
              transform: `translateX(-${currentIndex * (100 / Math.max(1, columns.length))}%)`,
            }}
          >
            {columns.map((column, colIdx) => (
              <div
                key={colIdx}
                className="shrink-0 px-2.5 sm:px-3 flex flex-col gap-9"
                style={{ width: `${100 / Math.max(1, columns.length)}%` }}
              >
                {renderProductCard(column.top)}
                {column.bottom && renderProductCard(column.bottom)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
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
                <span className="text-xs uppercase tracking-wider text-[#64748b] font-semibold">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-base font-bold text-[#171145] mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                  {quickViewProduct.description}
                </p>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-xl font-bold text-[#0ea57a]">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(quickViewProduct.originalPrice)}
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
                    className="flex-1 bg-[#0ea57a] hover:bg-[#0b8462] text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                    className="p-2 border border-gray-200 rounded-md text-gray-700 hover:text-rose-500 hover:border-rose-400 transition-colors cursor-pointer"
                    aria-label="Wishlist"
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
        </div>
      )}
    </section>
  );
}
