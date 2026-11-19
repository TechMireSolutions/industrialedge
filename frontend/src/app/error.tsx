"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ShieldAlert, WifiOff } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or telemetry
    console.error("Application error captured:", error);
  }, [error]);

  const isNetworkOrConnection =
    error.message?.toLowerCase().includes("fetch") ||
    error.message?.toLowerCase().includes("network") ||
    error.message?.toLowerCase().includes("connect") ||
    error.message?.toLowerCase().includes("refused");

  return (
    <div
      role="alert"
      className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50 text-slate-800"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center mb-6 text-orange-600 shadow-sm">
          {isNetworkOrConnection ? (
            <WifiOff className="w-8 h-8" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-8 h-8" aria-hidden="true" />
          )}
        </div>

        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700 bg-orange-100/70 rounded-full mb-3">
          {isNetworkOrConnection ? "Connection Notice" : "Application Error"}
        </span>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          {isNetworkOrConnection
            ? "Service Unavailable or Refused"
            : "Something Went Wrong"}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {isNetworkOrConnection
            ? "The frontend could not connect to the backend API service. Please verify server connectivity or retry."
            : error.message ||
              "An unexpected error occurred while rendering this page. You can reload or return to the main storefront."}
        </p>

        {error.digest && (
          <div className="mb-6 px-3 py-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-500 break-all">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-sm transition-all duration-150 border border-slate-300/80 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Next.js Frontend
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Node.js Backend API
          </span>
        </div>
      </div>
    </div>
  );
}
