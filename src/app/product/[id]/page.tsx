"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import ShopProductCard, { ShopProductItem } from "@/components/products/shop-product-card";
import {
  ShoppingCart,
  Heart,
  Star,
  Check,
  X,
  MessageSquare,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

// Gallery images
const GALLERY_IMAGES = [
  {
    id: 1,
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Angle View",
  },
  {
    id: 2,
    full: "/images/lenovo-tab/tab-front.png",
    alt: "Lenovo Tab M10 Plus Front 2K Display View",
  },
  {
    id: 3,
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Stand Mode View",
  },
  {
    id: 4,
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Back View",
  },
];

// Storage Options
const STORAGE_OPTIONS = [
  { id: "64gb", label: "64GB", priceDelta: 0 },
  { id: "128gb", label: "128GB", priceDelta: 25.0 },
  { id: "256gb", label: "256GB", priceDelta: 50.0 },
];

// Color Options
const COLOR_OPTIONS = [
  { id: "storm-gray", name: "Storm Gray", hex: "#4b5563" },
  { id: "platinum-slate", name: "Platinum Slate", hex: "#94a3b8" },
];

// Simple specs table
const TECH_SPECS = [
  { label: "Display", value: "10.61\" 2K (2000 x 1200) IPS, 400 nits, TUV Low Blue Light" },
  { label: "Processor", value: "MediaTek Helio G80 Octa-Core (Up to 2.0 GHz)" },
  { label: "Operating System", value: "Android 12 (3 years security patches)" },
  { label: "Audio", value: "Quad stereo speakers with Dolby Atmos®" },
  { label: "Memory", value: "4GB LPDDR4x RAM" },
  { label: "Battery", value: "7,700 mAh (Up to 14 hours streaming)" },
  { label: "Weight", value: "465g (1.03 lbs) with slim 7.45mm aluminum chassis" },
  { label: "Ports", value: "USB-C 2.0, 3.5mm Audio Jack, MicroSD slot (up to 1TB)" },
];

// Simple review items
const REVIEWS = [
  {
    id: 1,
    name: "Tariq Mahmood",
    rating: 5,
    date: "3 days ago",
    comment:
      "The 2K screen is exceptionally crisp for reviewing engineering diagrams and PDF datasheets. Quad Dolby Atmos speakers are very loud and clear. Fast delivery in Karachi.",
  },
  {
    id: 2,
    name: "Zainab Sheikh",
    rating: 5,
    date: "1 week ago",
    comment:
      "Easily lasts 2 full days of study and video calls. The aluminum build feels very premium and solid in hand.",
  },
  {
    id: 3,
    name: "Usman Raza",
    rating: 4,
    date: "2 weeks ago",
    comment:
      "Good performance for multitasking with split screen. Delivered in perfect condition with official warranty card.",
  },
];

// Recently viewed products using official ShopProductItem format
const RECENT_PRODUCTS: ShopProductItem[] = [
  {
    id: "p-amazfit-gts-2",
    name: "Amazfit GTS 2 Smart Watch for Men Android iPhone, Bluetooth Phone Call",
    shortName: "Amazfit GTS 2 Smart Watch for Men Android iPhone...",
    categoryLine: "Apple products, Computers & Accessories, Smartwatch",
    categories: ["Smartwatch", "Apple products"],
    brand: "Amazfit",
    price: 134.99,
    originalPrice: 179.99,
    mainImage: "/images/o_0601-540x540.webp",
    thumbnails: [
      "/images/o_0601-540x540.webp",
      "/images/o_1101-540x540.webp",
    ],
    moreThumbnailsCount: 1,
    rating: 5,
    description:
      "AMOLED display, blood oxygen saturation measurement, 90 sports modes, and 7-day battery life.",
    specs: [
      { label: "Platform", value: "Android / iOS" },
      { label: "Display", value: "1.65\" AMOLED" },
      { label: "Color", value: "Desert Gold" },
      { label: "Brand", value: "Amazfit" },
      { label: "Battery Life", value: "7 Days" },
    ],
    deliveryDays: "2 day delivery",
  },
  {
    id: "p-sony-ps4-pro",
    name: "Sony PlayStation 4 Pro 1TB White Edition Console (PS4)",
    shortName: "Sony PlayStation 4 Pro 1TB White Edition Console (PS4)",
    categoryLine: "Gaming Accessories, TV & Video Games",
    categories: ["Gaming Accessories"],
    brand: "PlayStation",
    price: 399.99,
    mainImage: "/images/o_4301-540x540.webp",
    thumbnails: [
      "/images/o_4301-540x540.webp",
      "/images/o_4501-540x540.webp",
    ],
    moreThumbnailsCount: 1,
    rating: 5,
    description:
      "Dynamic 4K gaming and 4K entertainment, faster frame rates, and enhanced graphics.",
    specs: [
      { label: "Platform", value: "PlayStation 4" },
      { label: "Storage", value: "1TB" },
      { label: "Color", value: "Glacier White" },
      { label: "Brand", value: "PlayStation" },
      { label: "Input Device", value: "Gamepad" },
    ],
    deliveryDays: "2 day delivery",
  },
  {
    id: "p-acer-aspire-5",
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6\" Full HD IPS Display – 11th Gen Intel i3",
    shortName: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6'' Full HD IPS Display...",
    categoryLine: "Acer, Computers & Accessories, Laptop & Tablet",
    categories: ["Acer", "Computers & Accessories", "Laptop & Tablet"],
    brand: "Acer",
    price: 529.75,
    mainImage: "/images/o_3603-540x540.webp",
    thumbnails: [
      "/images/o_3603-540x540.webp",
      "/images/o_3701-540x540.webp",
    ],
    moreThumbnailsCount: 2,
    rating: 5,
    description:
      "Powerful 11th Gen Intel Core i3 processor, 15.6-inch Full HD IPS display with narrow bezels.",
    specs: [
      { label: "Screen Size", value: "15.6 Inches" },
      { label: "CPU Model", value: "Core i3" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "128 GB SSD" },
      { label: "Brand", value: "Acer" },
    ],
    deliveryDays: "3 day delivery",
  },
  {
    id: "p-canon-eos-m50",
    name: "Canon EOS M50 Mark II Mirrorless Camera with 15-45mm Lens (White)",
    shortName: "Canon EOS M50 Mark II Mirrorless Camera with 15-45mm Lens (White)",
    categoryLine: "Camera & Video, Photography & Video",
    categories: ["Camera & Video"],
    brand: "Canon",
    price: 519.0,
    originalPrice: 839.95,
    mainImage: "/images/o_5001-540x540.webp",
    thumbnails: [
      "/images/o_5001-540x540.webp",
      "/images/o_4901-540x540.webp",
    ],
    moreThumbnailsCount: 2,
    rating: 5,
    description:
      "24.1MP APS-C CMOS sensor, DIGIC 8 image processor, 4K UHD 24p and HD 120p for slow motion.",
    specs: [
      { label: "Sensor", value: "24.1MP APS-C CMOS" },
      { label: "Video", value: "4K UHD 24p" },
      { label: "Color", value: "White" },
      { label: "Brand", value: "Canon" },
      { label: "Lens", value: "EF-M 15-45mm STM" },
    ],
    deliveryDays: "2 day delivery",
  },
];

export default function ProductSinglePage() {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState("64gb");
  const [selectedColor, setSelectedColor] = useState("storm-gray");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const basePrice = 193.13;
  const storageDelta = STORAGE_OPTIONS.find((s) => s.id === selectedStorage)?.priceDelta || 0;
  const unitPrice = basePrice + storageDelta;
  const originalPrice = 229.0 + storageDelta;

  const currentProduct = {
    id: `lenovo-tab-m10-plus-${selectedStorage}`,
    name: `Lenovo Tab M10 Plus (3rd Gen) – 10.6" 2K FHD – ${selectedStorage.toUpperCase()}`,
    price: unitPrice,
    status: "discount" as const,
    image: GALLERY_IMAGES[selectedImageIndex].full,
    category: "Laptop & Tablet",
    description: "10.61-inch 2K IPS display, quad speakers, 7700mAh battery.",
  };

  const isLiked = isWishlisted(currentProduct.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2500);
  };

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity, true);
    showToast(`Added ${quantity} item(s) to cart`);
  };

  const currentImage = GALLERY_IMAGES[selectedImageIndex];

  return (
    <div className="w-full bg-white min-h-screen text-[#1f2937]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-6 z-50 bg-[#171145] text-white px-5 py-3 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-200">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] w-full bg-white rounded-xl p-6 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="relative w-full h-[450px] flex items-center justify-center">
              <Image
                src={currentImage.full}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1240px] mx-auto px-6 pt-6 pb-2 text-xs text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-slate-700 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">Lenovo Tab M10 Plus</span>
      </div>

      {/* ========================================================= */}
      {/* MAIN PRODUCT STAGE (Clean, Minimal, Breathing White Space)*/}
      {/* ========================================================= */}
      <div className="max-w-[1240px] mx-auto px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT: Clean Image Gallery */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Image Stage */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative w-full aspect-square max-w-[460px] bg-[#fafafa] rounded-2xl p-8 flex items-center justify-center cursor-zoom-in group select-none transition-all hover:bg-[#f6f6f6]"
            >
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={currentImage.full}
                  alt={currentImage.alt}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 460px"
                />
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-2.5 mt-5">
              {GALLERY_IMAGES.map((img, index) => {
                const isSelected = selectedImageIndex === index;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-14 h-14 rounded-xl p-1.5 bg-[#fafafa] transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? "border-2 border-slate-900 shadow-2xs scale-105"
                        : "border border-slate-200 hover:border-slate-400 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.full}
                      alt={img.alt}
                      width={42}
                      height={42}
                      className="object-contain max-h-full"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Minimal Buy Box & Details */}
          <div className="lg:col-span-6 flex flex-col pt-2">
            {/* Category / Brand */}
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Lenovo • TB125FU
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 leading-tight mb-2.5">
              Lenovo Tab M10 Plus (3rd Gen) – 10.6&quot; 2K FHD Android Tablet
            </h1>

            {/* Ratings Line */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="font-semibold text-slate-700">4.7</span>
              <span>•</span>
              <a
                href="#tabs"
                onClick={() => setActiveTab("reviews")}
                className="hover:underline cursor-pointer"
              >
                128 reviews
              </a>
            </div>

            {/* Price Line (No Heavy Boxes!) */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                ${unitPrice.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-[#0ea57a] bg-emerald-50 px-2 py-0.5 rounded">
                Save ${(originalPrice - unitPrice).toFixed(2)}
              </span>
            </div>

            {/* Clean Availability Line */}
            <div className="text-xs font-medium text-emerald-600 flex items-center gap-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In stock • Dispatches within 24 hours from Karachi hub
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-100 mb-6" />

            {/* Storage Selector (Minimal Pills) */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Storage Capacity
              </label>
              <div className="flex items-center gap-2">
                {STORAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStorage(opt.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedStorage === opt.id
                        ? "bg-[#171145] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector (Minimal Dots) */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Color: <span className="text-slate-800 capitalize font-medium">{COLOR_OPTIONS.find((c) => c.id === selectedColor)?.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col.id)}
                    aria-label={col.name}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor === col.id
                        ? "ring-2 ring-offset-2 ring-[#171145]"
                        : "hover:scale-105"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10"
                      style={{ backgroundColor: col.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Key Specs (Clean minimal bullets, no boxes) */}
            <ul className="text-xs text-slate-600 space-y-1.5 mb-7">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                10.61&quot; 2K (2000 x 1200) IPS Display, 400 nits
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                Quad stereo speakers with Dolby Atmos®
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                7,700 mAh battery with all-day streaming longevity
              </li>
            </ul>

            {/* Actions: Stepper + Add to Cart + Wishlist */}
            <div className="flex items-center gap-3 mb-6">
              {/* Stepper */}
              <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 h-11 px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded text-slate-600 hover:bg-white text-sm font-bold transition-colors cursor-pointer"
                  aria-label="Decrease"
                >
                  -
                </button>
                <span className="w-7 text-center text-xs font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded text-slate-600 hover:bg-white text-sm font-bold transition-colors cursor-pointer"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-11 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(currentProduct.id);
                  showToast(isLiked ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  isLiked
                    ? "border-[#0ea57a] text-[#0ea57a] bg-emerald-50"
                    : "border-slate-200 text-slate-500 hover:border-slate-400"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Quiet Footer Line */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-4 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Truck size={13} className="text-slate-400" />
                  Free shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-slate-400" />
                  1-year warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw size={13} className="text-slate-400" />
                  7-day return
                </span>
              </div>
              <a
                href="https://wa.me/923322316225?text=Hi%20IndustrialEdge%2C%20I%20have%20an%20inquiry%20regarding%20the%20Lenovo%20Tab%20M10%20Plus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <MessageSquare size={13} />
                <span>WhatsApp inquiry</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABS: Description | Specifications | Reviews              */}
        {/* ========================================================= */}
        <div id="tabs" className="mt-14 pt-8 border-t border-slate-100">
          {/* Tab Navigation */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
                activeTab === "desc"
                  ? "text-slate-900 border-b-2 border-slate-900 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
                activeTab === "specs"
                  ? "text-slate-900 border-b-2 border-slate-900 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
                activeTab === "reviews"
                  ? "text-slate-900 border-b-2 border-slate-900 -mb-[1px]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Reviews (128)
            </button>
          </div>

          {/* Tab Content 1: Description */}
          {activeTab === "desc" && (
            <div className="max-w-3xl space-y-6 text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150">
              <p>
                The Lenovo Tab M10 Plus (3rd Gen) is designed for immersive 2K entertainment, remote productivity, and student research.
                Its 10.61-inch IPS display delivers crisp 2000 x 1200 resolution with 400 nits brightness and TUV Low Blue Light eye protection.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Immersive Reading Mode
                  </h4>
                  <p className="text-xs text-slate-500">
                    Simulates chromatic and mono page colors to reduce optical fatigue during extended study and documentation reading.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Quad Dolby Atmos® Audio
                  </h4>
                  <p className="text-xs text-slate-500">
                    Four independent acoustic speakers create rich room-filling audio for movies, virtual meetings, and music.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Specifications */}
          {activeTab === "specs" && (
            <div className="max-w-2xl divide-y divide-slate-100 text-xs sm:text-sm animate-in fade-in duration-150">
              {TECH_SPECS.map((s) => (
                <div key={s.label} className="grid grid-cols-[140px_1fr] py-3 gap-4">
                  <span className="font-semibold text-slate-900">{s.label}</span>
                  <span className="text-slate-600">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 3: Reviews */}
          {activeTab === "reviews" && (
            <div className="max-w-2xl space-y-5 animate-in fade-in duration-150">
              {REVIEWS.map((rev) => (
                <div key={rev.id} className="pb-5 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{rev.name}</span>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400 mb-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        fill={s <= rev.rating ? "currentColor" : "none"}
                        className={s <= rev.rating ? "text-amber-400" : "text-slate-200"}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RECENTLY VIEWED (Exact Shop Product Cards)                */}
        {/* ========================================================= */}
        <div className="mt-16 pt-10 border-t border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#171145]">Recently Viewed</h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-slate-500 hover:text-[#0ea57a] transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {RECENT_PRODUCTS.map((prod) => (
              <ShopProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
