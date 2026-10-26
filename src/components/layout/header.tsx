"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Menu,
  Headphones,
  Globe,
  User,
  ShoppingCart,
  Check,
  Speaker,
  Laptop,
  Gamepad2,
  Smartphone,
  Camera,
  Watch,
  Cpu,
  Armchair,
  Server,
  Tv,
} from "lucide-react";

// Categories in the 3-column modal (Image 2)
const SEARCH_CATEGORY_COLUMNS = [
  // Column 1
  [
    "All categories",
    "Camera & Video",
    "Gaming Accessories",
    "Server & Workstation",
    "Storage & Digital Devices",
  ],
  // Column 2
  [
    "Apple products",
    "Computers & Accessories",
    "Headphone",
    "Smartphone",
    "TV & Computer Screen",
  ],
  // Column 3
  [
    "Audio Equipments",
    "Game & Room Furniture",
    "Laptop & Tablet",
    "Smartwatch",
  ],
];

// All Categories Vertical Menu items (Image 3 & 4)
const ALL_DEPARTMENTS = [
  {
    name: "Audio Equipments",
    icon: Speaker,
    hasSub: false,
    href: "/shop?cat=Audio+Equipments",
  },
  {
    name: "Laptop & Tablet",
    icon: Laptop,
    hasSub: true,
    subItems: ["Acer", "Amazon", "Apple", "ASUS", "HP"],
    href: "/shop?cat=Laptop+%26+Tablet",
  },
  {
    name: "Gaming Accessories",
    icon: Gamepad2,
    hasSub: false,
    href: "/shop?cat=Gaming+Accessories",
  },
  {
    name: "Headphone",
    icon: Headphones,
    hasSub: true,
    subItems: ["Earbuds", "On Ear", "Over Ear"],
    href: "/shop?cat=Headphone",
  },
  {
    name: "Smartphone",
    icon: Smartphone,
    hasSub: false,
    href: "/shop?cat=Smartphone",
  },
  {
    name: "Camera & Video",
    icon: Camera,
    hasSub: false,
    href: "/shop?cat=Camera+%26+Video",
  },
  {
    name: "Smartwatch",
    icon: Watch,
    hasSub: false,
    href: "/shop?cat=Smartwatch",
  },
  {
    name: "Storage & Digital Devices",
    icon: Cpu,
    hasSub: false,
    href: "/shop?cat=Storage+%26+Digital+Devices",
  },
  {
    name: "Game & Room Furniture",
    icon: Armchair,
    hasSub: false,
    href: "/shop?cat=Game+%26+Room+Furniture",
  },
  {
    name: "Server & Workstation",
    icon: Server,
    hasSub: false,
    href: "/shop?cat=Server+%26+Workstation",
  },
  {
    name: "TV & Computer Screen",
    icon: Tv,
    hasSub: false,
    href: "/shop?cat=TV+%26+Computer+Screen",
  },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
];

