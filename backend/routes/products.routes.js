const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// Helper to slugify product name
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// GET all products with filtering & search
router.get("/", (req, res) => {
  const products = readCollection("products") || [];
  const { category, search, status, featured, limit } = req.query;

  let filtered = [...products];

  if (category && category !== "All" && category !== "All categories") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (featured === "trending") {
    filtered = filtered.filter((p) => p.isTrending);
  } else if (featured === "bestSeller") {
    filtered = filtered.filter((p) => p.isBestSeller);
  } else if (featured === "featuredTab") {
    filtered = filtered.filter((p) => p.isFeaturedTab);
  }

  if (limit) {
    filtered = filtered.slice(0, parseInt(limit, 10));
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
});

// GET single product by ID or slug
router.get("/:id", (req, res) => {
  const products = readCollection("products") || [];
  const product = products.find(
    (p) => p.id === req.params.id || p.slug === req.params.id
  );

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, data: product });
});

// POST create new product
router.post("/", (req, res) => {
  const products = readCollection("products") || [];
  const {
    name,
    category,
    price,
    originalPrice,
    status = "none",
    stock = 10,
    rating = 5.0,
    image,
    images = [],
    description = "",
    specs = {},
    isTrending = false,
    isBestSeller = false,
    isFeaturedTab = false,
  } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: "Name and Price are required" });
  }

  const id = `prd-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;
  const slug = slugify(name);

  const newProduct = {
    id,
    name,
    slug,
    category: category || "Uncategorized",
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    status,
    stock: Number(stock),
    rating: Number(rating),
    ratingCount: 1,
    image: image || "/images/cat-laptop.jpg",
    images: images.length > 0 ? images : [image || "/images/cat-laptop.jpg"],
    description,
    specs: specs || {},
    isTrending: Boolean(isTrending),
    isBestSeller: Boolean(isBestSeller),
    isFeaturedTab: Boolean(isFeaturedTab),
    createdAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  writeCollection("products", products);

  res.status(201).json({ success: true, data: newProduct });
});

// PUT update product
router.put("/:id", (req, res) => {
  const products = readCollection("products") || [];
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const existing = products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent ID overwrite
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : existing.originalPrice,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
    updatedAt: new Date().toISOString(),
  };

  if (req.body.name && req.body.name !== existing.name) {
    updated.slug = slugify(req.body.name);
  }

  products[index] = updated;
  writeCollection("products", products);

  res.json({ success: true, data: updated });
});

// PATCH quick stock update
router.patch("/:id/stock", (req, res) => {
  const products = readCollection("products") || [];
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  if (req.body.stock !== undefined) {
    product.stock = Number(req.body.stock);
  } else if (req.body.toggleInStock !== undefined) {
    product.stock = product.stock > 0 ? 0 : 15;
  }

  writeCollection("products", products);
  res.json({ success: true, data: product });
});

// DELETE product
router.delete("/:id", (req, res) => {
  let products = readCollection("products") || [];
  const exists = products.some((p) => p.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  products = products.filter((p) => p.id !== req.params.id);
  writeCollection("products", products);

  res.json({ success: true, message: "Product deleted successfully" });
});

module.exports = router;
