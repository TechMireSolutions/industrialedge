"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  ChevronDown,
  Search,
  X,
  Menu,
  Headphones,
  Globe,
  Check,
} from "lucide-react";

const CATEGORY_COLUMNS = [
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

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
];

export default function Header() {
  const router = useRouter();
  const { wishlist, cart } = useStore();

  // Search & Categories State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const categoryModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dropdown states
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languageRef = useRef<HTMLDivElement>(null);

  // Nav dropdown states
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);

  // Mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

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
      if (languageRef.current && !languageRef.current.contains(target)) {
        setLanguageOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCategoryModalOpen(false);
        setLanguageOpen(false);
        setHomeDropdownOpen(false);
        setBlogDropdownOpen(false);
        setShopDropdownOpen(false);
        setPageDropdownOpen(false);
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

  // Compare count (static 0 for initial view matching screenshot)
  const compareCount = 0;
  // Wishlist count reflects actual items in wishlist
  const wishlistCount = wishlist.length;
  // Cart count reflects items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="w-full bg-white select-none">
      {/* ========================================================= */}
      {/* 1. TOP UTILITY BAR                                        */}
      {/* ========================================================= */}
      <div className="h-[42px] border-b border-[#eeeeee] bg-white text-[13px] text-[#73787d]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Left: Call us for free */}
          <div className="flex items-center gap-2">
            <Headphones size={14} strokeWidth={1.6} className="text-[#73787d]" />
            <span>Call us for free:</span>
            <a
              href="tel:+18001234567"
              className="text-[#ff3d3d] font-semibold hover:underline transition-colors"
            >
              +1 (800) 123 4567
            </a>
          </div>

          {/* Right: Language & Sign In */}
          <div className="flex items-center gap-7">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => setLanguageOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-[#73787d] hover:text-[#ff3d3d] transition-colors cursor-pointer text-[13px]"
                aria-expanded={languageOpen}
              >
                <Globe size={14} strokeWidth={1.6} className="text-[#73787d]" />
                <span>Language:</span>
                <span className="font-semibold text-[#333e48] ml-0.5">
                  {selectedLanguage}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-[#73787d] transition-transform duration-200 ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[140px] bg-white border border-[#e5e5e5] rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.1)] py-1.5 z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang.label);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        selectedLanguage === lang.label
                          ? "text-[#ff3d3d] font-semibold bg-[#fff5f5]"
                          : "text-[#333e48] hover:bg-[#f8f9fa] hover:text-[#ff3d3d]"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.label && (
                        <Check size={12} className="text-[#ff3d3d]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In */}
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-[#333e48] hover:text-[#ff3d3d] transition-colors text-[13px]"
            >
              {/* User SVG matching Onsus icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-current"
              >
                <path
                  d="M11.9998 12.5283C6.20222 12.5283 1.48535 17.2452 1.48535 23.0428C1.48535 23.2952 1.69017 23.5 1.94252 23.5C2.19487 23.5 2.39968 23.2952 2.39968 23.0428C2.39968 17.749 6.70606 13.4426 11.9999 13.4426C17.2937 13.4426 21.6001 17.749 21.6001 23.0428C21.6001 23.2952 21.8049 23.5 22.0572 23.5C22.3096 23.5 22.5144 23.2952 22.5144 23.0428C22.5144 17.2443 17.7975 12.5283 11.9998 12.5283Z"
                  fill="currentColor"
                />
                <path
                  d="M12.0003 1.5C9.22815 1.5 6.97168 3.75557 6.97168 6.52866C6.97168 9.30174 9.2282 11.5573 12.0003 11.5573C14.7725 11.5573 17.029 9.30174 17.029 6.52866C17.029 3.75557 14.7725 1.5 12.0003 1.5ZM12.0003 10.643C9.73195 10.643 7.88597 8.79705 7.88597 6.52866C7.88597 4.26027 9.73195 2.41429 12.0003 2.41429C14.2687 2.41429 16.1147 4.26027 16.1147 6.52866C16.1147 8.79705 14.2687 10.643 12.0003 10.643Z"
                  fill="currentColor"
                />
              </svg>
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN MIDDLE HEADER BAR                                 */}
      {/* ========================================================= */}
      <div className="py-5 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/logo-onsus.png"
              alt="onsus."
              width={165}
              height={36}
              priority
              className="h-[36px] w-auto object-contain hover:opacity-95 transition-opacity"
            />
          </Link>

          {/* Search Bar with "All categories" & Pill Border */}
          <div className="flex-1 max-w-[620px] relative hidden md:block">
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
            {/* SELECT CATEGORIES MODAL / MEGA-DROPDOWN (Image 2)        */}
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
                  {CATEGORY_COLUMNS.map((column, colIdx) => (
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

          {/* Right: Support Contact (Headset + Phone + Email) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Support Headset Icon */}
            <div className="text-[#333e48]">
              <Headphones size={28} strokeWidth={1.5} className="text-[#333e48]" />
            </div>

            {/* Stacked Contact Info */}
            <div className="flex flex-col text-xs leading-snug">
              <div className="text-[#73787d]">
                <span>Call us now: </span>
                <a
                  href="tel:+18001234567"
                  className="text-[#ff3d3d] font-semibold hover:underline"
                >
                  +1(800) 123 4567
                </a>
              </div>
              <div className="text-[#73787d] mt-0.5">
                <span>Email: </span>
                <a
                  href="mailto:oesus@support.com"
                  className="text-[#004ec3] hover:underline"
                >
                  oesus@support.com
                </a>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden ml-2 p-2 text-[#333e48] hover:text-[#ff3d3d] cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
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
      {/* 3. BOTTOM NAVIGATION BAR (Light Gray Strip)               */}
      {/* ========================================================= */}
      <nav className="h-[50px] bg-[#f4f5f7] border-y border-[#e5e7eb]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Left Navigation Links: Home +, Blog +, Shop +, Page + */}
          <div className="flex items-center gap-8 h-full">
            {/* Home + (Highlighted in RED as in Image 1) */}
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

              {/* Home Submenu Dropdown */}
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

          {/* Right Action Icons: Compare (0), Wishlist (0), Cart (0) */}
          <div className="flex items-center gap-6">
            {/* Compare Action */}
            <Link
              href="/shop"
              className="relative p-1 text-[#333e48] hover:text-[#ff3d3d] transition-colors cursor-pointer group"
              aria-label="Compare"
            >
              {/* Exact Onsus Compare SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 26 26"
                fill="none"
                className="text-[#333e48] group-hover:text-[#ff3d3d] transition-colors"
              >
                <path
                  d="M7.85714 10.4286L4.42857 13.8572L1 10.4286"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.1429 15.625L21.5714 12.1964L25 15.625"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 20.7142C7 19.2941 5.84874 18.1428 4.42858 18.1428C3.00841 18.1428 1.85715 19.2941 1.85715 20.7142C1.85715 22.1344 3.00841 23.2856 4.42858 23.2856C5.84874 23.2856 7 22.1344 7 20.7142Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24.1429 5.28575C24.1429 3.86559 22.9916 2.71432 21.5714 2.71432C20.1513 2.71432 19 3.86559 19 5.28575C19 6.70591 20.1513 7.85718 21.5714 7.85718C22.9916 7.85718 24.1429 6.70591 24.1429 5.28575Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.42856 13L4.42856 8.5C4.42856 7.64752 4.76721 6.82995 5.37 6.22716C5.9728 5.62436 6.79036 5.28571 7.64284 5.28571L19 5.28571"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.5714 13.0535L21.5714 17.5535C21.5714 18.406 21.2328 19.2236 20.63 19.8264C20.0272 20.4292 19.2096 20.7678 18.3571 20.7678L7 20.7678"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Circular Red Badge */}
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#ff3d3d] text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                {compareCount}
              </span>
            </Link>

            {/* Wishlist Action */}
            <Link
              href="/shop"
              className="relative p-1 text-[#333e48] hover:text-[#ff3d3d] transition-colors cursor-pointer group"
              aria-label="Wishlist"
            >
              {/* Exact Onsus Wishlist Heart SVG */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 26 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#333e48] group-hover:text-[#ff3d3d] transition-colors"
              >
                <path
                  d="M18.1949 2.73732C16.1929 2.72573 14.2896 3.67827 13 5.33729C11.7184 3.66693 9.80988 2.71168 7.80503 2.73732C4.0467 2.73732 1 6.03791 1 10.1094C1 17.0867 12.2405 23.8993 12.6962 24.1626C12.8801 24.2957 13.1199 24.2957 13.3038 24.1626C13.7595 23.8993 25 17.1854 25 10.1094C25 6.03791 21.9532 2.73732 18.1949 2.73732ZM13 22.8461C11.2379 21.7272 2.21519 15.7702 2.21519 10.1094C2.21519 6.765 4.71785 4.05371 7.80508 4.05371C9.69561 4.02682 11.4648 5.05986 12.4836 6.78534C12.6904 7.09433 13.0893 7.16318 13.3746 6.93905C13.4291 6.89621 13.477 6.84437 13.5164 6.78534C15.206 3.98618 18.6702 3.20077 21.2541 5.03107C22.8358 6.15155 23.7879 8.06199 23.7848 10.1094C23.7848 15.836 14.762 21.7601 13 22.8461Z"
                  fill="currentColor"
                />
              </svg>
              {/* Circular Red Badge */}
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#ff3d3d] text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            </Link>

            {/* Cart Action */}
            <Link
              href="/cart"
              className="relative p-1 text-[#333e48] hover:text-[#ff3d3d] transition-colors cursor-pointer group"
              aria-label="Cart"
            >
              {/* Exact Onsus Cart SVG */}
              <svg
                width="24"
                height="23"
                viewBox="0 0 28 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#333e48] group-hover:text-[#ff3d3d] transition-colors"
              >
                <path
                  d="M9.55865 19.6096C7.8483 19.6096 6.46191 20.996 6.46191 22.7064C6.46191 24.4165 7.8483 25.8029 9.55865 25.8029C11.2688 25.8029 12.6552 24.4165 12.6552 22.7064C12.6534 20.9969 11.2681 19.6114 9.55865 19.6096ZM9.55865 24.6644C8.47712 24.6644 7.60037 23.7877 7.60037 22.7064C7.60037 21.6248 8.47712 20.7481 9.55865 20.7481C10.64 20.7481 11.5167 21.6248 11.5167 22.7064C11.5167 23.7877 10.64 24.6644 9.55865 24.6644Z"
                  fill="currentColor"
                />
                <path
                  d="M26.4365 6.6144H6.33692L5.92712 4.32036C5.67452 2.90819 4.56764 1.80353 3.15502 1.55382L1.66925 1.29211C1.35951 1.23697 1.064 1.44354 1.00885 1.75305C0.95393 2.06279 1.16028 2.3583 1.47002 2.41345L2.96135 2.67516C3.90235 2.84193 4.63902 3.57859 4.80578 4.51959L6.82076 15.887C7.05868 17.2472 8.2405 18.2393 9.62132 18.238H21.5751C22.831 18.2418 23.9401 17.4197 24.3018 16.2172L26.9772 7.34861C27.0268 7.17562 26.9955 6.98929 26.8918 6.84209C26.7835 6.69956 26.6152 6.61551 26.4365 6.6144ZM23.2145 15.8813C22.9997 16.6035 22.3342 17.0975 21.5809 17.0938H9.6271C8.79794 17.096 8.08818 16.4994 7.94788 15.682L6.54193 7.74707H25.6736L23.2145 15.8813Z"
                  fill="currentColor"
                />
                <path
                  d="M21.5118 19.6096C19.8014 19.6096 18.415 20.996 18.415 22.7064C18.415 24.4165 19.8014 25.8029 21.5118 25.8029C23.2219 25.8029 24.6083 24.4165 24.6083 22.7064C24.6065 20.9969 23.2212 19.6114 21.5118 19.6096ZM21.5118 24.6644C20.4302 24.6644 19.5535 23.7877 19.5535 22.7064C19.5535 21.6248 20.4302 20.7481 21.5118 20.7481C22.5931 20.7481 23.4698 21.6248 23.4698 22.7064C23.4698 23.7877 22.5931 24.6644 21.5118 24.6644Z"
                  fill="currentColor"
                />
              </svg>
              {/* Circular Red Badge */}
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#ff3d3d] text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 4. RESPONSIVE MOBILE DRAWER MENU                          */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#eeeeee] flex items-center justify-between">
              <Image
                src="/logo-onsus.png"
                alt="onsus."
                width={140}
                height={30}
                className="h-[30px] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#555555] hover:text-[#ff3d3d] rounded cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="p-4 flex-1 space-y-4">
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#ff3d3d] bg-[#fff5f5] rounded-md"
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#333e48] hover:text-[#ff3d3d] hover:bg-gray-50 rounded-md"
                >
                  Blog
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#333e48] hover:text-[#ff3d3d] hover:bg-gray-50 rounded-md"
                >
                  Shop
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#333e48] hover:text-[#ff3d3d] hover:bg-gray-50 rounded-md"
                >
                  Contact
                </Link>
              </div>

              {/* Categories Section in Mobile */}
              <div className="pt-4 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setMobileCategoryOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-[#222222] py-2 cursor-pointer"
                >
                  <span>All Categories</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      mobileCategoryOpen ? "rotate-180 text-[#ff3d3d]" : ""
                    }`}
                  />
                </button>
                {mobileCategoryOpen && (
                  <div className="mt-2 space-y-1 pl-2">
                    {CATEGORY_COLUMNS.flat().map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-1 text-xs text-[#555555] hover:text-[#ff3d3d] cursor-pointer"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact info in mobile */}
              <div className="pt-4 border-t border-[#eeeeee] text-xs space-y-2 text-[#73787d]">
                <div>
                  <span>Call us for free: </span>
                  <a href="tel:+18001234567" className="text-[#ff3d3d] font-semibold">
                    +1 (800) 123 4567
                  </a>
                </div>
                <div>
                  <span>Email: </span>
                  <a href="mailto:oesus@support.com" className="text-[#004ec3]">
                    oesus@support.com
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
