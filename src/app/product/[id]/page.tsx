"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  ShieldCheck,
  RotateCcw,
  Clock,
  Share2,
  Cpu,
  Battery,
  Volume2,
  Tv,
  MessageSquare,
  Sparkles,
  Package,
  ThumbsUp,
  MapPin,
  Lock,
} from "lucide-react";

// Gallery images for the Lenovo Tab M10 Plus
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
    alt: "Lenovo Tab M10 Plus Front 2K Display View",
  },
  {
    id: 3,
    thumb: "/images/lenovo-tab/thumb-3.png",
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Stand Mode View",
  },
  {
    id: 4,
    thumb: "/images/lenovo-tab/thumb-4.png",
    full: "/images/o_5001-540x540.webp",
    alt: "Lenovo Tab M10 Plus Dual-Tone Aluminum Back View",
  },
];

// Hardware Quick Highlights Bento Chips
const FEATURE_CHIPS = [
  {
    icon: Tv,
    title: "10.6\" 2K FHD IPS",
    subtitle: "2000 x 1200, 400 nits",
  },
  {
    icon: Cpu,
    title: "Helio G80 Octa-Core",
    subtitle: "Up to 2.0 GHz Speed",
  },
  {
    icon: Battery,
    title: "7,700 mAh Battery",
    subtitle: "Up to 14 Hours Streaming",
  },
  {
    icon: Volume2,
    title: "Quad Dolby Atmos®",
    subtitle: "Immersive 3D Acoustics",
  },
];

// Storage Options
const STORAGE_OPTIONS = [
  { id: "64gb", label: "64GB eMMC 5.1", priceDelta: 0, tag: "Standard" },
  { id: "128gb", label: "128GB eMMC 5.1", priceDelta: 25.0, tag: "Popular" },
  { id: "256gb", label: "256GB High-Speed", priceDelta: 50.0, tag: "Pro" },
];

// Color Options
const COLOR_OPTIONS = [
  { id: "storm-gray", name: "Storm Gray", hex: "#4b5563" },
  { id: "platinum-slate", name: "Platinum Slate", hex: "#94a3b8" },
];

// Frequently bought bundle accessories
const BUNDLE_ITEMS = [
  {
    id: "bundle-pen",
    name: "Lenovo Precision Active Stylus Pen 2",
    price: 34.99,
    image: "/images/lenovo-tab/rv-watch.png",
  },
  {
    id: "bundle-case",
    name: "Shockproof Magnetic Smart Stand Folio Cover",
    price: 18.99,
    image: "/images/lenovo-tab/rv-ps4.png",
  },
];

// Recently Viewed products
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
      "/images/lenovo-tab/w-th1.png",
      "/images/lenovo-tab/w-th2.png",
      "/images/lenovo-tab/w-th3.png",
    ],
    moreThumbCount: 1,
    specs: [
      { label: "Platform", value: "Android / iOS" },
      { label: "Display", value: "1.65\" AMOLED" },
      { label: "Color", value: "Desert Gold" },
      { label: "Brand", value: "Amazfit" },
      { label: "Battery Life", value: "7 Days" },
    ],
    deliveryDays: 2,
  },
  {
    id: "rv-ps4",
    categories: ["Gaming Accessories"],
    name: "Sony PlayStation 4 Pro 1TB White Edition Console (PS4)",
    price: 399.99,
    image: "/images/lenovo-tab/rv-ps4.png",
    thumbnails: [
      "/images/lenovo-tab/ps4-th1.png",
      "/images/lenovo-tab/ps4-th2.png",
      "/images/lenovo-tab/ps4-th3.png",
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
    deliveryDays: 2,
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
      "/images/lenovo-tab/lap-th1.png",
      "/images/lenovo-tab/lap-th2.png",
      "/images/lenovo-tab/lap-th3.png",
    ],
    moreThumbCount: 2,
    specs: [
      { label: "Screen Size", value: "15.6 Inches" },
      { label: "CPU Model", value: "Core i3" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "128 GB SSD" },
      { label: "Brand", value: "Acer" },
    ],
    deliveryDays: 3,
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
      "/images/lenovo-tab/cam-th1.png",
      "/images/lenovo-tab/cam-th2.png",
      "/images/lenovo-tab/cam-th3.png",
    ],
    moreThumbCount: 2,
    specs: [
      { label: "Sensor", value: "24.1MP APS-C CMOS" },
      { label: "Video", value: "4K UHD 24p" },
      { label: "Color", value: "White" },
      { label: "Brand", value: "Canon" },
      { label: "Lens", value: "EF-M 15-45mm STM" },
    ],
    deliveryDays: 2,
  },
];

