"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface ArrivalItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  status: "new" | "discount" | "none";
}

const COLOR_SWATCHES = [
  { value: "#b19c83", label: "Taupe" },
  { value: "#000000", label: "Black" },
  { value: "#999999", label: "Silver" },
];

// Page 1 products matching the user's reference image exactly
const FEATURED_ITEMS_PAGE_1: ArrivalItem[] = [
  {
    id: "hna-1",
    name: "Echo Buds",
    price: 225,
    image: "/images/adv_1.png",
    category: "Audio & Video",
    status: "new",
  },
  {
    id: "hna-2",
    name: "FitBand 4",
    price: 379,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop&q=80",
    category: "Gadgets",
    status: "new",
  },
  {
    id: "hna-3",
    name: "Dot Smart Speaker",
    price: 225,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop&q=80",
    category: "Gadgets",
    status: "new",
  },
  {
    id: "hna-4",
    name: "Pace Watch",
    price: 379,
    image: "/images/best_5.png",
    category: "Gadgets",
    status: "new",
  },
  {
    id: "hna-5",
    name: "Echo Buds",
    price: 225,
    image: "/images/adv_1.png",
    category: "Audio & Video",
    status: "new",
  },
  {
    id: "hna-6",
    name: "Pocket Player",
    price: 379,
    image: "/images/featured_2.png",
    category: "Gadgets",
    status: "new",
  },
  {
    id: "hna-7",
    name: "Glide Mouse",
    price: 225,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop&q=80",
    category: "Accessories",
    status: "new",
  },
  {
    id: "hna-8",
    name: "Echo Buds Pro",
    price: 379,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&q=80",
    category: "Audio & Video",
    status: "new",
  },
  {
    id: "hna-9",
    name: "Lumo M10 Camera",
    price: 225,
    image: "/images/featured_5.png",
    category: "Cameras & Photos",
    status: "new",
  },
  {
    id: "hna-10",
    name: "Pocket Player",
    price: 379,
    image: "/images/featured_2.png",
    category: "Gadgets",
    status: "new",
  },
];

// Page 2 products for pagination
const FEATURED_ITEMS_PAGE_2: ArrivalItem[] = [
  {
    id: "hna-11",
    name: "Slate 10 Tablet",
    price: 225,
    image: "/images/featured_1.png",
    category: "Smartphones & Tablets",
    status: "new",
  },
  {
    id: "hna-12",
    name: "Pulse Headphones",
    price: 379,
    image: "/images/featured_3.png",
    category: "Audio & Video",
    status: "new",
  },
  {
    id: "hna-13",
    name: "Skylite Drone",
    price: 379,
    image: "/images/featured_7.png",
    category: "Gadgets",
    status: "new",
  },
  {
    id: "hna-14",
    name: "Fold Duo Phone",
    price: 225,
    image: "/images/featured_4.png",
    category: "Smartphones & Tablets",
    status: "new",
  },
  {
    id: "hna-15",
    name: "Charge 10K",
    price: 225,
    image: "/images/featured_8.png",
    category: "Accessories",
    status: "new",
  },
  {
    id: "hna-16",
    name: "Pixel Watch 2",
    price: 299,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
    category: "Gadgets",
    status: "new",
  },
  {
    id: "hna-17",
    name: "MacBook Air M3",
    price: 1099,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80",
    category: "Computers & Laptops",
    status: "new",
  },
  {
    id: "hna-18",
    name: "Mechanical Keyboard",
    price: 145,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop&q=80",
    category: "Accessories",
    status: "new",
  },
  {
    id: "hna-19",
    name: "Mirrorless Camera",
    price: 899,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&q=80",
    category: "Cameras & Photos",
    status: "new",
  },
  {
    id: "hna-20",
    name: "Wireless Speaker Pro",
    price: 189,
    image: "/images/best_1.png",
    category: "Audio & Video",
    status: "new",
  },
];

