"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Truck,
  Eye,
  Heart,
  ArrowLeftRight,
  Star,
  Check,
  X,
} from "lucide-react";

// Gallery images for the Lenovo Tab
const GALLERY_IMAGES = [
  {
    id: 1,
    thumb: "/images/lenovo-tab/thumb-1.png",
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Angle View",
  },
  {
    id: 2,
    thumb: "/images/lenovo-tab/thumb-2.png",
    full: "/images/lenovo-tab/tab-front.png",
    alt: "Lenovo Tab M10 Plus Front Display View",
  },
  {
    id: 3,
    thumb: "/images/lenovo-tab/thumb-3.png",
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Stand View",
  },
  {
    id: 4,
    thumb: "/images/lenovo-tab/thumb-4.png",
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Aluminum Back View",
  },
];

// Product specifications
const SPECIFICATIONS = [
  { label: "Brand", value: "Lenovo" },
  { label: "Model Name", value: "Tab M10 Plus" },
  { label: "Color", value: "Gray" },
  { label: "Memory Storage", value: "64GB" },
  { label: "Screen Size", value: "10.61 Inches" },
];

// About this item bullet points
const ABOUT_BULLETS = [
  "The dazzling, 10.6\" FHD IPS display on this Android tablet lets you stream your video services at up to 1080p.",
  "A lightweight, portable tablet like the Tab M10 Plus Gen 3 is great for student research and projects.",
  "Keep focused with Immersive Reading Mode, which makes long screen sessions easier on the eyes with enhanced readability.",
  "The Tab M10 Plus Gen 3 tablet includes Android 12 for all of the latest features and three years of security.",
  "Stream, study, and multitask for hours with great processing power and a battery that can run the whole day.",
  "It's very thin—7.45mm / 0.29\"—and starts at just 465g / 1.03lbs, thanks to an aluminum chassis that's both lightweight and durable.",
];

// Recently Viewed products (matching Image 1 & 2)
interface RecentItem {
  id: string;
  categories: string[];
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  thumbnails: string[];
  moreThumbCount?: number;
  sold?: number;
  available?: number;
  specs: { label: string; value: string }[];
  deliveryDays?: number;
}

const RECENTLY_VIEWED: RecentItem[] = [
  {
    id: "rv-watch",
    categories: [
      "Apple products",
      "Computers & Accessories",
      "Gaming Accessories",
      "Smartwatch",
    ],
    name: "Amazfit GTS 2 Smart Watch for Men Android iPhone, Bluetooth Phone Call",
    price: 134.99,
    image: "/images/lenovo-tab/rv-watch.png",
    thumbnails: [
      "/images/lenovo-tab/thumb-1.png",
      "/images/lenovo-tab/thumb-2.png",
      "/images/lenovo-tab/thumb-3.png",
    ],
    moreThumbCount: 1,
    specs: [
      { label: "Platform", value: "Android / iOS" },
      { label: "Display", value: "1.65\" AMOLED" },
      { label: "Color", value: "Desert Gold" },
      { label: "Brand", value: "Amazfit" },
      { label: "Battery Life", value: "7 Days" },
    ],
    deliveryDays: 5,
  },
  {
    id: "rv-ps4",
    categories: ["Gaming Accessories"],
    name: "Sony PlayStation 4 Pro 1TB White (PS4)",
    price: 399.99,
    image: "/images/lenovo-tab/rv-ps4.png",
    thumbnails: [
      "/images/lenovo-tab/thumb-1.png",
      "/images/lenovo-tab/thumb-2.png",
      "/images/lenovo-tab/thumb-3.png",
    ],
    moreThumbCount: 1,
    sold: 5,
    available: 5,
    specs: [
      { label: "Platform", value: "PlayStation 4" },
      { label: "Input Device", value: "Gamepad" },
      { label: "Color", value: "White" },
      { label: "Brand", value: "PlayStation" },
      { label: "Model Name", value: "PlayStation 4 Pro 1TB Console" },
    ],
    deliveryDays: 5,
  },
  {
    id: "rv-laptop",
    categories: [
      "Acer",
      "Apple products",
      "Computers & Accessories",
      "Gaming Accessories",
      "Laptop & Tablet",
    ],
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6\" Full HD IPS Display – 11th Gen Intel i3",
    price: 529.75,
    image: "/images/lenovo-tab/rv-laptop.png",
    thumbnails: [
      "/images/lenovo-tab/thumb-1.png",
      "/images/lenovo-tab/thumb-2.png",
      "/images/lenovo-tab/thumb-3.png",
    ],
    moreThumbCount: 2,
    specs: [
      { label: "Screen Size", value: "15.6 Inches" },
      { label: "CPU Model", value: "Core i3" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "128 GB SSD" },
      { label: "Brand", value: "Acer" },
    ],
    deliveryDays: 5,
  },
  {
    id: "rv-camera",
    categories: [
      "Apple products",
      "Camera & Video",
      "Computers & Accessories",
      "Gaming Accessories",
    ],
    name: "Canon EOS M50 Mark II Mirrorless Camera with 15-45mm Lens (White)",
    price: 519.0,
    originalPrice: 839.95,
    image: "/images/lenovo-tab/rv-camera.png",
    thumbnails: [
      "/images/lenovo-tab/thumb-1.png",
      "/images/lenovo-tab/thumb-2.png",
      "/images/lenovo-tab/thumb-3.png",
    ],
    moreThumbCount: 2,
    specs: [
      { label: "Sensor", value: "24.1MP APS-C CMOS" },
      { label: "Video", value: "4K UHD 24p" },
      { label: "Color", value: "White" },
      { label: "Brand", value: "Canon" },
      { label: "Lens", value: "EF-M 15-45mm STM" },
    ],
    deliveryDays: 5,
  },
];

