"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Check, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api";

export default function AuthModal() {
  const pathname = usePathname();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    setCustomerUser,
  } = useStore();

  const isAdminRoute = Boolean(pathname?.startsWith("/admin"));

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

  // Feedback / loading state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Close on Escape key press (hooks always run before conditional return)
  useEffect(() => {
    if (isAdminRoute) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdminRoute, isAuthModalOpen, closeAuthModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAdminRoute) return;
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAdminRoute, isAuthModalOpen]);

  if (isAdminRoute || !isAuthModalOpen) {
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setErrorMessage("Please enter your email/username and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.customerLogin(loginUsername.trim(), loginPassword);
      setCustomerUser(res.user);
      setFeedbackMessage(`Welcome back, ${res.user.name}!`);
      setLoginPassword("");
      setTimeout(() => {
        setFeedbackMessage(null);
        closeAuthModal();
      }, 1200);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (registerPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage("Passwords do not match. Please check and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.customerRegister({
        name: registerUsername.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });
      setCustomerUser(res.user);
      setFeedbackMessage("Account created successfully! Welcome to IndustrialEdge.pk.");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setTimeout(() => {
        setFeedbackMessage(null);
        closeAuthModal();
      }, 1200);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await api.forgotPassword(forgotEmail.trim());
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setShowForgotPassword(false);
        setForgotEmail("");
      }, 2200);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Dimmed Backdrop Overlay */}
      <div
        onClick={closeAuthModal}
        aria-hidden="true"
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[430px] sm:max-w-[450px] bg-white rounded-[10px] p-7 sm:p-9 shadow-2xl z-10 border border-[#f0f0f0]"
      >
        {/* 1. MODAL HEADER */}
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

        {/* Success Feedback */}
        {feedbackMessage && (
          <div className="mb-5 p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13px] rounded-[6px] flex items-center gap-2">
            <Check size={16} className="text-[#059669] shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-[6px] flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2. FORGOT PASSWORD VIEW */}
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
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#0ea57a] transition-colors"
              />
            </div>

            {forgotSuccess && (
              <p className="text-xs text-[#059669] flex items-center gap-1 font-medium">
                <Check size={13} /> Password reset link has been sent to your email.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[46px] bg-[#0ea57a] hover:bg-[#0b8462] disabled:opacity-60 text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs cursor-pointer mt-3"
            >
              {submitting ? "Sending..." : "Reset Password"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setShowForgotPassword(false);
                }}
                className="text-[13px] text-[#475569] hover:text-[#0ea57a] hover:underline cursor-pointer transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : authModalTab === "login" ? (
          /* 3. LOGIN VIEW */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#0ea57a] transition-colors"
              />
            </div>

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
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#0ea57a] transition-colors"
              />
            </div>

            <div className="text-right pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setShowForgotPassword(true);
                }}
                className="text-[12.5px] text-[#475569] hover:text-[#0ea57a] hover:underline cursor-pointer transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[46px] bg-[#0ea57a] hover:bg-[#0b8462] disabled:opacity-60 text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs cursor-pointer mt-3"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>

            <div className="text-center text-[13px] text-[#4b5563] pt-3">
              Don&apos;t you have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
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
          /* 4. REGISTER VIEW */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
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
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#0ea57a] transition-colors"
              />
            </div>

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
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#0ea57a] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                Password:
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Your password (min 6 chars)"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#0ea57a] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                Confirm Password:
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full h-[44px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#0ea57a] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[46px] bg-[#0ea57a] hover:bg-[#0b8462] disabled:opacity-60 text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs cursor-pointer mt-4"
            >
              {submitting ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="text-center text-[13px] text-[#4b5563] pt-3">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
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
