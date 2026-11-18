"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Eye,
  EyeOff,
  Check,
  LogOut,
  Package,
  MapPin,
  Settings,
  AlertCircle,
  Truck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api, type OrderItem } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

const PAKISTAN_PROVINCES = [
  "Sindh",
  "Punjab",
  "Islamabad Capital Territory",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

export default function MyAccountPage() {
  const { customerUser, setCustomerUser, logoutCustomer } = useStore();

  // Auth form states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard states
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "security">("orders");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    streetAddress1: "",
    city: "Karachi",
    state: "Sindh",
    zipCode: "75500",
    country: "Pakistan",
  });
  const [addressSaved, setAddressSaved] = useState(false);

  // Change Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  // Load customer orders & saved address when logged in
  useEffect(() => {
    if (!customerUser) return;

    setOrdersLoading(true);
    api
      .getOrders(undefined, undefined, customerUser.email)
      .then((list) => {
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));

    try {
      const raw = localStorage.getItem("industrialedge_saved_address");
      if (raw) {
        setAddressForm((prev) => ({ ...prev, ...JSON.parse(raw) }));
      } else {
        const parts = customerUser.name.split(" ");
        setAddressForm((prev) => ({
          ...prev,
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
        }));
      }
    } catch {}
  }, [customerUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await api.customerLogin(username.trim(), password);
      setCustomerUser(res.user);
      setPassword("");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await api.customerRegister({
        name: regName.trim(),
        email: regEmail.trim(),
        password,
      });
      setCustomerUser(res.user);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!resetEmail.trim()) return;
    setAuthLoading(true);
    try {
      await api.forgotPassword(resetEmail.trim());
      setResetSent(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
        setResetEmail("");
      }, 2800);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "industrialedge_saved_address",
        JSON.stringify({ ...addressForm, email: customerUser?.email || "" })
      );
      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 3000);
    } catch {}
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    if (newPassword.length < 6) {
      setPwMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPwSaving(true);
    try {
      await api.changePassword({
        email: customerUser?.email,
        oldPassword,
        newPassword,
      });
      setPwMessage({ type: "success", text: "Your password has been updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPwMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update password",
      });
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 sm:py-7">
        {/* 1. BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#64748b] mb-8">
          <Link href="/" className="hover:text-[#0ea57a] transition-colors">
            Home
          </Link>
          <span className="text-[#94a3b8] font-normal">&gt;</span>
          <span className="text-[#171145] font-medium">My account</span>
        </nav>

        {/* 2. ACCOUNT DASHBOARD OR AUTH FORM */}
        {customerUser ? (
          <div className="max-w-[1100px] mb-20">
            <h1 className="text-[26px] font-bold text-[#171145] mb-6">My Account</h1>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 sm:p-8 shadow-2xs">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#f0f0f0] mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#0ea57a] font-bold text-xl">
                    {customerUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-[#171145]">
                      Hello, {customerUser.name}!
                    </h2>
                    <p className="text-[13px] text-[#64748b]">{customerUser.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logoutCustomer}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e4e4e7] hover:border-rose-400 hover:text-rose-600 text-[13px] font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Log out</span>
                </button>
              </div>

              {/* Interactive Section Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`p-4 border rounded-xl transition-all text-left cursor-pointer ${
                    activeTab === "orders"
                      ? "border-[#0ea57a] bg-[#ecfdf5]/60 shadow-2xs"
                      : "border-[#e5e7eb] hover:border-slate-300 bg-white"
                  }`}
                >
                  <Package size={20} className="text-[#0ea57a] mb-2" />
                  <h3 className="font-bold text-[14.5px] text-[#171145]">
                    Orders ({orders.length})
                  </h3>
                  <p className="text-[12px] text-[#64748b] mt-0.5">
                    Track purchases and delivery status.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("addresses")}
                  className={`p-4 border rounded-xl transition-all text-left cursor-pointer ${
                    activeTab === "addresses"
                      ? "border-[#0ea57a] bg-[#ecfdf5]/60 shadow-2xs"
                      : "border-[#e5e7eb] hover:border-slate-300 bg-white"
                  }`}
                >
                  <MapPin size={20} className="text-[#0ea57a] mb-2" />
                  <h3 className="font-bold text-[14.5px] text-[#171145]">Addresses</h3>
                  <p className="text-[12px] text-[#64748b] mt-0.5">
                    Save default checkout delivery address.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={`p-4 border rounded-xl transition-all text-left cursor-pointer ${
                    activeTab === "security"
                      ? "border-[#0ea57a] bg-[#ecfdf5]/60 shadow-2xs"
                      : "border-[#e5e7eb] hover:border-slate-300 bg-white"
                  }`}
                >
                  <Settings size={20} className="text-[#0ea57a] mb-2" />
                  <h3 className="font-bold text-[14.5px] text-[#171145]">Account Security</h3>
                  <p className="text-[12px] text-[#64748b] mt-0.5">
                    Update your login password securely.
                  </p>
                </button>
              </div>

              {/* TAB 1: ORDERS */}
              {activeTab === "orders" && (
                <div>
                  <h3 className="text-base font-bold text-[#171145] mb-4">Your Order History</h3>
                  {ordersLoading ? (
                    <p className="text-sm text-slate-400 py-8 text-center">Loading your orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
                      <Package size={30} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700 mb-1">No orders found yet</p>
                      <p className="text-xs text-slate-500 mb-4">
                        Orders placed using {customerUser.email} will appear here automatically.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex px-5 py-2 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2.5 mb-1">
                              <span className="font-bold text-sm text-[#171145]">{ord.id}</span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {ord.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(ord.createdAt).toLocaleDateString("en-PK", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              • {ord.items?.length || 0} item(s) • {ord.paymentMethod}
                            </div>
                            {ord.trackingNumber && (
                              <div className="text-xs text-[#0ea57a] font-medium flex items-center gap-1 mt-1">
                                <Truck size={13} />
                                <span>Tracking: {ord.trackingNumber}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-base font-bold text-[#171145]">
                              {formatPrice(ord.total)}
                            </span>
                            <Link
                              href={`/checkout?order=${encodeURIComponent(ord.id)}`}
                              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-[#171145] hover:text-white text-xs font-semibold text-slate-700 transition-colors"
                            >
                              View Receipt
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADDRESSES */}
              {activeTab === "addresses" && (
                <form onSubmit={handleSaveAddress} className="max-w-xl space-y-4">
                  <h3 className="text-base font-bold text-[#171145]">Saved Delivery Address</h3>
                  {addressSaved && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                      <Check size={14} /> Address saved! It will auto-fill during checkout.
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={addressForm.streetAddress1}
                      onChange={(e) => setAddressForm({ ...addressForm, streetAddress1: e.target.value })}
                      placeholder="House, street, block / sector"
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Province</label>
                      <select
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full h-10 px-2.5 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        {PAKISTAN_PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Save Delivery Address
                  </button>
                </form>
              )}

              {/* TAB 3: ACCOUNT SECURITY */}
              {activeTab === "security" && (
                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                  <h3 className="text-base font-bold text-[#171145]">Change Password</h3>
                  {pwMessage && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                        pwMessage.type === "success"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-rose-50 border-rose-200 text-rose-700"
                      }`}
                    >
                      {pwMessage.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
                      <span>{pwMessage.text}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="px-6 py-2.5 bg-[#0ea57a] hover:bg-[#0b8462] disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {pwSaving ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* LOGIN / REGISTER FORM */
          <div className="max-w-[600px] mx-auto mb-24">
            <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setShowForgotPassword(false);
                  setAuthError(null);
                }}
                className={`pb-3 text-xl font-bold transition-colors cursor-pointer ${
                  authMode === "login"
                    ? "text-[#171145] border-b-2 border-[#0ea57a] -mb-[1px]"
                    : "text-slate-400 hover:text-[#171145]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setShowForgotPassword(false);
                  setAuthError(null);
                }}
                className={`pb-3 text-xl font-bold transition-colors cursor-pointer ${
                  authMode === "register"
                    ? "text-[#171145] border-b-2 border-[#0ea57a] -mb-[1px]"
                    : "text-slate-400 hover:text-[#171145]"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-7 sm:p-9 shadow-2xs">
              {authError && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {showForgotPassword ? (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <h2 className="text-[18px] font-bold text-[#171145]">Reset your password</h2>
                  <p className="text-[13.5px] text-[#64748b] leading-relaxed">
                    Enter your registered email address and we will send password reset instructions.
                  </p>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#334155] mb-2">
                      Email address <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-[46px] px-4 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#171145]"
                    />
                  </div>
                  {resetSent && (
                    <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs rounded flex items-center gap-2">
                      <Check size={14} className="text-[#059669]" />
                      Password reset email has been sent!
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="h-[42px] px-7 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[13.5px] rounded-[6px] transition-colors cursor-pointer"
                    >
                      {authLoading ? "Sending..." : "Reset password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-[13px] text-[#64748b] hover:text-[#171145] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : authMode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#334155] mb-2">
                      Username or email address <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-[46px] px-4 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#171145]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-medium text-[#334155] mb-2">
                      Password <span className="text-[#0ea57a]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[46px] px-4 pr-11 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#171145]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#171145] p-1 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="h-[44px] px-8 bg-[#0ea57a] hover:bg-[#0b8462] disabled:opacity-60 text-white font-bold text-[14px] rounded-[6px] transition-colors cursor-pointer"
                    >
                      {authLoading ? "Signing in..." : "Log In"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[13px] text-[#64748b] hover:text-[#0ea57a] hover:underline cursor-pointer"
                    >
                      Lost your password?
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#334155] mb-1.5">
                      Full Name <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ali Raza"
                      className="w-full h-[44px] px-4 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#171145]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#334155] mb-1.5">
                      Email Address <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-[44px] px-4 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#171145]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#334155] mb-1.5">
                      Password (min 6 chars) <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[44px] px-4 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#171145]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#334155] mb-1.5">
                      Confirm Password <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[44px] px-4 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#171145]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-[46px] bg-[#0ea57a] hover:bg-[#0b8462] disabled:opacity-60 text-white font-bold text-[14px] rounded-[6px] transition-colors cursor-pointer mt-2"
                  >
                    {authLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
