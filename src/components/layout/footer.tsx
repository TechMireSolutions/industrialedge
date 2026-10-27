"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const COMPANY_LINKS = [
    { label: "Blogs", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Official Partners", href: "/partners" },
  { label: "Contact Us", href: "/contact" },
];

const POPULAR_CATEGORIES = [
  { label: "Smartwatch", href: "/shop" },
  { label: "Smart Phones", href: "/shop" },
  { label: "Laptop & Tablet", href: "/shop" },
  { label: "Cameras & Video", href: "/shop" },
  { label: "Computer Screen", href: "/shop" },
  { label: "Audio Equipments", href: "/shop" },
  { label: "Gaming Accessories", href: "/shop" },
];

const CUSTOMER_CARE = [
    { label: "My Account", href: "/my-account" },
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
];

const BOTTOM_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Partners", href: "/partners" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="w-full bg-[#fafafa] border-t border-[#ebebeb] text-[#73787d]">
      {/* 1. Main 5-Column Section */}
      <div className="max-w-[1490px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Column 1: Logo & Payment */}
          <div className="flex flex-col">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <Image
                src="/images/logo.png"
                alt="IndustrialEdge.pk"
                width={36}
                height={36}
                className="w-[34px] h-[34px] object-contain transition-transform group-hover:scale-105"
                priority
              />
              <span className="text-[20px] font-black tracking-tight text-[#171145] flex items-center">
                Industrial<span className="text-[#0ea57a]">Edge</span>
                <span className="text-[#0ea57a] text-[12px] font-extrabold ml-1 px-1.5 py-0.5 bg-[#ecfdf5] rounded border border-[#a7f3d0]">.pk</span>
              </span>
            </Link>
            <h4 className="text-[15px] font-semibold text-[#333e48] mt-4 mb-3">
              We accept:
            </h4>
            <div className="mt-1">
              <Image
                src="/images/payments-logo.png"
                alt="Accepted Payments"
                width={220}
                height={26}
                className="h-auto w-[210px] object-contain"
              />
            </div>
          </div>

          {/* Column 2: Company & Info */}
          <div>
            <h3 className="font-['Poppins',sans-serif] text-[18px] font-semibold text-[#333e48] mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-[#73787d] hover:text-[#0ea57a] transition-colors leading-[24px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular categories */}
          <div>
            <h3 className="font-['Poppins',sans-serif] text-[18px] font-semibold text-[#333e48] mb-4">
              Popular categories
            </h3>
            <ul className="space-y-2.5">
              {POPULAR_CATEGORIES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-[#73787d] hover:text-[#0ea57a] transition-colors leading-[24px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Care */}
          <div>
            <h3 className="font-['Poppins',sans-serif] text-[18px] font-semibold text-[#333e48] mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5">
              {CUSTOMER_CARE.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-[#73787d] hover:text-[#0ea57a] transition-colors leading-[24px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h3 className="font-['Poppins',sans-serif] text-[18px] font-semibold text-[#333e48] mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-[14px]">
              <div>
                <a
                  href="https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#73787d] hover:text-[#0ea57a] transition-colors leading-[22px] flex items-start gap-2 group"
                >
                  <MapPin size={16} className="text-[#0ea57a] shrink-0 mt-1" />
                  <span>Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan</span>
                </a>
              </div>
              <div className="pt-0.5">
                <a
                  href="https://wa.me/923322316225"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0ea57a] hover:text-[#333e48] transition-colors text-[15px] flex items-center gap-2"
                >
                  <Phone size={15} className="shrink-0" />
                  <span>+92 332 2316225</span>
                </a>
                <div className="flex items-center gap-1.5 text-[12px] text-[#8e9398] mt-1 pl-6">
                  <Clock size={12} className="shrink-0" />
                  <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
              <div>
                <a
                  href="mailto:info@industrialedge.pk"
                  className="text-[#73787d] hover:text-[#0ea57a] transition-colors flex items-center gap-2"
                >
                  <Mail size={15} className="text-[#0ea57a] shrink-0" />
                  <span>info@industrialedge.pk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dark Newsletter Strip */}
      <div className="w-full bg-[#333e48] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1490px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Message */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 text-white">
              <Mail className="w-6 h-6 stroke-[1.5]" />
              <span className="text-[17px] sm:text-[18px] font-bold tracking-tight">
                Join our newsletter for $10 offs
              </span>
            </div>
            <span className="text-[13px] text-[#a0a4a8]">
              Register now to get latest updates on promotions &amp; coupons.
            </span>
          </div>

          {/* Right: Newsletter Input Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-full lg:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="w-full sm:w-[280px] lg:w-[320px] h-[44px] px-4 bg-white text-[#333e48] text-sm rounded-l focus:outline-none placeholder:text-[#999]"
            />
            <button
              type="submit"
              className="h-[44px] px-6 sm:px-8 bg-[#0ea57a] hover:bg-black text-white text-sm font-semibold rounded-r transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* 3. Bottom Centered Section */}
      <div className="w-full bg-[#fafafa] py-8 px-4 sm:px-6 lg:px-8 border-t border-[#ebebeb]">
        <div className="max-w-[1490px] mx-auto flex flex-col items-center justify-center text-center space-y-4">
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-2.5">
            {/* Facebook */}
            <a
              href="https://facebook.com/industrialedge.pk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#0ea57a] hover:border-[#0ea57a] transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/industrialedge.pk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#0ea57a] hover:border-[#0ea57a] transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/company/industrial-edge-pk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#0ea57a] hover:border-[#0ea57a] transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923322316225"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#0ea57a] hover:border-[#0ea57a] transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-[#73787d]">
            {BOTTOM_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[#0ea57a] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[13px] text-[#73787d]">
            IndustrialEdge.pk &copy; 2026 All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