// Single Grid Item Component with the exact hover state
function ArrivalCard({
  item,
  isRow1,
}: {
  item: ArrivalItem;
  isRow1: boolean;
}) {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [selectedColor, setSelectedColor] = useState("#b19c83");
  const liked = isWishlisted(item.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      status: item.status,
    } as Product);
  };

  return (
    <article
      className={`group relative bg-white h-[245px] sm:h-[255px] flex flex-col justify-between py-5 px-3 transition-shadow duration-200 hover:z-30 hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:rounded-t-[4px] border-r border-[#e5e5e5] ${
        isRow1 ? "border-b border-[#e5e5e5]" : ""
      }`}
    >
      {/* Top Left Status Badge */}
      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#2b6cb0] text-white text-[10px] font-medium flex items-center justify-center z-10 pointer-events-none">
        new
      </div>

      {/* Top Right Wishlist Heart (Visible on hover or when liked) */}
      <button
        type="button"
        onClick={handleHeartClick}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer transition-all duration-200 z-10 ${
          liked
            ? "opacity-100 visible text-[#df3b3b]"
            : "opacity-0 invisible group-hover:opacity-100 group-hover:visible text-[#cccccc] hover:text-[#df3b3b]"
        }`}
      >
        <Heart size={14} strokeWidth={2.5} fill={liked ? "#df3b3b" : "none"} />
      </button>

      {/* Product Image */}
      <Link
        href={`/product/${item.id}`}
        className="h-[120px] flex items-center justify-center pt-2"
      >
        <Image
          src={item.image}
          alt={item.name}
          width={100}
          height={100}
          className="max-h-[95px] max-w-[95px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </Link>

      {/* Price & Name (Centered) */}
      <div className="text-center pt-2">
        <span className="text-sm font-bold text-[#111111] block mb-1">
          ${item.price}
        </span>
        <Link href={`/product/${item.id}`}>
          <span className="text-xs sm:text-[13px] text-[#111111] font-normal hover:text-[#2b6cb0] transition-colors truncate block">
            {item.name}
          </span>
        </Link>
      </div>

      {/* Hover Dropdown Drawer with Color Swatches and Add to Cart */}
      <div className="absolute top-full left-0 w-full bg-white shadow-[0_15px_25px_rgba(0,0,0,0.12)] rounded-b-[4px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 pt-3 pb-0">
        {/* Color Swatch Radio Dots */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              type="button"
              key={swatch.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedColor(swatch.value);
              }}
              style={{ backgroundColor: swatch.value }}
              className={`w-3 h-3 rounded-full cursor-pointer ring-offset-1 transition-all ${
                selectedColor === swatch.value
                  ? "ring-2 ring-[#2b6cb0]"
                  : "ring-transparent hover:ring-1 hover:ring-gray-400"
              }`}
              aria-label={swatch.label}
            />
          ))}
        </div>

        {/* Add to Cart CTA Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full h-[40px] bg-[#2b6cb0] hover:bg-[#205493] text-white text-sm font-medium rounded-b-[4px] flex items-center justify-center transition-colors cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default function HotNewArrivals() {
  const [activeTab, setActiveTab] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(0);
  const { isWishlisted, toggleWishlist, addToCart } = useStore();

  const TABS = ["Featured", "Audio & Video", "Laptops & Computers"];

  // Filter items by category tab
  const getDisplayItems = () => {
    const rawList =
      currentPage === 0 ? FEATURED_ITEMS_PAGE_1 : FEATURED_ITEMS_PAGE_2;
    if (activeTab === "Audio & Video") {
      return rawList.filter((item) => item.category === "Audio & Video").concat(
        rawList.filter((item) => item.category !== "Audio & Video")
      );
    }
    if (activeTab === "Laptops & Computers") {
      return rawList
        .filter((item) => item.category.includes("Computers") || item.category === "Accessories")
        .concat(
          rawList.filter(
            (item) => !item.category.includes("Computers") && item.category !== "Accessories"
          )
        );
    }
    return rawList;
  };

  const displayItems = getDisplayItems();

  // Tall spotlight product
  const spotlightProduct: Product = {
    id: "spotlight-nova-x",
    name: "Nova X Phone",
    price: 379,
    category: "Smartphones",
    image: "/images/banner_product.png",
    status: "new",
    rating: 4.0,
  };

  const isSpotlightLiked = isWishlisted(spotlightProduct.id);

  return (
    <section className="py-16 bg-white select-none">
      <div className="container">
        {/* Header Row: Title on Left, Tabs on Right with Bottom Border */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e5e5e5] pb-2 mb-8 gap-4">
          <h2 className="text-2xl sm:text-[26px] font-bold text-[#111111] tracking-tight">
            Hot New Arrivals
          </h2>

          <div className="flex items-center gap-6 sm:gap-8">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(0);
                  }}
                  className={`text-sm cursor-pointer transition-colors pb-2.5 -mb-[9px] ${
                    isActive
                      ? "text-[#111111] font-semibold border-b-2 border-[#2b6cb0]"
                      : "text-[#828282] hover:text-[#111111] font-normal"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Section Content: 5x2 Grid on Left, Tall Spotlight Card on Right */}
        <div className="flex flex-col lg:flex-row items-stretch border-t border-[#e5e5e5] lg:border-t-0">
          {/* Left Column: 5 Columns x 2 Rows Grid + Pagination Dots */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-l border-t border-[#e5e5e5]">
              {displayItems.slice(0, 10).map((item, index) => (
                <ArrivalCard
                  key={item.id}
                  item={item}
                  isRow1={index < 5}
                />
              ))}
            </div>

            {/* Pagination Dots below 5x2 Grid */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                type="button"
                onClick={() => setCurrentPage(0)}
                aria-label="Page 1"
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentPage === 0
                    ? "bg-[#2b6cb0] scale-110"
                    : "bg-[#d8d8d8] hover:bg-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                aria-label="Page 2"
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentPage === 1
                    ? "bg-[#2b6cb0] scale-110"
                    : "bg-[#d8d8d8] hover:bg-gray-400"
                }`}
              />
            </div>
          </div>

          {/* Right Column: Tall Spotlight Card (Foldable Phone) */}
          <div className="w-full lg:w-[270px] xl:w-[290px] shrink-0 border-t lg:border-t-0 border-[#e5e5e5] mt-8 lg:mt-0 lg:pl-6">
            <div className="h-full min-h-[490px] sm:min-h-[510px] flex flex-col justify-between p-6 relative bg-white border border-[#e5e5e5] rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              {/* Top Left Badge */}
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-[#2b6cb0] text-white text-[10px] font-medium flex items-center justify-center z-10">
                new
              </div>

              {/* Top Right Wishlist Heart */}
              <button
                type="button"
                onClick={() => toggleWishlist(spotlightProduct.id)}
                aria-label="Toggle wishlist for Nova X Phone"
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
              >
                <Heart
                  size={14}
                  strokeWidth={2.5}
                  fill={isSpotlightLiked ? "#df3b3b" : "none"}
                  className={isSpotlightLiked ? "text-[#df3b3b]" : "text-[#df3b3b]"}
                />
              </button>

              {/* Tall Image */}
              <div className="flex-1 flex items-center justify-center pt-8 pb-4">
                <Image
                  src={spotlightProduct.image}
                  alt={spotlightProduct.name}
                  width={220}
                  height={320}
                  priority
                  className="max-h-[260px] w-auto object-contain select-none"
                />
              </div>

              {/* Product Info */}
              <div className="pt-2">
                <span className="text-xs text-[#828282] font-normal mb-1 block">
                  {spotlightProduct.category}
                </span>

                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-base font-semibold text-[#111111]">
                    {spotlightProduct.name}
                  </h3>
                  <span className="text-base font-bold text-[#111111]">
                    ${spotlightProduct.price}
                  </span>
                </div>

                {/* 5 Stars Rating (4 filled, 1 empty) */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#f8be14] text-[#f8be14]" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-[#f8be14]" strokeWidth={2} />
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => addToCart(spotlightProduct)}
                  className="w-full h-[40px] bg-[#2b6cb0] hover:bg-[#205493] text-white text-sm font-medium rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

