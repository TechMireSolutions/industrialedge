"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  SlidersHorizontal,
  Settings,
  TicketPercent,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Radio,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products Catalog", icon: Package },
  { href: "/admin/orders", label: "Customer Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/banners", label: "Hero & Banners Customizer", icon: SlidersHorizontal },
  { href: "/admin/coupons", label: "Discount Coupons", icon: TicketPercent },
  { href: "/admin/messages", label: "Customer Inquiries", icon: Mail },
  { href: "/admin/settings", label: "Store & Site Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  // Skip admin layout chrome on /admin/login
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    // Check server health and stats
    const checkStatus = async () => {
      try {
        const stats = await api.getStats();
        setServerOnline(true);
        if (stats?.metrics) {
          setPendingOrders(stats.metrics.pendingOrders || 0);
          setUnreadMessages(stats.metrics.unreadInquiries || 0);
        }
      } catch {
        setServerOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, [isLoginPage]);

  const handleLogout = () => {
    api.adminLogout();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0f172a] text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row font-sans text-slate-800 antialiased">
      {/* 1. Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 flex-shrink-0 z-30">
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#090d16]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f97316] to-[#ea580c] flex items-center justify-center text-white font-bold text-base shadow-md shadow-orange-500/20">
              IE
            </div>
            <div>
              <span className="font-bold text-slate-100 text-sm tracking-wide block leading-none">
                IndustrialEdge
              </span>
              <span className="text-[10px] uppercase tracking-wider text-orange-400 font-semibold">
                Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Store Management
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#f97316] text-white shadow-md shadow-orange-600/30 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.href === "/admin/orders" && pendingOrders > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                    {pendingOrders}
                  </span>
                )}

                {item.href === "/admin/messages" && unreadMessages > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500 text-white">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Server & System Status in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090d16] text-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${serverOnline ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
              Node.js API
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                serverOnline
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                  : "bg-amber-950/80 text-amber-300 border border-amber-800/40"
              }`}
            >
              {serverOnline ? "Online :5000" : "Embedded API"}
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-xs font-semibold"
          >
            <span>Visit Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Mobile menu toggle button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-slate-900 text-sm">Industrial Edge Admin</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-700">
            <span className="font-semibold text-slate-800">Admin Control Panel</span>
            <span>/</span>
            <span className="text-orange-600 font-medium capitalize">
              {pathname.replace("/admin", "").replace("/", "") || "Overview"}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 px-3 py-1.5 rounded-md border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </Link>

            <Link
              href="/admin/orders"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Orders Notification"
            >
              <Bell className="w-4 h-4" />
              {pendingOrders > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </Link>

            {/* Admin User Chip */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-none">Administrator</div>
                <div className="text-[10px] text-slate-400">admin@industrialedge.pk</div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0f172a] text-slate-200 px-4 py-4 space-y-1 border-b border-slate-800">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                    pathname === item.href ? "bg-[#f97316] text-white font-semibold" : "text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
