"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  Printer,
  X,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { api, type OrderItem } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      showToast("Error loading customer orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderItem["status"]) => {
    try {
      await api.updateOrder(orderId, { status });
      showToast(`Order ${orderId} updated to ${status}`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      loadOrders();
    } catch (err) {
      console.error(err);
      showToast("Failed to update status");
    }
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      await api.updateOrder(orderId, { trackingNumber });
      showToast("Tracking number saved");
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, trackingNumber });
      }
      loadOrders();
    } catch (err) {
      console.error(err);
      showToast("Failed to update tracking number");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === "all" || o.status.toLowerCase() === activeTab.toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.phone && o.customer.phone.includes(q)) ||
      (o.customer?.city && o.customer.city.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Orders</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track orders placed through checkout, update fulfillment status, view customer addresses, and print invoices.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((tab) => {
            const count =
              tab === "all"
                ? orders.length
                : orders.filter((o) => o.status.toLowerCase() === tab).length;
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#0f172a] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID (ORD-XXXX), Customer name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading customer orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No orders found in this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer & Destination</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{order.id}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{order.customer?.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{order.customer?.city || "Pakistan"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">{order.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400">{order.paymentStatus}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderItem["status"])
                        }
                        className={`text-xs font-bold uppercase rounded-md px-2.5 py-1 border transition-all ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Inspection Modal & Invoice View */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{selectedOrder.id}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Customer & Contact
                </h3>
                <div className="font-semibold text-slate-800 text-sm mb-1">
                  {selectedOrder.customer?.name}
                </div>
                <div className="text-slate-600 flex items-center gap-1.5 mb-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.customer?.email}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.customer?.phone}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Delivery Address
                </h3>
                <div className="text-slate-700 leading-relaxed">
                  {selectedOrder.customer?.address}
                </div>
                <div className="text-slate-500 font-semibold mt-1">
                  {selectedOrder.customer?.city}, {selectedOrder.customer?.country || "Pakistan"}
                </div>
              </div>
            </div>

            {/* Tracking Number Input */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-bold text-blue-900 mb-0.5">
                  Courier Tracking Number (TCS / Leopard / DHL)
                </label>
                <input
                  type="text"
                  defaultValue={selectedOrder.trackingNumber || ""}
                  placeholder="Enter tracking code e.g. TCS-892182"
                  onBlur={(e) => handleTrackingUpdate(selectedOrder.id, e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-blue-200 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Ordered Items Table */}
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Ordered Products
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={item.image || "/images/cat-laptop.jpg"}
                          alt={item.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400">Qty: {item.qty} &times; ${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${selectedOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span>${selectedOrder.shipping?.toFixed(2) || "0.00"}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>-${selectedOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="text-orange-600">${selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Change Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderItem["status"])
                  }
                  className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
