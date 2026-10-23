"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Grid,
  List,
  ChevronRight,
  Eye,
  Heart,
  ShoppingCart,
  Star,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useStore, type Product } from "@/lib/store";

// Top Circular Categories (Image 1 Carousel)
interface TopCategoryItem {
  id: string;
  name: string;
  displayName: string;
  image: string;
}

const TOP_CATEGORIES: TopCategoryItem[] = [
  {
    id: "apple",
    name: "Apple products",
    displayName: "Apple products",
    image: "/images/apple-imac.jpg",
  },
  {
    id: "audio",
    name: "Audio Equipments",
    displayName: "Audio Equipme...",
    image: "/images/bose-speaker.png",
  },
  {
    id: "camera",
    name: "Camera & Video",
    displayName: "Camera & Video",
    image: "/images/o_3801-540x540.webp",
  },
  {
    id: "computers",
    name: "Computers & Accessories",
    displayName: "Computers &...",
    image: "/images/o_3701-540x540.webp",
  },
  {
    id: "furniture",
    name: "Game & Room Furniture",
    displayName: "Game & Room...",
    image: "/images/gaming-chair.jpg",
  },
  {
    id: "gaming",
    name: "Gaming Accessories",
    displayName: "Gaming Accesso...",
    image: "/images/xbox-controller.png",
  },
  {
    id: "headphone",
    name: "Headphone",
    displayName: "Headphone...",
    image: "/images/beats-headphones.png",
  },
  {
    id: "laptop",
    name: "Laptop & Tablet",
    displayName: "Laptop & Tablet",
    image: "/images/o_3603-540x540.webp",
  },
];

// Sidebar Filter Categories
const SIDEBAR_CATEGORIES = [
  { name: "Apple products", hasSub: true },
  { name: "Audio Equipments", hasSub: false },
  { name: "Camera & Video", hasSub: false },
  { name: "Computers & Accessories", hasSub: false },
  { name: "Game & Room Furniture", hasSub: false },
  { name: "Gaming Accessories", hasSub: false },
  { name: "Headphone", hasSub: true },
  { name: "Laptop & Tablet", hasSub: true },
  { name: "Server & Workstation", hasSub: false },
  { name: "Smartphone", hasSub: false },
  { name: "Smartwatch", hasSub: false },
  { name: "Sensor & Digital Devices", hasSub: false },
  { name: "TV & Computer Screen", hasSub: false },
];

// Sidebar Brands
const SIDEBAR_BRANDS = [
  "Acer",
  "Amazon",
  "Apple",
  "ASUS",
  "Canon",
  "HP",
  "Huawei",
  "Leica",
  "Lenovo",
  "Samsung",
  "Sony",
  "Xbox",
];

export interface ShopProductItem {
  id: string;
  name: string;
  shortName: string;
  categoryLine: string;
  categories: string[];
  brand: string;
  price: number;
  originalPrice?: number;
  mainImage: string;
  thumbnails: string[];
  moreThumbnailsCount: number;
  rating: number;
  reviewsCount?: number;
  description: string;
}

