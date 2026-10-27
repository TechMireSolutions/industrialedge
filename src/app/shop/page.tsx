"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  Eye,
  Heart,
  ShoppingCart,
  Star,
  Check,
  X,
  SlidersHorizontal,
  Truck,
  ArrowLeftRight,
} from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import ShopProductCard, {
  type ShopProductItem,
  type ProductSpec,
} from "@/components/products/shop-product-card";

// Top Circular Categories (Image 1 & 2 Carousel)
interface TopCategoryItem {
  id: string;
  name: string;
  titleLines: string[];
  image: string;
}

const TOP_CATEGORIES: TopCategoryItem[] = [
  {
    id: "apple",
    name: "Apple products",
    titleLines: ["Apple products"],
    image: "/images/cat-imac.jpg",
  },
  {
    id: "audio",
    name: "Audio Equipments",
    titleLines: ["Audio Equipments"],
    image: "/images/cat-speakers.jpg",
  },
  {
    id: "camera",
    name: "Camera & Video",
    titleLines: ["Camera & Video"],
    image: "/images/cat-camera.jpg",
  },
  {
    id: "computers",
    name: "Computers & Accessories",
    titleLines: ["Computers &", "Accessories"],
    image: "/images/cat-pc-tower.jpg",
  },
  {
    id: "furniture",
    name: "Game & Room Furniture",
    titleLines: ["Game & Room", "Furniture"],
    image: "/images/cat-gaming-chair.jpg",
  },
  {
    id: "gaming",
    name: "Gaming Accessories",
    titleLines: ["Gaming", "Accessories"],
    image: "/images/cat-gamepad.jpg",
  },
  {
    id: "headphone",
    name: "Headphone",
    titleLines: ["Headphone"],
    image: "/images/cat-headphones.jpg",
  },
  {
    id: "laptop",
    name: "Laptop & Tablet",
    titleLines: ["Laptop & Tablet"],
    image: "/images/cat-laptop.jpg",
  },
];