export default function Header() {
  const router = useRouter();
  const { cart, openCartDrawer } = useStore();

  // Search & Categories Modal State (Image 2)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const categoryModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // "All Categories" Dropdown Menu State (Image 3 & 4)
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const allCategoriesRef = useRef<HTMLDivElement>(null);

  // Language Dropdown
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languageRef = useRef<HTMLDivElement>(null);

  // Nav Dropdowns
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);

  // Mobile Drawer & Canvas Tabs
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [canvasTab, setCanvasTab] = useState<"menu" | "categories">("menu");
  const [expandedCanvasMenu, setExpandedCanvasMenu] = useState<string | null>(null);

  // Sticky Header on Scroll & Hamburger Dropdown
  const [isSticky, setIsSticky] = useState(false);
  const [stickyMenuOpen, setStickyMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
        setStickyMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click or ESC key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        categoryModalRef.current &&
        !categoryModalRef.current.contains(target)
      ) {
        setCategoryModalOpen(false);
      }
      if (
        allCategoriesRef.current &&
        !allCategoriesRef.current.contains(target)
      ) {
        setAllCategoriesOpen(false);
        setActiveSubMenu(null);
      }
      if (languageRef.current && !languageRef.current.contains(target)) {
        setLanguageOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCategoryModalOpen(false);
        setAllCategoriesOpen(false);
        setActiveSubMenu(null);
        setLanguageOpen(false);
        setHomeDropdownOpen(false);
        setBlogDropdownOpen(false);
        setShopDropdownOpen(false);
        setPageDropdownOpen(false);
        setStickyMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (selectedCategory && selectedCategory !== "All categories") {
      params.set("cat", selectedCategory);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategoryModalOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="w-full bg-white select-none">
      {/* Spacer when sticky to prevent layout jump */}
      {isSticky && <div className="h-[134px] w-full" />}

      {/* ========================================================= */}
      {/* STICKY HEADER WRAPPER (Bar 1 + Toggleable Bar 2)          */}
      {/* ========================================================= */}
      <div
        className={`w-full bg-white transition-all duration-200 z-50 ${
          isSticky
            ? "fixed top-0 left-0 right-0 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-b border-[#eeeeee]"
            : "relative"
        }`}
      >
        {/* 1. MAIN HEADER BAR (Logo, Search Pill, Actions) */}
        <div
          className={`w-full bg-white border-b border-[#f4f4f4] ${
            isSticky ? "py-3" : "py-4 md:py-5"
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
            <Image
              src="/logo-onsus.png"
              alt="onsus."
              width={130}
              height={36}
              priority
              className="h-[32px] md:h-[36px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Center: Scoped Search Bar with Pill Border */}
          <div className="flex-1 max-w-[640px] relative hidden md:block">
            <form
              onSubmit={handleSearchSubmit}
              className="h-[46px] w-full rounded-full border border-[#ff3d3d] bg-white flex items-center pl-5 pr-1.5 transition-shadow focus-within:shadow-[0_0_0_2px_rgba(255,61,61,0.15)]"
            >
              {/* Category Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setCategoryModalOpen((prev) => !prev)}
                className="flex items-center gap-2 text-[13px] text-[#333e48] hover:text-[#ff3d3d] transition-colors cursor-pointer shrink-0 whitespace-nowrap focus:outline-none"
                aria-expanded={categoryModalOpen}
              >
                <span className="font-normal text-[13px] text-[#333e48]">
                  {selectedCategory}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-[#73787d] transition-transform duration-200 ${
                    categoryModalOpen ? "rotate-180 text-[#ff3d3d]" : ""
                  }`}
                />
              </button>

              {/* Vertical Divider */}
              <div className="h-5 w-[1px] bg-[#e5e5e5] mx-4 shrink-0" />

              {/* Product Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products"
                className="flex-1 h-full bg-transparent text-[13px] text-[#333e48] placeholder:text-[#999999] focus:outline-none pr-3"
              />

              {/* Circular Red Search Button */}
              <button
                type="submit"
                className="w-[36px] h-[36px] rounded-full bg-[#ff3d3d] hover:bg-[#e03131] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
                aria-label="Search"
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            </form>

            {/* ========================================================= */}
            {/* SELECT CATEGORIES MODAL (Image 2)                        */}
            {/* ========================================================= */}
            {categoryModalOpen && (
              <div
                ref={categoryModalRef}
                className="absolute left-0 top-[calc(100%+8px)] w-[680px] lg:w-[730px] bg-white border border-[#e5e5e5] rounded-lg shadow-[0_15px_45px_rgba(0,0,0,0.12)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#f0f0f0] mb-4">
                  <h3 className="text-[14px] font-semibold text-[#222222]">
                    Select Categories
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCategoryModalOpen(false)}
                    className="p-1 text-[#888888] hover:text-[#222222] transition-colors cursor-pointer rounded"
                    aria-label="Close"
                  >
                    <X size={17} strokeWidth={2} />
                  </button>
                </div>

                {/* 3 Columns Grid of Categories */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                  {SEARCH_CATEGORY_COLUMNS.map((column, colIdx) => (
                    <div key={colIdx} className="flex flex-col space-y-1">
                      {column.map((category) => {
                        const isSelected = selectedCategory === category;
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className={`text-left text-[13px] py-1.5 transition-colors cursor-pointer ${
                              isSelected
                                ? "text-[#ff3d3d] font-medium"
                                : "text-[#444444] hover:text-[#ff3d3d]"
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sign In, Support, Your cart: (Matching Image 1 Reference) */}
          <div className="flex items-center gap-5 sm:gap-7 shrink-0">
            {/* 1. Sign In */}
            <Link
              href="/my-account"
              className="group flex flex-col items-center justify-center cursor-pointer text-[#333e48] hover:text-[#ff3d3d] transition-colors"
              aria-label="Sign In"
            >
              <User size={22} strokeWidth={1.5} className="group-hover:text-[#ff3d3d] transition-colors" />
              <span className="text-[12px] text-[#333e48] group-hover:text-[#ff3d3d] font-normal leading-tight mt-1 transition-colors">
                Sign In
              </span>
            </Link>

            {/* 2. Support */}
            <Link
              href="/contact"
              className="group hidden sm:flex flex-col items-center justify-center cursor-pointer text-[#333e48] hover:text-[#ff3d3d] transition-colors"
              aria-label="Support"
            >
              <Headphones size={22} strokeWidth={1.5} className="group-hover:text-[#ff3d3d] transition-colors" />
              <span className="text-[12px] text-[#333e48] group-hover:text-[#ff3d3d] font-normal leading-tight mt-1 transition-colors">
                Support
              </span>
            </Link>

            {/* 3. Your cart: (Clicking opens cart drawer from right) */}
            <button
              type="button"
              onClick={openCartDrawer}
              className="group flex flex-col items-center justify-center cursor-pointer text-[#333e48] hover:text-[#ff3d3d] transition-colors focus:outline-none"
              aria-label={`Your cart: ${cartCount} items`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingCart size={22} strokeWidth={1.5} className="group-hover:text-[#ff3d3d] transition-colors" />
                <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-[#ff3d3d] text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none shadow-sm">
                  {cartCount}
                </span>
              </div>
              <span className="text-[12px] text-[#333e48] group-hover:text-[#ff3d3d] font-normal leading-tight mt-1 transition-colors">
                Your cart:
              </span>
            </button>

            {/* 4. Hamburger Menu (Toggles Bottom Menu on Mobile / Sticky Mode) */}
            <button
              type="button"
              onClick={() => {
                if (isSticky) {
                  setStickyMenuOpen((prev) => !prev);
                } else {
                  setMobileMenuOpen(true);
                }
              }}
              className={`p-1 cursor-pointer flex items-center justify-center transition-colors ${
                isSticky ? "flex" : "md:hidden"
              } ${
                isSticky && stickyMenuOpen
                  ? "text-[#ff3d3d]"
                  : "text-[#333e48] hover:text-[#ff3d3d]"
              }`}
              aria-label="Toggle menu"
            >
              <Menu size={24} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (<md) */}
        <div className="container mx-auto px-4 mt-3 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="h-[42px] w-full rounded-full border border-[#ff3d3d] bg-white flex items-center pl-4 pr-1 relative"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products"
              className="flex-1 h-full bg-transparent text-xs text-[#333e48] placeholder:text-[#999999] focus:outline-none pr-2"
            />
            <button
              type="submit"
              className="w-[32px] h-[32px] rounded-full bg-[#ff3d3d] text-white flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Search"
            >
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BOTTOM NAVIGATION BAR (Image 1: hidden when sticky, Image 2: shown when hamburger open) */}
      {/* ========================================================= */}
      {(!isSticky || stickyMenuOpen) && (
        <nav
          className={`h-[48px] border-b border-[#eeeeee] transition-all duration-200 ${
            isSticky
              ? "bg-[#f4f5f7] shadow-[0_4px_12px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-top-1 duration-150"
              : "bg-white"
          }`}
        >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Left: All Categories + Divider + Nav Links */}
          <div className="flex items-center h-full">
            {/* "All Categories" Dropdown Trigger & Flyout (Image 3 & 4) */}
            <div
              className="relative h-full flex items-center"
              ref={allCategoriesRef}
              onMouseEnter={() => setAllCategoriesOpen(true)}
              onMouseLeave={() => {
                setAllCategoriesOpen(false);
                setActiveSubMenu(null);
              }}
            >
              <button
                type="button"
                onClick={() => setAllCategoriesOpen((prev) => !prev)}
                className="flex items-center gap-2.5 text-[15px] font-semibold text-[#1e293b] hover:text-[#ff3d3d] transition-colors py-3 cursor-pointer select-none focus:outline-none"
                aria-expanded={allCategoriesOpen}
              >
                {/* 9-dot grid icon (3x3 dots matching Image 1, 2, 3) */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="shrink-0 text-[#1e293b] group-hover:text-[#ff3d3d]"
                >
                  <rect x="1" y="1" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="7.5" y="1" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="14" y="1" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="1" y="7.5" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="7.5" y="7.5" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="14" y="7.5" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="1" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="7.5" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                  <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                </svg>
                <span>All Categories</span>
              </button>

              {/* ========================================================= */}
              {/* ALL CATEGORIES FLYOUT MENU (Image 3 & 4)                  */}
              {/* ========================================================= */}
              {allCategoriesOpen && (
                <div className="absolute left-0 top-full w-[275px] bg-white border border-[#e5e5e5] shadow-[0_12px_32px_rgba(0,0,0,0.1)] rounded-b-md z-40 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {ALL_DEPARTMENTS.map((dept) => {
                    const IconComponent = dept.icon;
                    const isSubActive = activeSubMenu === dept.name;

                    return (
                      <div
                        key={dept.name}
                        className="relative group/item"
                        onMouseEnter={() => {
                          if (dept.hasSub) {
                            setActiveSubMenu(dept.name);
                          } else {
                            setActiveSubMenu(null);
                          }
                        }}
                      >
                        <Link
                          href={dept.href}
                          className={`flex items-center justify-between px-5 py-2.5 text-[13.5px] border-b border-[#f5f5f5] last:border-b-0 transition-colors ${
                            isSubActive
                              ? "text-[#ff3d3d] bg-white"
                              : "text-[#333e48] hover:text-[#ff3d3d] hover:bg-[#fafafa]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent
                              size={18}
                              strokeWidth={1.5}
                              className={`shrink-0 transition-colors ${
                                isSubActive ? "text-[#ff3d3d]" : "text-[#555555]"
                              }`}
                            />
                            <span className="truncate">{dept.name}</span>
                          </div>

                          {dept.hasSub && (
                            <ChevronRight
                              size={14}
                              className={`shrink-0 transition-colors ${
                                isSubActive ? "text-[#ff3d3d]" : "text-[#888888]"
                              }`}
                            />
                          )}
                        </Link>

                        {/* Nested Submenu (Image 4) */}
                        {dept.hasSub && isSubActive && dept.subItems && (
                          <div
                            className="absolute left-full top-0 w-[210px] bg-white border border-[#e5e5e5] shadow-[0_12px_32px_rgba(0,0,0,0.12)] rounded-md py-3 px-2 z-50 animate-in fade-in slide-in-from-left-1 duration-150"
                            onMouseLeave={() => setActiveSubMenu(null)}
                          >
                            {dept.subItems.map((sub) => (
                              <Link
                                key={sub}
                                href={`/shop?cat=${encodeURIComponent(dept.name)}&sub=${encodeURIComponent(sub)}`}
                                className="block px-4 py-2 text-[13.5px] text-[#333e48] hover:text-[#ff3d3d] hover:bg-[#f8f9fa] rounded transition-colors"
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Vertical Separator Line | */}
            <div className="h-5 w-[1px] bg-[#e2e8f0] mx-5" />

            {/* Navigation Links: Home +, Blog +, Shop +, Page + */}
            <div className="flex items-center gap-7 h-full">
              {/* Home + (in red #ff3d3d) */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setHomeDropdownOpen(true)}
                onMouseLeave={() => setHomeDropdownOpen(false)}
              >
                <Link
                  href="/"
                  className="flex items-center gap-1 text-[14px] font-medium text-[#ff3d3d] hover:text-[#ff3d3d] transition-colors py-3"
                >
                  <span>Home</span>
                  <span className="text-[13px] font-normal leading-none">+</span>
                </Link>

                {homeDropdownOpen && (
                  <div className="absolute left-0 top-full w-[170px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {[
                      "Home 01",
                      "Home 02",
                      "Home 03",
                      "Home 04",
                      "Home 05",
                      "Home 06",
                      "Home 07",
                      "Home 08",
                    ].map((item, idx) => (
                      <Link
                        key={item}
                        href="/"
                        className={`block px-4 py-2 text-[13px] transition-colors ${
                          idx === 0
                            ? "text-[#ff3d3d] font-medium"
                            : "text-[#333e48] hover:text-[#ff3d3d] hover:bg-[#f8f9fa]"
                        }`}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Blog + */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setBlogDropdownOpen(true)}
                onMouseLeave={() => setBlogDropdownOpen(false)}
              >
                <Link
                  href="/blog"
                  className="flex items-center gap-1 text-[14px] font-medium text-[#333e48] hover:text-[#ff3d3d] transition-colors py-3"
                >
                  <span>Blog</span>
                  <span className="text-[13px] font-normal leading-none">+</span>
                </Link>

                {blogDropdownOpen && (
                  <div className="absolute left-0 top-full w-[160px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {["Blog List", "Blog Grid", "Blog Single"].map((item) => (
                      <Link
                        key={item}
                        href="/blog"
                        className="block px-4 py-2 text-[13px] text-[#333e48] hover:text-[#ff3d3d] hover:bg-[#f8f9fa] transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Shop + */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-1 text-[14px] font-medium text-[#333e48] hover:text-[#ff3d3d] transition-colors py-3"
                >
                  <span>Shop</span>
                  <span className="text-[13px] font-normal leading-none">+</span>
                </Link>

                {shopDropdownOpen && (
                  <div className="absolute left-0 top-full w-[190px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {[
                      { label: "Shop Grid Style", href: "/shop" },
                      { label: "Shop List Style", href: "/shop" },
                      { label: "Product Variable", href: "/product/sample" },
                      { label: "Product Countdown", href: "/product/sample" },
                      { label: "Cart", href: "/cart" },
                      { label: "Wishlist", href: "/shop" },
                      { label: "Order Tracking", href: "/contact" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-[13px] text-[#333e48] hover:text-[#ff3d3d] hover:bg-[#f8f9fa] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Page + */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setPageDropdownOpen(true)}
                onMouseLeave={() => setPageDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-[14px] font-medium text-[#333e48] hover:text-[#ff3d3d] transition-colors py-3 cursor-pointer"
                >
                  <span>Page</span>
                  <span className="text-[13px] font-normal leading-none">+</span>
                </button>

                {pageDropdownOpen && (
                  <div className="absolute left-0 top-full w-[160px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {[
                      { label: "FAQs", href: "/contact" },
                      { label: "Contact Us", href: "/contact" },
                      { label: "About Us", href: "/blog" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-[13px] text-[#333e48] hover:text-[#ff3d3d] hover:bg-[#f8f9fa] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Language Selector (Image 1) */}
          <div className="relative hidden sm:flex items-center" ref={languageRef}>
            <button
              type="button"
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-[13.5px] text-[#555555] hover:text-[#ff3d3d] transition-colors py-2 cursor-pointer select-none"
              aria-label="Select Language"
            >
              <Globe size={16} strokeWidth={1.5} className="text-[#666666]" />
              <span className="text-[#777777]">Language:</span>
              <span className="font-medium text-[#222222]">{selectedLanguage}</span>
              <ChevronDown size={14} className="text-[#888888] ml-0.5" />
            </button>

            {languageOpen && (
              <div className="absolute right-0 top-full mt-1 w-[130px] bg-white border border-[#e5e5e5] shadow-[0_8px_20px_rgba(0,0,0,0.1)] rounded-md py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(lang.label);
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-[13px] flex items-center justify-between cursor-pointer transition-colors ${
                      selectedLanguage === lang.label
                        ? "text-[#ff3d3d] font-semibold bg-[#fef2f2]"
                        : "text-[#444444] hover:text-[#ff3d3d] hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {selectedLanguage === lang.label && (
                      <Check size={14} className="text-[#ff3d3d]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      )}
      </div>

      {/* ========================================================= */}
      {/* 3. TWO-TAB OFF-CANVAS DRAWER MENU (Menu & Categories)     */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999999] flex">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Inner Canvas Panel (slides from left) */}
          <div className="relative w-full max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Top Header: Logo + Close Button */}
            <div className="p-4 border-b border-[#f0f0f0] flex items-center justify-between bg-white">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 group"
              >
                <Image
                  src="/images/logo-icon.png"
                  alt="IndustrialEdge"
                  width={30}
                  height={34}
                  className="h-[28px] w-auto object-contain transition-transform group-hover:scale-105"
                />
                <span className="text-[19px] font-bold tracking-tight text-[#141539]">
                  Industrial<span className="text-[#00937a]">Edge</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f5] hover:bg-[#ff3d3d] text-[#555] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Tabs Navigation Header: [ Menu ] | [ Categories ] */}
            <div className="grid grid-cols-2 border-b border-[#eeeeee] bg-[#fafafa]">
              <button
                type="button"
                onClick={() => setCanvasTab("menu")}
                className={`py-3 text-[14px] font-semibold transition-all cursor-pointer relative ${
                  canvasTab === "menu"
                    ? "text-[#ff3d3d] bg-white border-b-2 border-[#ff3d3d]"
                    : "text-[#555555] hover:text-[#ff3d3d]"
                }`}
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => setCanvasTab("categories")}
                className={`py-3 text-[14px] font-semibold transition-all cursor-pointer relative ${
                  canvasTab === "categories"
                    ? "text-[#ff3d3d] bg-white border-b-2 border-[#ff3d3d]"
                    : "text-[#555555] hover:text-[#ff3d3d]"
                }`}
              >
                Categories
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-[#f2f2f2]">
              {canvasTab === "menu" ? (
                /* TAB 1: MENU */
                <div className="py-2 space-y-1">
                  {/* Home Accordion */}
                  <div>
                    <div className="flex items-center justify-between py-2.5 px-2 hover:bg-[#f8f9fa] rounded">
                      <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[14px] font-medium text-[#222222] hover:text-[#ff3d3d] transition-colors"
                      >
                        Home
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCanvasMenu(
                            expandedCanvasMenu === "home" ? null : "home"
                          )
                        }
                        className="p-1 text-[#888] hover:text-[#ff3d3d]"
                      >
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${
                            expandedCanvasMenu === "home"
                              ? "rotate-180 text-[#ff3d3d]"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                    {expandedCanvasMenu === "home" && (
                      <div className="pl-4 pb-2 space-y-1 bg-[#fafafa] rounded-b">
                        {[
                          "Home 01",
                          "Home 02",
                          "Home 03",
                          "Home 04",
                          "Home 05",
                          "Home 06",
                          "Home 07",
                          "Home 08",
                        ].map((h, i) => (
                          <Link
                            key={h}
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-1.5 text-[13px] ${
                              i === 7
                                ? "text-[#ff3d3d] font-semibold"
                                : "text-[#555555] hover:text-[#ff3d3d]"
                            }`}
                          >
                            {h}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Blog Accordion */}
                  <div>
                    <div className="flex items-center justify-between py-2.5 px-2 hover:bg-[#f8f9fa] rounded">
                      <Link
                        href="/blog"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[14px] font-medium text-[#222222] hover:text-[#ff3d3d] transition-colors"
                      >
                        Blog
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCanvasMenu(
                            expandedCanvasMenu === "blog" ? null : "blog"
                          )
                        }
                        className="p-1 text-[#888] hover:text-[#ff3d3d]"
                      >
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${
                            expandedCanvasMenu === "blog"
                              ? "rotate-180 text-[#ff3d3d]"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                    {expandedCanvasMenu === "blog" && (
                      <div className="pl-4 pb-2 space-y-1 bg-[#fafafa] rounded-b">
                        {["Blog List", "Blog Grid", "Blog Single"].map((b) => (
                          <Link
                            key={b}
                            href="/blog"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 text-[13px] text-[#555555] hover:text-[#ff3d3d]"
                          >
                            {b}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shop Accordion */}
                  <div>
                    <div className="flex items-center justify-between py-2.5 px-2 hover:bg-[#f8f9fa] rounded">
                      <Link
                        href="/shop"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[14px] font-medium text-[#222222] hover:text-[#ff3d3d] transition-colors"
                      >
                        Shop
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCanvasMenu(
                            expandedCanvasMenu === "shop" ? null : "shop"
                          )
                        }
                        className="p-1 text-[#888] hover:text-[#ff3d3d]"
                      >
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${
                            expandedCanvasMenu === "shop"
                              ? "rotate-180 text-[#ff3d3d]"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                    {expandedCanvasMenu === "shop" && (
                      <div className="pl-4 pb-2 space-y-1 bg-[#fafafa] rounded-b">
                        {[
                          "All Products",
                          "Computers & Laptops",
                          "Smartphones",
                          "Audio & Headphones",
                          "Cameras",
                        ].map((s) => (
                          <Link
                            key={s}
                            href="/shop"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 text-[13px] text-[#555555] hover:text-[#ff3d3d]"
                          >
                            {s}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact Us */}
                  <div className="py-2.5 px-2 hover:bg-[#f8f9fa] rounded">
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[14px] font-medium text-[#222222] hover:text-[#ff3d3d] transition-colors block"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              ) : (
                /* TAB 2: CATEGORIES */
                <div className="py-2 space-y-1">
                  {ALL_DEPARTMENTS.map((dept) => {
                    const IconComp = dept.icon;
                    return (
                      <div key={dept.name}>
                        <div className="flex items-center justify-between py-2.5 px-2 hover:bg-[#f8f9fa] rounded">
                          <Link
                            href={dept.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 text-[14px] text-[#333e48] hover:text-[#ff3d3d] transition-colors"
                          >
                            <IconComp
                              size={16}
                              strokeWidth={1.5}
                              className="text-[#888]"
                            />
                            <span>{dept.name}</span>
                          </Link>
                          {dept.hasSub && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedCanvasMenu(
                                  expandedCanvasMenu === dept.name
                                    ? null
                                    : dept.name
                                )
                              }
                              className="p-1 text-[#888] hover:text-[#ff3d3d]"
                            >
                              <ChevronRight
                                size={15}
                                className={`transition-transform duration-200 ${
                                  expandedCanvasMenu === dept.name
                                    ? "rotate-90 text-[#ff3d3d]"
                                    : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>
                        {dept.hasSub && expandedCanvasMenu === dept.name && (
                          <div className="pl-8 pb-2 space-y-1 bg-[#fafafa] rounded-b">
                            {dept.subItems?.map((sub) => (
                              <Link
                                key={sub}
                                href={`/shop?cat=${encodeURIComponent(sub)}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-1 text-[13px] text-[#666666] hover:text-[#ff3d3d]"
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* User Account & Cart Quick Actions */}
              <div className="pt-4 pb-2 space-y-3">
                <Link
                  href="/my-account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-[14px] text-[#333e48] hover:text-[#ff3d3d] transition-colors"
                >
                  <User size={18} strokeWidth={1.6} />
                  <span>My Account / Sign In</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCartDrawer();
                  }}
                  className="flex items-center gap-2.5 text-[14px] text-[#333e48] hover:text-[#ff3d3d] transition-colors cursor-pointer w-full text-left"
                >
                  <ShoppingCart size={18} strokeWidth={1.6} />
                  <span>Shopping Cart ({cartCount})</span>
                </button>
              </div>

              {/* Support & Contact Footer */}
              <div className="pt-4 pb-2 text-[13px] text-[#73787d] space-y-1.5">
                <div className="font-semibold text-[#222222]">Need Help?</div>
                <div>
                  Call us now:{" "}
                  <a href="tel:+18001234567" className="font-semibold text-[#ff3d3d]">
                    +1(800) 123 4567
                  </a>
                </div>
                <div>
                  Email:{" "}
                  <a
                    href="mailto:support@industrialedge.com"
                    className="text-[#0e8ce4]"
                  >
                    support@industrialedge.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