const SHOP_PRODUCTS: ShopProductItem[] = [
  // 1
  {
    id: "p-acer-aspire-5",
    name: "Acer Aspire 5 A515-56-547N Slim Laptop – 15.6\" Full HD IPS Display – 11th Gen Intel i3",
    shortName: "Acer Aspire 5 A515-56-547N Slim Laptop – 15...",
    categoryLine:
      "Acer, Apple products, Computers & Accessories, Gaming Accessories, Laptop & Tablet",
    categories: [
      "Acer",
      "Apple products",
      "Computers & Accessories",
      "Gaming Accessories",
      "Laptop & Tablet",
    ],
    brand: "Acer",
    price: 529.75,
    mainImage: "/images/o_3603-540x540.webp",
    thumbnails: [
      "/images/o_3603-540x540.webp",
      "/images/lenovo-tab/lap-th1.png",
      "/images/lenovo-tab/lap-th2.png",
    ],
    moreThumbnailsCount: 2,
    rating: 5,
    description:
      "Powerful 11th Gen Intel Core i3 processor, 15.6-inch Full HD IPS display with narrow bezels, ergonomic hinge, and all-day battery life.",
  },
  // 2
  {
    id: "p-airpods-2nd-gen",
    name: "AirPods (2nd generation) with Wired Charging Case",
    shortName: "AirPods (2nd generation) with Wired Charging ...",
    categoryLine: "AirPods, Apple products, Earbuds, Headphone",
    categories: ["AirPods", "Apple products", "Earbuds", "Headphone"],
    brand: "Apple",
    price: 129.0,
    mainImage: "/images/o_2003-540x540.webp",
    thumbnails: [
      "/images/o_2003-540x540.webp",
      "/images/o_2101-540x540.webp",
    ],
    moreThumbnailsCount: 2,
    rating: 5,
    description:
      "Effortless setup, high-quality audio, hands-free Siri access, and over 24 hours of listening time with the charging case.",
  },
  // 3
  {
    id: "p-airpods-3rd-gen",
    name: "AirPods (3rd generation) with Lightning Charging Case",
    shortName: "AirPods (3rd generation) with Lightning Chargi...",
    categoryLine: "AirPods, Apple products, Earbuds, Headphone",
    categories: ["AirPods", "Apple products", "Earbuds", "Headphone"],
    brand: "Apple",
    price: 169.0,
    mainImage: "/images/o_2101-540x540.webp",
    thumbnails: [
      "/images/o_2101-540x540.webp",
      "/images/o_2003-540x540.webp",
    ],
    moreThumbnailsCount: 1,
    rating: 5,
    description:
      "Personalized Spatial Audio with dynamic head tracking, sweat and water resistance, and contoured design with force sensor control.",
  },
  // 4
  {
    id: "p-amazfit-gts-2",
    name: "AMAZFIT GTS 2 Smart Watch for Men Android iPhone, Bluetooth Phone Call",
    shortName: "AMAZFIT GTS 2 Smart Watch for Men Android...",
    categoryLine: "Accessories, Gaming Accessories, Smartwatch",
    categories: [
      "Accessories",
      "Gaming Accessories",
      "Smartwatch",
      "Apple products",
    ],
    brand: "Apple",
    price: 134.99,
    mainImage: "/images/o_0601-540x540.webp",
    thumbnails: [
      "/images/o_0601-540x540.webp",
      "/images/lenovo-tab/w-th1.png",
    ],
    moreThumbnailsCount: 1,
    rating: 4.8,
    description:
      "Curved 3D bezel-less design, all-round health tracking, 90 built-in sports modes, and Bluetooth phone call support.",
  },
  // 5
  {
    id: "p-amazon-fire-hd8",
    name: "Amazon Fire HD 8 Tablet, 2 GB RAM, 32 GB, Black",
    shortName: "Amazon Fire HD 8 Tablet, 2 GB RAM, 32 GB, Black...",
    categoryLine:
      "Amazon, Apple products, Computers & Accessories, Gaming Accessories, Laptop & Tablet",
    categories: [
      "Amazon",
      "Apple products",
      "Computers & Accessories",
      "Gaming Accessories",
      "Laptop & Tablet",
    ],
    brand: "Amazon",
    price: 98.99,
    mainImage: "/images/o_1101-540x540.webp",
    thumbnails: [
      "/images/o_1101-540x540.webp",
      "/images/o_5001-540x540.webp",
    ],
    moreThumbnailsCount: 1,
    rating: 4.5,
    description:
      "8-inch vibrant HD display, 30% faster quad-core processor, all-day battery life up to 12 hours, and enhanced USB-C charging.",
  },
  // 6
  {
    id: "p-amazon-fire-tv-50",
    name: "Amazon Fire TV 50\" 4-Series 4K UHD smart TV",
    shortName: "Amazon Fire TV 50\" 4-Series 4K UHD smart TV",
    categoryLine:
      "Apple products, Computers & Accessories, Gaming Accessories, TV & Computer Screen",
    categories: [
      "Apple products",
      "Computers & Accessories",
      "Gaming Accessories",
      "TV & Computer Screen",
    ],
    brand: "Amazon",
    price: 299.99,
    mainImage: "/images/o_1301-540x540.webp",
    thumbnails: [
      "/images/o_1301-540x540.webp",
      "/images/o_4301-540x540.webp",
    ],
    moreThumbnailsCount: 2,
    rating: 4.6,
    description:
      "Stunning 4K Ultra HD, HDR 10, and HLG provide clear picture and vivid colors. Control entertainment hands-free with Alexa Voice Remote.",
  },
  // 7
  {
    id: "p-apple-airpods-max",
    name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
    shortName: "Apple AirPods Max Wireless Over-Ear...",
    categoryLine: "AirPods, Apple products, Headphone, Over Ear",
    categories: ["AirPods", "Apple products", "Headphone", "Over Ear"],
    brand: "Apple",
    price: 549.0,
    mainImage: "/images/product-airpods-max.webp",
    thumbnails: [
      "/images/product-airpods-max.webp",
      "/images/beats-headphones.png",
    ],
    moreThumbnailsCount: 1,
    rating: 5,
    description:
      "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise, so you can immerse yourself in music.",
  },
  // 8
  {
    id: "p-apple-iphone-11-pro-max-1",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold (Copy)",
    shortName: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold ...",
    categoryLine: "Apple products, Iphone, Smartphone",
    categories: ["Apple products", "Iphone", "Smartphone"],
    brand: "Apple",
    price: 475.0,
    mainImage: "/images/o_4901-540x540.webp",
    thumbnails: [
      "/images/o_4901-540x540.webp",
      "/images/lenovo-tab/tab-front.png",
    ],
    moreThumbnailsCount: 1,
    rating: 4.9,
    description:
      "Fully unlocked and compatible with any carrier of choice. Stunning 6.5-inch Super Retina XDR OLED display with A13 Bionic chip.",
  },
  // 9
  {
    id: "p-apple-iphone-11-pro-max-2",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold",
    shortName: "Apple iPhone 11 Pro Max, US Version, 64GB, Gol...",
    categoryLine: "Apple products, Iphone, Smartphone",
    categories: ["Apple products", "Iphone", "Smartphone"],
    brand: "Apple",
    price: 475.0,
    mainImage: "/images/o_4901-540x540.webp",
    thumbnails: [
      "/images/o_4901-540x540.webp",
      "/images/lenovo-tab/tab-front.png",
    ],
    moreThumbnailsCount: 1,
    rating: 4.9,
    description:
      "Triple-camera system with 12MP Ultra Wide, Wide, and Telephoto cameras; Night mode and 4K video recording up to 60 fps.",
  },
  // 10
  {
    id: "p-apple-watch-series-5",
    name: "Apple Watch Series 5 (GPS + Cellular, 40MM - Gold Aluminum Case with Pink Sand Sport Band)",
    shortName: "Apple Watch Series 5 (GPS + Cellular, 40MM - ...",
    categoryLine: "Apple products, Apple Watch, Smartwatch",
    categories: ["Apple products", "Apple Watch", "Smartwatch"],
    brand: "Apple",
    price: 215.19,
    mainImage: "/images/o_4801-540x540.webp",
    thumbnails: [
      "/images/o_4801-540x540.webp",
      "/images/lenovo-tab/w-th1.png",
    ],
    moreThumbnailsCount: 2,
    rating: 4.8,
    description:
      "Always-On Retina display, electrical and optical heart sensors, built-in compass, and emergency SOS for ultimate health monitoring.",
  },
  // 11
  {
    id: "p-apple-watch-series-6",
    name: "Apple Watch Series 6 (GPS + Cellular, 40mm - Space Gray Aluminum Case with Black Sport Band)",
    shortName: "Apple Watch Series 6 (GPS + Cellular, 40mm - ...",
    categoryLine: "Apple products, Apple Watch, Smartwatch",
    categories: ["Apple products", "Apple Watch", "Smartwatch"],
    brand: "Apple",
    price: 219.52,
    mainImage: "/images/o_4601-540x540.webp",
    thumbnails: [
      "/images/o_4601-540x540.webp",
      "/images/o_2901-540x540.webp",
    ],
    moreThumbnailsCount: 2,
    rating: 4.8,
    description:
      "Measure your blood oxygen level with a revolutionary sensor and app. Take an ECG anytime, anywhere on the Always-On Retina display.",
  },
  // 12
  {
    id: "p-asus-zenbook-flip-13",
    name: "ASUS ZenBook Flip 13 Ultra Slim Convertible Laptop, 13.3\" OLED FHD Touch Display",
    shortName: "ASUS ZenBook Flip 13 Ultra Slim Convertible...",
    categoryLine:
      "Apple products, ASUS, Computers & Accessories, Gaming Accessories, Laptop & Tablet",
    categories: [
      "Apple products",
      "ASUS",
      "Computers & Accessories",
      "Gaming Accessories",
      "Laptop & Tablet",
    ],
    brand: "ASUS",
    price: 1052.72,
    mainImage: "/images/o_4001-540x540.webp",
    thumbnails: [
      "/images/o_4001-540x540.webp",
      "/images/lenovo-tab/lap-th1.png",
    ],
    moreThumbnailsCount: 2,
    rating: 4.7,
    description:
      "13.3-inch OLED FHD Touch Display with 360 ErgoLift hinge, Intel Core i5 processor, 8GB RAM, and 512GB SSD for premium versatility.",
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const catParam = searchParams.get("cat") || "";

  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    return catParam ? [catParam] : [];
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number | null>(null);

  // View & Sorting
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "rating"
  >("default");

  // Interactive Card Image Previews (overriding default card image if thumbnail clicked)
  const [cardImageMap, setCardImageMap] = useState<Record<string, string>>({});

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick View Modal
  const [quickViewItem, setQuickViewItem] = useState<ShopProductItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    let result = SHOP_PRODUCTS;

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((item) =>
        selectedCategories.some((cat) =>
          item.categories.some(
            (c) => c.toLowerCase() === cat.toLowerCase()
          )
        )
      );
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter((item) => selectedBrands.includes(item.brand));
    }

    // Filter by price
    result = result.filter((item) => item.price <= priceRange);

    // Filter by rating
    if (minRating !== null) {
      result = result.filter((item) => item.rating >= minRating);
    }

    // Filter by search query
    if (queryParam.trim()) {
      const q = queryParam.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.categoryLine.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    queryParam,
    sortBy,
  ]);

  const handleAddToCart = (item: ShopProductItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const storeProduct: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      status: "none",
      image: cardImageMap[item.id] || item.mainImage,
      category: item.categories[0] || "Electronics",
      description: item.description,
    };
    addToCart(storeProduct, 1);
    showToast(`Added "${item.shortName}" to your cart!`);
  };

  const handleToggleWishlist = (item: ShopProductItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleWishlist(item.id);
    const wishlisted = isWishlisted(item.id);
    showToast(
      wishlisted
        ? `Removed from wishlist.`
        : `Added to wishlist!`
    );
  };

  return (
    <div className="w-full bg-white pb-16 pt-3 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-[#141539] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 text-sm">
          <div className="w-6 h-6 rounded-full bg-[#00937a] flex items-center justify-center shrink-0">
            <Check size={14} strokeWidth={3} className="text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewItem && (
        <div
          className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setQuickViewItem(null)}
        >
          <div
            className="bg-white rounded-lg max-w-[780px] w-full p-6 relative shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewItem(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left: Product Image */}
            <div className="relative aspect-square w-full bg-[#f9f9f9] rounded flex items-center justify-center p-6 border border-[#eee]">
              <Image
                src={cardImageMap[quickViewItem.id] || quickViewItem.mainImage}
                alt={quickViewItem.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain p-4"
              />
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <p className="text-[12px] text-[#888] mb-1.5">{quickViewItem.categoryLine}</p>
                <h3 className="text-[18px] font-semibold text-[#141539] leading-snug mb-3">
                  {quickViewItem.name}
                </h3>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(quickViewItem.rating)
                          ? "fill-[#f5a623] text-[#f5a623]"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-[12px] text-[#777] ml-2 font-medium">
                    {quickViewItem.rating} out of 5
                  </span>
                </div>
                <div className="text-[24px] font-bold text-[#111] mb-4">
                  ${quickViewItem.price.toFixed(2)}
                </div>
                <p className="text-[13.5px] text-[#555] leading-relaxed mb-6">
                  {quickViewItem.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#eee]">
                <button
                  type="button"
                  onClick={() => handleAddToCart(quickViewItem)}
                  className="flex-1 h-[44px] bg-[#ff3d3d] hover:bg-[#e03131] text-white font-semibold text-sm rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  <span>Add To Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleWishlist(quickViewItem)}
                  className={`w-[44px] h-[44px] rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted(quickViewItem.id)
                      ? "border-[#ff3d3d] text-[#ff3d3d] bg-red-50"
                      : "border-gray-200 text-gray-500 hover:text-[#ff3d3d] hover:border-[#ff3d3d]"
                  }`}
                >
                  <Heart
                    size={18}
                    className={
                      isWishlisted(quickViewItem.id) ? "fill-[#ff3d3d]" : ""
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* 1. BREADCRUMBS                                           */}
        {/* ========================================================= */}
        <nav aria-label="Breadcrumb" className="py-2.5 mb-2">
          <ol className="flex items-center gap-2 text-[13px] text-[#777777]">
            <li>
              <Link
                href="/"
                className="hover:text-[#ff3d3d] transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-[#a0a0a0]">&gt;</li>
            <li className="text-[#333333] font-medium" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>

        {/* ========================================================= */}
        {/* 2. TOP CIRCULAR CATEGORIES (Carousel / Badges)           */}
        {/* ========================================================= */}
        <section aria-label="Category Highlights" className="pt-2 pb-6 border-b border-[#f0f0f0] mb-8">
          <div className="flex items-start justify-between gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
            {TOP_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.name)}
                  className="flex flex-col items-center group cursor-pointer shrink-0 text-center focus:outline-none"
                  style={{ width: "105px" }}
                >
                  {/* Circle Image Wrapper */}
                  <div
                    className={`w-[84px] h-[84px] sm:w-[94px] sm:h-[94px] rounded-full border flex items-center justify-center p-3.5 transition-all duration-200 bg-white ${
                      isSelected
                        ? "border-[#ff3d3d] shadow-[0_0_0_2px_rgba(255,61,61,0.2)]"
                        : "border-[#e9ecef] hover:border-[#ff3d3d] hover:shadow-md"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="94px"
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-2.5 text-[12px] sm:text-[13px] font-medium leading-tight max-w-[95px] truncate transition-colors ${
                      isSelected
                        ? "text-[#ff3d3d] font-semibold"
                        : "text-[#222222] group-hover:text-[#ff3d3d]"
                    }`}
                    title={cat.name}
                  >
                    {cat.displayName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#eee]">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#ddd] rounded text-[13.5px] font-medium text-[#333] hover:border-[#ff3d3d]"
          >
            <SlidersHorizontal size={15} />
            <span>Filter Products</span>
          </button>
          <span className="text-[13px] text-[#777]">
            Showing 1-{filteredProducts.length} Of 58 Results
          </span>
        </div>

        {/* ========================================================= */}
        {/* 3. MAIN TWO-COLUMN LAYOUT (Sidebar + Products Grid)       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 xl:gap-10 items-start">
          {/* ======================================================= */}
          {/* LEFT SIDEBAR (FILTERS)                                  */}
          {/* ======================================================= */}
          <aside
            className={`lg:block ${
              mobileFilterOpen
                ? "fixed inset-0 z-[999999] bg-white p-6 overflow-y-auto"
                : "hidden"
            }`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#eee] lg:hidden">
                <h2 className="text-[18px] font-bold text-[#222]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* SECTION 1: FILTER CATEGORIES */}
            <div className="mb-7">
              <h2 className="text-[15px] font-bold text-[#222222] mb-3.5 tracking-tight">
                Filter Categories
              </h2>
              <ul className="space-y-2">
                {SIDEBAR_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.name);
                  return (
                    <li
                      key={cat.name}
                      className="flex items-center justify-between group cursor-pointer py-0.5"
                      onClick={() => handleCategoryToggle(cat.name)}
                    >
                      <label className="flex items-center gap-2.5 text-[13px] text-[#444444] group-hover:text-[#ff3d3d] cursor-pointer select-none transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by li click
                          className="w-[14px] h-[14px] rounded-[3px] border-[#c8c8c8] text-[#ff3d3d] focus:ring-0 cursor-pointer"
                        />
                        <span>{cat.name}</span>
                      </label>
                      {cat.hasSub && (
                        <ChevronRight
                          size={13}
                          className="text-[#999999] group-hover:text-[#ff3d3d] transition-colors"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* SECTION 2: BRAND */}
            <div className="mb-7 pt-5 border-t border-[#ececec]">
              <h2 className="text-[15px] font-bold text-[#222222] mb-3.5 tracking-tight">
                Brand
              </h2>
              <ul className="space-y-2">
                {SIDEBAR_BRANDS.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <li
                      key={brand}
                      className="flex items-center group cursor-pointer py-0.5"
                      onClick={() => handleBrandToggle(brand)}
                    >
                      <label className="flex items-center gap-2.5 text-[13px] text-[#444444] group-hover:text-[#ff3d3d] cursor-pointer select-none transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by li click
                          className="w-[14px] h-[14px] rounded-[3px] border-[#c8c8c8] text-[#ff3d3d] focus:ring-0 cursor-pointer"
                        />
                        <span>{brand}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* SECTION 3: PRICE */}
            <div className="mb-7 pt-5 border-t border-[#ececec]">
              <h2 className="text-[15px] font-bold text-[#222222] mb-3.5 tracking-tight">
                Price
              </h2>

              {/* Slider Track */}
              <div className="relative pt-1 pb-4">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="25"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#222222]"
                />
              </div>

              {/* Value and Filter Button */}
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#333333] font-medium">
                  0 - {priceRange}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (mobileFilterOpen) setMobileFilterOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-[4px] bg-[#333e48] hover:bg-black text-white text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* SECTION 4: CUSTOMER REVIEW */}
            <div className="mb-7 pt-5 border-t border-[#ececec]">
              <h2 className="text-[15px] font-bold text-[#222222] mb-3.5 tracking-tight">
                Customer Review
              </h2>
              <div className="space-y-2">
                {[
                  { stars: 5, label: "" },
                  { stars: 4, label: "& Up" },
                  { stars: 3, label: "& Up" },
                  { stars: 2, label: "& Up" },
                  { stars: 1, label: "& Up" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.stars}
                    onClick={() =>
                      setMinRating((prev) =>
                        prev === item.stars ? null : item.stars
                      )
                    }
                    className={`flex items-center gap-1.5 text-[13px] py-1 px-1.5 rounded transition-colors w-full text-left cursor-pointer ${
                      minRating === item.stars
                        ? "bg-amber-50 text-[#ff3d3d]"
                        : "hover:bg-gray-50 text-[#555555]"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < item.stars
                              ? "fill-[#f5a623] text-[#f5a623]"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    {item.label && (
                      <span className="text-[12.5px] ml-1 text-[#666]">
                        {item.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset All Filters button if active */}
            {(selectedCategories.length > 0 ||
              selectedBrands.length > 0 ||
              priceRange < 2000 ||
              minRating !== null) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setPriceRange(2000);
                  setMinRating(null);
                }}
                className="w-full py-2 border border-[#ff3d3d] text-[#ff3d3d] hover:bg-[#ff3d3d] hover:text-white rounded text-[13px] font-medium transition-colors cursor-pointer mt-2"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ======================================================= */}
          {/* RIGHT CONTENT AREA: TOP BAR + PRODUCTS GRID             */}
          {/* ======================================================= */}
          <main className="flex-1">
            {/* Top Toolbar Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#ececec]">
              {/* Left: Showing Results Count */}
              <div className="text-[13px] text-[#666666]">
                Showing 1-{filteredProducts.length} Of 58 Results
              </div>

              {/* Right: View & Sort Controls */}
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#777777] hidden md:inline">
                  View 16
                </span>

                {/* View Mode Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`w-7 h-7 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "border-[#ff3d3d] text-[#ff3d3d] bg-white"
                        : "border-[#e0e0e0] text-[#888888] bg-white hover:text-[#ff3d3d]"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={15} strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`w-7 h-7 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "border-[#ff3d3d] text-[#ff3d3d] bg-white"
                        : "border-[#e0e0e0] text-[#888888] bg-white hover:text-[#ff3d3d]"
                    }`}
                    aria-label="List view"
                  >
                    <List size={15} strokeWidth={2.2} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-[34px] border border-[#e2e2e2] rounded-[4px] px-3 text-[12.5px] bg-white text-[#333333] focus:outline-none focus:border-[#ff3d3d] cursor-pointer"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Sort by Average Rating</option>
                </select>
              </div>
            </div>

            {/* PRODUCT GRID (4 columns x 3 rows) */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#f9f9f9] rounded-lg border border-[#e5e5e5] p-8">
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  No matching products found
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Try adjusting your filter options or price range.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                    setPriceRange(2000);
                    setMinRating(null);
                  }}
                  className="px-5 py-2 bg-[#ff3d3d] text-white rounded text-sm font-medium hover:bg-[#e03131] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                {filteredProducts.map((product) => {
                  const currentImg =
                    cardImageMap[product.id] || product.mainImage;

                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col justify-between bg-white relative transition-all duration-200"
                    >
                      {/* Product Image Area with Hover Action Overlay */}
                      <div className="relative aspect-square w-full bg-white flex items-center justify-center p-3 overflow-hidden">
                        <Link
                          href={`/product/lenovo-tab-m10-plus`}
                          className="relative w-full h-full flex items-center justify-center"
                        >
                          <Image
                            src={currentImg}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {/* Quick Action Floating Bar on Hover */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 shadow-md border border-gray-100 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-10">
                          <button
                            type="button"
                            title="Add to Cart"
                            onClick={(e) => handleAddToCart(product, e)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#444] hover:text-[#ff3d3d] hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <ShoppingCart size={13} />
                          </button>
                          <button
                            type="button"
                            title="Wishlist"
                            onClick={(e) => handleToggleWishlist(product, e)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              isWishlisted(product.id)
                                ? "text-[#ff3d3d] bg-red-50"
                                : "text-[#444] hover:text-[#ff3d3d] hover:bg-red-50"
                            }`}
                          >
                            <Heart
                              size={13}
                              className={
                                isWishlisted(product.id)
                                  ? "fill-[#ff3d3d]"
                                  : ""
                              }
                            />
                          </button>
                          <button
                            type="button"
                            title="Quick View"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setQuickViewItem(product);
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#444] hover:text-[#ff3d3d] hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Small Thumbnails Strip (Matching Image 1 Exact Layout) */}
                      <div className="flex items-center gap-1.5 my-2.5 px-0.5">
                        {product.thumbnails.map((thumbSrc, idx) => {
                          const isActive = currentImg === thumbSrc;
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() =>
                                setCardImageMap((prev) => ({
                                  ...prev,
                                  [product.id]: thumbSrc,
                                }))
                              }
                              onMouseEnter={() =>
                                setCardImageMap((prev) => ({
                                  ...prev,
                                  [product.id]: thumbSrc,
                                }))
                              }
                              className={`w-8 h-8 rounded border flex items-center justify-center p-0.5 bg-white transition-all cursor-pointer ${
                                isActive
                                  ? "border-[#ff3d3d] shadow-xs"
                                  : "border-[#e5e5e5] hover:border-gray-400"
                              }`}
                            >
                              <div className="relative w-full h-full">
                                <Image
                                  src={thumbSrc}
                                  alt={`${product.name} thumb ${idx + 1}`}
                                  fill
                                  sizes="32px"
                                  className="object-contain"
                                />
                              </div>
                            </button>
                          );
                        })}

                        {/* Extra Thumbnails Badge "+1" or "+2" */}
                        {product.moreThumbnailsCount > 0 && (
                          <div className="w-8 h-8 rounded border border-[#e5e5e5] bg-[#f9f9f9] flex items-center justify-center text-[11px] font-semibold text-[#666666] select-none">
                            +{product.moreThumbnailsCount}
                          </div>
                        )}
                      </div>

                      {/* Info Area */}
                      <div className="pt-1 flex flex-col flex-1">
                        {/* Categories tags line */}
                        <p
                          className="text-[11px] text-[#999999] leading-tight line-clamp-1 mb-1.5"
                          title={product.categoryLine}
                        >
                          {product.categoryLine}
                        </p>

                        {/* Product Title (Blue link) */}
                        <h3 className="text-[13.5px] font-medium leading-[1.35] mb-2 flex-1">
                          <Link
                            href={`/product/lenovo-tab-m10-plus`}
                            className="text-[#0e8ce4] hover:text-[#ff3d3d] hover:underline transition-colors line-clamp-2"
                            title={product.name}
                          >
                            {product.shortName}
                          </Link>
                        </h3>

                        {/* Price */}
                        <div className="text-[15.5px] font-bold text-[#1a1a1a] tracking-tight">
                          ${product.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW MODE */
              <div className="space-y-6">
                {filteredProducts.map((product) => {
                  const currentImg =
                    cardImageMap[product.id] || product.mainImage;

                  return (
                    <article
                      key={product.id}
                      className="flex flex-col sm:flex-row gap-6 p-4 border border-[#e9ecef] rounded-lg hover:shadow-md transition-shadow bg-white"
                    >
                      {/* Image */}
                      <div className="relative w-full sm:w-[200px] h-[200px] shrink-0 bg-[#f9f9f9] rounded flex items-center justify-center p-4">
                        <Image
                          src={currentImg}
                          alt={product.name}
                          fill
                          sizes="200px"
                          className="object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[12px] text-[#999] mb-1">
                            {product.categoryLine}
                          </p>
                          <h3 className="text-[16px] font-semibold text-[#141539] mb-2">
                            <Link
                              href="/product/lenovo-tab-m10-plus"
                              className="text-[#0e8ce4] hover:underline"
                            >
                              {product.name}
                            </Link>
                          </h3>
                          <p className="text-[13px] text-[#666] line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <div className="text-[20px] font-bold text-[#111]">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-3 mt-3 border-t border-[#f0f0f0]">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="px-4 py-2 bg-[#ff3d3d] hover:bg-[#e03131] text-white text-[13px] font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <ShoppingCart size={15} />
                            <span>Add To Cart</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(product)}
                            className="p-2 border border-gray-200 rounded text-gray-500 hover:text-[#ff3d3d] hover:border-[#ff3d3d] transition-colors"
                          >
                            <Heart
                              size={16}
                              className={
                                isWishlisted(product.id) ? "fill-[#ff3d3d] text-[#ff3d3d]" : ""
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ======================================================= */}
            {/* 4. PAGINATION (Matching Exact Screenshot Styling)       */}
            {/* ======================================================= */}
            <div className="mt-14 pt-8 border-t border-[#ececec] flex items-center justify-center">
              <nav aria-label="Pagination" className="flex items-center gap-2">
                {/* Page 1 (Active: blue circle with white text) */}
                <button
                  type="button"
                  aria-current="page"
                  className="w-8 h-8 rounded-full bg-[#0e8ce4] text-white font-semibold text-[13.5px] flex items-center justify-center shadow-xs cursor-pointer"
                >
                  1
                </button>

                {/* Page 2 */}
                <button
                  type="button"
                  className="w-8 h-8 rounded-full text-[#666666] hover:text-[#0e8ce4] hover:bg-gray-100 font-medium text-[13.5px] flex items-center justify-center transition-colors cursor-pointer"
                >
                  2
                </button>

                {/* Page 3 */}
                <button
                  type="button"
                  className="w-8 h-8 rounded-full text-[#666666] hover:text-[#0e8ce4] hover:bg-gray-100 font-medium text-[13.5px] flex items-center justify-center transition-colors cursor-pointer"
                >
                  3
                </button>

                {/* Page 4 */}
                <button
                  type="button"
                  className="w-8 h-8 rounded-full text-[#666666] hover:text-[#0e8ce4] hover:bg-gray-100 font-medium text-[13.5px] flex items-center justify-center transition-colors cursor-pointer"
                >
                  4
                </button>

                {/* Page 5 */}
                <button
                  type="button"
                  className="w-8 h-8 rounded-full text-[#666666] hover:text-[#0e8ce4] hover:bg-gray-100 font-medium text-[13.5px] flex items-center justify-center transition-colors cursor-pointer"
                >
                  5
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  aria-label="Next page"
                  className="w-8 h-8 rounded-full text-[#666666] hover:text-[#0e8ce4] hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer ml-1"
                >
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#ff3d3d] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
