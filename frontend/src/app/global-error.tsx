"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-950/60 border border-orange-700/50 flex items-center justify-center mb-6 text-orange-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            System Level Error
          </h1>

          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            A critical error occurred while initializing the application.
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-all duration-150 cursor-pointer shadow-lg shadow-orange-900/30"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
