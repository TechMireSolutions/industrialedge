import { describe, it, expect, beforeEach } from "vitest";
import path from "path";
import fs from "fs";

// Load db directly
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readCollection, writeCollection } = require("../../server/db.js");

describe("Node.js Backend & Persistent DB Layer", () => {
  it("should initialize and read all standard collections", () => {
    const products = readCollection("products");
    const categories = readCollection("categories");
    const orders = readCollection("orders");
    const banners = readCollection("banners");
    const settings = readCollection("settings");
    const coupons = readCollection("coupons");
    const inquiries = readCollection("inquiries");

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(Array.isArray(categories)).toBe(true);
    expect(Array.isArray(orders)).toBe(true);
    expect(banners).toBeDefined();
    expect(banners.hero).toBeDefined();
    expect(settings).toBeDefined();
    expect(settings.storeName).toBe("Industrial Edge");
    expect(Array.isArray(coupons)).toBe(true);
    expect(Array.isArray(inquiries)).toBe(true);
  });

  it("should allow creating, updating, and deleting a product", () => {
    const products = readCollection("products");
    const initialCount = products.length;

    const testProduct = {
      id: "test-item-999",
      name: "Test Industrial Edge Sensor",
      slug: "test-industrial-edge-sensor",
      category: "Industrial IoT",
      price: 149.99,
      status: "new",
      stock: 50,
      image: "/images/cat-laptop.jpg",
      createdAt: new Date().toISOString(),
    };

    // 1. Add
    products.unshift(testProduct);
    writeCollection("products", products);
    const updated1 = readCollection("products");
    expect(updated1.length).toBe(initialCount + 1);
    expect(updated1[0].id).toBe("test-item-999");

    // 2. Update
    updated1[0].price = 129.99;
    writeCollection("products", updated1);
    const updated2 = readCollection("products");
    expect(updated2[0].price).toBe(129.99);

    // 3. Delete
    const cleaned = updated2.filter((p: { id: string }) => p.id !== "test-item-999");
    writeCollection("products", cleaned);
    const updated3 = readCollection("products");
    expect(updated3.length).toBe(initialCount);
  });

  it("should support 'start dot to end dot' banner customizer updates", () => {
    const banners = readCollection("banners");
    expect(banners.hero).toBeDefined();

    const originalPrice = banners.hero.price;
    banners.hero.price = 499;
    writeCollection("banners", banners);

    const reloaded = readCollection("banners");
    expect(reloaded.hero.price).toBe(499);

    // Restore
    reloaded.hero.price = originalPrice;
    writeCollection("banners", reloaded);
  });

  it("should verify discount coupons correctly", () => {
    const coupons = readCollection("coupons");
    const edge20 = coupons.find((c: { code: string }) => c.code === "EDGE20");
    expect(edge20).toBeDefined();
    expect(edge20.discountType).toBe("percentage");
    expect(edge20.value).toBe(20);
  });

  it("should append customer orders with pending status and items", () => {
    const orders = readCollection("orders");
    const prevCount = orders.length;

    const newOrder = {
      id: "ORD-TEST-1234",
      customer: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "+92 300 0000000",
        address: "Test Street 1",
        city: "Karachi",
      },
      items: [{ id: "bs-1", name: "Acer Aspire Laptop", price: 529.75, qty: 1, image: "/test.jpg" }],
      subtotal: 529.75,
      shipping: 0,
      discount: 0,
      total: 529.75,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    writeCollection("orders", orders);

    const reloaded = readCollection("orders");
    expect(reloaded.length).toBe(prevCount + 1);
    expect(reloaded[0].id).toBe("ORD-TEST-1234");

    // Clean up test order
    const cleaned = reloaded.filter((o: { id: string }) => o.id !== "ORD-TEST-1234");
    writeCollection("orders", cleaned);
  });
});
