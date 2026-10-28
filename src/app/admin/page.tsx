"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Mail,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  SlidersHorizontal,
  Settings,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { api, type DashboardStats, type OrderItem } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderItem["status"]) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      setActionMessage(`Order ${orderId} marked as ${newStatus}`);
      setTimeout(() => setActionMessage(null), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading Industrial Edge Dashboard...</p>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    unreadInquiries: 0,
    totalCategories: 0,
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time operations, sales metrics, and catalog management for Industrial Edge.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-lg shadow-sm shadow-orange-500/20 transition-all hover:translate-y-[-1px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ${metrics.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs last month</span>
          </div>
        </div>

        {/* Customer Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {metrics.totalOrders}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{metrics.pendingOrders} pending fulfillment</span>
            {metrics.pendingOrders > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Action Needed</span>
            )}
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Products</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {metrics.totalProducts}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{metrics.totalCategories} categories active</span>
            {metrics.lowStockCount > 0 && (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {metrics.lowStockCount} low stock
              </span>
            )}
          </div>
        </div>

        {/* Customer Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Messages</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {metrics.unreadInquiries}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Unread inquiries</span>
            <Link href="/admin/messages" className="text-orange-600 font-semibold hover:underline">
              View all &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards ("Start Dot to End Dot" Control Shortcuts) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/banners"
          className="group p-5 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Full Customizer</span>
            </div>
            <h3 className="font-bold text-base text-slate-100 group-hover:text-orange-300 transition-colors">
              Hero & Banners Manager
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Change headlines, prices, laptop images & deal banners end-to-end.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/products"
          className="group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-orange-300 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              <Package className="w-4 h-4 text-orange-500" />
              <span>Catalog Control</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
              Products & Stock Levels
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add products, toggle inventory, adjust prices & badges.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/settings"
          className="group p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-orange-300 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              <Settings className="w-4 h-4 text-slate-700" />
              <span>Global Settings</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
              Store & Site Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure logo, support phone, address, currency & shipping rates.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Middle Section: Sales Trend & Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sales Performance Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Revenue & Sales Trajectory</h2>
              <p className="text-xs text-slate-500">Monthly revenue volume in USD ($)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Data
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2 border-b border-slate-100">
            {stats?.salesTrend.map((item) => {
              const maxRev = 14000;
              const heightPct = Math.min(100, Math.round((item.revenue / maxRev) * 100));

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shadow-xs mb-1">
                    ${item.revenue}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[48px] bg-gradient-to-t from-slate-800 to-[#f97316] rounded-t-lg group-hover:brightness-110 transition-all cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-500 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Status Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Order Pipeline Status</h2>
            <p className="text-xs text-slate-500 mb-6">Breakdown across customer order stages</p>

            <div className="space-y-3.5">
              {stats?.statusBreakdown.map((item) => {
                const total = metrics.totalOrders || 1;
                const pct = Math.round((item.count / total) * 100);

                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="font-bold text-slate-900">
                        {item.count} orders ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                        className="h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="mt-6 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Fulfill Pending Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom Section: Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500">Latest orders placed through checkout</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Items</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {stats?.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">{order.id}</td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-800">{order.customer?.name}</div>
                    <div className="text-[10px] text-slate-400">{order.customer?.city || "Pakistan"}</div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">
                    {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">${order.total?.toFixed(2)}</td>
                  <td className="py-3.5 px-5">
                    <span className="text-slate-600 text-[11px]">{order.paymentMethod}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        order.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : order.status === "shipped"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : order.status === "processing"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : order.status === "cancelled"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => handleQuickStatusChange(order.id, e.target.value as OrderItem["status"])}
                      className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-orange-500 font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
