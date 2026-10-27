import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
  getTrendingPosts,
} from "@/lib/blog-data";
import ReadingProgress from "@/components/blog/reading-progress";
import TableOfContents from "@/components/blog/table-of-contents";
import SocialShareBar from "@/components/blog/social-share-bar";
import CommentsSection from "@/components/blog/comments-section";
import BlogCard from "@/components/blog/blog-card";
import {
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Quote,
  Cpu,
  ArrowLeft,
  ArrowRight,
  Star,
  ExternalLink,
  ShieldCheck,
  Share2,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found — IndustrialEdge",
    };
  }

  return {
    title: `${post.title} — IndustrialEdge.pk`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
      publishedTime: post.isoDate,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#f8fafc]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0ea57a] flex items-center justify-center mb-4">
          <Cpu className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171145] mb-2">
          Article Not Found
        </h1>
        <p className="text-slate-600 max-w-md mb-6 text-sm">
          The requested article may have been archived or moved. Explore our latest publications in the blog directory.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0ea57a] text-white text-sm font-semibold hover:bg-[#0b8462] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog Hub</span>
        </Link>
      </div>
    );
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = getRelatedPosts(post.slug, 3);
  const trendingPosts = getTrendingPosts(3);

  return (
    <article className="bg-[#f8fafc] min-h-screen">
      {/* Top Reading Progress Bar */}
      <ReadingProgress />

      {/* Hero Header Container */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-[#0ea57a] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/blog" className="hover:text-[#0ea57a] transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500">{post.category}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-semibold truncate max-w-[240px]">
              {post.title}
            </span>
          </nav>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-[#0ea57a]">
              {post.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.date}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {post.views.toLocaleString()} views
            </span>
          </div>

          {/* H1 Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#171145] tracking-tight leading-[1.25] mb-5">
            {post.title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
            {post.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Verified Contributor" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {post.author.name}
                  </h4>
                  <span title="Verified Author">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">
                  {post.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#comments"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.commentsCount} Comments</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reader Layout */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Cover Hero Photo */}
        <div className="relative aspect-[21/9] sm:aspect-[2/1] rounded-2xl overflow-hidden mb-10 shadow-lg border border-slate-200 max-w-5xl mx-auto">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs text-white text-[11px]">
            Photo: IndustrialEdge Hardware Lab
          </div>
        </div>

        {/* 2-Column Grid: Content (8 cols) + Sticky Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Main Article Body (8 cols) */}
          <div className="lg:col-span-8">
            {/* Social Share Bar */}
            <SocialShareBar
              title={post.title}
              slug={post.slug}
              initialLikes={post.likes}
            />

            {/* Key Takeaways Box */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200 rounded-xl p-5 sm:p-6 mb-8 shadow-xs">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Key Takeaways & Executive Summary
                </h3>
                <ul className="space-y-2.5">
                  {post.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Content Sections */}
            <div className="prose prose-slate max-w-none space-y-8">
              {post.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  {section.heading && (
                    <h2 className="text-xl sm:text-2xl font-bold text-[#171145] tracking-tight mb-4 pt-4 border-t border-slate-200/60 first:border-t-0 first:pt-0">
                      {section.heading}
                    </h2>
                  )}

                  {section.subheading && (
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      {section.subheading}
                    </h3>
                  )}

                  <div className="space-y-4">
                    {section.paragraphs.map((p, idx) => (
                      <p
                        key={idx}
                        className="text-slate-700 text-sm sm:text-base leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Optional Blockquote */}
                  {section.quote && (
                    <div className="my-6 p-5 sm:p-6 rounded-xl bg-slate-50 border-l-4 border-[#0ea57a] shadow-xs">
                      <Quote className="w-6 h-6 text-[#0ea57a] opacity-50 mb-2" />
                      <p className="text-slate-800 font-medium italic text-sm sm:text-base leading-relaxed mb-2">
                        &ldquo;{section.quote.text}&rdquo;
                      </p>
                      <span className="text-xs font-semibold text-slate-500 block">
                        — {section.quote.attribution}
                      </span>
                    </div>
                  )}

                  {/* Optional Specs Comparison Table */}
                  {section.specsTable && (
                    <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-xs bg-white">
                      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-semibold text-xs text-slate-800">
                        {section.specsTable.title}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-slate-100/70 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-2.5">Feature</th>
                              <th className="px-4 py-2.5">Specification</th>
                              <th className="px-4 py-2.5">Advantage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {section.specsTable.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/60">
                                <td className="px-4 py-3 font-semibold text-slate-800">
                                  {row.feature}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                  {row.spec}
                                </td>
                                <td className="px-4 py-3 text-emerald-700 font-medium">
                                  {row.advantage}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Optional Code Snippet */}
                  {section.codeSnippet && (
                    <div className="my-6 rounded-xl overflow-hidden bg-[#0f172a] text-slate-200 border border-slate-800 shadow-md">
                      {section.codeSnippet.filename && (
                        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                          <span>{section.codeSnippet.filename}</span>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">
                            {section.codeSnippet.language}
                          </span>
                        </div>
                      )}
                      <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-400">
                        <code>{section.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Optional Bullet Points */}
                  {section.bulletPoints && (
                    <ul className="my-4 space-y-2">
                      {section.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <span className="text-[#0ea57a] font-bold mr-1">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* In-Article Product Spotlight Card */}
            {post.featuredProduct && (
              <div className="my-10 bg-white rounded-2xl border-2 border-[#171145]/10 p-5 sm:p-6 shadow-md">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <Image
                      src={post.featuredProduct.image}
                      alt={post.featuredProduct.title}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                    {post.featuredProduct.badge && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0ea57a] text-white">
                        {post.featuredProduct.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-xs font-semibold text-[#0ea57a] uppercase tracking-wider">
                      Featured in this article
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2">
                      {post.featuredProduct.title}
                    </h4>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-800 ml-1">
                          {post.featuredProduct.rating}
                        </span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-sm font-bold text-[#171145]">
                        {post.featuredProduct.price}
                      </span>
                      {post.featuredProduct.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {post.featuredProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    <Link
                      href={post.featuredProduct.href}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#171145] hover:bg-[#0ea57a] text-white text-xs font-semibold transition-colors"
                    >
                      <span>View Specifications & Buy</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Tags Cloud */}
            <div className="pt-6 mt-8 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Tagged:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Author Bio Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 my-10 shadow-xs flex flex-col sm:flex-row gap-5 items-start">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={72}
                height={72}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-slate-200 flex-shrink-0"
              />
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0ea57a]">
                  Written By Contributor
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                  {post.author.name}
                </h4>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  {post.author.role}
                </p>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {post.author.bio}
                </p>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-[#0ea57a] hover:underline inline-flex items-center gap-1"
                >
                  <span>More articles by {post.author.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Previous & Next Post Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1 mb-2">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Previous Article
                  </span>
                  <h5 className="text-sm font-bold text-slate-800 group-hover:text-[#0ea57a] transition-colors line-clamp-2">
                    {prevPost.title}
                  </h5>
                </Link>
              ) : (
                <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  You are viewing our earliest article
                </div>
              )}

              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between text-right"
                >
                  <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center justify-end gap-1 mb-2">
                    Next Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <h5 className="text-sm font-bold text-slate-800 group-hover:text-[#0ea57a] transition-colors line-clamp-2">
                    {nextPost.title}
                  </h5>
                </Link>
              ) : (
                <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  You are viewing the latest published article
                </div>
              )}
            </div>

            {/* Related Articles Section */}
            <div className="mt-12 pt-10 border-t border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0ea57a]">
                    Further Reading
                  </span>
                  <h3 className="text-xl font-bold text-[#171145]">
                    Related Articles in {post.category}
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-[#0ea57a] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPosts.map((rPost) => (
                  <BlogCard key={rPost.id} post={rPost} layout="grid" />
                ))}
              </div>
            </div>

            {/* Comments & Discussion */}
            <CommentsSection
              initialComments={post.comments}
              postTitle={post.title}
            />
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sticky Container */}
            <div className="sticky top-20 space-y-6">
              {/* 1. Table of Contents */}
              <TableOfContents items={post.tableOfContents} />

              {/* 2. Trending in this niche */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3.5">
                  Popular in Tech & Hardware
                </h4>
                <div className="space-y-3.5">
                  {trendingPosts.map((tPost) => (
                    <Link
                      key={tPost.id}
                      href={`/blog/${tPost.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                        <Image
                          src={tPost.image}
                          alt={tPost.title}
                          fill
                          sizes="56px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold uppercase text-[#0ea57a] block">
                          {tPost.category}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#0ea57a] transition-colors line-clamp-2 leading-snug">
                          {tPost.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {tPost.readTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3. Hardware Store CTA */}
              <div className="bg-[#171145] text-white p-5 rounded-xl border border-slate-800 shadow-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0ea57a] block mb-1">
                  Need Industrial Hardware?
                </span>
                <h5 className="text-sm font-bold text-white mb-2">
                  IndustrialEdge Official Pakistan Store
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Browse authentic microcontrollers, PLC modules, rugged sensors, and smart tech devices with fast nationwide delivery.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#0ea57a] hover:bg-[#0b8462] text-white text-xs font-semibold transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
