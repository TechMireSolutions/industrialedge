"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { products } from "@/lib/products";

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-276px)] flex items-center justify-center">
        <div className="container text-center">
          <h1 className="text-[28px] font-normal text-[#212529] mb-2">Product Not Found</h1>
          <Link href="/shop" className="text-[#0e8ce4] hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12">
        <div className="container">
          <nav className="mb-8">
            <Link href="/" className="text-sm text-black/50 hover:text-[#0e8ce4]">Home</Link>
            <span className="text-sm text-black/50 mx-1">/</span>
            <Link
              href="/shop"
              className="text-sm text-black/50 hover:text-[#0e8ce4]"
            >
              Shop
            </Link>
            <span className="text-sm text-black/50 mx-1">/</span>
            <span className="text-sm text-black">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-[450px] h-[450px] bg-[#f2f4f8] border border-[#e5e5e5] rounded-[5px] flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-16 bg-[#f2f4f8] border border-[#e5e5e5] rounded-[5px] flex items-center justify-center text-xs text-black/50"
                  >
                    {i}
                  </div>
                ))}
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
                  <span className="text-xs font-medium text-[#0e8ce4] bg-[#df3b3b]/10 px-2 py-0.5 rounded">Save 25%</span>
                )}
              </div>

              <h1 className="text-[24px] font-normal text-[#212529] mb-4">{product.name}</h1>
              <p className="text-sm text-black/50 mb-6">
                {product.description ||
                  `Experience premium quality with the ${product.name} from ${product.category}. Built for performance and style.`}
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-3">Select Color</label>
                <div className="flex gap-3">
                  {["#b19c83", "#000000", "#999999"].map((color) => (
                    <button
                      key={color}
                      className="w-9 h-9 rounded-full border-2 border-transparent focus:border-[#0e8ce4] transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-black mb-3">Quantity</label>
                <div className="flex items-center gap-2 w-[120px]">
                  <button className="w-8 h-8 border border-[#e5e5e5] flex items-center justify-center text-sm">−</button>
                  <span className="w-8 text-center text-sm font-medium">1</span>
                  <button className="w-8 h-8 border border-[#e5e5e5] flex items-center justify-center text-sm">+</button>
                </div>
              </div>

              <button className="w-full h-[50px] bg-[#0e8ce4] text-white text-base font-medium rounded-[5px] hover:bg-[#0e8ce4]/80 transition-colors mb-6">
                Add to Cart
              </button>

              <button className="w-full h-[50px] border border-[#e5e5e5] text-base font-medium text-[#212529] rounded-[5px] hover:bg-[#f2f4f8] transition-colors">
                Add to Wishlist
              </button>
            </div>
          </div>

          {/* Description / specs tabs */}
          <div className="mt-12 border-t border-[#e5e5e5] pt-8">
            <h2 className="text-lg font-medium text-black mb-4">Product Description</h2>
            <p className="text-black/50 leading-relaxed max-w-[600px]">
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
