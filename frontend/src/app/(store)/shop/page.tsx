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
  Heart,
  ShoppingCart,
  Star,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import { api, type ProductItem, type CategoryItem } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import ShopProductCard, {
  type ShopProductItem,
  type ProductSpec,
} from "@/components/products/shop-product-card";

const SUB_CATEGORY_MAP: Record<string, string[]> = {
  "Apple products": ["AirPods", "Apple Watch", "iPhone", "Mac"],
  Headphone: ["Earbuds", "On Ear", "Over Ear"],
  "Laptop & Tablet": ["Acer", "Amazon", "Apple", "ASUS", "Dell", "HP", "Lenovo"],
};

const KNOWN_BRANDS = [
  "Acer",
  "Amazon",
  "Amazfit",
  "Apple",
  "ASUS",
  "AutoFull",
  "Beats",
  "Bose",
  "Canon",
  "Dell",
  "Lenovo",
  "Samsung",
  "SkyTech",
  "Sony",
];

function inferBrand(p: ProductItem): string {
  if (p.brand && p.brand.trim()) return p.brand.trim();
  if (p.specs?.Brand) return p.specs.Brand;
  const lower = p.name.toLowerCase();
  const match = KNOWN_BRANDS.find((b) => lower.includes(b.toLowerCase()));
  return match || "Industrial Edge";
}

function mapApiProductToShopItem(p: ProductItem): ShopProductItem {
  const brand = inferBrand(p);
  const thumbs =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : [p.image || "/images/cat-laptop.jpg"];

  const specs: ProductSpec[] = p.specs
    ? Object.entries(p.specs).map(([label, value]) => ({ label, value }))
    : [
        { label: "Brand", value: brand },
        { label: "Category", value: p.category },
        { label: "Stock", value: (p.stock || 0) > 0 ? `${p.stock} Available` : "Out of Stock" },
      ];

  const categories = [p.category, brand].filter(Boolean);

  return {
    id: p.id,
    name: p.name,
    shortName: p.name.length > 56 ? `${p.name.slice(0, 54)}...` : p.name,
    categoryLine: p.category,
    categories,
    brand,
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    mainImage: p.image || "/images/cat-laptop.jpg",
    thumbnails: thumbs,
    moreThumbnailsCount: Math.max(0, thumbs.length - 3),
    rating: Number(p.rating) || 4.8,
    reviewsCount: p.ratingCount || 12,
    description:
      p.description ||
      "Genuine high-performance hardware with official IndustrialEdge.pk warranty and nationwide Pakistan delivery.",
    specs,
    deliveryDays: "2–4 day delivery",
  };
}

