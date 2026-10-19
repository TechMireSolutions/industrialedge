import Link from "next/link";
import { Mail, MapPin, Clock, Camera, Share2, X, Music } from "lucide-react";

const FIND_IT_FAST = [
  { label: "Shop", href: "/shop" },
  { label: "Product", href: "/product/sample" },
  { label: "Blog", href: "/blog" },
  { label: "Cart", href: "/cart" },
  { label: "Contact", href: "/contact" },
];

const CUSTOMER_CARE = [
  { label: "Help Center", href: "#" },
  { label: "Shipping & Returns", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Warranty", href: "#" },
];

const SOCIALS = [
  { icon: Share2, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: X, label: "Twitter" },
  { icon: Music, label: "TikTok" },
];

const PAYMENTS = ["Visa", "Mastercard", "PayPal", "American Express", "Discover"];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-[#f2f4f8] border-t border-[#e5e5e5]">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Logo + contact */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[30px] font-medium text-[#0e8ce4] tracking-tight">OneTech</span>
            </div>
            <p className="text-sm text-black/50 mb-6 max-w-[260px] leading-relaxed">
              Your trusted destination for cutting-edge electronics, smart devices, and premium
              gadgets delivered straight to your door.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={16} strokeWidth={1.5} />
                  <span className="text-sm text-black">Open 24/7</span>
                </div>
                <span className="text-sm text-black/50">+1 (555) 014-2360</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-sm text-black">123 Tech Avenue, Silicon Valley</span>
                  <span className="block text-sm text-black/50">CA 94025, USA</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-0.5">
                  <Mail size={16} strokeWidth={1.5} />
                </div>
                <span className="text-sm text-black/50">support@onetech.example</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Find it Fast */}
          <div>
            <h3 className="text-sm font-medium text-black uppercase tracking-wider mb-6">
              Find it Fast
            </h3>
            <ul className="space-y-3">
              {FIND_IT_FAST.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-black/50 hover:text-[#0e8ce4] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="text-sm font-medium text-black uppercase tracking-wider mb-6">
              Customer Care
            </h3>
            <ul className="space-y-3">
              {CUSTOMER_CARE.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-black/50 hover:text-[#0e8ce4] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e5e5e5] pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs text-black/50">
              © {year} OneTech. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-3 md:gap-6">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="text-xs text-black/50 font-medium tracking-tight uppercase"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
