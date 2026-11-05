"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  getAllPosts,
  getFeaturedPost,
  getCategoriesWithCounts,
  BlogPost,
} from "@/lib/blog-data";
import BlogHeroFeatured from "@/components/blog/blog-hero-featured";
import BlogCard from "@/components/blog/blog-card";
import BlogSidebar from "@/components/blog/blog-sidebar";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  Filter,
  X,
  Archive,
} from "lucide-react";

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featuredPost = getFeaturedPost();
  const categories = getCategoriesWithCounts();

  // Interactive UI state
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    return allPosts
      .filter((post) => {
        const matchesCategory = selectedCategory
          ? post.category.toLowerCase() === selectedCategory.toLowerCase()
          : true;
        const matchesTag = selectedTag
          ? post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
          : true;
        const matchesSearch = searchTerm
          ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        return matchesCategory && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.views - a.views;
        if (sortBy === "comments") return b.commentsCount - a.commentsCount;
        return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
      });
  }, [allPosts, selectedCategory, selectedTag, searchTerm, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(selectedCategory || selectedTag || searchTerm);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 sm:py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#0ea57a] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">Blog & Insights</span>
        </nav>

        {/* Page Title & Mission Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#0ea57a] mb-2.5">
              <BookOpen className="w-3.5 h-3.5" />
              IndustrialEdge Engineering Journal
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171145] tracking-tight">
              Tech Insights, Benchmarks & Guides
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              In-depth hardware teardowns, Industry 4.0 automation guides, embedded architecture comparisons, and smart consumer tech reviews.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <Link
              href="/blog/archive"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-[#0ea57a] hover:border-[#0ea57a] text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Archive className="w-4 h-4 text-[#0ea57a]" />
              <span>Browse Archive</span>
            </Link>
          </div>
        </div>

        {/* Editorial Hero Spotlight (only shown on page 1 when no active filter is applied) */}
        {!hasActiveFilters && currentPage === 1 && (
          <BlogHeroFeatured post={featuredPost} />
        )}

        {/* Filter and Control Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === ""
                    ? "bg-[#171145] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                All Topics ({allPosts.length})
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(isSelected ? "" : cat.name);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-[#0ea57a] text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Sort & Layout Grid/List Toggle */}
            <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0ea57a]"
                >
                  <option value="latest">Latest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="comments">Most Discussed</option>
                </select>
              </div>

              {/* Layout Switcher (Grid vs List) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    layout === "grid"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    layout === "list"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <Filter className="w-3.5 h-3.5" /> Active filters:
              </span>

              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="hover:text-blue-900 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTag && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-200">
                  Tag: #{selectedTag}
                  <button
                    onClick={() => setSelectedTag("")}
                    className="hover:text-amber-900 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-200">
                  Search: &ldquo;{searchTerm}&rdquo;
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-purple-900 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-[#0ea57a] hover:underline font-semibold ml-auto"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Articles Stream (8 cols) */}
          <div className="lg:col-span-8">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  No articles matched your criteria
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
                  Try adjusting your search query, selecting another category, or resetting your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-lg bg-[#0ea57a] text-white text-xs font-semibold hover:bg-[#0b8462] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  layout === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-6"
                }
              >
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} layout={layout} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-10 mt-10 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Showing {(currentPage - 1) * postsPerPage + 1} -{" "}
                  {Math.min(currentPage * postsPerPage, filteredPosts.length)} of{" "}
                  {filteredPosts.length} articles
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 350, behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 350, behavior: "smooth" });
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === page
                          ? "bg-[#0ea57a] text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 350, behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <BlogSidebar
              currentCategory={selectedCategory}
              currentTag={selectedTag}
              initialSearch={searchTerm}
              onSearch={(term) => {
                setSearchTerm(term);
                setCurrentPage(1);
              }}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              onSelectTag={(tag) => {
                setSelectedTag(tag);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
