import { describe, it, expect } from "vitest";

// Load db directly from backend root
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readCollection, writeCollection } = require("../db.js");

describe("Node.js Backend & Persistent DB Layer", () => {
  it("should initialize and read all standard collections", async () => {
    const products = await readCollection("products");
    const categories = await readCollection("categories");
    const orders = await readCollection("orders");
    const banners = await readCollection("banners");
    const settings = await readCollection("settings");
    const coupons = await readCollection("coupons");
    const inquiries = await readCollection("inquiries");

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

  it("should allow creating, updating, and deleting a product", async () => {
    const products = (await readCollection("products")) || [];
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
    await writeCollection("products", products);
    const updated1 = (await readCollection("products")) || [];
    expect(updated1.length).toBe(initialCount + 1);
    expect(updated1[0].id).toBe("test-item-999");

    // 2. Update
    updated1[0].price = 129.99;
    await writeCollection("products", updated1);
    const updated2 = (await readCollection("products")) || [];
    expect(updated2[0].price).toBe(129.99);

    // 3. Delete
    const cleaned = updated2.filter((p: { id: string }) => p.id !== "test-item-999");
    await writeCollection("products", cleaned);
    const updated3 = (await readCollection("products")) || [];
    expect(updated3.length).toBe(initialCount);
  });

  it("should support 'start dot to end dot' banner customizer updates", async () => {
    const banners = await readCollection("banners");
    expect(banners.hero).toBeDefined();

    const originalPrice = banners.hero.price;
    banners.hero.price = 499;
    await writeCollection("banners", banners);

    const reloaded = await readCollection("banners");
    expect(reloaded.hero.price).toBe(499);

    // Restore
    reloaded.hero.price = originalPrice;
    await writeCollection("banners", reloaded);
  });

  it("should verify discount coupons correctly", async () => {
    const coupons = (await readCollection("coupons")) || [];
    const edge20 = coupons.find((c: { code: string }) => c.code === "EDGE20");
    expect(edge20).toBeDefined();
    expect(edge20.discountType).toBe("percentage");
    expect(edge20.value).toBe(20);
  });

  it("should append customer orders with pending status and items", async () => {
    const orders = (await readCollection("orders")) || [];
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
    await writeCollection("orders", orders);

    const reloaded = (await readCollection("orders")) || [];
    expect(reloaded.length).toBe(prevCount + 1);
    expect(reloaded[0].id).toBe("ORD-TEST-1234");

    // Clean up test order
    const cleaned = reloaded.filter((o: { id: string }) => o.id !== "ORD-TEST-1234");
    await writeCollection("orders", cleaned);
  });
});
