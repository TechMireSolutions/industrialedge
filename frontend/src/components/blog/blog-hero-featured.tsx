import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";
import { Calendar, Clock, Eye, ArrowRight, Sparkles } from "lucide-react";

export default function BlogHeroFeatured({ post }: { post: BlogPost }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-slate-700/60 mb-12">
      {/* Subtle background glow effect */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Text & Editorial Details */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0ea57a] text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Editorial
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/15">
              {post.category}
            </span>
          </div>

          <Link href={`/blog/${post.slug}`} className="group block">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-[#ff6b6b] transition-colors leading-[1.25]">
              {post.title}
            </h2>
          </Link>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-700/70">
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
              />
              <span className="font-medium text-slate-200">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{post.date}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{post.readTime}</span>
            </div>

            <div className="flex items-center gap-1.5 hidden sm:flex">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0ea57a] hover:bg-[#0b8462] text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 group"
            >
              <span>Read Full Deep-Dive</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Cover Image */}
        <div className="lg:col-span-5">
          <Link href={`/blog/${post.slug}`} className="group block relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-700/80 shadow-2xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
              Click to Read →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
