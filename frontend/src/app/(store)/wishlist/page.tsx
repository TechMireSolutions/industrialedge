"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, ArrowRight, Check, ShoppingCart } from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import { api, type ProductItem } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [catalog, setCatalog] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItemMessage, setAddedItemMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .getProducts()
      .then((prods) => {
        if (mounted && Array.isArray(prods)) setCatalog(prods);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const wishlistItems = useMemo(() => {
    return wishlist
      .map((id) => catalog.find((p) => p.id === id || p.slug === id))
      .filter((p): p is ProductItem => Boolean(p));
  }, [wishlist, catalog]);

  const handleRemove = (id: string) => {
    toggleWishlist(id);
  };

  const handleAddToCart = (item: ProductItem) => {
    const product: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      status: item.status || "none",
      image: item.image,
      category: item.category,
      description: item.description,
    };
    addToCart(product, 1, true);
    setAddedItemMessage(`"${item.name}" was added to your cart.`);
    setTimeout(() => setAddedItemMessage(null), 3500);
  };

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => (item.stock ?? 1) > 0);
    inStockItems.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          status: item.status || "none",
          image: item.image,
          category: item.category,
          description: item.description,
        },
        1,
        false
      );
    });
    if (inStockItems.length > 0) {
      setAddedItemMessage(`Added ${inStockItems.length} item(s) to your cart!`);
      setTimeout(() => setAddedItemMessage(null), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 sm:py-7">
        {/* 1. BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#64748b] mb-6">
          <Link href="/" className="hover:text-[#0ea57a] transition-colors">
            Home
          </Link>
          <span className="text-[#94a3b8] font-normal">&gt;</span>
          <span className="text-[#171145] font-medium">Wishlist</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#171145] tracking-tight">My Wishlist</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {wishlistItems.length} saved product{wishlistItems.length === 1 ? "" : "s"}
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ShoppingCart size={15} />
              <span>Add All to Cart</span>
            </button>
          )}
        </div>

        {/* Success Alert */}
        {addedItemMessage && (
          <div className="mb-6 p-4 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13.5px] rounded-[6px] flex items-center gap-2">
            <Check size={16} className="text-[#059669] shrink-0" />
            <span>{addedItemMessage}</span>
          </div>
        )}

        {/* 2. WISHLIST TABLE OR EMPTY STATE */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading your saved products...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-[#fafafa] rounded-[10px] border border-[#f0f0f0] my-6">
            <div className="w-20 h-20 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] mx-auto mb-4 shadow-xs">
              <Heart size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-[#171145] mb-2">
              Your wishlist is currently empty
            </h2>
            <p className="text-[14px] text-[#64748b] max-w-[360px] mx-auto mb-6 leading-relaxed">
              Click the heart icon on any product in the store to save your favorite industrial and consumer tech here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-medium text-[14px] rounded-[6px] transition-all shadow-sm"
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto my-6 mb-24">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[14px] font-bold text-[#171145]">
                  <th className="pb-4 pt-1 w-[120px]"></th>
                  <th className="pb-4 pt-1 font-semibold pl-4">Product Name</th>
                  <th className="pb-4 pt-1 font-semibold px-4 w-[200px]">Unit Price</th>
                  <th className="pb-4 pt-1 font-semibold px-4 w-[140px]">Stock Status</th>
                  <th className="pb-4 pt-1 w-[200px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {wishlistItems.map((item) => {
                  const inStock = (item.stock ?? 1) > 0;
                  return (
                    <tr key={item.id} className="group hover:bg-[#fcfdfd] transition-colors">
                      <td className="py-6 pr-2 align-middle">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="text-[#9ca3af] hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                            title="Remove from wishlist"
                            aria-label={`Remove ${item.name}`}
                          >
                            <X size={17} strokeWidth={2} />
                          </button>

                          <div className="relative w-[65px] h-[75px] flex items-center justify-center shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="75px"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-6 pl-4 pr-6 align-middle">
                        <span className="text-[11px] text-slate-400 uppercase block mb-0.5">
                          {item.category}
                        </span>
                        <Link
                          href={`/product/${item.id}`}
                          className="text-[14.5px] font-semibold text-[#171145] hover:text-[#0ea57a] transition-colors leading-[1.4] block max-w-[500px]"
                        >
                          {item.name}
                        </Link>
                      </td>

                      <td className="py-6 px-4 align-middle whitespace-nowrap">
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="line-through text-[#9ca3af] mr-2.5 text-[13px] font-normal block">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                        <span className="text-[15px] font-bold text-[#0ea57a]">
                          {formatPrice(item.price)}
                        </span>
                      </td>

                      <td className="py-6 px-4 align-middle">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            inStock
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {inStock ? "In Stock" : "Out of stock"}
                        </span>
                      </td>

                      <td className="py-6 pl-4 pr-2 align-middle text-right">
                        <div className="flex flex-col items-end gap-2">
                          <button
                            type="button"
                            disabled={!inStock}
                            onClick={() => handleAddToCart(item)}
                            className="w-[165px] h-[38px] bg-[#0ea57a] hover:bg-[#0b8462] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-[13px] rounded-[5px] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                          >
                            Add to cart
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="w-[165px] h-[36px] bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold text-[13px] rounded-[5px] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            Remove
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
    </div>
  );
}
