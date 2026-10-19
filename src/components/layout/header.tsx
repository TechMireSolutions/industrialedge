"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Smartphone,
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
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-1 text-xs text-[#212529] hover:text-[#0e8ce4] transition-colors cursor-pointer"
      >
        {trigger}
      </button>
      {open && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 w-[160px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-[5px] py-2 z-50">
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
  const router = useRouter();
  const { wishlistCount, cartCount, cartTotal } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [superDealsOpen, setSuperDealsOpen] = useState(false);
  const [featuredBrandsOpen, setFeaturedBrandsOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("All Categories");

  const formatMoney = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (searchCategory !== "All Categories") params.set("cat", searchCategory);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <>
      {/* ============ TIER 1: TOP UTILITY BAR ============ */}
      <div className="h-[52px] border-b border-[#e5e5e5] bg-white text-xs">
        <div className="container h-full flex items-center justify-between">
          {/* Left: Phone & Email */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[#212529]">
              <Smartphone size={15} strokeWidth={1.5} className="shrink-0 text-[#212529]" />
              <span>+1 (555) 014-2360</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[#212529]">
              <Mail size={15} strokeWidth={1.5} className="shrink-0 text-[#212529]" />
              <span>support@onetech.example</span>
            </div>
          </div>

          {/* Right: Language, Currency, Auth */}
          <div className="flex items-center gap-8">
            <Dropdown trigger={<span>English</span>}>
              {LANGUAGES.map((lg) => (
                <DropdownItem key={lg.code} label={lg.label} />
              ))}
            </Dropdown>

            <Dropdown trigger={<span>$ US dollar</span>}>
              {CURRENCIES.map((c) => (
                <DropdownItem key={c.code} label={c.label} />
              ))}
            </Dropdown>

            <div className="hidden md:flex items-center gap-2.5 text-[#212529]">
              <User size={15} strokeWidth={1.5} className="shrink-0 text-[#212529]" />
              <Link href="/shop" className="hover:text-[#0e8ce4] transition-colors">
                Register
              </Link>
              <span className="text-[#d1d5db]">|</span>
              <Link href="/shop" className="hover:text-[#0e8ce4] transition-colors">
                Sign in
              </Link>
            </div>

            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="p-1.5 text-black/60 hover:text-[#0e8ce4]"
                aria-label="Open menu"
              >
                <Menu size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TIER 2: MAIN SEARCH & CART BAR ============ */}
      <div className="h-[110px] lg:h-[125px] bg-white">
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-[36px] sm:text-[38px] font-bold text-[#0e8ce4] tracking-tight hover:opacity-95 transition-opacity leading-none"
          >
            OneTech
          </Link>

          {/* Scoped Search */}
          <div className="hidden lg:flex items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-[500px] xl:w-[540px] h-[50px] border border-[#e5e5e5] rounded-[5px] bg-white transition-colors focus-within:border-[#0e8ce4]"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 h-full px-5 text-sm text-[#212529] placeholder:text-[#999999] bg-transparent focus:outline-none"
              />
              <div className="relative h-[26px] flex items-center border-l border-[#e5e5e5] px-4 bg-transparent">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="border-none bg-transparent text-xs text-[#555555] cursor-pointer appearance-none pr-5 focus:outline-none"
                >
                  <option>All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
                />
              </div>
              <button
                type="submit"
                className="w-[50px] h-[50px] bg-[#0e8ce4] hover:bg-[#007bd4] text-white rounded-r-[4px] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={2} />
              </button>
            </form>
          </div>

          {/* Widgets (Wishlist & Cart) */}
          <div className="flex items-center gap-8 lg:gap-11">
            {/* Wishlist */}
            <Link
              href="/shop"
              className="group flex items-center gap-3 cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart
                size={34}
                strokeWidth={1.5}
                className="text-black group-hover:text-[#0e8ce4] transition-colors shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black group-hover:text-[#0e8ce4] transition-colors leading-tight">
                  Wishlist
                </span>
                <span className="text-xs text-[#828282] leading-tight mt-1">
                  {wishlistCount}
                </span>
              </div>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="group flex items-center gap-3.5 cursor-pointer"
              aria-label="Cart"
            >
              <div className="relative shrink-0">
                <ShoppingBag
                  size={34}
                  strokeWidth={1.5}
                  className="text-black group-hover:text-[#0e8ce4] transition-colors"
                />
                <span className="absolute -bottom-1 -right-2 min-w-[19px] h-[19px] px-1 bg-[#0e8ce4] text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black group-hover:text-[#0e8ce4] transition-colors leading-tight">
                  Cart
                </span>
                <span className="text-xs text-[#828282] leading-tight mt-1">
                  {formatMoney(cartTotal)}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ============ TIER 3: PRIMARY NAVIGATION ============ */}
      <nav className="h-[60px] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.05)] border-t border-[#e5e5e5]">
        <div className="container h-full flex items-center justify-between">
          {/* Category spine button */}
          <div
            className="w-[270px] h-full bg-[#0e8ce4] text-white px-6 flex items-center gap-4 uppercase font-medium tracking-wider cursor-pointer relative group"
            onClick={() => setCategoriesOpen((prev) => !prev)}
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
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
                    className="relative group/hardware px-4 py-3 text-sm text-black hover:bg-[#f2f4f8] hover:text-[#0e8ce4] cursor-pointer border-b border-[#e5e5e5]/50 flex items-center justify-between"
                  >
                    <Link href="/shop" className="flex-1 block">
                      {cat}
                    </Link>
                    {cat === "Hardware" && (
                      <div className="absolute left-full top-0 w-[240px] bg-white border border-[#e5e5e5] shadow-[0_10px_25px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover/hardware:opacity-100 group-hover/hardware:visible transition-opacity z-50">
                        <div className="py-2">
                          {HARDWARE_SUB.map((sub) => (
                            <Link
                              key={sub}
                              href="/shop"
                              className="block px-4 py-3 text-sm text-black hover:bg-[#f2f4f8] hover:text-[#0e8ce4] border-b border-[#e5e5e5]/50"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    <ChevronRight size={14} className="text-[#828282]" />
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
