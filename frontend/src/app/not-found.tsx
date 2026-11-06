import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center mb-6 text-orange-600 shadow-sm">
          <Search className="w-8 h-8" aria-hidden="true" />
        </div>

        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700 bg-orange-100/70 rounded-full mb-3">
          Error 404
        </span>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          The page or product you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-sm transition-all duration-150 border border-slate-300/80 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
          Looking for custom enterprise gear?{" "}
          <Link href="/contact" className="text-orange-600 font-medium hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
