"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ArrowLeftRight, ShoppingCart, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

interface SmartHomeProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
}

const FALLBACK_SMART_HOME: SmartHomeProduct[] = [
  { id: "bs-1", name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6\" Full HD IPS", category: "Laptop & Tablet", price: 148300, image: "/images/o_3603-540x540.webp", description: "11th Gen Intel Core i3 processor, 15.6-inch Full HD IPS display." },
  { id: "bs-2", name: "AirPods (2nd generation) with Wired Charging Case", category: "Headphone", price: 36100, image: "/images/o_2003-540x540.webp", description: "Effortless setup, Apple H1 chip, over 24 hours listening time." },
  { id: "bs-3", name: "AirPods (3rd generation) with Lightning Charging Case", category: "Headphone", price: 47300, image: "/images/o_2101-540x540.webp", description: "Personalized Spatial Audio with dynamic head tracking." },
  { id: "bs-4", name: "Amazfit GTS 2 Smart Watch, Bluetooth Calls", category: "Smartwatch", price: 37800, image: "/images/o_0601-540x540.webp", description: "Curved 3D bezel-less AMOLED display and 90 sports modes." },
  { id: "hero-fire-tv", name: 'Amazon Fire TV 50" 4-Series 4K UHD Smart TV', category: "TV & Computer Screen", price: 84000, image: "/images/product-fire-tv.webp", description: "4K Ultra HD, HDR 10, HLG, and Alexa Voice Remote." },
  { id: "hero-airpods-max", name: "Apple AirPods Max Wireless Over-Ear Headphones – Green", category: "Headphone", price: 153700, image: "/images/product-airpods-max.webp", description: "High-fidelity audio and Active Noise Cancellation." },
  { id: "prd-bose-speaker", name: "Bose SoundLink Revolve+ II Bluetooth Speaker", category: "Audio Equipments", price: 55700, image: "/images/bose-speaker.png", description: "True 360-degree sound with IP55 water resistance." },
  { id: "tr-1", name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold", category: "Apple products", price: 133000, image: "/images/o_4901-540x540.webp", description: "Triple-camera system and 6.5-inch Super Retina XDR OLED display." },
];

export default function SmartHomeAppliances() {
  const [products, setProducts] = useState<SmartHomeProduct[]>(FALLBACK_SMART_HOME);
  const [currentPage, setCurrentPage] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<SmartHomeProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isWishlisted, toggleWishlist, addToCart, addToCompare } = useStore();

  useEffect(() => {
    api
      .getProducts()
      .then((all) => {
        if (Array.isArray(all) && all.length > 0) {
          setProducts(all);
        }
      })
      .catch(() => {});
  }, []);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentItems = useMemo(() => {
    const safePage = currentPage % totalPages;
    return products.slice(safePage * pageSize, safePage * pageSize + pageSize);
  }, [products, currentPage, totalPages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2000);
  };

  const toStoreProduct = (product: SmartHomeProduct): Product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    status: "none",
    image: product.image,
    category: product.category,
    description: product.description,
  });

  const handleAddToCart = (product: SmartHomeProduct, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(toStoreProduct(product), 1);
    showToast(`Added "${product.name.slice(0, 24)}..." to cart!`);
  };

  const handleToggleWishlist = (product: SmartHomeProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasLiked = isWishlisted(product.id);
    toggleWishlist(product.id);
    showToast(wasLiked ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = (product: SmartHomeProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(toStoreProduct(product));
    showToast("Added to compare!");
  };

  const handleQuickView = (product: SmartHomeProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-14 select-none">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171145] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl flex flex-col md:flex-row gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
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
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-lg font-bold text-[#171145] leading-snug mb-3">
                  {quickViewProduct.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-[#0ea57a]">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
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
                  className="flex-1 bg-[#0ea57a] hover:bg-[#0b8462] text-white py-2.5 px-4 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(quickViewProduct, e)}
                  className={`p-2.5 rounded border transition-colors cursor-pointer ${
                    isWishlisted(quickViewProduct.id)
                      ? "border-rose-500 text-rose-500 bg-rose-50"
                      : "border-gray-200 text-gray-700 hover:text-rose-500 hover:border-rose-300"
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
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#171145] tracking-tight">
            Smart Home &amp; Tech Essentials
          </h2>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
              className="p-1 text-gray-500 hover:text-[#171145] transition-colors cursor-pointer select-none"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
              className="p-1 text-gray-500 hover:text-[#171145] transition-colors cursor-pointer select-none"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        <div className="w-full border-b border-gray-200 mt-1 mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-10">
          {currentItems.map((product) => {
            const liked = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex items-start gap-4 select-none"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="relative w-[85px] sm:w-[95px] h-[85px] sm:h-[95px] shrink-0 flex items-center justify-center bg-white"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={95}
                    height={95}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-start pt-1">
                  <span className="text-[12px] text-[#64748b] font-normal leading-tight mb-1 block truncate">
                    {product.category}
                  </span>

                  <Link
                    href={`/product/${product.id}`}
                    className="text-[13px] sm:text-[14px] font-medium text-[#171145] hover:text-[#0ea57a] leading-[1.35] line-clamp-2 mb-2 transition-colors duration-150 block"
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  <div className="relative h-8 flex items-center">
                    <div className="absolute inset-0 flex items-center transition-all duration-200 group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-1">
                      <span className="text-[15px] sm:text-[16px] font-bold text-[#0ea57a] leading-none">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center gap-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-1 transition-all duration-200">
                      <button
                        type="button"
                        onClick={(e) => handleQuickView(product, e)}
                        className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#0ea57a] hover:border-[#0ea57a] transition-colors cursor-pointer"
                        title="Quick View"
                        aria-label="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className={`w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center transition-colors cursor-pointer ${
                          liked
                            ? "text-rose-500 border-rose-200"
                            : "text-gray-700 hover:text-white hover:bg-[#0ea57a] hover:border-[#0ea57a]"
                        }`}
                        title="Wishlist"
                        aria-label="Wishlist"
                      >
                        <Heart className="w-3.5 h-3.5 stroke-[1.8]" fill={liked ? "currentColor" : "none"} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleCompare(product, e)}
                        className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#0ea57a] hover:border-[#0ea57a] transition-colors cursor-pointer"
                        title="Compare"
                        aria-label="Compare"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#0ea57a] hover:border-[#0ea57a] transition-colors cursor-pointer"
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
