import { Metadata } from "next";
import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
  getTrendingPosts,
} from "@/lib/blog-data";
import BlogPostView from "@/components/blog/blog-post-view";

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
      <BlogPostView
        post={null}
        prevPost={null}
        nextPost={null}
        relatedPosts={[]}
        trendingPosts={[]}
      />
    );
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = getRelatedPosts(post.slug, 3);
  const trendingPosts = getTrendingPosts(3);

  return (
    <BlogPostView
      post={post}
      prevPost={prevPost}
      nextPost={nextPost}
      relatedPosts={relatedPosts}
      trendingPosts={trendingPosts}
    />
  );
}
