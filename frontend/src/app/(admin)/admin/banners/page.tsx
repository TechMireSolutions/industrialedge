"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  Eye,
  Laptop,
  Tv,
  Camera,
  Upload,
  Loader2,
} from "lucide-react";
import { api, type BannerSettings } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "gameconsole" | "dual">("hero");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await api.getBanners();
      setBanners(data);
    } catch (err) {
      console.error(err);
      showToast("Error loading banner configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!banners) return;

    try {
      setSaving(true);
      await api.updateBanners(banners);
      showToast("All promotional banners updated live on storefront!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save banners.");
    } finally {
      setSaving(false);
    }
  };

  const handleBannerImageUpload = async (
    fieldKey: string,
    file: File | undefined,
    onSuccess: (url: string) => void
  ) => {
    if (!file) return;
    try {
      setUploadingField(fieldKey);
      const url = await api.uploadImage(file);
      onSuccess(url);
      showToast("Banner image uploaded! Click Save All Banners to publish.");
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  if (loading || !banners) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading banner customizer...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 border border-slate-700 transition-all duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Start-to-End Banners Customizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Change every visual banner, hero showcase, PKR pricing tag, and headline across the store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Live Site</span>
          </Link>

          <button
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-60 rounded-lg shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save All Banners"}</span>
          </button>
        </div>
      </div>

      {/* Customizer Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "hero"
              ? "bg-[#0f172a] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Laptop className="w-4 h-4 text-orange-400" />
          <span>1. Hero Section (Dell G5 Showcase)</span>
        </button>

        <button
          onClick={() => setActiveTab("gameconsole")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "gameconsole"
              ? "bg-[#0f172a] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Tv className="w-4 h-4 text-emerald-400" />
          <span>2. GameConsole Destiny Banner</span>
        </button>

        <button
          onClick={() => setActiveTab("dual")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "dual"
              ? "bg-[#0f172a] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4 text-blue-400" />
          <span>3. Dual Camera Save Big Banner</span>
        </button>
      </div>

      {/* Tab 1: Hero Showcase Editor */}
      {activeTab === "hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-orange-500" />
              <span>Hero Laptop Showcase Customizer</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Line 1
                </label>
                <input
                  type="text"
                  value={banners.hero.titleLine1}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, titleLine1: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headline Line 2
                </label>
                <input
                  type="text"
                  value={banners.hero.titleLine2}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, titleLine2: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={banners.hero.subtitle}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    hero: { ...banners.hero, subtitle: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Promotional Price (Rs. PKR)
                </label>
                <input
                  type="number"
                  step="1"
                  value={banners.hero.price}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, price: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shop Now Link
                </label>
                <input
                  type="text"
                  value={banners.hero.ctaLink}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, ctaLink: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Featured Product Image URL (Transparent PNG)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={banners.hero.image}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, image: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0">
                  {uploadingField === "hero.image" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      handleBannerImageUpload("hero.image", f, (url) =>
                        setBanners((prev) =>
                          prev ? { ...prev, hero: { ...prev.hero, image: url } } : prev
                        )
                      );
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Background Texture Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={banners.hero.backgroundImage}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      hero: { ...banners.hero, backgroundImage: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0">
                  {uploadingField === "hero.bg" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      handleBannerImageUpload("hero.bg", f, (url) =>
                        setBanners((prev) =>
                          prev ? { ...prev, hero: { ...prev.hero, backgroundImage: url } } : prev
                        )
                      );
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Real-Time Visual Preview Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Live Preview
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                  Storefront Section 1
                </span>
              </div>

              <div className="bg-[#f4f6f8] text-slate-900 p-6 rounded-xl border border-slate-300 shadow-inner flex flex-col items-center text-center">
                <div className="relative w-48 h-32 mb-3">
                  <Image
                    src={banners.hero.image || "/images/dell-g5-hero.png"}
                    alt="Hero Preview"
                    width={200}
                    height={140}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-2xl font-extrabold text-[#0ea57a] mb-1">
                  {formatPrice(banners.hero.price)}
                </div>
                <div className="text-xs text-slate-500 mb-2">{banners.hero.subtitle}</div>
                <div className="text-lg font-bold text-[#171145] uppercase leading-tight">
                  {banners.hero.titleLine1} <br /> {banners.hero.titleLine2}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              When you click <strong className="text-white">Save All Banners</strong>, this exact layout and PKR price updates immediately across all user screens.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: GameConsole Destiny Banner */}
      {activeTab === "gameconsole" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-500" />
              <span>GameConsole Destiny Full-Width Banner</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Title</label>
              <input
                type="text"
                value={banners.gameConsoleBanner.title}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    gameConsoleBanner: {
                      ...banners.gameConsoleBanner,
                      title: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Strike Old Price (e.g. Rs. 99,000)
                </label>
                <input
                  type="text"
                  value={banners.gameConsoleBanner.originalPrice}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      gameConsoleBanner: {
                        ...banners.gameConsoleBanner,
                        originalPrice: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highlight Price (e.g. Rs. 79,900)
                </label>
                <input
                  type="text"
                  value={banners.gameConsoleBanner.currentPrice}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      gameConsoleBanner: {
                        ...banners.gameConsoleBanner,
                        currentPrice: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sale Badge Text
                </label>
                <input
                  type="text"
                  value={banners.gameConsoleBanner.saleBadge}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      gameConsoleBanner: {
                        ...banners.gameConsoleBanner,
                        saleBadge: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={banners.gameConsoleBanner.ctaText}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      gameConsoleBanner: {
                        ...banners.gameConsoleBanner,
                        ctaText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={banners.gameConsoleBanner.ctaLink}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      gameConsoleBanner: {
                        ...banners.gameConsoleBanner,
                        ctaLink: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                TV Screen Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={banners.gameConsoleBanner.image}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      gameConsoleBanner: {
                        ...banners.gameConsoleBanner,
                        image: e.target.value,
                      },
                    })
                  }
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0">
                  {uploadingField === "gc.image" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      handleBannerImageUpload("gc.image", f, (url) =>
                        setBanners((prev) =>
                          prev
                            ? { ...prev, gameConsoleBanner: { ...prev.gameConsoleBanner, image: url } }
                            : prev
                        )
                      );
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-5 bg-black text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                  Live Banner Preview
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                  Storefront Section 4
                </span>
              </div>

              <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4">
                <div className="relative w-28 h-28">
                  <Image
                    src={banners.gameConsoleBanner.image || "/images/img-prd8.webp"}
                    alt="Game Console"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#0ea57a] text-white">
                    {banners.gameConsoleBanner.saleBadge}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-sm text-white line-clamp-1">
                    {banners.gameConsoleBanner.title}
                  </h3>
                  <div className="text-xs text-zinc-400 line-through">
                    {banners.gameConsoleBanner.originalPrice}
                  </div>
                  <div className="text-xl font-black text-[#ffdc00]">
                    {banners.gameConsoleBanner.currentPrice}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
              Matches Section 4 on the homepage with high contrast framing.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dual Camera Promo Banner */}
      {activeTab === "dual" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-500" />
              <span>Dual Camera Big Save Banner</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Badge Text (e.g. SAVE Rs. 22,400)
                </label>
                <input
                  type="text"
                  value={banners.dualPromoBanner.badgeText}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      dualPromoBanner: {
                        ...banners.dualPromoBanner,
                        badgeText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={banners.dualPromoBanner.title}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      dualPromoBanner: {
                        ...banners.dualPromoBanner,
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtitle Description
              </label>
              <input
                type="text"
                value={banners.dualPromoBanner.subtitle}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    dualPromoBanner: {
                      ...banners.dualPromoBanner,
                      subtitle: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Camera Body Image URL
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={banners.dualPromoBanner.image1}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        dualPromoBanner: {
                          ...banners.dualPromoBanner,
                          image1: e.target.value,
                        },
                      })
                    }
                    className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <label className="inline-flex items-center px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0">
                    {uploadingField === "dual.img1" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        handleBannerImageUpload("dual.img1", f, (url) =>
                          setBanners((prev) =>
                            prev
                              ? { ...prev, dualPromoBanner: { ...prev.dualPromoBanner, image1: url } }
                              : prev
                          )
                        );
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Camera Lens Image URL
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={banners.dualPromoBanner.image2}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        dualPromoBanner: {
                          ...banners.dualPromoBanner,
                          image2: e.target.value,
                        },
                      })
                    }
                    className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <label className="inline-flex items-center px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0">
                    {uploadingField === "dual.img2" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        handleBannerImageUpload("dual.img2", f, (url) =>
                          setBanners((prev) =>
                            prev
                              ? { ...prev, dualPromoBanner: { ...prev.dualPromoBanner, image2: url } }
                              : prev
                          )
                        );
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-5 bg-gradient-to-r from-[#eef3f8] to-[#d6e3f0] p-6 rounded-2xl border border-slate-300 shadow-md flex flex-col justify-between text-slate-900">
            <div>
              <span className="inline-block bg-[#0ea57a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase">
                {banners.dualPromoBanner.badgeText}
              </span>
              <h3 className="text-xl font-extrabold text-[#171145] leading-tight mb-1">
                {banners.dualPromoBanner.title}
              </h3>
              <p className="text-xs text-slate-600 mb-4">{banners.dualPromoBanner.subtitle}</p>

              <div className="flex items-center gap-3">
                <div className="w-24 h-20 relative">
                  <Image
                    src={banners.dualPromoBanner.image1 || "/images/img-prd16.webp"}
                    alt="Camera Body"
                    width={96}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-20 h-16 relative">
                  <Image
                    src={banners.dualPromoBanner.image2 || "/images/img-prd15.webp"}
                    alt="Camera Lens"
                    width={80}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-300/60 text-xs text-slate-500">
              Live banner in Section 7 on the storefront.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
