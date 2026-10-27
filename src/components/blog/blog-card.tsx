import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";
import { Calendar, Clock, MessageSquare, ArrowRight, Eye, TrendingUp } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  layout?: "grid" | "list";
}

export default function BlogCard({ post, layout = "grid" }: BlogCardProps) {
  if (layout === "list") {
    return (
      <article className="group flex flex-col md:flex-row bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300">
        {/* Thumbnail on left */}
        <div className="relative md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-100 flex-shrink-0">
          <Link href={`/blog/${post.slug}`} className="block w-full h-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
              {post.category}
            </span>
            {post.trending && (
              <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#ff3d3d] text-white flex items-center gap-1 shadow-sm">
                <TrendingUp className="w-3 h-3" /> Hot
              </span>
            )}
          </div>
        </div>

        {/* Content on right */}
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readTime}
              </span>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#ff3d3d] transition-colors leading-snug mb-2.5">
                {post.title}
              </h3>
            </Link>

            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          </div>

          {/* Footer metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="text-xs font-medium text-slate-700">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {post.commentsCount}
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#ff3d3d] hover:text-[#d32f2f] ml-1"
              >
                <span>Read</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid layout (default)
  return (
    <article className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link href={`/blog/${post.slug}`} className="block w-full h-full">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
            {post.category}
          </span>
          {post.trending && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#ff3d3d] text-white flex items-center gap-1 shadow-sm">
              <TrendingUp className="w-3 h-3" /> Hot
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Date & Read time */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#ff3d3d] transition-colors leading-snug mb-2 line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={26}
              height={26}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="text-xs font-medium text-slate-700 truncate max-w-[110px]">
              {post.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MessageSquare className="w-3 h-3" />
              {post.commentsCount}
            </span>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xs font-semibold text-[#ff3d3d] hover:text-[#d32f2f] flex items-center gap-1 group/btn"
            >
              <span>Read</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
