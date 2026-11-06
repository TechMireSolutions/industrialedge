import { describe, it, expect } from "vitest";
import {
  BLOG_POSTS,
  getPostBySlug,
  getPostById,
  getAllPosts,
  getFeaturedPost,
  getCategoriesWithCounts,
  getAllTagsWithCounts,
  getTrendingPosts,
  getAllBlogCategories,
  getAllBlogTags,
  getRelatedPosts,
  searchPosts,
  getPaginatedPosts,
  getArchiveTimeline,
  getArchiveStats,
} from "@/lib/blog-data";

describe("Blog Data Integrity & Helper Functions", () => {
  describe("Dataset Validation", () => {
    it("should have at least 8 published blog articles", () => {
      expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(8);
      expect(getAllPosts().length).toBe(BLOG_POSTS.length);
    });

    it("should ensure every blog post has unique ID and unique slug", () => {
      const ids = BLOG_POSTS.map((p) => p.id);
      const slugs = BLOG_POSTS.map((p) => p.slug);

      const uniqueIds = new Set(ids);
      const uniqueSlugs = new Set(slugs);

      expect(uniqueIds.size).toBe(ids.length);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("should have all required fields filled on every post", () => {
      BLOG_POSTS.forEach((post) => {
        expect(post.id).toBeTruthy();
        expect(post.title).toBeTruthy();
        expect(post.slug).toMatch(/^[a-z0-9-]+$/);
        expect(post.excerpt).toBeTruthy();
        expect(post.category).toBeTruthy();
        expect(post.isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(post.date).toBeTruthy();
        expect(post.year).toBeGreaterThanOrEqual(2024);
        expect(post.readTime).toMatch(/min read/);
        expect(post.image).toBeTruthy();
        expect(post.author.name).toBeTruthy();
        expect(post.author.role).toBeTruthy();
        expect(Array.isArray(post.tags)).toBe(true);
        expect(post.tags.length).toBeGreaterThan(0);
        expect(post.sections.length).toBeGreaterThan(0);
        expect(post.sections[0].paragraphs.length).toBeGreaterThan(0);
      });
    });

    it("should have at least one featured post", () => {
      const featured = getFeaturedPost();
      expect(featured).toBeDefined();
      expect(featured.id).toBeTruthy();
    });
  });

  describe("getPostBySlug and getPostById", () => {
    it("should return the exact post when queried with an existing slug", () => {
      const post = getPostBySlug("the-future-of-foldable-smartphones-in-2026");
      expect(post).toBeDefined();
      expect(post?.id).toBe("1");
      expect(post?.title).toContain("Foldable");
    });

    it("should support lookup by string ID as fallback", () => {
      const post = getPostBySlug("2");
      expect(post).toBeDefined();
      expect(post?.id).toBe("2");
    });

    it("should find post by ID directly using getPostById", () => {
      const post = getPostById("1");
      expect(post).toBeDefined();
      expect(post?.slug).toBe("the-future-of-foldable-smartphones-in-2026");
    });

    it("should return undefined for a non-existent slug", () => {
      const post = getPostBySlug("this-post-definitely-does-not-exist-999");
      expect(post).toBeUndefined();
    });
  });

  describe("getAllBlogCategories and getCategoriesWithCounts", () => {
    it("should return an array of unique category names", () => {
      const categories = getAllBlogCategories();
      expect(categories.length).toBeGreaterThan(0);
      const uniqueCats = new Set(categories);
      expect(uniqueCats.size).toBe(categories.length);
    });

    it("should contain major site categories like Smart Devices", () => {
      const categories = getAllBlogCategories();
      expect(categories).toContain("Smart Devices");
    });

    it("should compute category post counts accurately", () => {
      const counts = getCategoriesWithCounts();
      expect(counts.length).toBeGreaterThan(0);
      const totalCount = counts.reduce((acc, c) => acc + c.count, 0);
      expect(totalCount).toBe(BLOG_POSTS.length);
    });
  });

  describe("getAllBlogTags and getAllTagsWithCounts", () => {
    it("should return unique tags", () => {
      const tags = getAllBlogTags();
      expect(tags.length).toBeGreaterThan(0);
      const uniqueTags = new Set(tags);
      expect(uniqueTags.size).toBe(tags.length);
    });

    it("should sort tag counts in descending order", () => {
      const tagsWithCounts = getAllTagsWithCounts();
      expect(tagsWithCounts.length).toBeGreaterThan(0);
      for (let i = 0; i < tagsWithCounts.length - 1; i++) {
        expect(tagsWithCounts[i].count).toBeGreaterThanOrEqual(tagsWithCounts[i + 1].count);
      }
    });
  });

  describe("getTrendingPosts", () => {
    it("should return posts sorted by views descending", () => {
      const trending = getTrendingPosts(4);
      expect(trending.length).toBeLessThanOrEqual(4);
      for (let i = 0; i < trending.length - 1; i++) {
        expect(trending[i].views).toBeGreaterThanOrEqual(trending[i + 1].views);
      }
    });
  });

  describe("getRelatedPosts", () => {
    it("should exclude the current post itself", () => {
      const related = getRelatedPosts("the-future-of-foldable-smartphones-in-2026", 3);
      const includesSelf = related.some((p) => p.id === "1");
      expect(includesSelf).toBe(false);
    });

    it("should prioritize same-category posts when available", () => {
      const related = getRelatedPosts("the-future-of-foldable-smartphones-in-2026", 2);
      expect(related.length).toBeLessThanOrEqual(2);
      if (related.length > 0) {
        expect(related[0].id).not.toBe("1");
      }
    });

    it("should respect the count parameter", () => {
      const count = 2;
      const related = getRelatedPosts("the-future-of-foldable-smartphones-in-2026", count);
      expect(related.length).toBeLessThanOrEqual(count);
    });
  });

  describe("searchPosts", () => {
    it("should filter posts by title keyword matching", () => {
      const results = searchPosts("Smartphones");
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every(
          (p) =>
            p.title.toLowerCase().includes("smartphones") ||
            p.excerpt.toLowerCase().includes("smartphones") ||
            p.tags.some((t) => t.toLowerCase().includes("smartphones"))
        )
      ).toBe(true);
    });

    it("should filter by category when category parameter is supplied", () => {
      const results = searchPosts("", "Smart Devices");
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.category.toLowerCase() === "smart devices")).toBe(true);
    });

    it("should combine search query and category filtering", () => {
      const results = searchPosts("Samsung", "Smart Devices");
      expect(results.every((p) => p.category.toLowerCase() === "smart devices")).toBe(true);
    });

    it("should return empty array for gibberish search query", () => {
      const results = searchPosts("xyznonexistentterm998877");
      expect(results).toEqual([]);
    });
  });

  describe("getPaginatedPosts", () => {
    it("should return first page with requested limit", () => {
      const limit = 3;
      const { posts, totalPosts, totalPages, currentPage } = getPaginatedPosts(1, limit);
      expect(currentPage).toBe(1);
      expect(posts.length).toBeLessThanOrEqual(limit);
      expect(totalPosts).toBe(BLOG_POSTS.length);
      expect(totalPages).toBe(Math.ceil(BLOG_POSTS.length / limit));
    });

    it("should correctly calculate slice for page 2", () => {
      const limit = 2;
      const page1 = getPaginatedPosts(1, limit);
      const page2 = getPaginatedPosts(2, limit);

      expect(page1.posts[0].id).not.toBe(page2.posts[0].id);
      expect(page2.currentPage).toBe(2);
    });
  });

  describe("getArchiveTimeline", () => {
    it("should group posts into chronological months and years", () => {
      const timeline = getArchiveTimeline();
      expect(timeline.length).toBeGreaterThan(0);

      timeline.forEach((group) => {
        expect(group.month).toBeTruthy();
        expect(group.year).toBeGreaterThanOrEqual(2024);
        expect(group.count).toBe(group.posts.length);
        expect(group.posts.length).toBeGreaterThan(0);
      });
    });

    it("should ensure total posts in timeline equals total BLOG_POSTS", () => {
      const timeline = getArchiveTimeline();
      const totalTimelinePosts = timeline.reduce((acc, item) => acc + item.count, 0);
      expect(totalTimelinePosts).toBe(BLOG_POSTS.length);
    });
  });

  describe("getArchiveStats", () => {
    it("should compute accurate archive statistics", () => {
      const stats = getArchiveStats();
      expect(stats.totalArticles).toBe(BLOG_POSTS.length);
      expect(stats.categories).toBe(getCategoriesWithCounts().length);
      expect(stats.tags).toBe(getAllTagsWithCounts().length);
      expect(stats.authors).toBeGreaterThan(0);
      expect(stats.totalViews).toBeGreaterThan(0);
    });
  });
});
