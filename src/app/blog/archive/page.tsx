"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getArchiveStats,
  getCategoriesWithCounts,
  getAllTagsWithCounts,
  BlogPost,
} from "@/lib/blog-data";
import {
  Archive,
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Search,
  Filter,
  Users,
  Eye,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function BlogArchivePage() {
  const allPosts = getAllPosts();
  const stats = getArchiveStats();
  const categories = getCategoriesWithCounts();
  const allTags = getAllTagsWithCounts();

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Distinct months in dataset
  const availableMonths = useMemo(() => {
    const months = Array.from(new Set(allPosts.map((p) => p.month)));
    return months;
  }, [allPosts]);

  // Filter posts based on user selection
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchMonth = selectedMonth === "all" || post.month === selectedMonth;
      const matchCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchSearch = searchTerm
        ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return matchMonth && matchCategory && matchSearch;
    });
  }, [allPosts, selectedMonth, selectedCategory, searchTerm]);

  // Group filtered posts by Month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, BlogPost[]> = {};
    filteredPosts.forEach((post) => {
      if (!groups[post.month]) {
        groups[post.month] = [];
      }
      groups[post.month].push(post);
    });
    return groups;
  }, [filteredPosts]);

  const monthKeys = Object.keys(groupedByMonth);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 sm:py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#ff3d3d] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/blog" className="hover:text-[#ff3d3d] transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">Archive & Timeline</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-700/80 mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff3d3d] text-white mb-3 shadow-xs">
              <Archive className="w-3.5 h-3.5" />
              Chronological Repository
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Articles Archive & Timeline
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore our complete historical index of technical whitepapers, reverse engineering reviews, and industrial automation teardowns categorized by publication date.
            </p>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-700/80">
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <BookOpen className="w-4 h-4 text-[#ff3d3d]" />
                <span>Total Published</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stats.totalArticles} Articles
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Disciplines</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stats.categories} Domains
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Contributing Team</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stats.authors} Engineers
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Total Readership</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stats.totalViews.toLocaleString()}+ Views
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Jump Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search within archive..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff3d3d]/20 focus:border-[#ff3d3d]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Month & Category Selectors */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Month:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#ff3d3d]"
                >
                  <option value="all">All Months</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#ff3d3d]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedMonth !== "all" || selectedCategory !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedMonth("all");
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className="text-xs text-[#ff3d3d] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout: Timeline Stream (8 cols) + Archive Metadata (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Timeline Column */}
          <div className="lg:col-span-8">
            {monthKeys.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  No archived articles found
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                  No publications matched your selected month or search query.
                </p>
                <button
                  onClick={() => {
                    setSelectedMonth("all");
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 rounded-lg bg-[#ff3d3d] text-white text-xs font-semibold"
                >
                  Reset Archive Filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {monthKeys.map((month) => {
                  const posts = groupedByMonth[month];
                  return (
                    <section key={month} className="relative">
                      {/* Sticky Month Heading */}
                      <div className="sticky top-20 z-10 bg-[#f8fafc]/95 backdrop-blur-sm py-2 mb-4 flex items-center justify-between border-b-2 border-slate-300">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-[#ff3d3d]" />
                          <h2 className="text-lg sm:text-xl font-bold text-[#15233e]">
                            {month}
                          </h2>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                          {posts.length} {posts.length === 1 ? "Article" : "Articles"}
                        </span>
                      </div>

                      {/* Posts in Month */}
                      <div className="space-y-4 pl-4 border-l-2 border-slate-200 ml-1.5">
                        {posts.map((post) => {
                          const dateObj = new Date(post.isoDate);
                          const dayNumber = dateObj.getDate();
                          const monthShort = post.date.split(" ")[0];

                          return (
                            <div
                              key={post.id}
                              className="group relative bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              {/* Left: Date Badge + Title + Excerpt */}
                              <div className="flex items-start gap-4">
                                {/* Calendar Day Badge */}
                                <div className="flex-shrink-0 w-12 h-14 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center group-hover:border-[#ff3d3d] group-hover:bg-red-50/50 transition-colors">
                                  <span className="text-xs font-bold text-[#ff3d3d] uppercase leading-none">
                                    {monthShort}
                                  </span>
                                  <span className="text-lg font-extrabold text-slate-800 leading-tight">
                                    {dayNumber}
                                  </span>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="text-[11px] font-semibold uppercase text-slate-700 px-2 py-0.5 rounded bg-slate-100">
                                      {post.category}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {post.readTime}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      by {post.author.name}
                                    </span>
                                  </div>

                                  <Link href={`/blog/${post.slug}`}>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#ff3d3d] transition-colors leading-snug">
                                      {post.title}
                                    </h3>
                                  </Link>

                                  <p className="text-slate-500 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                  </p>
                                </div>
                              </div>

                              {/* Right: Read Action */}
                              <div className="flex-shrink-0 self-end sm:self-center pl-16 sm:pl-0">
                                <Link
                                  href={`/blog/${post.slug}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#15233e] group-hover:text-white bg-slate-100 group-hover:bg-[#ff3d3d] transition-all"
                                >
                                  <span>Read</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          {/* Archive Metadata Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Month Jump Index */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ff3d3d]" />
                Jump to Month
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedMonth("all")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedMonth === "all"
                      ? "bg-[#ff3d3d] text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>All Archived Months</span>
                  <span>{allPosts.length}</span>
                </button>
                {availableMonths.map((m) => {
                  const count = allPosts.filter((p) => p.month === m).length;
                  const isSelected = selectedMonth === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-[#ff3d3d] text-white"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{m}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Archive Topics Breakdown */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff3d3d]" />
                Topic Breakdown
              </h4>
              <div className="space-y-2">
                {categories.map((c) => {
                  const percent = Math.round((c.count / allPosts.length) * 100);
                  return (
                    <div key={c.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-slate-400 font-semibold">{c.count} ({percent}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-800 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back to Live Blog Link */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-md">
              <h4 className="text-sm font-bold mb-1">Return to Main Feed</h4>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Check out the latest featured articles, interactive filters, and community comments.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff3d3d] hover:bg-[#e03131] text-white text-xs font-semibold transition-colors"
              >
                <span>Go to Blog Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
