"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  DollarSign,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "it", label: "Italian" },
  { code: "es", label: "Spanish" },
  { code: "jp", label: "Japanese" },
];

const CURRENCIES = [
  { code: "USD", label: "$ US dollar" },
  { code: "EUR", label: "EUR Euro" },
  { code: "GBP", label: "GBP British Pound" },
  { code: "JPY", label: "JPY Japanese Yen" },
];

const CATEGORIES = [
  "Computers & Laptops",
  "Cameras & Photos",
  "Hardware",
  "Smartphones & Tablets",
  "TV & Audio",
  "Gadgets",
  "Car Electronics",
  "Video Games & Consoles",
  "Accessories",
];

const HARDWARE_SUB = ["Internal Components", "Peripherals", "Cables & Adapters", "Power Supply"];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function Dropdown({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-1 text-xs text-black/50 hover:text-[#0e8ce4] transition-colors"
      >
        {trigger}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-[160px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-[5px] py-2 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ label }: { label: string }) {
  return (
    <button className="w-full text-left px-4 py-2 text-sm text-black/50 hover:bg-[#0e8ce4] hover:text-white transition-colors">
      {label}
    </button>
  );
}

function NavLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-3 text-sm font-medium text-black hover:text-[#0e8ce4] transition-colors"
    >
      {children}
    </Link>
  );
}

function NavLinkDrawer({
  children,
  href,
  onClose,
}: {
  children: React.ReactNode;
  href: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block px-4 py-3 text-sm font-medium text-black hover:text-[#0e8ce4] transition-colors"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const { wishlistCount, cartCount, cartTotal } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [superDealsOpen, setSuperDealsOpen] = useState(false);
  const [featuredBrandsOpen, setFeaturedBrandsOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  const formatMoney = (n: number) => `$${n.toFixed(2)}`;

  return (
    <>
      {/* ============ TIER 1: TOP UTILITY BAR ============ */}
      <div className="h-[56px] border-b border-[#e5e5e5] bg-[#fafafa] text-xs">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-black/50">
              <Phone size={14} strokeWidth={1.5} />
              <span>+1 (555) 014-2360</span>
            </div>
            <div className="flex items-center gap-2 text-black/50">
              <Mail size={14} strokeWidth={1.5} />
              <span>support@onetech.example</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown trigger={<Globe size={14} strokeWidth={1.5} />}>
              {LANGUAGES.map((lg) => (
                <DropdownItem key={lg.code} label={lg.label} />
              ))}
            </Dropdown>

            <Dropdown trigger={<DollarSign size={14} strokeWidth={1.5} />}>
              {CURRENCIES.map((c) => (
                <DropdownItem key={c.code} label={c.label} />
              ))}
            </Dropdown>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 text-black/50 border-r border-[#e5e5e5]">
              <User size={14} strokeWidth={1.5} />
              <span>Register</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 text-black/50">
              <User size={14} strokeWidth={1.5} />
              <span>Sign in</span>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-black/50 hover:text-[#0e8ce4]"
              >
                <Menu size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TIER 2: MAIN SEARCH & CART BAR ============ */}
      <div className="h-[100px] lg:h-[130px] bg-white">
        <div className="container h-full flex items-center justify-between lg:px-0">
          {/* Logo */}
          <NavLink href="/">
            <span className="text-[36px] font-medium text-[#0e8ce4] tracking-tight">OneTech</span>
          </NavLink>

          {/* Search */}
          <div className="hidden lg:flex items-center">
            <div className="relative flex w-[470px]">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full h-[50px] border border-[#e5e5e5] rounded-[5px] px-4 pr-[90px] text-sm focus:outline-none focus:border-[#0e8ce4] overflow-visible"
              />
              <select
                className="absolute right-0 top-0 bottom-0 w-[120px] border-none bg-transparent text-xs text-black/50 cursor-pointer appearance-none pr-4"
              >
                <option>All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button className="w-[50px] h-full bg-[#0e8ce4] text-white flex items-center justify-center rounded-r-[5px]">
                <Search size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Widgets */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Wishlist */}
            <div className="relative group hidden lg:flex flex-col items-center gap-1 cursor-pointer">
              <button
                className="relative p-2 text-[#cccccc] hover:text-[#0e8ce4] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 w-[10px] h-[10px] bg-[#df3b3b] rounded-full text-[10px] text-white flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              </button>
              <span className="text-[10px] text-[#828282] font-medium">Wishlist</span>
              <span className="text-[10px] text-[#828282]">{wishlistCount}</span>
            </div>

            {/* Cart */}
            <div className="relative group flex flex-col items-center gap-1 cursor-pointer">
              <button
                className="relative p-2 text-[#cccccc] hover:text-[#0e8ce4] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 w-[24px] h-[24px] bg-[#0e8ce4] text-white rounded-full text-[10px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
              <span className="text-[10px] text-[#828282] font-medium">Cart</span>
              <span className="text-[10px] text-[#828282]">{formatMoney(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TIER 3: PRIMARY NAVIGATION ============ */}
      <nav className="h-[60px] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.05)] border-t border-[#e5e5e5]">
        <div className="container h-full flex items-center justify-between lg:px-0">
          {/* Category spine button */}
          <div
            className="w-[270px] h-full bg-[#0e8ce4] text-white px-6 flex items-center gap-4 uppercase font-medium tracking-wider cursor-pointer relative group"
          >
            <div className="flex flex-col gap-1">
              <span className="block h-[2px] w-6 bg-white"></span>
              <span className="block h-[2px] w-6 bg-white"></span>
              <span className="block h-[2px] w-6 bg-white"></span>
            </div>
            <span>CATEGORIES</span>

            {/* Dropdown flyout */}
            <div
              className={`absolute left-0 top-full w-[270px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-40 ${
                categoriesOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
              } transition-all duration-200`}
            >
              <div className="py-2">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat}
                    className="relative px-4 py-3 text-sm text-black hover:bg-[#f2f4f8] cursor-pointer border-b border-[#e5e5e5]/50"
                  >
                    {cat}
                    {cat === "Hardware" && (
                      <div className="absolute right-0 top-0 h-full w-[270px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 ml-[-1px]">
                        <div className="py-2">
                          {HARDWARE_SUB.map((sub) => (
                            <div
                              key={sub}
                              className="px-4 py-3 text-sm text-black hover:bg-[#f2f4f8] border-b border-[#e5e5e5]/50"
                            >
                              {sub}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#828282]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right horizontal nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}

            {/* Super Deals dropdown */}
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSuperDealsOpen(!superDealsOpen);
                }}
                className="px-4 py-3 text-sm font-medium text-black hover:text-[#0e8ce4] transition-colors"
              >
                Super Deals <ChevronDown size={14} className="ml-1" />
              </button>
              {superDealsOpen && (
                <div className="absolute left-0 top-full mt-1 w-[200px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-[5px] py-2 z-50">
                  {["All Deals", "Today Only", "Clearance"].map((d) => (
                    <DropdownItem key={d} label={d} />
                  ))}
                </div>
              )}
            </div>

            {/* Featured Brands dropdown */}
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFeaturedBrandsOpen(!featuredBrandsOpen);
                }}
                className="px-4 py-3 text-sm font-medium text-black hover:text-[#0e8ce4] transition-colors"
              >
                Featured Brands <ChevronDown size={14} className="ml-1" />
              </button>
              {featuredBrandsOpen && (
                <div className="absolute left-0 top-full mt-1 w-[200px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-[5px] py-2 z-50">
                  {["Apple", "Samsung", "Sony", "Dell", "HP"].map((b) => (
                    <DropdownItem key={b} label={b} />
                  ))}
                </div>
              )}
            </div>

            {/* Pages dropdown */}
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPagesOpen(!pagesOpen);
                }}
                className="px-4 py-3 text-sm font-medium text-black hover:text-[#0e8ce4] transition-colors"
              >
                Pages <ChevronDown size={14} className="ml-1" />
              </button>
              {pagesOpen && (
                <div className="absolute left-0 top-full mt-1 w-[200px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-[5px] py-2 z-50">
                  <NavLink key="shop" href="/shop">
                    Shop
                  </NavLink>
                  <NavLink key="product" href="/product/sample">
                    Product
                  </NavLink>
                  <NavLink key="blog" href="/blog">
                    Blog
                  </NavLink>
                  <NavLink key="cart" href="/cart">
                    Cart
                  </NavLink>
                  <NavLink key="contact" href="/contact">
                    Contact
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ============ MOBILE DRAWER ============ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setMobileOpen(false)} className="text-black/50 hover:text-black">
              <X size={24} strokeWidth={2} />
            </button>
          </div>
          <div className="absolute inset-0 p-6 overflow-y-auto max-w-md w-full">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} strokeWidth={1.5} />
                <span className="text-sm text-black">English</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} strokeWidth={1.5} />
                <span className="text-sm text-black">$ US dollar</span>
              </div>
              <hr className="border-[#e5e5e5]" />
              <NavLinkDrawer href="/" onClose={() => setMobileOpen(false)}>
                Home
              </NavLinkDrawer>
              <NavLinkDrawer href="/shop" onClose={() => setMobileOpen(false)}>
                Shop
              </NavLinkDrawer>
              <NavLinkDrawer href="/product/sample" onClose={() => setMobileOpen(false)}>
                Product
              </NavLinkDrawer>
              <NavLinkDrawer href="/blog" onClose={() => setMobileOpen(false)}>
                Blog
              </NavLinkDrawer>
              <NavLinkDrawer href="/cart" onClose={() => setMobileOpen(false)}>
                Cart
              </NavLinkDrawer>
              <NavLinkDrawer href="/contact" onClose={() => setMobileOpen(false)}>
                Contact
              </NavLinkDrawer>
              <hr className="border-[#e5e5e5]" />
              <div className="flex items-center gap-2 text-sm text-black/50">
                <User size={16} strokeWidth={1.5} />
                <span>Register</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-black/50">
                <User size={16} strokeWidth={1.5} />
                <span>Sign in</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
