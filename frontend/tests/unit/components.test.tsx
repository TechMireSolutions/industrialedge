import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BlogCard from "@/components/blog/blog-card";
import BlogHeroFeatured from "@/components/blog/blog-hero-featured";
import TableOfContents from "@/components/blog/table-of-contents";
import CommentsSection from "@/components/blog/comments-section";
import ReadingProgress from "@/components/blog/reading-progress";
import { BLOG_POSTS } from "@/lib/blog-data";

// Mock next/image cleanly stripping Next-specific non-standard DOM props
vi.mock("next/image", () => ({
  default: ({ fill, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Core UI Components Unit Tests", () => {
  const samplePost = BLOG_POSTS[0];

  describe("BlogCard Component", () => {
    it("should render the card in grid layout by default", () => {
      const { container } = render(<BlogCard post={samplePost} />);
      expect(screen.getByText(samplePost.title)).toBeInTheDocument();
      expect(screen.getByText(samplePost.category)).toBeInTheDocument();
      expect(screen.getByText(samplePost.readTime)).toBeInTheDocument();

      const link = container.querySelector(`a[href="/blog/${samplePost.slug}"]`);
      expect(link).toBeInTheDocument();
    });

    it("should render the card in list layout when specified", () => {
      render(<BlogCard post={samplePost} layout="list" />);
      expect(screen.getByText(samplePost.title)).toBeInTheDocument();
      expect(screen.getByText(samplePost.excerpt)).toBeInTheDocument();
    });

    it("should display the author name and date", () => {
      render(<BlogCard post={samplePost} />);
      expect(screen.getByText(samplePost.author.name)).toBeInTheDocument();
      expect(screen.getByText(samplePost.date)).toBeInTheDocument();
    });
  });

  describe("BlogHeroFeatured Component", () => {
    it("should render featured article headline and metadata", () => {
      render(<BlogHeroFeatured post={samplePost} />);
      expect(screen.getByText(samplePost.title)).toBeInTheDocument();
      expect(screen.getByText(samplePost.excerpt)).toBeInTheDocument();
      expect(screen.getByText(samplePost.category)).toBeInTheDocument();
      expect(screen.getByText(samplePost.author.name)).toBeInTheDocument();
    });
  });

  describe("TableOfContents Component", () => {
    it("should render all table of contents headings as interactive navigation buttons", () => {
      render(<TableOfContents items={samplePost.tableOfContents} />);
      samplePost.tableOfContents.forEach((item) => {
        expect(screen.getByText(item.title)).toBeInTheDocument();
      });
    });

    it("should trigger click without error when selecting an anchor section", () => {
      render(<TableOfContents items={samplePost.tableOfContents} />);
      const firstHeadingButton = screen.getByText(samplePost.tableOfContents[0].title);
      expect(() => fireEvent.click(firstHeadingButton)).not.toThrow();
    });
  });

  describe("CommentsSection Component", () => {
    it("should render existing post comments", () => {
      render(
        <CommentsSection
          initialComments={samplePost.comments}
          postTitle={samplePost.title}
        />
      );

      samplePost.comments.forEach((comment) => {
        expect(screen.getByText(comment.author)).toBeInTheDocument();
        expect(screen.getByText(comment.content)).toBeInTheDocument();
      });
    });

    it("should allow submitting a new comment and render it immediately", () => {
      const { container } = render(
        <CommentsSection
          initialComments={samplePost.comments}
          postTitle={samplePost.title}
        />
      );

      const nameInput = screen.getByPlaceholderText(/e\.g\. Engr\. Hamza/i);
      const emailInput = screen.getByPlaceholderText(/hamza@domain\.com/i);
      const commentInput = container.querySelector("textarea")!;
      const submitBtn = screen.getByRole("button", { name: /submit comment/i });

      fireEvent.change(nameInput, { target: { value: "Engr. Bilal" } });
      fireEvent.change(emailInput, { target: { value: "bilal@example.com" } });
      fireEvent.change(commentInput, {
        target: { value: "Very thorough benchmarking of 3nm thermals." },
      });

      fireEvent.click(submitBtn);

      expect(screen.getByText("Engr. Bilal")).toBeInTheDocument();
      expect(
        screen.getByText("Very thorough benchmarking of 3nm thermals.")
      ).toBeInTheDocument();
    });
  });

  describe("ReadingProgress Component", () => {
    it("should mount and render progress bar element", () => {
      const { container } = render(<ReadingProgress />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Footer Links and Copy QA Tests", () => {
    it("should render standardized contact landline tel:+922134685312 and address", async () => {
      const Footer = (await import("@/components/layout/footer")).default;
      const { container } = render(<Footer />);

      const landline = container.querySelector('a[href="tel:+922134685312"]');
      expect(landline).toBeInTheDocument();
      expect(landline?.textContent).toContain("021 346 853 12");

      expect(
        screen.getByText(/Suite M-107, Odeon Center, Regal Chowk, Saddar, Karachi, Pakistan/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Register now to get the latest procurement updates on bulk supplies/i)
      ).toBeInTheDocument();
    });
  });
});
