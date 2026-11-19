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
  const [dbType, setDbType] = useState<string>("mysql");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  // Skip admin layout chrome on /admin/login
  const isLoginPage = pathname === "/admin/login";

  const [authorized, setAuthorized] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("industrialedge_admin_token");
    if (isLoginPage) return !token;
    return Boolean(token);
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(() => {
    return api.getStoredAdminUser();
  });

  // 1. Strict Authentication Guard & Redirect
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("industrialedge_admin_token") : null;
    const user = api.getStoredAdminUser();

    if (isLoginPage) {
      if (token) {
        // If already authenticated and visiting /admin/login, redirect to /admin
        setAuthorized(false);
        router.replace("/admin");
      } else {
        setAuthorized(true);
      }
      return;
    }

    // Protected admin routes (/admin, /admin/products, etc.):
    if (!token) {
      setAuthorized(false);
      router.replace("/admin/login");
      return;
    }

    setAuthorized(true);
    if (user) {
      setAdminUser(user);
    }
  }, [pathname, isLoginPage]);

  // 2. Check server health & badge counters (Only runs when authenticated)
  useEffect(() => {
    if (isLoginPage || authorized !== true) return;

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const [stats, health] = await Promise.all([
          api.getStats(),
          api.getHealth().catch(() => null),
        ]);
        if (!isMounted) return;
        const isStandalone = Boolean(health?.service && health.service.includes("Node.js"));
        setServerOnline(isStandalone);
        if (health?.database) {
          setDbType(health.database);
        }
        if (stats?.metrics) {
          setPendingOrders(stats.metrics.pendingOrders || 0);
          setUnreadMessages(stats.metrics.unreadInquiries || 0);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("token")) {
          api.adminLogout();
          router.replace("/admin/login");
          return;
        }
        setServerOnline(false);
      }
    };

    checkStatus();
    let interval: NodeJS.Timeout | null = null;
    if (process.env.NODE_ENV !== "test") {
      interval = setInterval(checkStatus, 15000);
    }
    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [isLoginPage, authorized]);

  const handleLogout = () => {
    api.adminLogout();
    setAuthorized(false);
    router.replace("/admin/login");
  };

  // If on login page, render login page chrome directly
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0f172a] text-slate-100">{children}</div>;
  }

  // If verifying token or redirecting to /admin/login, show clean loader to avoid flash
  if (authorized !== true) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-xs font-medium tracking-wide">
          Verifying IndustrialEdge Admin Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row font-sans text-slate-800 antialiased">
      {/* 1. Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 flex-shrink-0 z-30 min-h-screen sticky top-0 h-screen">
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

        {/* User Profile & System Status in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090d16] text-xs space-y-3">
          {/* Admin User Chip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f97316] to-[#ea580c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {(adminUser?.name || "A").charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">
                  {adminUser?.name || "Administrator"}
                </div>
                <div className="text-[10px] text-slate-400">
                  {adminUser?.email || "admin@industrialedge.pk"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Node.js API status */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <Radio className={`w-3 h-3 ${serverOnline ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
              Node.js API
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                serverOnline
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                  : "bg-amber-950/80 text-amber-300 border border-amber-800/40"
              }`}
            >
              {serverOnline ? `Live (${dbType === "mysql" ? "MySQL" : "API"})` : "Embedded API"}
            </span>
          </div>

          {/* Live Storefront Button */}
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
        {/* Mobile Navigation Toggle (Small screens only) */}
        <div className="lg:hidden bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-sm text-slate-100">Industrial Edge Admin</span>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

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
            <div className="pt-2 border-t border-slate-800">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Storefront</span>
              </Link>
            </div>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
