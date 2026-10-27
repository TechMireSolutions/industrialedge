"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
  } = useStore();

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // Forgot password sub-state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Success / feedback state
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() && loginPassword.trim()) {
      setFeedbackMessage(`Welcome back, ${loginUsername}!`);
      setTimeout(() => {
        setFeedbackMessage(null);
        closeAuthModal();
      }, 1500);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setFeedbackMessage("Account created successfully!");
    setTimeout(() => {
      setFeedbackMessage(null);
      closeAuthModal();
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotPassword(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Dimmed Backdrop Overlay */}
      <div
        onClick={closeAuthModal}
        aria-hidden="true"
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[430px] sm:max-w-[450px] bg-white rounded-[10px] p-7 sm:p-9 shadow-2xl z-10 animate-in zoom-in-95 duration-200 border border-[#f0f0f0]"
      >
        {/* ======================================================== */}
        {/* 1. MODAL HEADER (TITLE & CLOSE BUTTON)                   */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-[#18181b] tracking-tight">
            {showForgotPassword
              ? "Forgot Password:"
              : authModalTab === "login"
              ? "Login:"
              : "Register:"}
          </h2>
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1 text-[#18181b] hover:text-[#0ea57a] hover:bg-[#f4f4f5] rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="mb-5 p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13px] rounded-[6px] flex items-center gap-2">
            <Check size={16} className="text-[#059669] shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. FORGOT PASSWORD VIEW                                  */}
        {/* ======================================================== */}
        {showForgotPassword ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                Email Address:
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors"
              />
            </div>

            {forgotSuccess && (
              <p className="text-xs text-[#059669] flex items-center gap-1 font-medium">
                <Check size={13} /> Password reset link has been sent to your email.
              </p>
            )}

            <button
              type="submit"
              className="w-full h-[46px] bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs cursor-pointer active:scale-[0.99] mt-3"
            >
              Reset Password
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-[13px] text-[#71717a] hover:text-[#0ea57a] hover:underline cursor-pointer transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : authModalTab === "login" ? (
          /* ======================================================== */
          /* 3. LOGIN VIEW (IMAGE 2 EXACT MATCH)                      */
          /* ======================================================== */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* User Name Field */}
            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                User Name:
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Email or user name"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                Password:
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Your password"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors"
              />
            </div>

            {/* Forgot password link */}
            <div className="text-right pt-0.5">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[12.5px] text-[#71717a] hover:text-[#0ea57a] hover:underline cursor-pointer transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Red Login Button */}
            <button
              type="submit"
              className="w-full h-[46px] bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs cursor-pointer active:scale-[0.99] mt-3"
            >
              Login
            </button>

            {/* Register Footer Switch */}
            <div className="text-center text-[13px] text-[#4b5563] pt-3">
              Don&apos;t you have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setAuthModalTab("register");
                }}
                className="text-[#0ea57a] hover:underline font-semibold cursor-pointer transition-colors ml-1"
              >
                Register.
              </button>
            </div>
          </form>
        ) : (
          /* ======================================================== */
          /* 4. REGISTER VIEW (IMAGE 3 EXACT MATCH)                   */
          /* ======================================================== */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* User Name Field */}
            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                User Name:
              </label>
              <input
                type="text"
                required
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="User name"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                Email:
              </label>
              <input
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                Password:
              </label>
              <input
                type="password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Your passsword"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                Confirm Password:
              </label>
              <input
                type="password"
                required
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#18181b] transition-colors"
              />
            </div>

            {/* Red Sign Up Button */}
            <button
              type="submit"
              className="w-full h-[46px] bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs cursor-pointer active:scale-[0.99] mt-4"
            >
              Sign Up
            </button>

            {/* Sign In Footer Switch */}
            <div className="text-center text-[13px] text-[#4b5563] pt-3">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setAuthModalTab("login");
                }}
                className="text-[#0ea57a] hover:underline font-semibold cursor-pointer transition-colors ml-1"
              >
                Sign In.
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
