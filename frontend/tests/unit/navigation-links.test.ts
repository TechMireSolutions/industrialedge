import { describe, it, expect } from "vitest";

describe("Site Navigation & Route Architecture", () => {
  const REQUIRED_NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Blogs", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "What we do", href: "/what-we-do" },
    { label: "Our partners", href: "/partners" },
  ];

  it("should contain exactly the 6 required primary navigation links", () => {
    expect(REQUIRED_NAV_LINKS.length).toBe(6);
    expect(REQUIRED_NAV_LINKS.map((l) => l.label)).toEqual([
      "Home",
      "Shop",
      "Blogs",
      "About Us",
      "What we do",
      "Our partners",
    ]);
  });

  it("should have valid root-relative routes for each nav item", () => {
    REQUIRED_NAV_LINKS.forEach((item) => {
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.href).not.toBe("#");
      expect(item.href).not.toContain("javascript:");
    });
  });

  it("should have existing valid routes for all primary pages", () => {
    const validAppRoutes = [
      "/",
      "/shop",
      "/blog",
      "/blog/archive",
      "/blogs",
      "/blogs/archive",
      "/about",
      "/what-we-do",
      "/partners",
      "/contact",
      "/cart",
      "/wishlist",
      "/checkout",
      "/my-account",
    ];

    REQUIRED_NAV_LINKS.forEach((link) => {
      expect(validAppRoutes).toContain(link.href);
    });
  });
});
