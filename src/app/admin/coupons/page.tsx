"use client";

import { useState, useEffect } from "react";
import {
  TicketPercent,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  X,
  RefreshCw,
} from "lucide-react";
import { api, type CouponItem } from "@/lib/api";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    value: 15,
    minSpend: 50,
    maxUses: 100,
    expiresAt: "2027-12-31",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await api.getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
      showToast("Error loading coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.value === undefined) return;

    try {
      await api.createCoupon(formData);
      showToast("Coupon created successfully!");
      setModalOpen(false);
      setFormData({
        code: "",
        discountType: "percentage",
        value: 15,
        minSpend: 50,
        maxUses: 100,
        expiresAt: "2027-12-31",
      });
      loadCoupons();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create coupon";
      showToast(msg);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.deleteCoupon(id);
      showToast("Coupon deleted successfully");
      loadCoupons();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discounts & Promo Codes</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create checkout coupons, percentage discounts, minimum spend thresholds, and expiry limits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCoupons}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-lg shadow-sm shadow-orange-500/20 transition-all hover:translate-y-[-1px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No coupons found. Create your first promo code!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Coupon Code</th>
                  <th className="py-3.5 px-5">Discount Value</th>
                  <th className="py-3.5 px-5">Min Spend</th>
                  <th className="py-3.5 px-5">Usage</th>
                  <th className="py-3.5 px-5">Expires</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-slate-900 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded text-xs text-orange-700">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {c.discountType === "percentage" ? `${c.value}% OFF` : `$${c.value} Fixed Discount`}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {c.minSpend ? `$${c.minSpend}` : "No minimum"}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {c.usageCount} / {c.maxUses || 500}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">{c.expiresAt}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Create New Coupon Code</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FLASH50"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-lg shadow-sm"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
