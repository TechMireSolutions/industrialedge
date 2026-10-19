"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { Heart, Check } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("#b19c83");
  const [addedToast, setAddedToast] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-276px)] flex items-center justify-center">
        <div className="container text-center py-20">
          <h1 className="text-[28px] font-normal text-[#212529] mb-4">Product Not Found</h1>
          <p className="text-sm text-black/50 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/shop">
            <button className="bg-[#0e8ce4] text-white px-8 py-3 rounded-[5px] font-medium hover:bg-[#0e8ce4]/80 transition-colors">
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const liked = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12">
        <div className="container">
          <nav className="mb-8 flex items-center gap-2 text-sm text-black/50">
            <Link href="/" className="hover:text-[#0e8ce4] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#0e8ce4] transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-black font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-[450px] h-[450px] bg-[#f2f4f8] border border-[#e5e5e5] rounded-[5px] flex items-center justify-center p-8 relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={450}
                  height={450}
                  className="max-w-full max-h-full object-contain"
                  priority
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-medium text-[#df3b3b]">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-black/50 line-through ml-2">
                    ${product.originalPrice}
                  </span>
                )}
                {product.status === "discount" && (
                  <span className="text-xs font-medium text-[#df3b3b] bg-[#df3b3b]/10 px-2 py-0.5 rounded">
                    Save 25%
                  </span>
                )}
              </div>

              <h1 className="text-[28px] font-normal text-[#212529] mb-4">{product.name}</h1>
              <p className="text-sm text-black/50 mb-6 leading-relaxed">
                {product.description ||
                  `Experience premium quality with the ${product.name} from ${product.category}. Built for performance and style.`}
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-3">Select Color</label>
                <div className="flex gap-3">
                  {["#b19c83", "#000000", "#999999"].map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === color ? "border-[#0e8ce4] scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-black mb-3">Quantity</label>
                <div className="flex items-center gap-2 w-[120px]">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 border border-[#e5e5e5] rounded flex items-center justify-center text-sm hover:border-[#0e8ce4] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => prev + 1)}
                    className="w-8 h-8 border border-[#e5e5e5] rounded flex items-center justify-center text-sm hover:border-[#0e8ce4] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full h-[50px] bg-[#0e8ce4] text-white text-base font-medium rounded-[5px] hover:bg-[#0e8ce4]/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedToast ? (
                    <>
                      <Check size={18} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-full h-[50px] border border-[#e5e5e5] text-base font-medium rounded-[5px] hover:bg-[#f2f4f8] transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    liked ? "text-[#df3b3b] border-[#df3b3b]/30" : "text-[#212529]"
                  }`}
                >
                  <Heart size={18} fill={liked ? "#df3b3b" : "none"} />
                  <span>{liked ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description / specs tabs */}
          <div className="mt-16 border-t border-[#e5e5e5] pt-8">
            <h2 className="text-lg font-medium text-black mb-4">Product Description</h2>
            <p className="text-black/50 leading-relaxed max-w-[700px]">
              The {product.name} is a premium {product.category.toLowerCase()} designed for modern
              users who demand performance, style, and reliability. Featuring cutting-edge
              technology and a sleek design, this product delivers exceptional value for everyday
              use and professional applications alike.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