const ITEMS_PER_PAGE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const catParam = searchParams.get("cat") || "";
  const subParam = searchParams.get("sub") || "";

  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  // Live backend catalog & categories
  const [products, setProducts] = useState<ShopProductItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    catParam ? [catParam] : []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(() =>
    subParam ? [subParam] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxCatalogPrice, setMaxCatalogPrice] = useState<number>(500000);
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Apple products",
    "Laptop & Tablet",
  ]);

  // View, Sort & Pagination
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // UI Overlays
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickViewItem, setQuickViewItem] = useState<ShopProductItem | null>(null);

  // Carousel Ref
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  // Sync URL query params whenever user navigates from Header/Footer
  useEffect(() => {
    setSelectedCategories(catParam ? [catParam] : []);
    setSelectedSubCategories(subParam ? [subParam] : []);
    setCurrentPage(1);
  }, [catParam, subParam, queryParam]);

  // Load live products & categories from backend
  useEffect(() => {
    let mounted = true;
    async function loadCatalog() {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          api.getProducts().catch(() => []),
          api.getCategories().catch(() => []),
        ]);
        if (!mounted) return;
        if (Array.isArray(prods) && prods.length > 0) {
          const mapped = prods.map(mapApiProductToShopItem);
          setProducts(mapped);
          const highest = Math.max(...mapped.map((m) => m.price), 100000);
          const roundedMax = Math.ceil(highest / 50000) * 50000;
          setMaxCatalogPrice(roundedMax);
          setPriceRange(roundedMax);
        }
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(
            cats.map((c: CategoryItem) => ({
              id: c.id,
              name: c.name,
              image: c.image || "/images/cat-laptop.jpg",
            }))
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  const checkCarouselScroll = () => {
    if (!carouselRef.current) return;
    setCanScrollLeft(carouselRef.current.scrollLeft > 10);
  };

  const handleCarouselScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction === "right" ? 280 : -280,
      behavior: "smooth",
    });
    setTimeout(checkCarouselScroll, 350);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  const toggleCategoryExpand = (catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
    setCurrentPage(1);
  };

  const handleSubCategoryToggle = (subName: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subName) ? prev.filter((s) => s !== subName) : [...prev, subName]
    );
    setCurrentPage(1);
  };

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedBrands([]);
    setPriceRange(maxCatalogPrice);
    setMinRating(null);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategories.length > 0) {
      result = result.filter((item) =>
        selectedCategories.some((cat) =>
          item.categories.some((c) => c.toLowerCase() === cat.toLowerCase()) ||
          item.categoryLine.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    if (selectedSubCategories.length > 0) {
      result = result.filter((item) =>
        selectedSubCategories.some(
          (sub) =>
            item.categories.some((c) => c.toLowerCase() === sub.toLowerCase()) ||
            item.name.toLowerCase().includes(sub.toLowerCase()) ||
            item.brand.toLowerCase() === sub.toLowerCase()
        )
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((item) =>
        selectedBrands.some((b) => b.toLowerCase() === item.brand.toLowerCase())
      );
    }

    result = result.filter((item) => item.price <= priceRange);

    if (minRating !== null) {
      result = result.filter((item) => item.rating >= minRating);
    }

    if (queryParam.trim()) {
      const q = queryParam.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.categoryLine.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    products,
    selectedCategories,
    selectedSubCategories,
    selectedBrands,
    priceRange,
    minRating,
    queryParam,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddToCart = (item: ShopProductItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const storeProduct: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      status: "none",
      image: item.mainImage,
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
    const wasLiked = isWishlisted(item.id);
    toggleWishlist(item.id);
    showToast(wasLiked ? "Removed from wishlist." : "Added to wishlist!");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSubCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange < maxCatalogPrice ||
    minRating !== null;

  return (
    <div className="w-full bg-white pb-16 pt-3 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-[#171145] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-sm">
          <div className="w-6 h-6 rounded-full bg-[#0ea57a] flex items-center justify-center shrink-0">
            <Check size={14} strokeWidth={3} className="text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewItem && (
        <div
          className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQuickViewItem(null)}
        >
          <div
            className="bg-white rounded-xl max-w-[780px] w-full p-6 relative shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close quick view"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-square w-full bg-[#f9f9f9] rounded-lg flex items-center justify-center p-6 border border-[#eee]">
              <Image
                src={quickViewItem.mainImage}
                alt={quickViewItem.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain p-4"
              />
            </div>

            <div className="flex flex-col justify-between py-2">
              <div>
                <p className="text-[12px] text-[#64748b] mb-1.5">{quickViewItem.categoryLine}</p>
                <h3 className="text-[18px] font-semibold text-[#171145] leading-snug mb-3">
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
                  <span className="text-[12px] text-[#64748b] ml-2 font-medium">
                    {quickViewItem.rating} out of 5
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-[24px] font-bold text-[#0ea57a]">
                    {formatPrice(quickViewItem.price)}
                  </span>
                  {quickViewItem.originalPrice && quickViewItem.originalPrice > quickViewItem.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(quickViewItem.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[13.5px] text-[#475569] leading-relaxed mb-6">
                  {quickViewItem.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#eee]">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(quickViewItem);
                    setQuickViewItem(null);
                  }}
                  className="flex-1 h-[44px] bg-[#0ea57a] hover:bg-[#0b8462] text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  <span>Add To Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleWishlist(quickViewItem)}
                  className={`w-[44px] h-[44px] rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted(quickViewItem.id)
                      ? "border-[#0ea57a] text-[#0ea57a] bg-emerald-50"
                      : "border-gray-200 text-gray-500 hover:text-[#0ea57a] hover:border-[#0ea57a]"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={18} className={isWishlisted(quickViewItem.id) ? "fill-[#0ea57a]" : ""} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="py-2.5 mb-2">
          <ol className="flex items-center gap-2 text-[13px] text-[#64748b]">
            <li>
              <Link href="/" className="hover:text-[#0ea57a] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-[#94a3b8]">&gt;</li>
            <li className="text-[#171145] font-medium" aria-current="page">
              Shop{queryParam ? ` — Search: "${queryParam}"` : ""}
            </li>
          </ol>
        </nav>

        {/* 2. TOP CATEGORIES BOX */}
        <section aria-label="Category Highlights" className="relative mb-8">
          <div className="relative border border-[#e5e5e5] bg-white rounded-lg">
            <div
              ref={carouselRef}
              onScroll={checkCarouselScroll}
              className="flex items-stretch overflow-x-auto scrollbar-none divide-x divide-[#e5e5e5]"
            >
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.name)}
                    className={`flex-1 min-w-[130px] sm:min-w-[140px] xl:min-w-[135px] py-5 px-2.5 flex flex-col items-center justify-between text-center group cursor-pointer transition-colors ${
                      isSelected ? "bg-[#ecfdf5]" : "hover:bg-[#fafafa]"
                    }`}
                  >
                    <div
                      className={`w-[72px] h-[72px] rounded-full bg-[#f4f5f7] flex items-center justify-center p-2.5 mb-3 transition-transform duration-200 group-hover:scale-105 ${
                        isSelected ? "ring-2 ring-[#0ea57a] bg-white" : ""
                      }`}
                    >
                      <div className="relative w-[48px] h-[48px]">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="54px"
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <span
                      className={`text-[12.5px] leading-[1.3] text-center transition-colors min-h-[32px] flex items-center justify-center ${
                        isSelected
                          ? "text-[#0ea57a] font-semibold"
                          : "text-[#334155] group-hover:text-[#0ea57a]"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleCarouselScroll("left")}
                aria-label="Previous categories"
                className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] shadow-md hidden sm:flex items-center justify-center text-[#333] hover:text-[#0ea57a] hover:border-[#0ea57a] transition-all absolute -left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCarouselScroll("right")}
              aria-label="Next categories"
              className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] shadow-md hidden sm:flex items-center justify-center text-[#333] hover:text-[#0ea57a] hover:border-[#0ea57a] transition-all absolute -right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
          </div>
        </section>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#eee]">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#ddd] rounded text-[13.5px] font-medium text-[#333] hover:border-[#0ea57a] cursor-pointer"
          >
            <SlidersHorizontal size={15} />
            <span>Filter Products</span>
          </button>
          <span className="text-[13px] text-[#64748b]">
            {filteredProducts.length} Result{filteredProducts.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* 3. MAIN TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 xl:gap-10 items-start">
          {/* LEFT SIDEBAR */}
          <aside
            className={`lg:block ${
              mobileFilterOpen
                ? "fixed inset-0 z-[999999] bg-white p-6 overflow-y-auto"
                : "hidden"
            }`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#eee] lg:hidden">
                <h2 className="text-[18px] font-bold text-[#171145]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-gray-500 hover:text-black cursor-pointer"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* SECTION 1: FILTER CATEGORIES */}
            <div className="border border-[#e8ecef] rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="bg-[#f5f6f8] px-5 py-3.5 border-b border-[#edf0f2]">
                <h2 className="text-[15.5px] font-bold text-[#171145] tracking-tight">
                  Filter Categories
                </h2>
              </div>

              <div className="p-5">
                <ul className="space-y-3">
                  {categories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.name);
                    const subItems = SUB_CATEGORY_MAP[cat.name];
                    const hasSub = Boolean(subItems && subItems.length > 0);
                    const isExpanded = expandedCategories.includes(cat.name);

                    return (
                      <li key={cat.id} className="flex flex-col">
                        <div className="flex items-center justify-between group">
                          <label className="flex items-start gap-2.5 text-[13.5px] text-[#334155] group-hover:text-[#0ea57a] cursor-pointer select-none transition-colors flex-1">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCategoryToggle(cat.name)}
                              className="w-[15px] h-[15px] rounded-[2px] border border-[#cbd5e1] cursor-pointer mt-0.5 shrink-0 accent-[#0ea57a]"
                            />
                            <span className="leading-[1.35]">{cat.name}</span>
                          </label>

                          {hasSub && (
                            <button
                              type="button"
                              onClick={(e) => toggleCategoryExpand(cat.name, e)}
                              className="w-5 h-5 flex items-center justify-center text-[#1f2937] hover:text-[#0ea57a] text-[15px] font-bold cursor-pointer transition-colors shrink-0"
                              aria-label={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                          )}
                        </div>

                        {hasSub && isExpanded && subItems && (
                          <ul className="pl-6 pt-2.5 pb-1 space-y-2">
                            {subItems.map((sub) => {
                              const isSubChecked = selectedSubCategories.includes(sub);
                              return (
                                <li key={sub} className="flex items-center group">
                                  <label className="flex items-center gap-2.5 text-[13px] text-[#475569] group-hover:text-[#0ea57a] cursor-pointer select-none transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={isSubChecked}
                                      onChange={() => handleSubCategoryToggle(sub)}
                                      className="w-[14px] h-[14px] rounded-[2px] border border-[#cbd5e1] cursor-pointer accent-[#0ea57a]"
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

            {/* SECTION 2: BRAND */}
            {availableBrands.length > 0 && (
              <div className="mt-7">
                <h2 className="text-[15.5px] font-bold text-[#171145] tracking-tight mb-3.5">
                  Brand
                </h2>
                <ul className="space-y-2.5">
                  {availableBrands.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <li key={brand} className="flex items-center group">
                        <label className="flex items-center gap-2.5 text-[13.5px] text-[#334155] group-hover:text-[#0ea57a] cursor-pointer select-none transition-colors">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-[15px] h-[15px] rounded-[2px] border border-[#cbd5e1] cursor-pointer accent-[#0ea57a]"
                          />
                          <span>{brand}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* SECTION 3: PRICE (PKR) */}
            <div className="mt-7">
              <h2 className="text-[15.5px] font-bold text-[#171145] tracking-tight mb-3.5">
                Max Price (PKR)
              </h2>

              <input
                type="range"
                min={0}
                max={maxCatalogPrice}
                step={5000}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-[#0ea57a] cursor-pointer"
                aria-label="Maximum price in PKR"
              />

              <div className="flex items-center justify-between text-[13px] mt-2">
                <span className="text-[#171145] font-semibold">
                  Rs. 0 – {formatPrice(priceRange)}
                </span>
                {mobileFilterOpen && (
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="px-4 py-1.5 rounded-[6px] bg-[#171145] hover:bg-[#0ea57a] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 4: CUSTOMER REVIEW */}
            <div className="mt-7">
              <h2 className="text-[15.5px] font-bold text-[#171145] tracking-tight mb-3.5">
                Customer Review
              </h2>
              <div className="space-y-2">
                {[5, 4, 3].map((stars) => (
                  <button
                    type="button"
                    key={stars}
                    onClick={() => {
                      setMinRating((prev) => (prev === stars ? null : stars));
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-1.5 py-1.5 px-2 rounded transition-colors w-full text-left cursor-pointer ${
                      minRating === stars ? "bg-amber-50 border border-amber-200" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < stars ? "fill-[#f59e0b] text-[#f59e0b]" : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[13px] text-[#334155] ml-1">
                      {stars === 5 ? "5 Stars" : `${stars}+ Stars`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="w-full py-2.5 border border-[#0ea57a] text-[#0ea57a] hover:bg-[#0ea57a] hover:text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer mt-6"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#ececec]">
              <div className="text-[13px] text-[#475569]">
                {filteredProducts.length === 0
                  ? "Showing 0 results"
                  : `Showing ${startIndex + 1}–${Math.min(
                      startIndex + ITEMS_PER_PAGE,
                      filteredProducts.length
                    )} of ${filteredProducts.length} Results`}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`w-8 h-8 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "border-[#0ea57a] text-[#0ea57a] bg-emerald-50/50"
                        : "border-[#e0e0e0] text-[#64748b] bg-white hover:text-[#0ea57a]"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={15} strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`w-8 h-8 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "border-[#0ea57a] text-[#0ea57a] bg-emerald-50/50"
                        : "border-[#e0e0e0] text-[#64748b] bg-white hover:text-[#0ea57a]"
                    }`}
                    aria-label="List view"
                  >
                    <List size={15} strokeWidth={2.2} />
                  </button>
                </div>

                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as typeof sortBy);
                    setCurrentPage(1);
                  }}
                  className="h-[34px] border border-[#e2e2e2] rounded-[4px] px-3 text-[12.5px] bg-white text-[#333333] focus:border-[#0ea57a] cursor-pointer"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Sort by Average Rating</option>
                </select>
              </div>
            </div>

            {/* Loading / Empty / Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-[360px] rounded-lg bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#f9f9f9] rounded-xl border border-[#e5e5e5] p-8">
                <h3 className="text-base font-bold text-[#171145] mb-2">
                  No matching products found
                </h3>
                <p className="text-sm text-[#64748b] mb-5">
                  Try adjusting your category, brand, search term, or PKR price range.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-[#0ea57a] text-white rounded-lg text-sm font-semibold hover:bg-[#0b8462] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {paginatedProducts.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewItem(p)}
                    onCompare={(p) => showToast(`Added "${p.shortName}" to compare!`)}
                  />
                ))}
              </div>
            ) : (
              /* LIST VIEW MODE */
              <div className="space-y-6">
                {paginatedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-6 p-4 border border-[#e9ecef] rounded-xl hover:shadow-md transition-shadow bg-white"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="relative w-full sm:w-[200px] h-[200px] shrink-0 bg-[#f9f9f9] rounded-lg flex items-center justify-center p-4"
                    >
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        sizes="200px"
                        className="object-contain p-3"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[12px] text-[#64748b] mb-1">{product.categoryLine}</p>
                        <h3 className="text-[16px] font-semibold text-[#171145] mb-2">
                          <Link
                            href={`/product/${product.id}`}
                            className="text-[#171145] hover:text-[#0ea57a] hover:underline transition-colors"
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-[13px] text-[#475569] line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-[20px] font-bold text-[#0ea57a]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-slate-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 mt-3 border-t border-[#f0f0f0]">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <ShoppingCart size={15} />
                          <span>Add To Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(product)}
                          className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-[#0ea57a] hover:border-[#0ea57a] transition-colors cursor-pointer"
                          aria-label="Toggle wishlist"
                        >
                          <Heart
                            size={16}
                            className={isWishlisted(product.id) ? "fill-[#0ea57a] text-[#0ea57a]" : ""}
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* 4. WORKING PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-14 pt-8 border-t border-[#ececec] flex items-center justify-center">
                <nav aria-label="Pagination" className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 180, behavior: "smooth" });
                    }}
                    aria-label="Previous page"
                    className="w-8 h-8 rounded-full text-[#475569] hover:text-[#0ea57a] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} strokeWidth={2} />
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 180, behavior: "smooth" });
                      }}
                      aria-current={safePage === page ? "page" : undefined}
                      className={`w-8 h-8 rounded-full font-semibold text-[13.5px] flex items-center justify-center transition-colors cursor-pointer ${
                        safePage === page
                          ? "bg-[#0ea57a] text-white shadow-xs"
                          : "text-[#475569] hover:text-[#0ea57a] hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 180, behavior: "smooth" });
                    }}
                    aria-label="Next page"
                    className="w-8 h-8 rounded-full text-[#475569] hover:text-[#0ea57a] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} strokeWidth={2} />
                  </button>
                </nav>
              </div>
            )}
          </div>
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
          <div className="w-8 h-8 border-4 border-[#0ea57a] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
