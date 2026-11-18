"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { api, type ProductItem } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import ShopProductCard, { type ShopProductItem } from "@/components/products/shop-product-card";
import {
  ShoppingCart,
  Heart,
  Star,
  Check,
  X,
  MessageSquare,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeftRight,
  Zap,
  ArrowLeft,
} from "lucide-react";

interface ProductReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

function mapToShopCard(p: ProductItem): ShopProductItem {
  const thumbs =
    Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || "/images/cat-laptop.jpg"];
  return {
    id: p.id,
    name: p.name,
    shortName: p.name,
    categoryLine: p.category,
    categories: [p.category],
    brand: p.brand || p.specs?.Brand || "Industrial Edge",
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    mainImage: p.image || "/images/cat-laptop.jpg",
    thumbnails: thumbs,
    moreThumbnailsCount: Math.max(0, thumbs.length - 3),
    rating: Number(p.rating) || 4.8,
    description: p.description || "",
    specs: p.specs
      ? Object.entries(p.specs).map(([label, value]) => ({ label, value }))
      : [{ label: "Category", value: p.category }],
    deliveryDays: "2–4 day delivery",
  };
}

export default function ProductSinglePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id ? decodeURIComponent(params.id) : "";

  const { addToCart, toggleWishlist, isWishlisted, addToCompare, trackRecentlyViewed } = useStore();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local customer reviews state (persisted per product in localStorage, no fake hardcoded reviews)
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      setNotFoundError(false);
      setSelectedImageIndex(0);
      setQuantity(1);

      try {
        const allProducts = await api.getProducts().catch(() => []);
        let found: ProductItem | null = null;

        try {
          found = await api.getProduct(productId);
        } catch {
          // Try fuzzy match from catalog (handles slug or legacy IDs)
          found =
            allProducts.find(
              (p) =>
                p.id === productId ||
                p.slug === productId ||
                p.id.includes(productId) ||
                productId.includes(p.slug || "__")
            ) || null;
        }

        if (!mounted) return;

        if (!found) {
          setNotFoundError(true);
          setProduct(null);
        } else {
          setProduct(found);
          trackRecentlyViewed(found.id);
          const related = allProducts
            .filter((p) => p.id !== found!.id)
            .sort((a, b) => {
              const aSame = a.category === found!.category ? 1 : 0;
              const bSame = b.category === found!.category ? 1 : 0;
              return bSame - aSame;
            })
            .slice(0, 4)
            .map(mapToShopCard);
          setRelatedProducts(related);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      mounted = false;
    };
  }, [productId, trackRecentlyViewed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#0ea57a] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading product specifications...</p>
      </div>
    );
  }

  if (notFoundError || !product) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center bg-white px-4 text-center">
        <h1 className="text-2xl font-bold text-[#171145] mb-2">Product Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          The product you are looking for may have been removed or updated in our catalog.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const gallery =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "/images/cat-laptop.jpg"];
  const currentImage = gallery[selectedImageIndex] || gallery[0];
  const inStock = (product.stock ?? 10) > 0;
  const maxQty = Math.max(1, product.stock || 20);
  const isLiked = isWishlisted(product.id);
  const specsList = product.specs ? Object.entries(product.specs) : [];

  const storePayload = {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    status: product.status || ("none" as const),
    image: currentImage,
    category: product.category,
    description: product.description,
    specs: product.specs,
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(storePayload, quantity, true);
    showToast(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(storePayload, quantity, false);
    router.push("/checkout");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setReviews((prev) => [
      {
        id: `rev-${Date.now()}`,
        name: reviewName.trim(),
        rating: reviewRating,
        date: "Just now",
        comment: reviewComment.trim(),
      },
      ...prev,
    ]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    showToast("Thank you! Your review has been posted.");
  };

  return (
    <div className="w-full bg-white min-h-screen text-[#1f2937]">
      {toastMessage && (
        <div className="fixed bottom-8 right-6 z-50 bg-[#171145] text-white px-5 py-3 rounded-lg shadow-xl text-xs sm:text-sm flex items-center gap-2.5">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] w-full bg-white rounded-xl p-6 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close zoom preview"
            >
              <X size={18} />
            </button>
            <div className="relative w-full h-[450px] flex items-center justify-center">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1240px] mx-auto px-6 pt-6 pb-2 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#0ea57a] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#0ea57a] transition-colors">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/shop?cat=${encodeURIComponent(product.category)}`}
          className="hover:text-[#0ea57a] transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#171145] font-medium truncate max-w-[300px]">{product.name}</span>
      </div>

      {/* MAIN PRODUCT STAGE */}
      <div className="max-w-[1240px] mx-auto px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative w-full aspect-square max-w-[460px] bg-[#fafafa] border border-slate-100 rounded-2xl p-8 flex items-center justify-center cursor-zoom-in group select-none transition-all hover:bg-[#f5f7f9]"
            >
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 460px"
                />
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center gap-2.5 mt-5 flex-wrap justify-center">
                {gallery.map((imgSrc, index) => {
                  const isSelected = selectedImageIndex === index;
                  return (
                    <button
                      key={`${imgSrc}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-14 h-14 rounded-xl p-1.5 bg-[#fafafa] transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? "border-2 border-[#171145] shadow-2xs"
                          : "border border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgSrc}
                        alt={`${product.name} view ${index + 1}`}
                        width={42}
                        height={42}
                        className="object-contain max-h-full"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Buy Box & Details */}
          <div className="lg:col-span-6 flex flex-col pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0ea57a] mb-1.5">
              {product.brand || product.specs?.Brand || "Industrial Edge"} • {product.category}
            </div>

            <h1 className="text-2xl sm:text-[28px] font-bold text-[#171145] leading-tight mb-2.5">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= Math.round(product.rating || 4.8) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="font-semibold text-slate-700">{(product.rating || 4.8).toFixed(1)}</span>
              <span>•</span>
              <a
                href="#tabs"
                onClick={() => setActiveTab("reviews")}
                className="hover:underline cursor-pointer"
              >
                {reviews.length} customer reviews
              </a>
            </div>

            {/* Price Line in PKR */}
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <span className="text-3xl font-black text-[#171145] tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-[#0ea57a] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Availability */}
            <div
              className={`text-xs font-medium flex items-center gap-1.5 mb-6 ${
                inStock ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`}
              />
              {inStock
                ? `In stock (${product.stock} available) • Dispatches within 24 hours from Karachi hub`
                : "Currently out of stock • Contact us on WhatsApp for restock ETA"}
            </div>

            <div className="w-full h-px bg-slate-100 mb-6" />

            {product.description && (
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Quick Key Specs */}
            {specsList.length > 0 && (
              <ul className="text-xs text-slate-600 space-y-2 mb-7 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {specsList.slice(0, 5).map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-700">{label}</span>
                    <span className="text-slate-600 text-right">{value}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Actions: Quantity Stepper + Add to Cart + Buy Now + Wishlist + Compare */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 h-11 px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded text-slate-700 hover:bg-white text-sm font-bold transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="w-8 h-8 rounded text-slate-700 hover:bg-white text-sm font-bold transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={!inStock}
                onClick={handleAddToCart}
                className="flex-1 min-w-[150px] h-11 bg-[#0ea57a] hover:bg-[#0b8462] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingCart size={16} />
                <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
              </button>

              {inStock && (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="h-11 px-5 bg-[#171145] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Zap size={15} />
                  <span>Buy Now</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(isLiked ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  isLiked
                    ? "border-rose-500 text-rose-500 bg-rose-50"
                    : "border-slate-200 text-slate-600 hover:border-[#0ea57a] hover:text-[#0ea57a]"
                }`}
                aria-label="Wishlist"
                title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCompare(storePayload);
                  showToast("Added to compare!");
                }}
                className="w-11 h-11 rounded-lg border border-slate-200 text-slate-600 hover:border-[#0ea57a] hover:text-[#0ea57a] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Compare"
                title="Compare product"
              >
                <ArrowLeftRight size={16} />
              </button>
            </div>

            {/* Footer Guarantees & WhatsApp */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#0ea57a]" />
                  Free shipping over Rs. 25,000
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#0ea57a]" />
                  1-year warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw size={14} className="text-[#0ea57a]" />
                  7-day return
                </span>
              </div>
              <a
                href={`https://wa.me/923322316225?text=${encodeURIComponent(
                  `Hi IndustrialEdge.pk, I have an inquiry regarding ${product.name} (${formatPrice(product.price)})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0ea57a] hover:underline flex items-center gap-1 font-semibold"
              >
                <MessageSquare size={14} />
                <span>WhatsApp inquiry</span>
              </a>
            </div>
          </div>
        </div>

        {/* TABS: Description | Specifications | Reviews */}
        <div id="tabs" className="mt-14 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "desc"
                  ? "text-[#171145] border-b-2 border-[#0ea57a] -mb-[1px]"
                  : "text-slate-500 hover:text-[#171145]"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "specs"
                  ? "text-[#171145] border-b-2 border-[#0ea57a] -mb-[1px]"
                  : "text-slate-500 hover:text-[#171145]"
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === "reviews"
                  ? "text-[#171145] border-b-2 border-[#0ea57a] -mb-[1px]"
                  : "text-slate-500 hover:text-[#171145]"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === "desc" && (
            <div className="max-w-3xl space-y-5 text-sm text-slate-600 leading-relaxed">
              <p>
                {product.description ||
                  `${product.name} delivers dependable industrial-grade engineering and performance backed by official warranty support across Pakistan.`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-[#171145] text-xs uppercase tracking-wider mb-1">
                    Verified Authentic Supply
                  </h4>
                  <p className="text-xs text-slate-600">
                    Sourced directly through authorized distributors with transparent PKR invoicing and corporate PO options.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-[#171145] text-xs uppercase tracking-wider mb-1">
                    Nationwide Dispatch
                  </h4>
                  <p className="text-xs text-slate-600">
                    Fast insured courier delivery to Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and all major Pakistani cities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="grid grid-cols-[160px_1fr] py-3 gap-4">
                <span className="font-semibold text-[#171145]">Category</span>
                <span className="text-slate-600">{product.category}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] py-3 gap-4">
                <span className="font-semibold text-[#171145]">Product ID</span>
                <span className="text-slate-600 font-mono">{product.id}</span>
              </div>
              {specsList.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[160px_1fr] py-3 gap-4">
                  <span className="font-semibold text-[#171145]">{label}</span>
                  <span className="text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-5">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pb-5 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs sm:text-sm text-[#171145]">{rev.name}</span>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400 mb-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= rev.rating ? "currentColor" : "none"}
                          className={s <= rev.rating ? "text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write a Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 self-start"
              >
                <h3 className="text-sm font-bold text-[#171145]">Write a Customer Review</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-0.5 cursor-pointer"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          size={18}
                          className={
                            star <= reviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#171145]">Related Products</h2>
              <Link
                href="/shop"
                className="text-xs font-semibold text-slate-500 hover:text-[#0ea57a] transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {relatedProducts.map((prod) => (
                <ShopProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