export default function ProductSinglePage() {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState("64gb");
  const [selectedColor, setSelectedColor] = useState("storm-gray");
  const [addWarrantyShield, setAddWarrantyShield] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews" | "shipping">("desc");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Bundle selection checkboxes
  const [bundleIncludePen, setBundleIncludePen] = useState(true);
  const [bundleIncludeCase, setBundleIncludeCase] = useState(true);

  // Reviews filter
  const [reviewFilter, setReviewFilter] = useState<"all" | "5" | "4">("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: "Tariq Mahmood",
      verified: true,
      rating: 5,
      date: "3 days ago",
      city: "Karachi",
      title: "Superb tablet for technical docs and streaming",
      comment:
        "The 2K screen is exceptionally crisp for reviewing engineering diagrams and PDF datasheets. Quad Dolby Atmos speakers are very loud and clear. Delivered in 24 hours to Clifton Karachi with genuine seal intact.",
      likes: 14,
    },
    {
      id: 2,
      name: "Zainab Sheikh",
      verified: true,
      rating: 5,
      date: "1 week ago",
      city: "Lahore",
      title: "Long battery life and very lightweight",
      comment:
        "Easily lasts 2 full days of study and video calls. The aluminum build feels very premium and solid in hand. Very satisfied with IndustrialEdge service.",
      likes: 8,
    },
    {
      id: 3,
      name: "Usman Raza",
      verified: true,
      rating: 4,
      date: "2 weeks ago",
      city: "Islamabad",
      title: "Great value for money",
      comment:
        "Good performance for multitasking with split screen. Only thing is charging takes around 2.5 hours, but battery life is massive so no complaints.",
      likes: 5,
    },
  ]);

  // Zoom lens hover state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  // Hovered product for Recently Viewed
  const [hoveredRecentId, setHoveredRecentId] = useState<string | null>(null);

  // Sticky bottom bar detector
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        // Show sticky bar when user scrolls past the buy box
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2800);
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

  // Base price calculations
  const basePrice = 193.13;
  const storageDelta = STORAGE_OPTIONS.find((s) => s.id === selectedStorage)?.priceDelta || 0;
  const warrantyDelta = addWarrantyShield ? 18.0 : 0;
  const unitPrice = basePrice + storageDelta + warrantyDelta;
  const originalPrice = 229.0 + storageDelta;
  const discountSavings = originalPrice - unitPrice;
  const discountPercent = Math.round((discountSavings / originalPrice) * 100);

  // Product object for cart
  const currentProduct = {
    id: `lenovo-tab-m10-plus-${selectedStorage}`,
    name: `Lenovo Tab M10 Plus (3rd Gen) – 10.6'' 2K FHD – ${selectedStorage.toUpperCase()} Storage (${COLOR_OPTIONS.find((c) => c.id === selectedColor)?.name})`,
    price: unitPrice,
    status: "discount" as const,
    image: GALLERY_IMAGES[selectedImageIndex].full,
    category: "Laptop & Tablet",
    description: "Sleek, contemporary design with 10.61-inch 2K IPS display, quad speakers, and 7700mAh battery.",
  };

  const isLiked = isWishlisted(currentProduct.id);

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity, true);
    showToast(`Added ${quantity} item(s) to your shopping cart!`);
  };

  const handleBuyNow = () => {
    addToCart(currentProduct, quantity, false);
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Product link copied to clipboard!");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    const newRev = {
      id: Date.now(),
      name: reviewForm.name,
      verified: true,
      rating: reviewForm.rating,
      date: "Just now",
      city: "Pakistan",
      title: "Customer Review",
      comment: reviewForm.comment,
      likes: 0,
    };
    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setReviewForm({ name: "", rating: 5, comment: "" });
    showToast("Thank you! Your verified review has been published.");
  };

  // Bundle calculations
  const bundleTotalPrice =
    unitPrice +
    (bundleIncludePen ? BUNDLE_ITEMS[0].price : 0) +
    (bundleIncludeCase ? BUNDLE_ITEMS[1].price : 0) -
    10.0; // $10 bundle discount

  const handleAddBundle = () => {
    addToCart(currentProduct, 1, false);
    if (bundleIncludePen) {
      addToCart(
        {
          id: BUNDLE_ITEMS[0].id,
          name: BUNDLE_ITEMS[0].name,
          price: BUNDLE_ITEMS[0].price,
          status: "none",
          image: BUNDLE_ITEMS[0].image,
          category: "Accessories",
        },
        1,
        false
      );
    }
    if (bundleIncludeCase) {
      addToCart(
        {
          id: BUNDLE_ITEMS[1].id,
          name: BUNDLE_ITEMS[1].name,
          price: BUNDLE_ITEMS[1].price,
          status: "none",
          image: BUNDLE_ITEMS[1].image,
          category: "Accessories",
        },
        1,
        true
      );
    }
    showToast("Added complete combo bundle to cart with $10 savings!");
  };

  const currentImage = GALLERY_IMAGES[selectedImageIndex];

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen text-[#334155] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#15233e] text-white px-5 py-3.5 rounded-xl shadow-2xl text-sm flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200 border border-white/10">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={14} strokeWidth={2.5} />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            <div className="relative w-full h-[520px] flex items-center justify-center">
              <Image
                src={currentImage.full}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 850px"
              />
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-3">{currentImage.alt}</p>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-[#15233e]">Write a Customer Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={24}
                        fill={star <= reviewForm.rating ? "currentColor" : "none"}
                        className={star <= reviewForm.rating ? "text-amber-400" : "text-slate-300"}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-500 ml-2">
                    {reviewForm.rating} of 5 Stars
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="e.g. Asad Siddiqui"
                  className="w-full h-11 border border-slate-200 rounded-lg px-4 text-sm focus:outline-none focus:border-[#ff3d3d] focus:ring-1 focus:ring-[#ff3d3d]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Describe your hands-on experience, screen quality, battery longevity..."
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#ff3d3d] focus:ring-1 focus:ring-[#ff3d3d] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-sm rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1. Breadcrumb Bar & SKU Header */}
      <div className="w-full border-b border-[#e2e8f0] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#64748b]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#ff3d3d] transition-colors">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/shop" className="hover:text-[#ff3d3d] transition-colors">
              Products
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/shop?cat=Laptop%20%26%20Tablet" className="hover:text-[#ff3d3d] transition-colors">
              Laptop &amp; Tablet
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#15233e] font-semibold truncate max-w-[280px] sm:max-w-[420px]">
              Lenovo Tab M10 Plus (3rd Gen)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>SKU: <strong className="text-slate-800">IE-TAB-M10P-64</strong></span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">Brand: <strong className="text-slate-800">Lenovo</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Product Hero Stage */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-10">
        <div
          ref={buyBoxRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 bg-white p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#e2e8f0] shadow-sm relative"
        >
          {/* ========================================================= */}
          {/* LEFT: GALLERY & INTERACTIVE ZOOM LENS                     */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Image Stage */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="relative w-full max-w-[500px] h-[360px] sm:h-[420px] bg-gradient-to-b from-[#fafbfc] to-white flex items-center justify-center p-6 border border-slate-100 rounded-xl cursor-crosshair group select-none overflow-hidden"
            >
              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ff3d3d] text-white text-[11px] font-bold uppercase rounded-md shadow-xs tracking-wider">
                  -{discountPercent}% OFF
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-md shadow-xs">
                  <ShieldCheck size={12} />
                  1-Yr Official Warranty
                </span>
              </div>

              {/* Quick Floating Action Cluster */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                {/* Wishlist */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(currentProduct.id);
                    showToast(isLiked ? "Removed from wishlist" : "Added to your wishlist!");
                  }}
                  className={`w-9 h-9 rounded-full bg-white border flex items-center justify-center transition-all shadow-sm hover:scale-110 cursor-pointer ${
                    isLiked
                      ? "border-[#ff3d3d] text-[#ff3d3d]"
                      : "border-slate-200 text-slate-600 hover:text-[#ff3d3d] hover:border-[#ff3d3d]"
                  }`}
                  title="Save to Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                </button>

                {/* Share Link */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 flex items-center justify-center transition-all shadow-sm hover:scale-110 cursor-pointer"
                  title="Share Product"
                  aria-label="Share"
                >
                  <Share2 size={15} />
                </button>

                {/* Fullscreen Lightbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 flex items-center justify-center transition-all shadow-sm hover:scale-110 cursor-pointer"
                  title="Full View"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Main Image Viewport */}
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={currentImage.full}
                  alt={currentImage.alt}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </div>

              {/* Prev Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 border border-slate-200 flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 border border-slate-200 flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>

              {/* Zoom Lens Box */}
              {isZooming && (
                <div
                  className="absolute pointer-events-none border-2 border-[#ff3d3d]/60 bg-[#ff3d3d]/10 rounded shadow-sm"
                  style={{
                    width: "160px",
                    height: "140px",
                    left: `${Math.max(0, Math.min(zoomPos.x - 80, 500 - 160))}px`,
                    top: `${Math.max(0, Math.min(zoomPos.y - 70, 420 - 140))}px`,
                  }}
                />
              )}
            </div>

            {/* Magnified Zoom Preview Popup */}
            {isZooming && (
              <div
                className="hidden xl:block absolute left-[52%] top-6 w-[520px] h-[520px] bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 pointer-events-none overflow-hidden"
                style={{
                  backgroundImage: `url(${currentImage.full})`,
                  backgroundPosition: `${zoomPos.bgX}% ${zoomPos.bgY}%`,
                  backgroundSize: "280%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {/* Thumbnail Carousel Bar */}
            <div className="flex items-center gap-3 mt-5">
              {GALLERY_IMAGES.map((img, index) => {
                const isSelected = selectedImageIndex === index;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-[66px] h-[60px] p-1.5 rounded-xl bg-white border transition-all cursor-pointer flex items-center justify-center overflow-hidden ${
                      isSelected
                        ? "border-2 border-[#ff3d3d] shadow-sm ring-2 ring-[#ff3d3d]/20 scale-105"
                        : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.full}
                      alt={img.alt}
                      width={52}
                      height={48}
                      className="object-contain max-h-full"
                    />
                  </button>
                );
              })}
            </div>

            {/* 4 Feature Bento Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-7 pt-6 border-t border-slate-100">
              {FEATURE_CHIPS.map((chip) => {
                const IconComp = chip.icon;
                return (
                  <div
                    key={chip.title}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl transition-colors flex flex-col items-center text-center"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#ff3d3d] mb-1.5 shadow-2xs">
                      <IconComp size={16} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold text-[#15233e] leading-snug">{chip.title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{chip.subtitle}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: PRODUCT DETAILS & BUY BOX                          */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Product Brand & Category */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0ea57a] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Official Lenovo Partner
                </span>
                <span className="text-xs text-slate-500">Model: TB125FU</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#15233e] leading-tight tracking-tight mb-3">
                Lenovo Tab M10 Plus (3rd Gen) – 10.6'' 2K IPS Display – Octa-Core Android Tablet
              </h1>

              {/* Ratings and Reviews summary */}
              <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-800">4.7</span>
                </div>
                <span className="text-slate-300">•</span>
                <a
                  href="#reviews"
                  onClick={() => setActiveTab("reviews")}
                  className="text-xs font-semibold text-[#0ea57a] hover:underline cursor-pointer"
                >
                  128 Verified Ratings
                </a>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">34 Answered Tech Inquiries</span>
              </div>

              {/* Price Block */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80 mb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl sm:text-4xl font-black text-[#ff3d3d] tracking-tight">
                    ${unitPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Save ${discountSavings.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <strong className="text-emerald-700 font-semibold">In Stock</strong> — 8 units left at Karachi distribution center
                </div>
              </div>

              {/* Storage Capacity Selector */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span>Storage Capacity</span>
                  <span className="text-slate-500 normal-case font-normal">Expandable up to 1TB microSD</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {STORAGE_OPTIONS.map((opt) => {
                    const isSelected = selectedStorage === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedStorage(opt.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#ff3d3d] bg-white ring-2 ring-[#ff3d3d]/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs font-bold text-[#15233e]">{opt.label}</span>
                          {opt.tag && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                isSelected ? "bg-[#ff3d3d] text-white" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {opt.tag}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {opt.priceDelta === 0 ? "Standard" : `+$${opt.priceDelta.toFixed(2)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Color: <strong className="text-slate-900 capitalize">{COLOR_OPTIONS.find((c) => c.id === selectedColor)?.name}</strong>
                </span>
                <div className="flex items-center gap-3">
                  {COLOR_OPTIONS.map((col) => {
                    const isSelected = selectedColor === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectedColor(col.id)}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#ff3d3d] bg-white ring-2 ring-[#ff3d3d]/20 font-bold"
                            : "border-slate-200 bg-white hover:border-slate-400 font-medium"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 inline-block shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-xs text-slate-700">{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Protection Plan Addon */}
              <div className="mb-6 p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addWarrantyShield}
                    onChange={(e) => setAddWarrantyShield(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#ff3d3d] rounded border-slate-300 focus:ring-[#ff3d3d]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#15233e]">
                      <span>Add 1-Year IndustrialEdge Shield™ Extended Warranty</span>
                      <span className="text-[#ff3d3d]">+$18.00</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Includes 100% replacement coverage for screen breakage, water drops, and sudden surge protection.
                    </p>
                  </div>
                </label>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                {/* Stepper + Primary Add to Cart */}
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs h-12 px-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-base font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-9 text-center text-sm font-bold text-[#15233e]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-base font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button (Bright Red, triggers Drawer) */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                  >
                    <ShoppingCart size={18} strokeWidth={2.2} />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Secondary Actions: Buy Now + WhatsApp Consultation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="h-11 bg-[#15233e] hover:bg-[#0f172a] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Lock size={14} />
                    <span>Buy Now — Instant Checkout</span>
                  </button>

                  <a
                    href="https://wa.me/923322316225?text=Hi%20IndustrialEdge%2C%20I%20have%20an%20inquiry%20regarding%20the%20Lenovo%20Tab%20M10%20Plus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Trust and Delivery Assurance Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7 pt-5 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#ff3d3d] shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#0ea57a] shrink-0" />
                <span>1-Year Official Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-[#ff3d3d] shrink-0" />
                <span>7-Day Replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#0ea57a] shrink-0" />
                <span>Karachi Saddar Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. FREQUENTLY BOUGHT TOGETHER (COMBO BUNDLE BLOCK)        */}
        {/* ========================================================= */}
        <div className="mt-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-[#ff3d3d]" />
            <h2 className="text-lg font-bold text-[#15233e]">Frequently Bought Together</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded ml-2">
              Save $10.00 Bundle Discount
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Item Chain */}
            <div className="lg:col-span-8 flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Product 1: The Tablet */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                  <Image
                    src={GALLERY_IMAGES[0].full}
                    alt="Lenovo Tab"
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#15233e] block line-clamp-1 max-w-[170px]">
                    Lenovo Tab M10 Plus
                  </span>
                  <span className="text-xs font-bold text-[#ff3d3d]">${unitPrice.toFixed(2)}</span>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-300">+</span>

              {/* Product 2: Precision Stylus */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                  <Image
                    src={BUNDLE_ITEMS[0].image}
                    alt={BUNDLE_ITEMS[0].name}
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bundleIncludePen}
                      onChange={(e) => setBundleIncludePen(e.target.checked)}
                      className="rounded text-[#ff3d3d] focus:ring-[#ff3d3d]"
                    />
                    <span className="text-xs font-semibold text-slate-700 block line-clamp-1 max-w-[160px]">
                      Active Stylus Pen
                    </span>
                  </label>
                  <span className="text-xs font-bold text-slate-900">${BUNDLE_ITEMS[0].price}</span>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-300">+</span>

              {/* Product 3: Smart Folio Case */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-slate-200 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                  <Image
                    src={BUNDLE_ITEMS[1].image}
                    alt={BUNDLE_ITEMS[1].name}
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bundleIncludeCase}
                      onChange={(e) => setBundleIncludeCase(e.target.checked)}
                      className="rounded text-[#ff3d3d] focus:ring-[#ff3d3d]"
                    />
                    <span className="text-xs font-semibold text-slate-700 block line-clamp-1 max-w-[160px]">
                      Smart Folio Cover
                    </span>
                  </label>
                  <span className="text-xs font-bold text-slate-900">${BUNDLE_ITEMS[1].price}</span>
                </div>
              </div>
            </div>

            {/* Bundle Price & Add Button */}
            <div className="lg:col-span-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 block">Total Combo Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#15233e]">
                    ${bundleTotalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Save $10.00
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddBundle}
                className="w-full sm:w-auto lg:w-full h-11 bg-[#15233e] hover:bg-[#ff3d3d] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Package size={16} />
                <span>Add 3 Items to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. TABS: Description | Specifications | Reviews | Shipping*/}
        {/* ========================================================= */}
        <div id="reviews" className="mt-12 bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
          {/* Tab Navigation Bar */}
          <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-6 sm:px-8 flex flex-wrap items-center gap-2 sm:gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`py-4 text-sm font-bold transition-all cursor-pointer border-b-2 relative ${
                activeTab === "desc"
                  ? "text-[#ff3d3d] border-[#ff3d3d]"
                  : "text-slate-600 border-transparent hover:text-[#ff3d3d]"
              }`}
            >
              Description &amp; Highlights
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`py-4 text-sm font-bold transition-all cursor-pointer border-b-2 relative ${
                activeTab === "specs"
                  ? "text-[#ff3d3d] border-[#ff3d3d]"
                  : "text-slate-600 border-transparent hover:text-[#ff3d3d]"
              }`}
            >
              Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`py-4 text-sm font-bold transition-all cursor-pointer border-b-2 relative flex items-center gap-2 ${
                activeTab === "reviews"
                  ? "text-[#ff3d3d] border-[#ff3d3d]"
                  : "text-slate-600 border-transparent hover:text-[#ff3d3d]"
              }`}
            >
              <span>Customer Reviews</span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                {reviewsList.length + 125}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`py-4 text-sm font-bold transition-all cursor-pointer border-b-2 relative ${
                activeTab === "shipping"
                  ? "text-[#ff3d3d] border-[#ff3d3d]"
                  : "text-slate-600 border-transparent hover:text-[#ff3d3d]"
              }`}
            >
              Shipping &amp; Warranty Policy
            </button>
          </div>

          {/* Tab 1 Content: Description */}
          {activeTab === "desc" && (
            <div className="p-6 sm:p-10 space-y-8 animate-in fade-in duration-150">
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-[#15233e] mb-3">
                  Cinematic 2K Entertainment Meets All-Day Productive Power
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The Lenovo Tab M10 Plus (3rd Gen) pairs sleek portability with an immersive 10.61&quot; 2K FHD IPS
                  display. Stream Netflix, Disney+, and YouTube in razor-sharp 1080p resolution backed by a quad-speaker
                  array fine-tuned with Dolby Atmos® spatial acoustics.
                </p>
              </div>

              {/* 2 Feature Visual Banners Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative w-full h-[260px] sm:h-[300px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src="/images/lenovo-tab/desc-feature-1.png"
                    alt="Entertainment with Kids UI and Apps"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative w-full h-[260px] sm:h-[300px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src="/images/lenovo-tab/desc-feature-2.png"
                    alt="Yellowjackets Video Streaming Display"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Key Highlights Checklist */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-[#15233e] uppercase tracking-wider mb-4">
                  Key Capabilities at a Glance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Check size={18} className="text-[#0ea57a] shrink-0 mt-0.5" />
                    <span><strong>Immersive Reading Mode:</strong> Simulates book pages to reduce eye fatigue during long sessions.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={18} className="text-[#0ea57a] shrink-0 mt-0.5" />
                    <span><strong>Quad Dolby Atmos® Speakers:</strong> Four independent speakers envelope you with rich room-filling audio.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={18} className="text-[#0ea57a] shrink-0 mt-0.5" />
                    <span><strong>Slim Aluminum Unibody:</strong> 7.45mm thin profile and starts at just 465g for everyday travel.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={18} className="text-[#0ea57a] shrink-0 mt-0.5" />
                    <span><strong>Android 12 with Guaranteed Updates:</strong> 3 years of enterprise security patches and updates.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2 Content: Technical Specifications */}
          {activeTab === "specs" && (
            <div className="p-6 sm:p-10 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-[#15233e] mb-5">
                Technical Specifications &amp; Hardware Components
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden max-w-3xl">
                {[
                  { k: "Operating System", v: "Android 12 (upgradable with 3 years security patches)" },
                  { k: "Processor (CPU)", v: "MediaTek Helio G80 Octa-core (2x2.0 GHz Cortex-A75 & 6x1.8 GHz Cortex-A55)" },
                  { k: "Graphics (GPU)", v: "ARM Mali-G52 MC2" },
                  { k: "Display Type", v: "10.61-inch 2K IPS LCD, 400 nits, 72% NTSC color gamut, TUV Low Blue Light certified" },
                  { k: "Display Resolution", v: "2000 x 1200 pixels (~213 ppi density)" },
                  { k: "Internal Memory & RAM", v: "4GB LPDDR4x RAM + 64GB / 128GB / 256GB eMMC 5.1" },
                  { k: "Expandable Storage", v: "MicroSD slot supporting FAT32 up to 256GB, exFAT up to 1TB" },
                  { k: "Audio & Microphones", v: "Quad stereo speakers with Dolby Atmos; dual microphone array" },
                  { k: "Cameras", v: "Rear: 8MP auto-focus | Front: 8MP fixed-focus selfie camera" },
                  { k: "Battery Capacity", v: "7700 mAh Li-Po (Up to 14 hours web browsing / 12 hours video playback)" },
                  { k: "Charging", v: "Supports up to 20W Quick Charge (10W charger in box)" },
                  { k: "Wireless Connectivity", v: "Wi-Fi 802.11 a/b/g/n/ac (2.4GHz & 5GHz), Bluetooth 5.0" },
                  { k: "Ports", v: "USB Type-C 2.0 (charging & audio), 3.5mm Headphone Jack, MicroSD slot" },
                  { k: "Chassis Dimensions", v: "251.2 x 158.8 x 7.45 mm (9.89 x 6.25 x 0.29 inches)" },
                  { k: "Net Weight", v: "465 grams (1.03 lbs)" },
                ].map((row, i) => (
                  <div
                    key={row.k}
                    className={`grid grid-cols-1 sm:grid-cols-[220px_1fr] px-5 py-3 text-sm ${
                      i % 2 === 0 ? "bg-slate-50/60" : "bg-white"
                    } border-b border-slate-100 last:border-b-0`}
                  >
                    <span className="font-bold text-[#15233e]">{row.k}</span>
                    <span className="text-slate-600">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3 Content: Customer Reviews */}
          {activeTab === "reviews" && (
            <div className="p-6 sm:p-10 animate-in fade-in duration-150 space-y-8">
              {/* Rating Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
                <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8">
                  <div className="text-5xl font-black text-[#15233e]">4.7</div>
                  <div className="flex justify-center md:justify-start text-amber-400 my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={20} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Based on 128 verified customer experiences</p>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="mt-4 px-5 py-2.5 bg-[#15233e] hover:bg-[#ff3d3d] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Rating Distribution Bars */}
                <div className="md:col-span-8 space-y-2">
                  {[
                    { stars: "5 Star", pct: 78, count: 100 },
                    { stars: "4 Star", pct: 15, count: 19 },
                    { stars: "3 Star", pct: 5, count: 6 },
                    { stars: "2 Star", pct: 1, count: 2 },
                    { stars: "1 Star", pct: 1, count: 1 },
                  ].map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-semibold text-slate-600 shrink-0">{bar.stars}</span>
                      <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-slate-400 shrink-0">{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#15233e]">{rev.name}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Check size={10} strokeWidth={3} /> Verified Buyer
                          </span>
                        )}
                        <span className="text-xs text-slate-400">• {rev.city}</span>
                      </div>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= rev.rating ? "currentColor" : "none"}
                          className={s <= rev.rating ? "text-amber-400" : "text-slate-300"}
                        />
                      ))}
                    </div>

                    <h4 className="text-sm font-bold text-[#15233e] mb-1">{rev.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{rev.comment}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <button
                        type="button"
                        onClick={() => showToast("Thanks for the helpfulness feedback!")}
                        className="inline-flex items-center gap-1 hover:text-slate-700 cursor-pointer"
                      >
                        <ThumbsUp size={13} />
                        <span>Helpful ({rev.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4 Content: Shipping & Warranty */}
          {activeTab === "shipping" && (
            <div className="p-6 sm:p-10 animate-in fade-in duration-150 space-y-6">
              <div className="max-w-2xl space-y-5 text-sm text-slate-600">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-[#15233e] text-base mb-2">
                    Nationwide Dispatch &amp; Delivery Timelines
                  </h4>
                  <ul className="space-y-2 list-disc pl-5 text-xs text-slate-600">
                    <li><strong>Karachi:</strong> Same-day or Next-day delivery for orders placed before 3:00 PM.</li>
                    <li><strong>Lahore, Islamabad, Rawalpindi:</strong> 24 to 48 hours via express air courier.</li>
                    <li><strong>Rest of Pakistan:</strong> 2 to 4 business days.</li>
                    <li><strong>Local Warehouse Pickup:</strong> Available at Suite M-107 Odeon Center Regal Chowk Saddar Karachi.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-[#15233e] text-base mb-2">
                    Warranty &amp; Replacement Protection
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Every hardware shipment from <strong>IndustrialEdge.pk</strong> includes a verifiable manufacturer warranty card.
                    If you encounter any transit damage or factory defect, you are covered by our 7-Day Replacement Guarantee.
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    For warranty claims: Email <a href="mailto:info@industrialedge.pk" className="text-[#ff3d3d] underline">info@industrialedge.pk</a> or WhatsApp +92 332 2316225.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 5. RECENTLY VIEWED HARDWARE (WITH ACTIVE HOVER STATES)    */}
        {/* ========================================================= */}
        <div className="mt-14 mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-[#15233e]">
                Recently Viewed &amp; Recommended Hardware
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Complementary enterprise electronics and gadgets</p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#ff3d3d] hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {RECENTLY_VIEWED.map((product) => {
              const isHovered = hoveredRecentId === product.id;
              const isLikedItem = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredRecentId(product.id)}
                  onMouseLeave={() => setHoveredRecentId(null)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 transition-all duration-200 hover:shadow-lg hover:border-slate-300 flex flex-col justify-between group"
                >
                  {/* Upper Stage: Fixed height (240px) */}
                  <div className="relative w-full h-[220px] mb-3">
                    {/* Normal State: Centered Large Image */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center p-2 transition-opacity duration-200 ${
                        isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={180}
                        className="object-contain max-h-[190px] w-auto transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>

                    {/* Hover State: Specs + Action Icons + Delivery + Add to Cart */}
                    <div
                      className={`absolute inset-0 bg-white flex flex-col justify-between py-1 transition-opacity duration-200 z-10 ${
                        isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {/* Top: Specs List + Right-Aligned Action Buttons */}
                      <div className="flex items-start justify-between gap-2">
                        {/* Specs Key-Value Table */}
                        <div className="space-y-1 text-[11px] flex-1 min-w-0 pr-1">
                          {product.specs.map((s) => (
                            <div key={s.label} className="grid grid-cols-[75px_1fr] gap-1 leading-tight">
                              <span className="text-slate-400 font-medium">{s.label}:</span>
                              <span className="text-slate-800 font-semibold truncate">{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* 3 Circular Action Buttons Stacked */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => showToast(`Quick view for ${product.name}`)}
                            className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#ff3d3d] hover:border-[#ff3d3d] transition-colors cursor-pointer shadow-2xs"
                            title="Quick View"
                            aria-label="Quick View"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toggleWishlist(product.id);
                              showToast(isLikedItem ? "Removed from wishlist" : "Added to wishlist!");
                            }}
                            className={`w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${
                              isLikedItem
                                ? "text-[#ff3d3d] border-[#ff3d3d]"
                                : "text-slate-500 hover:text-[#ff3d3d] hover:border-[#ff3d3d]"
                            }`}
                            title="Wishlist"
                            aria-label="Wishlist"
                          >
                            <Heart size={13} fill={isLikedItem ? "currentColor" : "none"} />
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast("Added to compare list!")}
                            className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#ff3d3d] hover:border-[#ff3d3d] transition-colors cursor-pointer shadow-2xs"
                            title="Compare"
                            aria-label="Compare"
                          >
                            <ArrowLeftRight size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Delivery Estimate */}
                      {product.deliveryDays && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1 mb-2">
                          <Truck size={14} className="text-[#0ea57a]" />
                          <span>{product.deliveryDays} Day Express Delivery</span>
                        </div>
                      )}

                      {/* Bottom: Bright Red Add to Cart Button */}
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
                        className="w-full h-9 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99]"
                      >
                        <ShoppingCart size={14} />
                        <span>Add to cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Lower Part: Thumbnails + Category + Title + Price */}
                  <div>
                    {/* Category */}
                    <span className="text-[11px] text-slate-400 font-medium block truncate mb-1">
                      {product.categories[0]}
                    </span>

                    {/* Product Title */}
                    <h3 className="text-xs font-bold text-[#15233e] hover:text-[#ff3d3d] line-clamp-2 leading-snug mb-2 cursor-pointer transition-colors">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-[#15233e]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
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

      {/* ========================================================= */}
      {/* 6. STICKY QUICK BUY BAR (APPEARS ON SCROLL PAST BUY BOX)  */}
      {/* ========================================================= */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-8 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            {/* Left: Thumbnail & Name */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg border border-slate-200 p-0.5 bg-slate-50 shrink-0 hidden sm:flex items-center justify-center">
                <Image
                  src={currentImage.full}
                  alt={currentProduct.name}
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#15233e] truncate max-w-[280px] sm:max-w-[460px]">
                  {currentProduct.name}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#ff3d3d]">${unitPrice.toFixed(2)}</span>
                  <span className="text-slate-400 line-through text-[11px]">${originalPrice.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">In Stock</span>
                </div>
              </div>
            </div>

            {/* Right: Stepper & Add to Cart Action */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:inline-flex items-center border border-slate-300 rounded-lg bg-white h-9 px-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer font-bold text-xs"
                >
                  -
                </button>
                <span className="w-7 text-center text-xs font-bold text-[#15233e]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer font-bold text-xs"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="h-10 px-5 sm:px-7 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <ShoppingCart size={16} strokeWidth={2.2} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
