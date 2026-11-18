"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowLeftRight, ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/currency";

export default function CompareModal() {
  const pathname = usePathname();
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    openCompareModal,
    closeCompareModal,
    addToCart,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCompareModalOpen) {
        closeCompareModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompareModalOpen, closeCompareModal]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Compare Pill when items exist and modal is closed */}
      {compareList.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-5 left-5 z-[9990] flex items-center gap-2 bg-[#171145] text-white pl-4 pr-2 py-2 rounded-full shadow-xl border border-slate-700/60">
          <button
            type="button"
            onClick={openCompareModal}
            className="flex items-center gap-2 text-xs font-semibold hover:text-[#0ea57a] transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#0ea57a]" />
            <span>Compare ({compareList.length})</span>
          </button>
          <button
            type="button"
            onClick={clearCompare}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Clear compare list"
            title="Clear compare list"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Side-by-side Compare Modal */}
      {isCompareModalOpen && (
        <div
          className="fixed inset-0 z-[99998] bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={closeCompareModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product Comparison"
            className="relative w-full max-w-5xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#0ea57a] flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#171145]">
                    Compare Products ({compareList.length}/4)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Side-by-side pricing &amp; specification comparison in PKR
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {compareList.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCompare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeCompareModal}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-full transition-colors cursor-pointer"
                  aria-label="Close comparison"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-6">
              {compareList.length === 0 ? (
                <div className="py-16 text-center">
                  <ArrowLeftRight className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">No products to compare yet</h3>
                  <p className="text-xs text-slate-500 mb-5">
                    Click the compare icon on any product card to compare specs and prices side by side.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCompareModal}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#0ea57a] hover:bg-[#0b8462] text-white text-xs font-semibold transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {compareList.map((item) => (
                    <div
                      key={item.id}
                      className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-white relative hover:border-[#0ea57a]/50 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label={`Remove ${item.name} from compare`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        <div className="relative w-full h-36 bg-slate-50 rounded-lg p-3 mb-3 flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="200px"
                            className="object-contain p-2"
                          />
                        </div>

                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          {item.category}
                        </span>

                        <Link
                          href={`/product/${item.id}`}
                          onClick={closeCompareModal}
                          className="text-sm font-bold text-[#171145] hover:text-[#0ea57a] line-clamp-2 leading-snug mb-2 block transition-colors"
                        >
                          {item.name}
                        </Link>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-extrabold text-[#0ea57a]">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                            {item.description}
                          </p>
                        )}

                        {item.specs && Object.keys(item.specs).length > 0 && (
                          <div className="border-t border-slate-100 pt-2.5 space-y-1.5 text-[11px] mb-4">
                            {Object.entries(item.specs)
                              .slice(0, 4)
                              .map(([k, v]) => (
                                <div key={k} className="flex justify-between gap-2">
                                  <span className="text-slate-500 font-medium">{k}:</span>
                                  <span className="text-slate-800 font-semibold text-right truncate">{v}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(item, 1, true);
                            closeCompareModal();
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-[#0ea57a] hover:bg-[#0b8462] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <Link
                          href={`/product/${item.id}`}
                          onClick={closeCompareModal}
                          className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:border-[#171145] text-slate-700 hover:text-[#171145] text-xs font-semibold text-center transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