export default function ProductSinglePage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Zoom lens hover state (Image 3)
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Hovered product for Recently Viewed (Image 2)
  const [hoveredRecentId, setHoveredRecentId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2500);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomPos({
      x,
      y,
      bgX: xPercent,
      bgY: yPercent,
    });
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: "lenovo-tab-m10-plus",
        name: "Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life – 10'' FHD – 64GB Storage",
        price: 193.13,
        status: "none",
        image: GALLERY_IMAGES[selectedImageIndex].full,
        category: "Laptop & Tablet",
        description:
          "Sleek, contemporary design with 10.61-inch 2K IPS display, dual speakers, and all-day battery life.",
      },
      quantity
    );
    showToast(`Added ${quantity} item(s) to your cart!`);
  };

  const currentImage = GALLERY_IMAGES[selectedImageIndex];

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen text-[#333e48]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-lg shadow-2xl text-sm flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-lg p-6 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-[600px] flex items-center justify-center">
              <Image
                src={currentImage.full}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="w-full border-b border-[#eeeeee] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-3 flex items-center gap-2 text-[13px] text-[#777777]">
          <Link href="/" className="hover:text-[#ff3d3d] transition-colors">
            Home
          </Link>
          <span className="text-[#cccccc]">&gt;</span>
          <Link href="/shop" className="hover:text-[#ff3d3d] transition-colors">
            Products
          </Link>
          <span className="text-[#cccccc]">&gt;</span>
          <span className="text-[#333e48] font-medium truncate max-w-[600px]">
            Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life – 10’’ FHD – 64GB Storage
          </span>
        </div>
      </div>

      {/* Main Product Stage Container */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 bg-white p-6 sm:p-8 rounded-lg border border-[#e8e8e8] shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative">
          {/* ========================================================= */}
          {/* LEFT: INTERACTIVE IMAGE GALLERY & ZOOM LENS (Image 1 & 3) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Image Stage */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="relative w-full max-w-[480px] h-[340px] sm:h-[400px] bg-white flex items-center justify-center p-6 border border-[#f0f0f0] rounded-md cursor-crosshair group select-none overflow-hidden"
            >
              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={currentImage.full}
                  alt={currentImage.alt}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>

              {/* Prev Arrow (<) on Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1
                  );
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-[#0e8ce4] text-white flex items-center justify-center shadow-md hover:bg-[#0b76c2] transition-colors cursor-pointer z-10"
                aria-label="Previous Image"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Arrow (>) on Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-[#0e8ce4] text-white flex items-center justify-center shadow-md hover:bg-[#0b76c2] transition-colors cursor-pointer z-10"
                aria-label="Next Image"
              >
                <ChevronRight size={20} />
              </button>

              {/* Zoom In Button (Magnifying glass with +) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute bottom-3 right-3 p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors cursor-pointer z-10"
                aria-label="Zoom Image"
              >
                <ZoomIn size={22} strokeWidth={1.75} />
              </button>

              {/* Zoom Lens Box (Image 3: rectangular lens following mouse) */}
              {isZooming && (
                <div
                  className="absolute pointer-events-none border-2 border-[#0e8ce4]/60 bg-[#0e8ce4]/10 rounded shadow-sm"
                  style={{
                    width: "160px",
                    height: "140px",
                    left: `${Math.max(0, Math.min(zoomPos.x - 80, 480 - 160))}px`,
                    top: `${Math.max(0, Math.min(zoomPos.y - 70, 400 - 140))}px`,
                  }}
                />
              )}
            </div>

            {/* Magnified Zoom Preview Popup (Image 3) */}
            {isZooming && (
              <div
                className="hidden xl:block absolute left-[52%] top-6 w-[480px] h-[480px] bg-white border border-[#e0e0e0] shadow-2xl rounded-lg z-50 pointer-events-none overflow-hidden"
                style={{
                  backgroundImage: `url(${currentImage.full})`,
                  backgroundPosition: `${zoomPos.bgX}% ${zoomPos.bgY}%`,
                  backgroundSize: "280%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {/* Thumbnail Carousel Bar */}
            <div className="flex items-center gap-3 mt-6">
              {/* Carousel Prev Arrow */}
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1
                  )
                }
                className="w-7 h-7 rounded bg-[#0e8ce4] text-white flex items-center justify-center hover:bg-[#0b76c2] transition-colors cursor-pointer shrink-0"
                aria-label="Previous Thumbnail"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Thumbnails */}
              <div className="flex items-center gap-3">
                {GALLERY_IMAGES.map((img, index) => {
                  const isSelected = selectedImageIndex === index;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-[60px] h-[55px] p-1 rounded bg-white border transition-all cursor-pointer flex items-center justify-center overflow-hidden ${
                        isSelected
                          ? "border-2 border-[#0e8ce4] shadow-sm"
                          : "border-[#e5e5e5] hover:border-[#999999]"
                      }`}
                    >
                      <Image
                        src={img.full}
                        alt={img.alt}
                        width={50}
                        height={45}
                        className="object-contain max-h-full"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Carousel Next Arrow */}
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1
                  )
                }
                className="w-7 h-7 rounded bg-[#0e8ce4] text-white flex items-center justify-center hover:bg-[#0b76c2] transition-colors cursor-pointer shrink-0"
                aria-label="Next Thumbnail"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: PRODUCT DETAILS & BUY BOX (Image 1)                */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Categories Links */}
            <div className="text-[13px] text-[#777777] leading-relaxed mb-1.5">
              <span className="font-medium text-[#555555]">Categories: </span>
              <Link
                href="/shop?cat=Apple%20products"
                className="text-[#0e8ce4] hover:text-[#ff3d3d] hover:underline transition-colors"
              >
                Apple products
              </Link>
              ,{" "}
              <Link
                href="/shop?cat=Computers%20%26%20Accessories"
                className="text-[#0e8ce4] hover:text-[#ff3d3d] hover:underline transition-colors"
              >
                Computers &amp; Accessories
              </Link>
              ,{" "}
              <Link
                href="/shop?cat=Gaming%20Accessories"
                className="text-[#0e8ce4] hover:text-[#ff3d3d] hover:underline transition-colors"
              >
                Gaming Accessories
              </Link>
              ,{" "}
              <Link
                href="/shop?cat=Laptop%20%26%20Tablet"
                className="text-[#0e8ce4] hover:text-[#ff3d3d] hover:underline transition-colors"
              >
                Laptop &amp; Tablet
              </Link>
            </div>

            {/* Product Title */}
            <h1 className="text-[22px] sm:text-[24px] xl:text-[26px] font-bold text-[#141539] leading-snug tracking-tight mb-3">
              Lenovo Tab M10 Plus (3rd Gen) – 2022 – Long Battery Life – 10’’ FHD – 64GB Storage
            </h1>

            {/* Price */}
            <div className="text-[30px] sm:text-[34px] font-bold text-[#ff3d3d] leading-none mb-6">
              $193.13
            </div>

            {/* Specifications Table */}
            <div className="w-full max-w-[420px] mb-6 space-y-2.5 text-[13.5px]">
              {SPECIFICATIONS.map((spec) => (
                <div key={spec.label} className="grid grid-cols-2 gap-4 py-0.5">
                  <span className="text-[#555555] font-medium">{spec.label}</span>
                  <span className="text-[#141539] font-normal">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Quantity Stepper & Add to Cart Button */}
            <div className="space-y-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-[13.5px] font-medium text-[#444444]">Quantity:</span>
                <div className="inline-flex items-center border border-[#dcdcdc] rounded-full px-2 py-0.5 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#555555] hover:text-black hover:bg-gray-100 transition-colors cursor-pointer text-sm font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-[13.5px] font-semibold text-[#141539]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#555555] hover:text-black hover:bg-gray-100 transition-colors cursor-pointer text-sm font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button (Bright Red, matching Image 1) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:w-[280px] h-[46px] bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[14px] rounded-md shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
              >
                <span>Add to cart</span>
                <ShoppingCart size={17} strokeWidth={2.2} />
              </button>
            </div>

            {/* About this item */}
            <div className="border-t border-[#f0f0f0] pt-6">
              <h2 className="text-[16px] font-bold text-[#141539] mb-3.5">
                About this item
              </h2>
              <ul className="space-y-2.5 text-[13px] text-[#555555] leading-relaxed">
                {ABOUT_BULLETS.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#555555] mt-1.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABS SECTION: Description | Additional info | Review      */}
        {/* ========================================================= */}
        <div className="mt-12 bg-white rounded-lg border border-[#e8e8e8] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          {/* Tab Navigation Bar */}
          <div className="bg-[#f4f5f7] border-b border-[#e5e7eb] px-6 flex items-center gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`py-3.5 text-[15px] font-bold transition-colors cursor-pointer border-b-2 relative ${
                activeTab === "desc"
                  ? "text-[#0e8ce4] border-[#0e8ce4]"
                  : "text-[#4b5563] border-transparent hover:text-[#0e8ce4]"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`py-3.5 text-[15px] font-bold transition-colors cursor-pointer border-b-2 relative ${
                activeTab === "specs"
                  ? "text-[#0e8ce4] border-[#0e8ce4]"
                  : "text-[#4b5563] border-transparent hover:text-[#0e8ce4]"
              }`}
            >
              Additional information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`py-3.5 text-[15px] font-bold transition-colors cursor-pointer border-b-2 relative ${
                activeTab === "reviews"
                  ? "text-[#0e8ce4] border-[#0e8ce4]"
                  : "text-[#4b5563] border-transparent hover:text-[#0e8ce4]"
              }`}
            >
              Review
            </button>
          </div>

          {/* Tab 1 Content: Description (Matching Image 1) */}
          {activeTab === "desc" && (
            <div className="p-6 sm:p-10 space-y-8 animate-in fade-in duration-150">
              {/* Paragraph 1 */}
              <p className="text-[13.5px] text-[#555555] leading-relaxed">
                Perfect for unwinding – stream or download your favorite shows and movies from
                Netflix, Prime Video, Disney+, and others (subscription for some apps required).
                Listen via built-in speakers or connect using Bluetooth or the headphone jack.
                Download Luna App on Fire tablets to stream Luna games directly from the cloud. Prime
                members play a rotating selection of games on the Prime Gaming Channel for free.
              </p>

              {/* 2 Feature Visual Banners Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative w-full h-[220px] sm:h-[280px] bg-[#f9f9f9] border border-[#f0f0f0] rounded-md overflow-hidden flex items-center justify-center p-3">
                  <Image
                    src="/images/lenovo-tab/desc-feature-1.png"
                    alt="Entertainment with Kids UI and Apps"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative w-full h-[220px] sm:h-[280px] bg-[#f9f9f9] border border-[#f0f0f0] rounded-md overflow-hidden flex items-center justify-center p-3">
                  <Image
                    src="/images/lenovo-tab/desc-feature-2.png"
                    alt="Yellowjackets Video Streaming Display"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Paragraph 2 */}
              <p className="text-[13.5px] text-[#555555] leading-relaxed">
                Split screen helps you do more with ease, so you send an email while joining a Zoom
                call, or look up a recipe while watching your favorite show on Prime Video. Use
                screen mirroring to project movies, shows, web browser, apps, photos, music and more
                on your Miracast compatible devices. Curl up with a must-read ebook, get social with
                apps like Facebook, Instagram, and TikTok, discover new movies or find your next
                favorite show on Netflix, Hulu, and more available through Amazon&apos;s Appstore (Google
                Play not supported. Subscription for some apps required).
              </p>
            </div>
          )}

          {/* Tab 2 Content: Additional Information */}
          {activeTab === "specs" && (
            <div className="p-6 sm:p-10 animate-in fade-in duration-150">
              <h3 className="text-[16px] font-bold text-[#141539] mb-4">
                Technical Specifications
              </h3>
              <div className="border border-[#e5e5e5] rounded overflow-hidden max-w-2xl">
                {[
                  { k: "Operating System", v: "Android 12 (upgradable to Android 13)" },
                  { k: "Processor", v: "MediaTek Helio G80 Octa-core (2x2.0 GHz & 6x1.8 GHz)" },
                  { k: "Display Resolution", v: "2000 x 1200 pixels (~213 ppi density)" },
                  { k: "Internal Storage", v: "64GB eMMC 5.1 (MicroSDXC expandable up to 1TB)" },
                  { k: "Battery Capacity", v: "7700 mAh Li-Po (Up to 14 hours video streaming)" },
                  { k: "Audio & Speakers", v: "Quad stereo speakers, optimized with Dolby Atmos" },
                  { k: "Dimensions", v: "251.2 x 158.8 x 7.45 mm (9.89 x 6.25 x 0.29 in)" },
                  { k: "Weight", v: "465 g (1.03 lbs)" },
                ].map((row, i) => (
                  <div
                    key={row.k}
                    className={`grid grid-cols-2 px-5 py-3 text-[13.5px] ${
                      i % 2 === 0 ? "bg-[#fcfcfc]" : "bg-white"
                    } border-b border-[#f0f0f0] last:border-b-0`}
                  >
                    <span className="font-semibold text-[#333e48]">{row.k}</span>
                    <span className="text-[#555555]">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3 Content: Reviews */}
          {activeTab === "reviews" && (
            <div className="p-6 sm:p-10 animate-in fade-in duration-150 space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-[32px] font-bold text-[#141539]">4.7</div>
                <div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <div className="text-[12px] text-[#777777] mt-0.5">Based on 128 reviews</div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0f0f0]">
                <div className="p-4 bg-[#f9fafb] rounded border border-[#f0f0f0]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-[13.5px] text-[#141539]">
                      Sarah Mitchell
                    </span>
                    <span className="text-[12px] text-gray-400">2 weeks ago</span>
                  </div>
                  <p className="text-[13px] text-[#555555]">
                    Amazing screen and speaker quality for watching videos and streaming Netflix!
                    Battery easily lasts more than a full day of reading and movies.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RECENTLY VIEWED PRODUCTS (Matching Image 1 & Image 2)     */}
        {/* ========================================================= */}
        <div className="mt-14 mb-16">
          <h2 className="text-[20px] font-bold text-[#141539] mb-6">
            Recently Viewed
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RECENTLY_VIEWED.map((product) => {
              const isHovered = hoveredRecentId === product.id;
              const isLiked = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredRecentId(product.id)}
                  onMouseLeave={() => setHoveredRecentId(null)}
                  className="relative bg-white rounded-lg border border-[#e8e8e8] p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group"
                >
                  {/* Top Image Stage */}
                  <div className="relative w-full h-[190px] flex items-center justify-center p-2 mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={170}
                      height={150}
                      className="object-contain max-h-[170px] group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Thumbnail Swatches Bar with +1 / +2 */}
                  <div className="flex items-center gap-1.5 mb-3">
                    {product.thumbnails.map((t, idx) => (
                      <div
                        key={idx}
                        className="w-[28px] h-[28px] border border-[#dcdcdc] rounded p-0.5 flex items-center justify-center bg-white"
                      >
                        <Image
                          src={t}
                          alt="thumbnail"
                          width={24}
                          height={24}
                          className="object-contain max-h-full"
                        />
                      </div>
                    ))}
                    {product.moreThumbCount && (
                      <div className="w-[28px] h-[28px] border border-[#dcdcdc] rounded flex items-center justify-center text-[11px] font-bold text-[#666666] bg-[#f9f9f9]">
                        +{product.moreThumbCount}
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="text-[11.5px] text-[#888888] line-clamp-1 mb-1">
                    {product.categories.join(", ")}
                  </div>

                  {/* Product Title */}
                  <h3 className="text-[13.5px] font-semibold text-[#0e8ce4] hover:text-[#ff3d3d] line-clamp-2 leading-snug mb-2 cursor-pointer">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[17px] font-bold text-[#141539]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[13px] text-[#999999] line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock progress bar (for PS4) */}
                  {product.sold !== undefined && product.available !== undefined && (
                    <div className="mt-1">
                      <div className="w-full h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-[#ff3d3d]"
                          style={{
                            width: `${(product.sold / (product.sold + product.available)) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#666666]">
                        <span>Sold: {product.sold}</span>
                        <span>Available: {product.available}</span>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* HOVER OVERLAY CARD (Exact Match to Image 2)              */}
                  {/* ========================================================= */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-white rounded-lg border-2 border-[#e0e0e0] p-4 flex flex-col justify-between shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                      {/* Top: Specifications Table + Quick Action Icons */}
                      <div className="flex items-start justify-between gap-3">
                        {/* Specs Table */}
                        <div className="space-y-1.5 text-[12px] flex-1">
                          {product.specs.map((s) => (
                            <div key={s.label} className="grid grid-cols-2 gap-2 leading-tight">
                              <span className="text-[#666666] font-normal">{s.label}</span>
                              <span className="text-[#141539] font-medium truncate">{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Quick Action Icons: Eye, Heart, Compare (Image 2) */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => showToast(`Quick view for ${product.name}`)}
                            className="w-8 h-8 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center text-[#555555] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors cursor-pointer"
                            aria-label="Quick View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toggleWishlist(product.id);
                              showToast(isLiked ? "Removed from wishlist" : "Added to wishlist!");
                            }}
                            className={`w-8 h-8 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center transition-colors cursor-pointer ${
                              isLiked
                                ? "text-[#ff3d3d] border-[#ff3d3d]"
                                : "text-[#555555] hover:text-[#ff3d3d] hover:border-[#ff3d3d]"
                            }`}
                            aria-label="Wishlist"
                          >
                            <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast("Added to compare list!")}
                            className="w-8 h-8 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center text-[#555555] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors cursor-pointer"
                            aria-label="Compare"
                          >
                            <ArrowLeftRight size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Delivery estimate */}
                      {product.deliveryDays && (
                        <div className="flex items-center gap-2 text-[12px] text-[#555555] my-2">
                          <Truck size={16} className="text-[#333e48]" />
                          <span>{product.deliveryDays} day delivery</span>
                        </div>
                      )}

                      {/* Bottom: Add to cart button (Bright Red matching Image 2) */}
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            status: "none",
                            image: product.image,
                            category: product.categories[0],
                          });
                          showToast(`Added ${product.name} to cart!`);
                        }}
                        className="w-full h-[40px] bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[13.5px] rounded-md transition-colors flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.99]"
                      >
                        Add to cart
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
