"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCategoriesWithCounts,
  getTrendingPosts,
  getAllTagsWithCounts,
  BlogPost,
} from "@/lib/blog-data";
import {
  Search,
  TrendingUp,
  FolderOpen,
  Tag,
  Mail,
  Archive,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface BlogSidebarProps {
  currentCategory?: string;
  currentTag?: string;
  onSearch?: (term: string) => void;
  onSelectCategory?: (category: string) => void;
  onSelectTag?: (tag: string) => void;
  initialSearch?: string;
}

export default function BlogSidebar({
  currentCategory,
  currentTag,
  onSearch,
  onSelectCategory,
  onSelectTag,
  initialSearch = "",
}: BlogSidebarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = getCategoriesWithCounts();
  const trending = getTrendingPosts(4);
  const tags = getAllTagsWithCounts().slice(0, 10);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 3000);
    }
  };

  return (
    <aside className="space-y-8">
      {/* 1. Search Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#0ea57a]" />
          Search Articles
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search keywords, tech, hardware..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea57a]/20 focus:border-[#0ea57a] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#0ea57a] transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 2. Categories with Counts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3.5 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#0ea57a]" />
            Categories
          </span>
          {currentCategory && (
            <button
              onClick={() => onSelectCategory && onSelectCategory("")}
              className="text-xs text-[#0ea57a] hover:underline font-normal normal-case"
            >
              Reset
            </button>
          )}
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(isActive ? "" : cat.name);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  isActive
                    ? "bg-[#0ea57a] text-white font-medium"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[#0ea57a]"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Trending / Top Reads */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#0ea57a]" />
          Trending Articles
        </h4>
        <div className="space-y-4">
          {trending.map((item, index) => (
            <Link
              key={item.id}
              href={`/blog/${item.slug}`}
              className="group flex gap-3 items-start"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 left-1 w-4 h-4 rounded bg-[#0f172a]/90 text-white text-[10px] font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-semibold uppercase text-[#0ea57a] block mb-1">
                  {item.category}
                </span>
                <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0ea57a] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h5>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {item.date} • {item.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. IndustrialEdge Newsletter Box */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-5 rounded-xl border border-slate-700 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-600/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-lg bg-[#0ea57a] flex items-center justify-center text-white mb-3 shadow">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">IndustrialEdge Dispatch</h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Curated weekly hardware breakdowns, SCADA guides, and industrial IoT insights. Zero spam.
          </p>

          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-3 flex items-center gap-2 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>You are subscribed! Welcome aboard.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                required
                placeholder="engineer@company.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea57a] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-semibold bg-[#0ea57a] hover:bg-[#0b8462] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>Subscribe Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 5. Popular Tags */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#0ea57a]" />
            Tags Cloud
          </span>
          {currentTag && (
            <button
              onClick={() => onSelectTag && onSelectTag("")}
              className="text-xs text-[#0ea57a] hover:underline font-normal normal-case"
            >
              Clear
            </button>
          )}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => {
            const isActive = currentTag === t.tag;
            return (
              <button
                key={t.tag}
                onClick={() => {
                  if (onSelectTag) {
                    onSelectTag(isActive ? "" : t.tag);
                  }
                }}
                className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                  isActive
                    ? "bg-[#0ea57a] text-white font-medium"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                #{t.tag}
                <span className="opacity-60 ml-1 text-[10px]">({t.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Quick Link to Archive Page */}
      <div className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
            <Archive className="w-4 h-4 text-[#0ea57a]" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800">Looking for Old Posts?</h5>
            <p className="text-[11px] text-slate-500">Explore our chronological vault</p>
          </div>
        </div>
        <Link
          href="/blog/archive"
          className="text-xs font-semibold text-[#0ea57a] hover:underline flex items-center gap-1 flex-shrink-0"
        >
          <span>Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 7. Hardware Promo Banner */}
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
          <Cpu className="w-4 h-4" />
          <span>Industrial Hardware Store</span>
        </div>
        <h5 className="text-sm font-bold text-slate-900 mb-1.5">
          Need Edge Gateways & Sensors?
        </h5>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          Explore genuine STM32 dev kits, DIN-rail gateways, and high-temp telemetry sensors in Pakistan.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-[#0ea57a] px-3.5 py-2 rounded-lg transition-colors w-full justify-center"
        >
          <span>Shop Hardware Components</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
