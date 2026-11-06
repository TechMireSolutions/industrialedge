"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  CheckCircle2,
  Trash2,
  Eye,
  Phone,
  Calendar,
  X,
  RefreshCw,
  Clock,
  Check,
} from "lucide-react";
import { api, type InquiryItem } from "@/lib/api";

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<InquiryItem | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
      showToast("Error loading inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      await api.markInquiry(id, status);
      showToast(`Inquiry marked as ${status}`);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      loadInquiries();
    } catch (err) {
      console.error(err);
      showToast("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.deleteInquiry(id);
      showToast("Inquiry deleted successfully");
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      loadInquiries();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete inquiry");
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Messages & Leads</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inquiries and bulk quote requests submitted through the store's Contact page.
          </p>
        </div>

        <button
          onClick={loadInquiries}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading messages...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No customer inquiries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Sender</th>
                  <th className="py-3.5 px-5">Subject</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {inquiries.map((inq) => {
                  const isUnread = inq.status === "unread";

                  return (
                    <tr
                      key={inq.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isUnread ? "bg-orange-50/30 font-medium" : ""
                      }`}
                    >
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            inq.status === "unread"
                              ? "bg-amber-100 text-amber-800"
                              : inq.status === "replied"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{inq.name}</div>
                        <div className="text-[10px] text-slate-400">{inq.email}</div>
                      </td>
                      <td className="py-3.5 px-5 max-w-xs truncate text-slate-800">
                        {inq.subject}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedMessage(inq);
                              if (inq.status === "unread") {
                                handleStatusChange(inq.id, "read");
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                            title="Read Message"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedMessage.subject}</h3>
                <span className="text-xs text-slate-400">
                  From: {selectedMessage.name} &bull; {selectedMessage.email}
                </span>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedMessage.phone && (
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Phone: {selectedMessage.phone}</span>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              {selectedMessage.message}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, "replied")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold border border-emerald-200 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Replied</span>
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-white hover:bg-slate-800 font-semibold flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
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