// Sidebar Filter Categories (Matching Image 1 & 2)
const SIDEBAR_CATEGORIES = [
  {
    name: "Apple products",
    hasSub: true,
    subItems: ["AirPods", "Apple Watch", "Iphone", "Mac"],
  },
  { name: "Audio Equipments", hasSub: false },
  { name: "Camera & Video", hasSub: false },
  {
    name: "Computers & Accessories",
    displayLines: ["Computers &", "Accessories"],
    hasSub: false,
  },
  { name: "Game & Room Furniture", hasSub: false },
  { name: "Gaming Accessories", hasSub: false },
  {
    name: "Headphone",
    hasSub: true,
    subItems: ["Earbuds", "On Ear", "Over Ear"],
  },
  {
    name: "Laptop & Tablet",
    hasSub: true,
    subItems: ["Acer", "Amazon", "Apple", "ASUS", "HP", "Lenovo"],
  },
  { name: "Server & Workstation", hasSub: false },
  { name: "Smartphone", hasSub: false },
  { name: "Smartwatch", hasSub: false },
  { name: "Storage & Digital Devices", hasSub: false },
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

const SHOP_PRODUCTS: ShopProductItem[] = [
  // 1. AirPods (2nd Gen) - Exact match to user screenshot
  {
    id: "p-airpods-2nd-gen",
    name: "AirPods (2nd generation) with Wired Charging Case",
    shortName: "AirPods (2nd generation) with Wired Charging Case",
    categoryLine: "AirPods, Apple products, Earbuds, Headphone",
    categories: ["AirPods", "Apple products", "Earbuds", "Headphone"],
    brand: "Apple",
    price: 129.0,
    mainImage: "/images/o_2003-540x540.webp",
    thumbnails: [
      "/images/o_2003-540x540.webp",
      "/images/airpods-th2.jpg",
      "/images/airpods-th3.jpg",
    ],
    moreThumbnailsCount: 2,
    rating: 5,
    description:
      "Effortless setup, high-quality audio, hands-free Siri access, and over 24 hours of listening time with the charging case.",
    specs: [
      { label: "Brand", value: "Apple" },
      { label: "Model Name", value: "AirPods Pro" },
      { label: "Color", value: "White" },
      { label: "Form Factor", value: "In Ear" },
      { label: "Connectivity Technology", value: "Bluetooth 5.0" },
    ],
    deliveryDays: "2 day delivery",
  },
  // 2. Acer Aspire 5
  {
    id: "p-acer-aspire-5",
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6\" Full HD IPS Display – 11th Gen Intel i3",
    shortName: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6'' Full HD IPS Display – 11t...",
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
      "/images/lenovo-tab/lap-th2.png",
      "/images/lenovo-tab/lap-th3.png",
    ],
    moreThumbnailsCount: 2,
    rating: 5,
    description:
      "Powerful 11th Gen Intel Core i3 processor, 15.6-inch Full HD IPS display with narrow bezels, ergonomic hinge, and all-day battery life.",
    specs: [
      { label: "Brand", value: "Acer" },
      { label: "Model Name", value: "A515-56-347N" },
      { label: "Screen Size", value: "15.6 Inches" },
      { label: "Hard Disk Size", value: "128 GB" },
      { label: "Ram Memory", value: "8GB" },
    ],
    deliveryDays: "5 day delivery",
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
    specs: [
      { label: "Brand", value: "Apple" },
      { label: "Model Name", value: "AirPods (3rd Gen)" },
      { label: "Color", value: "White" },
      { label: "Audio", value: "Spatial Audio" },
      { label: "Battery Life", value: "30 Hours" },
    ],
    deliveryDays: "3 day delivery",
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
    specs: [
      { label: "Brand", value: "Amazfit" },
      { label: "Model Name", value: "GTS 2" },
      { label: "Display", value: "1.65\" AMOLED" },
      { label: "Battery Life", value: "7 Days" },
      { label: "Water Resist", value: "5 ATM" },
    ],
    deliveryDays: "5 day delivery",
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
    specs: [
      { label: "Brand", value: "Amazon" },
      { label: "Model Name", value: "Fire HD 8" },
      { label: "Screen Size", value: "8.0 Inches" },
      { label: "Hard Disk Size", value: "32 GB" },
      { label: "Ram Memory", value: "2 GB" },
    ],
    deliveryDays: "2 day delivery",
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
    specs: [
      { label: "Brand", value: "Amazon" },
      { label: "Model Name", value: "Fire TV 50\"" },
      { label: "Screen Size", value: "50 Inches" },
      { label: "Resolution", value: "4K UHD" },
      { label: "OS", value: "Fire OS" },
    ],
    deliveryDays: "5 day delivery",
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
    specs: [
      { label: "Brand", value: "Apple" },
      { label: "Model Name", value: "AirPods Max" },
      { label: "Color", value: "Green" },
      { label: "ANC", value: "Active Noise" },
      { label: "Battery Life", value: "20 Hours" },
    ],
    deliveryDays: "4 day delivery",
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
    specs: [
      { label: "Brand", value: "Apple" },
      { label: "Model Name", value: "iPhone 11 Pro Max" },
      { label: "Screen Size", value: "6.5 Inches" },
      { label: "Hard Disk Size", value: "64 GB" },
      { label: "Color", value: "Gold" },
    ],
    deliveryDays: "3 day delivery",
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
    specs: [
      { label: "Brand", value: "Apple" },
      { label: "Model Name", value: "iPhone 11 Pro Max" },
      { label: "Screen Size", value: "6.5 Inches" },
      { label: "Hard Disk Size", value: "64 GB" },
      { label: "Color", value: "Gold" },
    ],
    deliveryDays: "3 day delivery",
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
    specs: [
      { label: "Brand", value: "Apple" },
      { label: "Model Name", value: "Apple Watch S5" },
      { label: "Case Size", value: "40 MM" },
      { label: "Connectivity", value: "GPS + Cellular" },
      { label: "Color", value: "Pink Sand" },
    ],
    deliveryDays: "5 day delivery",
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
    specs: [
      { label: "Brand", value: "Apple" },
      { label: "Model Name", value: "Apple Watch S6" },
      { label: "Case Size", value: "40 MM" },
      { label: "Connectivity", value: "GPS + Cellular" },
      { label: "Color", value: "Space Gray" },
    ],
    deliveryDays: "5 day delivery",
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
    specs: [
      { label: "Brand", value: "ASUS" },
      { label: "Model Name", value: "ZenBook Flip 13" },
      { label: "Screen Size", value: "13.3 Inches OLED" },
      { label: "Hard Disk Size", value: "512 GB SSD" },
      { label: "Ram Memory", value: "8GB" },
    ],
    deliveryDays: "5 day delivery",
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

  // Top Categories Carousel Ref & Scroll state (Image 1 & 2)
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const handleCarouselScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 280;
    carouselRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkCarouselScroll, 350);
  };

  useEffect(() => {
    checkCarouselScroll();
    const handleResize = () => checkCarouselScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  // Expandable Category State (matching Image 1 & 2)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Apple products",
  ]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  const toggleCategoryExpand = (catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
  };

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleSubCategoryToggle = (subName: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subName)
        ? prev.filter((s) => s !== subName)
        : [...prev, subName]
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

    // Filter by subcategory
    if (selectedSubCategories.length > 0) {
      result = result.filter((item) =>
        selectedSubCategories.some((sub) =>
          item.categories.some(
            (c) => c.toLowerCase() === sub.toLowerCase()
          ) ||
          item.name.toLowerCase().includes(sub.toLowerCase())
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
    selectedSubCategories,
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
        {/* 2. TOP CATEGORIES BOX (Matching Image 1 & 2 Exactly)       */}
        {/* ========================================================= */}
        <section aria-label="Category Highlights" className="relative mb-8">
          <div className="relative border border-[#e5e5e5] bg-white">
            <div
              ref={carouselRef}
              onScroll={checkCarouselScroll}
              className="flex items-stretch overflow-x-auto scrollbar-none divide-x divide-[#e5e5e5]"
            >
              {TOP_CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.name)}
                    className={`flex-1 min-w-[130px] sm:min-w-[140px] xl:min-w-0 py-6 px-2 flex flex-col items-center justify-between text-center group cursor-pointer transition-colors focus:outline-none ${
                      isSelected ? "bg-[#fcfcfc]" : "hover:bg-[#fafafa]"
                    }`}
                  >
                    {/* Light Grey Circular Backdrop behind image */}
                    <div
                      className={`w-[78px] h-[78px] sm:w-[82px] sm:h-[82px] rounded-full bg-[#f4f5f7] flex items-center justify-center p-2.5 mb-3 transition-transform duration-200 group-hover:scale-105 ${
                        isSelected ? "ring-2 ring-[#ff3d3d] bg-[#edf2f7]" : ""
                      }`}
                    >
                      <div className="relative w-[52px] h-[52px]">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="54px"
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Category Label (Single line or Two lines) */}
                    <div
                      className={`text-[13px] leading-[1.3] text-center transition-colors min-h-[34px] flex flex-col justify-center ${
                        isSelected
                          ? "text-[#ff3d3d] font-semibold"
                          : "text-[#333333] group-hover:text-[#ff3d3d]"
                      }`}
                    >
                      {cat.titleLines.map((line, idx) => (
                        <span key={idx} className="block whitespace-nowrap">
                          {line}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Left Carousel Arrow (if scrolled) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleCarouselScroll("left")}
                aria-label="Previous categories"
                className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] shadow-[0_2px_10px_rgba(0,0,0,0.12)] hidden sm:flex items-center justify-center text-[#333] hover:text-[#ff3d3d] hover:border-[#ff3d3d] transition-all absolute -left-4.5 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>
            )}

            {/* Right Carousel Arrow Button (Image 2) */}
            <button
              type="button"
              onClick={() => handleCarouselScroll("right")}
              aria-label="Next categories"
              className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] shadow-[0_2px_10px_rgba(0,0,0,0.12)] hidden sm:flex items-center justify-center text-[#333] hover:text-[#ff3d3d] hover:border-[#ff3d3d] transition-all absolute -right-4.5 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
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

            {/* SECTION 1: FILTER CATEGORIES (Matching Image 1 & 2) */}
            <div className="border border-[#e8ecef] rounded-xl overflow-hidden bg-white shadow-xs">
              {/* Card Header with Gray Background */}
              <div className="bg-[#f5f6f8] px-5 py-3.5 border-b border-[#edf0f2]">
                <h2 className="text-[16px] font-bold text-[#1f2937] tracking-tight">
                  Filter Categories
                </h2>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <ul className="space-y-3.5">
                  {SIDEBAR_CATEGORIES.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.name);
                    const isExpanded = expandedCategories.includes(cat.name);

                    return (
                      <li key={cat.name} className="flex flex-col">
                        <div className="flex items-center justify-between group">
                          <label
                            onClick={() => handleCategoryToggle(cat.name)}
                            className="flex items-start gap-3 text-[13.5px] text-[#2d3748] group-hover:text-[#ff3d3d] cursor-pointer select-none transition-colors flex-1"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-[15px] h-[15px] rounded-[2px] border border-[#d6dade] text-[#ff3d3d] focus:ring-0 cursor-pointer mt-0.5 shrink-0 accent-[#ff3d3d]"
                            />
                            <span className="leading-[1.35]">
                              {cat.displayLines ? (
                                <>
                                  {cat.displayLines[0]}
                                  <br />
                                  {cat.displayLines[1]}
                                </>
                              ) : (
                                cat.name
                              )}
                            </span>
                          </label>

                          {/* + or - toggle button */}
                          {cat.hasSub && (
                            <button
                              type="button"
                              onClick={(e) => toggleCategoryExpand(cat.name, e)}
                              className="w-5 h-5 flex items-center justify-center text-[#1f2937] hover:text-[#ff3d3d] text-[16px] font-bold cursor-pointer transition-colors shrink-0"
                              aria-label={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                          )}
                        </div>

                        {/* Indented Subcategories List (Image 2) */}
                        {cat.hasSub && isExpanded && cat.subItems && (
                          <ul className="pl-6 pt-3 pb-1 space-y-2.5">
                            {cat.subItems.map((sub) => {
                              const isSubChecked = selectedSubCategories.includes(sub);
                              return (
                                <li
                                  key={sub}
                                  onClick={() => handleSubCategoryToggle(sub)}
                                  className="flex items-center group cursor-pointer"
                                >
                                  <label className="flex items-center gap-3 text-[13px] text-[#4a5568] group-hover:text-[#ff3d3d] cursor-pointer select-none transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={isSubChecked}
                                      onChange={() => {}}
                                      className="w-[14px] h-[14px] rounded-[2px] border border-[#d6dade] text-[#ff3d3d] focus:ring-0 cursor-pointer accent-[#ff3d3d]"
                                    />
                                    <span>{sub}</span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* SECTION 2: BRAND (Matching Image 3) */}
            <div className="mt-8">
              <h2 className="text-[16px] font-bold text-[#1f2937] tracking-tight mb-4">
                Brand
              </h2>
              <ul className="space-y-3">
                {SIDEBAR_BRANDS.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <li
                      key={brand}
                      className="flex items-center group cursor-pointer"
                      onClick={() => handleBrandToggle(brand)}
                    >
                      <label className="flex items-center gap-3 text-[13.5px] text-[#2d3748] group-hover:text-[#ff3d3d] cursor-pointer select-none transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-[15px] h-[15px] rounded-[2px] border border-[#d6dade] text-[#ff3d3d] focus:ring-0 cursor-pointer accent-[#ff3d3d]"
                        />
                        <span>{brand}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* SECTION 3: PRICE (Matching Image 3) */}
            <div className="mt-8">
              <h2 className="text-[16px] font-bold text-[#1f2937] tracking-tight mb-4">
                Price
              </h2>

              {/* Range Track with exact handles */}
              <div className="relative pt-2 pb-3 flex items-center">
                <div className="w-full h-[2.5px] bg-black rounded-full relative">
                  {/* Left handle */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-black shadow-xs pointer-events-none" />
                  {/* Right handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-black shadow-xs pointer-events-none transition-all duration-75"
                    style={{ left: `${(priceRange / 2000) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="25"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Price range filter"
                />
              </div>

              {/* Value and Filter Button */}
              <div className="flex items-center justify-between text-[14px] mt-1">
                <span className="text-[#1f2937] font-normal tracking-wide">
                  0 - {priceRange}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (mobileFilterOpen) setMobileFilterOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-[6px] bg-[#2d3748] hover:bg-black text-white text-[13px] font-medium transition-colors cursor-pointer shadow-xs"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* SECTION 4: CUSTOMER REVIEW (Matching Image 3) */}
            <div className="mt-8">
              <h2 className="text-[16px] font-bold text-[#1f2937] tracking-tight mb-4">
                Customer Review
              </h2>
              <div className="space-y-2.5">
                {[
                  { stars: 5, label: "" },
                  { stars: 4, label: "& Up" },
                  { stars: 3, label: "& Up" },
                  { stars: 2, label: "& Up" },
                  { stars: 1, label: "& Up" },
                ].map((tier) => (
                  <button
                    type="button"
                    key={tier.stars}
                    onClick={() =>
                      setMinRating((prev) =>
                        prev === tier.stars ? null : tier.stars
                      )
                    }
                    className={`flex items-center gap-1.5 py-1 px-1 rounded transition-colors w-full text-left cursor-pointer ${
                      minRating === tier.stars
                        ? "bg-amber-50/70"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          strokeWidth={1.5}
                          className={
                            i < tier.stars
                              ? "text-[#f59e0b] stroke-[#f59e0b] fill-none"
                              : "text-[#d1d5db] stroke-[#d1d5db] fill-none"
                          }
                        />
                      ))}
                    </div>
                    {tier.label && (
                      <span className="text-[13.5px] text-[#1f2937] ml-1 font-normal select-none">
                        {tier.label}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewItem(p)}
                    onCompare={(p) =>
                      showToast(`Added "${p.name}" to compare list!`)
                    }
                  />
                ))}
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
