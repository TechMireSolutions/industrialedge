"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.adminLogin(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail("admin@industrialedge.pk");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 sm:p-6 font-sans antialiased select-none">
      <div className="max-w-md w-full bg-[#0f172a] rounded-3xl border border-slate-800 p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f97316] to-[#ea580c] text-white font-extrabold text-xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
            IE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Sign in to access Industrial Edge full customs admin control panel.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@industrialedge.pk"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            <span>{loading ? "Verifying..." : "Sign In to Admin Panel"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Quick Button */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleAutofill}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-semibold border border-slate-700/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Autofill Demo Credentials</span>
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-2">
            Default: <span className="text-slate-400">admin@industrialedge.pk</span> &bull; Password:{" "}
            <span className="text-slate-400">admin123</span>
          </p>
        </div>

        {/* Return to storefront */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-orange-400 transition-colors"
          >
            &larr; Back to Public Store
          </Link>
        </div>
      </div>
    </div>
  );
}
