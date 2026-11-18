"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

interface HeroProduct {
  id: string;
  name: string;
  category: string;
  categoryLink: string;
  price: number;
  image: string;
  description: string;
}

const DEFAULT_HERO_SIDE_PRODUCTS: HeroProduct[] = [
  {
    id: "hero-airpods-max",
    name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
    category: "Headphone",
    categoryLink: "/shop?cat=Headphone",
    price: 153700,
    image: "/images/product-airpods-max.webp",
    description:
      "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise, so you can immerse yourself in music.",
  },
  {
    id: "hero-fire-tv",
    name: 'Amazon Fire TV 50" 4-Series 4K UHD Smart TV',
    category: "TV & Computer Screen",
    categoryLink: "/shop?cat=TV+%26+Computer+Screen",
    price: 84000,
    image: "/images/product-fire-tv.webp",
    description:
      "Brilliant 4K entertainment - Bring movies and shows to life with support for vivid 4K Ultra HD, HDR 10, HLG, and Dolby Digital Plus.",
  },
];

export default function Hero() {
  const { isWishlisted, toggleWishlist, addToCart, addToCompare } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<HeroProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sideProducts, setSideProducts] = useState<HeroProduct[]>(DEFAULT_HERO_SIDE_PRODUCTS);
  const [heroData, setHeroData] = useState({
    brandTag: "Price",
    price: 126000,
    subtitle: "Let power flow through you",
    titleLine1: "DELL G5",
    titleLine2: "GAMING LAPTOP",
    image: "/images/dell-g5-hero.png",
    backgroundImage: "/images/hero-bg-exact.webp",
    ctaLink: "/product/hero-dell-g5",
  });

  useEffect(() => {
    api
      .getBanners()
      .then((data) => {
        if (data?.hero) {
          setHeroData({
            brandTag: data.hero.brandTag || "Price",
            price: data.hero.price || 126000,
            subtitle: data.hero.subtitle || "Let power flow through you",
            titleLine1: data.hero.titleLine1 || "DELL G5",
            titleLine2: data.hero.titleLine2 || "GAMING LAPTOP",
            image: data.hero.image || "/images/dell-g5-hero.png",
            backgroundImage: data.hero.backgroundImage || "/images/hero-bg-exact.webp",
            ctaLink: data.hero.ctaLink || "/product/hero-dell-g5",
          });
        }
        if (Array.isArray(data?.heroSideProducts) && data.heroSideProducts.length > 0) {
          setSideProducts(data.heroSideProducts);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const toStoreProduct = (item: HeroProduct): Product => ({
    id: item.id,
    name: item.name,
    price: item.price,
    status: "none",
    image: item.image,
    category: item.category,
    description: item.description,
  });

  const handleAddToCart = (item: HeroProduct, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(toStoreProduct(item), 1);
    showToast("Added to cart!");
  };

  const handleToggleWishlist = (item: HeroProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasLiked = isWishlisted(item.id);
    toggleWishlist(item.id);
    showToast(wasLiked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (item: HeroProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(toStoreProduct(item));
    showToast("Added to compare!");
  };

  return (
    <section
      className="relative w-full bg-[#f4f6f8] bg-cover bg-center bg-no-repeat py-10 sm:py-14 lg:py-16 border-b border-gray-200/50"
      style={{
        backgroundImage: `url('${heroData.backgroundImage || "/images/hero-bg-exact.webp"}')`,
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171145] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[380px] lg:min-h-[440px]">
          {/* 1. Left: Featured Laptop */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-start items-center">
            <Link
              href={heroData.ctaLink || "/product/hero-dell-g5"}
              className="relative group w-full max-w-[420px] lg:max-w-[500px] xl:max-w-[540px] transition-transform duration-300 hover:scale-[1.02] block"
            >
              <Image
                src={heroData.image || "/images/dell-g5-hero.png"}
                alt={`${heroData.titleLine1} ${heroData.titleLine2}`}
                width={540}
                height={387}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.12)]"
              />
            </Link>
          </div>

          {/* 2. Center: Pricing & Headings */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left justify-center pl-0 lg:pl-2">
            <span className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#475569] font-normal leading-tight mb-1">
              {heroData.brandTag || "Price"}
            </span>

            <div className="text-[36px] sm:text-[42px] lg:text-[46px] font-extrabold text-[#0ea57a] tracking-tight leading-none mb-3 whitespace-nowrap">
              {formatPrice(heroData.price)}
            </div>

            <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#333e48] font-normal leading-snug mb-4 sm:mb-5">
              {heroData.subtitle}
            </p>

            <Link href={heroData.ctaLink || "/product/hero-dell-g5"} className="group">
              <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-bold text-[#171145] group-hover:text-[#0ea57a] transition-colors tracking-normal uppercase leading-[1.18]">
                {heroData.titleLine1}
                <br />
                {heroData.titleLine2}
              </h1>
            </Link>
          </div>

          {/* 3. Right: Stack of 2 Horizontal Product Cards */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4 sm:gap-5 justify-center items-center md:items-end">
            {sideProducts.map((product) => {
              const liked = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-xl p-3.5 sm:p-4 w-full max-w-[340px] lg:max-w-[360px] h-[108px] lg:h-[118px] shadow-[0_2px_14px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-3.5 sm:gap-4 select-none"
                >
                  {/* Left: Product Thumbnail */}
                  <Link
                    href={`/product/${product.id}`}
                    className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] flex-shrink-0 flex items-center justify-center p-1 bg-white"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Right: Category, Title & Swap Area */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <Link
                      href={product.categoryLink || "/shop"}
                      className="text-[11px] sm:text-[12px] text-[#64748b] font-normal hover:text-[#0ea57a] transition-colors leading-tight mb-1 truncate block"
                    >
                      {product.category}
                    </Link>

                    <Link
                      href={`/product/${product.id}`}
                      className="text-[12px] sm:text-[13px] font-semibold text-[#171145] hover:text-[#0ea57a] leading-[1.3] line-clamp-2 mb-1.5 transition-colors block"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    <div className="relative h-7 sm:h-8 flex items-center">
                      {/* Normal State: Price */}
                      <div className="absolute inset-0 flex items-center transition-all duration-200 ease-in-out group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-1">
                        <span className="text-[14px] sm:text-[15px] font-bold text-[#0ea57a]">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {/* Hover State: 4 Action Buttons */}
                      <div className="absolute inset-0 flex items-center gap-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-1 transition-all duration-200 ease-in-out">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickViewProduct(product);
                          }}
                          className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a] transition-colors shadow-xs cursor-pointer"
                          aria-label="Quick View"
                          title="Quick View"
                        >
                          <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleToggleWishlist(product, e)}
                          className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border transition-colors shadow-xs flex items-center justify-center cursor-pointer ${
                            liked
                              ? "border-rose-500 bg-rose-50 text-rose-500"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a]"
                          }`}
                          aria-label="Wishlist"
                          title={liked ? "Remove Wishlist" : "Add to Wishlist"}
                        >
                          <Heart className="w-3.5 h-3.5 stroke-[1.8]" fill={liked ? "currentColor" : "none"} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleCompare(product, e)}
                          className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a] transition-colors shadow-xs cursor-pointer"
                          aria-label="Compare"
                          title="Compare"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#0ea57a] hover:text-white hover:border-[#0ea57a] transition-colors shadow-xs cursor-pointer"
                          aria-label="Add to cart"
                          title="Add to cart"
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
                <div className="text-xl font-bold text-[#0ea57a] mt-3">
                  {formatPrice(quickViewProduct.price)}
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
