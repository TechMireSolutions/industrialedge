const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// Helper to slugify
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

// GET all categories with real product count
router.get("/", (req, res) => {
  const categories = readCollection("categories") || [];
  const products = readCollection("products") || [];

  // Compute live count for each category
  const categoriesWithCounts = categories.map((cat) => {
    const count = products.filter(
      (p) => p.category.toLowerCase() === cat.name.toLowerCase()
    ).length;
    return { ...cat, count: count > 0 ? count : (cat.count || 0) };
  });

  res.json({ success: true, data: categoriesWithCounts });
});

// POST add new category
router.post("/", (req, res) => {
  const categories = readCollection("categories") || [];
  const { name, icon = "Cpu", image = "/images/cat-laptop.jpg", description = "" } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Category name is required" });
  }

  const id = `cat-${slugify(name)}-${crypto.randomBytes(2).toString("hex")}`;
  const newCat = {
    id,
    name,
    slug: slugify(name),
    icon,
    image,
    description,
    count: 0,
    createdAt: new Date().toISOString(),
  };

  categories.push(newCat);
  writeCollection("categories", categories);

  res.status(201).json({ success: true, data: newCat });
});

// PUT update category
router.put("/:id", (req, res) => {
  const categories = readCollection("categories") || [];
  const index = categories.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const existing = categories[index];
  const oldName = existing.name;
  const newName = req.body.name || existing.name;

  categories[index] = {
    ...existing,
    ...req.body,
    id: existing.id,
    slug: slugify(newName),
    updatedAt: new Date().toISOString(),
  };

  writeCollection("categories", categories);

  // If category name changed, update products in that category
  if (oldName !== newName) {
    const products = readCollection("products") || [];
    let updatedProducts = false;
    products.forEach((p) => {
      if (p.category.toLowerCase() === oldName.toLowerCase()) {
        p.category = newName;
        updatedProducts = true;
      }
    });
    if (updatedProducts) writeCollection("products", products);
  }

  res.json({ success: true, data: categories[index] });
});

// DELETE category
router.delete("/:id", (req, res) => {
  let categories = readCollection("categories") || [];
  const exists = categories.some((c) => c.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  categories = categories.filter((c) => c.id !== req.params.id);
  writeCollection("categories", categories);

  res.json({ success: true, message: "Category deleted successfully" });
});

module.exports = router;
