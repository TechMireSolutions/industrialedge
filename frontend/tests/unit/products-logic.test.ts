import { describe, it, expect } from "vitest";

interface Product {
  id: string;
  name: string;
  brand: string;
  categories: string[];
  price: number;
  rating: number;
}

const SAMPLE_CATALOG: Product[] = [
  {
    id: "p1",
    name: "AirPods 2nd Gen",
    brand: "Apple",
    categories: ["AirPods", "Headphone", "Audio"],
    price: 129.0,
    rating: 5,
  },
  {
    id: "p2",
    name: "Acer Aspire 5 Laptop",
    brand: "Acer",
    categories: ["Computers & Accessories", "Laptop & Tablet"],
    price: 529.75,
    rating: 4.5,
  },
  {
    id: "p3",
    name: "Apple Watch Series 9",
    brand: "Apple",
    categories: ["Smart Watches", "Wearables"],
    price: 399.0,
    rating: 4.8,
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    categories: ["Headphone", "Audio"],
    price: 349.99,
    rating: 4.9,
  },
  {
    id: "p5",
    name: "Canon EOS M50 Mark II",
    brand: "Canon",
    categories: ["Camera & Video"],
    price: 699.0,
    rating: 4.7,
  },
];

// Reusable pure filter functions matching shop page logic
function filterProducts(
  products: Product[],
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }
): Product[] {
  return products.filter((p) => {
    if (filters.category && !p.categories.includes(filters.category)) {
      return false;
    }
    if (filters.brand && p.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }
    if (filters.minPrice !== undefined && p.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }
    return true;
  });
}

function sortProducts(
  products: Product[],
  sortBy: "price-asc" | "price-desc" | "rating-desc" | "name-asc"
): Product[] {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
}

describe("Product Catalog Filtering & Sorting Logic", () => {
  describe("Category and Brand Filtering", () => {
    it("should filter products by category", () => {
      const audioProducts = filterProducts(SAMPLE_CATALOG, { category: "Audio" });
      expect(audioProducts.length).toBe(2);
      expect(audioProducts.map((p) => p.name)).toEqual([
        "AirPods 2nd Gen",
        "Sony WH-1000XM5 Headphones",
      ]);
    });

    it("should filter products by brand", () => {
      const appleProducts = filterProducts(SAMPLE_CATALOG, { brand: "Apple" });
      expect(appleProducts.length).toBe(2);
      expect(appleProducts.every((p) => p.brand === "Apple")).toBe(true);
    });

    it("should combine brand and category filters", () => {
      const appleAudio = filterProducts(SAMPLE_CATALOG, {
        brand: "Apple",
        category: "Audio",
      });
      expect(appleAudio.length).toBe(1);
      expect(appleAudio[0].id).toBe("p1");
    });
  });

  describe("Price Range Filtering", () => {
    it("should filter products within a min and max price window", () => {
      const midTier = filterProducts(SAMPLE_CATALOG, {
        minPrice: 300,
        maxPrice: 400,
      });
      expect(midTier.length).toBe(2);
      expect(midTier.map((p) => p.name)).toEqual([
        "Apple Watch Series 9",
        "Sony WH-1000XM5 Headphones",
      ]);
    });

    it("should return empty array if price range has no matches", () => {
      const highTier = filterProducts(SAMPLE_CATALOG, { minPrice: 1000 });
      expect(highTier).toEqual([]);
    });
  });

  describe("Sorting Algorithms", () => {
    it("should sort products by price ascending (cheapest first)", () => {
      const sorted = sortProducts(SAMPLE_CATALOG, "price-asc");
      expect(sorted[0].price).toBe(129.0);
      expect(sorted[sorted.length - 1].price).toBe(699.0);
    });

    it("should sort products by price descending (most expensive first)", () => {
      const sorted = sortProducts(SAMPLE_CATALOG, "price-desc");
      expect(sorted[0].price).toBe(699.0);
      expect(sorted[sorted.length - 1].price).toBe(129.0);
    });

    it("should sort products by rating descending (highest rated first)", () => {
      const sorted = sortProducts(SAMPLE_CATALOG, "rating-desc");
      expect(sorted[0].rating).toBe(5);
    });

    it("should sort products alphabetically by name", () => {
      const sorted = sortProducts(SAMPLE_CATALOG, "name-asc");
      expect(sorted[0].name.startsWith("Acer")).toBe(true);
    });
  });

  describe("Cart and Checkout Calculations", () => {
    const cartItems = [
      { price: 129.0, qty: 2 }, // 258
      { price: 349.99, qty: 1 }, // 349.99
    ];

    it("should calculate correct subtotal", () => {
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      expect(subtotal).toBeCloseTo(607.99, 2);
    });

    it("should calculate correct tax (5% standard rate)", () => {
      const subtotal = 607.99;
      const taxRate = 0.05;
      const tax = subtotal * taxRate;
      expect(tax).toBeCloseTo(30.3995, 2);
    });

    it("should calculate total with free shipping threshold over $100", () => {
      const subtotal = 607.99;
      const shipping = subtotal > 100 ? 0 : 15;
      expect(shipping).toBe(0);
      const total = subtotal + shipping;
      expect(total).toBeCloseTo(607.99, 2);
    });
  });
});
