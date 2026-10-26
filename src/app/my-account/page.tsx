"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Eye, EyeOff, Check, LogOut, Package, MapPin, Settings } from "lucide-react";

export default function MyAccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail.trim()) {
      setResetSent(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
        setResetEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 sm:py-7">
        {/* ========================================================= */}
        {/* 1. BREADCRUMBS                                            */}
        {/* ========================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#71717a] mb-8">
          <Link href="/" className="hover:text-[#ff3d3d] transition-colors">
            Home
          </Link>
          <span className="text-[#a1a1aa] font-normal">&gt;</span>
          <span className="text-[#18181b] font-medium">My account</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. MAIN ACCOUNT CONTENT                                   */}
        {/* ========================================================= */}
        {isLoggedIn ? (
          /* LOGGED IN DASHBOARD STATE */
          <div className="max-w-[1000px] mb-20">
            <h1 className="text-[26px] font-bold text-[#18181b] mb-6">
              My account
            </h1>

            <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-8 sm:p-10 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#f0f0f0] mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center text-[#71717a]">
                    <User size={28} />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-[#18181b]">
                      Hello, {username || "Mir Ali"}!
                    </h2>
                    <p className="text-[13px] text-[#71717a]">
                      Welcome back to your IndustrialEdge account dashboard.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#e4e4e7] hover:border-[#ff3d3d] hover:text-[#ff3d3d] text-[13px] font-medium rounded-[5px] transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Log out</span>
                </button>
              </div>

              {/* Account Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Link
                  href="/checkout?step=confirmation"
                  className="p-5 border border-[#e5e7eb] hover:border-[#ff3d3d] rounded-[6px] transition-colors group block text-left"
                >
                  <Package size={22} className="text-[#ff3d3d] mb-3" />
                  <h3 className="font-bold text-[15px] text-[#18181b] group-hover:text-[#ff3d3d] transition-colors">
                    Orders
                  </h3>
                  <p className="text-[12.5px] text-[#71717a] mt-1">
                    View recent orders and invoice details.
                  </p>
                </Link>

                <div className="p-5 border border-[#e5e7eb] rounded-[6px] text-left">
                  <MapPin size={22} className="text-[#ff3d3d] mb-3" />
                  <h3 className="font-bold text-[15px] text-[#18181b]">
                    Addresses
                  </h3>
                  <p className="text-[12.5px] text-[#71717a] mt-1">
                    Manage billing and shipping addresses.
                  </p>
                </div>

                <div className="p-5 border border-[#e5e7eb] rounded-[6px] text-left">
                  <Settings size={22} className="text-[#ff3d3d] mb-3" />
                  <h3 className="font-bold text-[15px] text-[#18181b]">
                    Account details
                  </h3>
                  <p className="text-[12.5px] text-[#71717a] mt-1">
                    Edit password and account details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* LOGIN FORM (MATCHING USER REFERENCE SCREENSHOT) */
          <div className="max-w-[1200px] mb-24">
            <h1 className="text-[26px] font-bold text-[#18181b] tracking-tight mb-6">
              Login
            </h1>

            <div className="bg-white border border-[#e5e7eb] rounded-[6px] p-8 sm:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {showForgotPassword ? (
                /* FORGOT PASSWORD FORM */
                <form onSubmit={handleResetPassword} className="max-w-[500px]">
                  <h2 className="text-[18px] font-bold text-[#18181b] mb-2">
                    Reset your password
                  </h2>
                  <p className="text-[13.5px] text-[#71717a] mb-5 leading-relaxed">
                    Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
                  </p>

                  <div className="mb-5">
                    <label className="block text-[13.5px] font-medium text-[#27272a] mb-2">
                      Username or email <span className="text-[#ff3d3d]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter username or email"
                      className="w-full h-[46px] px-4 border border-[#e4e4e7] rounded-[5px] text-[14px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                    />
                  </div>

                  {resetSent && (
                    <div className="mb-4 p-3 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs rounded flex items-center gap-2">
                      <Check size={14} className="text-[#059669]" />
                      Password reset email has been sent!
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="h-[42px] px-7 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[13.5px] rounded-[5px] transition-colors shadow-xs cursor-pointer active:scale-[0.99]"
                    >
                      Reset password
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-[13px] text-[#71717a] hover:text-[#18181b] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* LOGIN FORM (EXACT MATCH TO REFERENCE) */
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Username or email address * */}
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#27272a] mb-2">
                      Username or email address <span className="text-[#ff3d3d]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-[46px] px-4 border border-[#e4e4e7] rounded-[5px] text-[14px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                    />
                  </div>

                  {/* Password * */}
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#27272a] mb-2">
                      Password <span className="text-[#ff3d3d]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[46px] px-4 pr-11 border border-[#e4e4e7] rounded-[5px] text-[14px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#18181b] p-1 cursor-pointer transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me Checkbox */}
                  <div>
                    <label className="inline-flex items-center gap-2.5 text-[13.5px] text-[#3f3f46] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-[#2563eb] w-4 h-4 rounded cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  {/* Log In Button (Red #ff3d3d) */}
                  <div>
                    <button
                      type="submit"
                      className="h-[44px] px-8 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[14px] rounded-[5px] transition-colors shadow-xs active:scale-[0.99] cursor-pointer inline-flex items-center justify-center"
                    >
                      Log In
                    </button>
                  </div>

                  {/* Lost your password? */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[13px] text-[#71717a] hover:text-[#ff3d3d] hover:underline transition-colors cursor-pointer"
                    >
                      Lost your password?
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
