const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

// GET all products with filtering, search & sorting
router.get("/", async (req, res) => {
  try {
    const products = (await readCollection("products")) || [];
    const { category, brand, search, status, featured, minPrice, maxPrice, minRating, sort, limit } = req.query;
    let filtered = [...products];

    if (category && category !== "All" && category !== "All categories") {
      filtered = filtered.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());
    }
    if (brand) {
      filtered = filtered.filter((p) => (p.brand || "").toLowerCase() === brand.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (featured === "trending") filtered = filtered.filter((p) => p.isTrending);
    else if (featured === "bestSeller") filtered = filtered.filter((p) => p.isBestSeller);
    else if (featured === "featuredTab") filtered = filtered.filter((p) => p.isFeaturedTab);

    if (minPrice !== undefined && minPrice !== "") {
      filtered = filtered.filter((p) => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      filtered = filtered.filter((p) => Number(p.price) <= Number(maxPrice));
    }
    if (minRating !== undefined && minRating !== "") {
      filtered = filtered.filter((p) => Number(p.rating || 0) >= Number(minRating));
    }

    if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    else if (sort === "rating") filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    if (limit) filtered = filtered.slice(0, parseInt(limit, 10));
    res.json({ success: true, total: filtered.length, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product by ID or slug
router.get("/:id", async (req, res) => {
  try {
    const products = (await readCollection("products")) || [];
    const product = products.find((p) => p.id === req.params.id || p.slug === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create new product
router.post("/", async (req, res) => {
  try {
    const products = (await readCollection("products")) || [];
    const {
      name, category, brand = "", price, originalPrice, status = "none", stock = 10,
      rating = 5.0, image, images = [], description = "", specs = {},
      isTrending = false, isBestSeller = false, isFeaturedTab = false,
    } = req.body;
    if (!name || price === undefined || price === "") {
      return res.status(400).json({ success: false, message: "Name and Price are required" });
    }
    const id = `prd-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;
    const slug = slugify(name);
    const img = image || "/images/cat-laptop.jpg";
    const parsedOriginal = originalPrice !== undefined && originalPrice !== "" && Number(originalPrice) > 0
      ? Number(originalPrice)
      : undefined;

    const newProduct = {
      id, name, slug, category: category || "Uncategorized", brand,
      price: Number(price), originalPrice: parsedOriginal,
      status, stock: Number(stock), rating: Number(rating), ratingCount: 1,
      image: img,
      images: Array.isArray(images) && images.length > 0 ? images : [img],
      description, specs: specs || {},
      isTrending: Boolean(isTrending), isBestSeller: Boolean(isBestSeller), isFeaturedTab: Boolean(isFeaturedTab),
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    await writeCollection("products", products);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const products = (await readCollection("products")) || [];
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: "Product not found" });
    const existing = products[index];

    let parsedOriginal = existing.originalPrice;
    if ("originalPrice" in req.body) {
      parsedOriginal = req.body.originalPrice !== null && req.body.originalPrice !== "" && Number(req.body.originalPrice) > 0
        ? Number(req.body.originalPrice)
        : undefined;
    }

    const updated = {
      ...existing,
      ...req.body,
      id: existing.id,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      originalPrice: parsedOriginal,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      updatedAt: new Date().toISOString(),
    };
    if (req.body.name && req.body.name !== existing.name) updated.slug = slugify(req.body.name);
    if (req.body.image && (!req.body.images || req.body.images.length === 0)) {
      updated.images = [req.body.image, ...(existing.images || []).filter((u) => u !== req.body.image && u !== existing.image)];
    }

    products[index] = updated;
    await writeCollection("products", products);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH quick stock update
router.patch("/:id/stock", async (req, res) => {
  try {
    const products = (await readCollection("products")) || [];
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (req.body.stock !== undefined) product.stock = Math.max(0, Number(req.body.stock));
    else if (req.body.toggleInStock !== undefined) product.stock = product.stock > 0 ? 0 : 15;
    product.updatedAt = new Date().toISOString();
    await writeCollection("products", products);
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    let products = (await readCollection("products")) || [];
    const exists = products.some((p) => p.id === req.params.id);
    if (!exists) return res.status(404).json({ success: false, message: "Product not found" });
    products = products.filter((p) => p.id !== req.params.id);
    await writeCollection("products", products);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
