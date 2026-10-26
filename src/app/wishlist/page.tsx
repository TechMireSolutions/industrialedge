"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, ArrowRight, ShoppingBag, Check } from "lucide-react";
import { useStore, type Product } from "@/lib/store";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
}

// Default items matching user reference screenshot
const DEFAULT_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: "bose-portable-speaker",
    name: "Bose Portable Smart Speaker — Wireless Bluetooth Speaker — White",
    price: 129.0,
    originalPrice: 399.0,
    image: "/images/bose-speaker.png",
    category: "Audio Equipments",
    inStock: true,
  },
];

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  // Local state for items in wishlist
  const [items, setItems] = useState<WishlistItem[]>(DEFAULT_WISHLIST_ITEMS);
  const [addedItemMessage, setAddedItemMessage] = useState<string | null>(null);

  // Sync if wishlist is modified or items removed
  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (wishlist.includes(id)) {
      toggleWishlist(id);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    const product: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      status: "none",
      image: item.image,
      category: item.category,
    };
    addToCart(product, 1, true); // Automatically opens the cart drawer!
    setAddedItemMessage(`"${item.name}" was added to your cart.`);
    setTimeout(() => setAddedItemMessage(null), 3500);
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
          <span className="text-[#18181b] font-medium">Wishlist</span>
        </nav>

        {/* Success Alert on Add to Cart */}
        {addedItemMessage && (
          <div className="mb-6 p-4 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13.5px] rounded-[6px] flex items-center gap-2 animate-in fade-in duration-200">
            <Check size={16} className="text-[#059669] shrink-0" />
            <span>{addedItemMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. WISHLIST TABLE OR EMPTY STATE                          */}
        {/* ========================================================= */}
        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#fafafa] rounded-[10px] border border-[#f0f0f0] my-8 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] mx-auto mb-4 shadow-xs">
              <Heart size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-2">
              Your wishlist is currently empty
            </h2>
            <p className="text-[14px] text-[#6b7280] max-w-[340px] mx-auto mb-6 leading-relaxed">
              Explore our tech collections and save your favorite gadgets here!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-medium text-[14px] rounded-[6px] transition-all shadow-sm active:scale-[0.99]"
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto my-6 mb-24">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[15px] font-bold text-[#18181b]">
                  {/* Space for remove icon & thumbnail */}
                  <th className="pb-4 pt-1 w-[120px]"></th>
                  <th className="pb-4 pt-1 font-semibold pl-4">Product Name</th>
                  <th className="pb-4 pt-1 font-semibold px-4 w-[180px]">Unit Price</th>
                  <th className="pb-4 pt-1 font-semibold px-4 w-[140px]">Stock Status</th>
                  {/* Actions column on right */}
                  <th className="pb-4 pt-1 w-[200px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {items.map((item) => (
                  <tr key={item.id} className="group hover:bg-[#fcfdfd] transition-colors">
                    {/* Remove '×' & Product Image Thumbnail */}
                    <td className="py-6 pr-2 align-middle">
                      <div className="flex items-center gap-4">
                        {/* Remove '×' Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="text-[#9ca3af] hover:text-[#ff3d3d] transition-colors p-1 cursor-pointer shrink-0"
                          title="Remove from wishlist"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X size={17} strokeWidth={2} />
                        </button>

                        {/* Product Thumbnail */}
                        <div className="relative w-[65px] h-[75px] flex items-center justify-center shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="75px"
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-6 pl-4 pr-6 align-middle">
                      <Link
                        href={`/product/${item.id}`}
                        className="text-[14.5px] font-medium text-[#18181b] hover:text-[#ff3d3d] transition-colors leading-[1.4] block max-w-[500px]"
                      >
                        {item.name}
                      </Link>
                    </td>

                    {/* Unit Price (Original price crossed out + Current price) */}
                    <td className="py-6 px-4 align-middle whitespace-nowrap">
                      {item.originalPrice && (
                        <span className="line-through text-[#9ca3af] mr-2.5 text-[14.5px] font-normal">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[14.5px] font-bold text-[#18181b]">
                        ${item.price.toFixed(2)}
                      </span>
                    </td>

                    {/* Stock Status */}
                    <td className="py-6 px-4 align-middle">
                      <span className="text-[14px] text-[#18181b] font-normal">
                        {item.inStock ? "In Stock" : "Out of stock"}
                      </span>
                    </td>

                    {/* Action Buttons: Add to cart & Remove (Stacked) */}
                    <td className="py-6 pl-4 pr-2 align-middle text-right">
                      <div className="flex flex-col items-end gap-2.5">
                        {/* 1. Add to cart */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="w-[170px] h-[40px] bg-[#333e48] hover:bg-[#222a32] text-white font-semibold text-[13.5px] rounded-[5px] flex items-center justify-center transition-colors shadow-xs active:scale-[0.99] cursor-pointer"
                        >
                          Add to cart
                        </button>

                        {/* 2. Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="w-[170px] h-[40px] bg-[#333e48] hover:bg-[#222a32] text-white font-semibold text-[13.5px] rounded-[5px] flex items-center justify-center transition-colors shadow-xs active:scale-[0.99] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
