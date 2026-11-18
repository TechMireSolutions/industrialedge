const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
}

// GET all categories with live product count
router.get("/", async (req, res) => {
  try {
    const [categories, products] = await Promise.all([
      readCollection("categories"),
      readCollection("products"),
    ]);
    const cats = categories || [];
    const prods = products || [];
    const categoriesWithCounts = cats.map((cat) => {
      const count = prods.filter((p) => (p.category || "").toLowerCase() === (cat.name || "").toLowerCase()).length;
      return { ...cat, count };
    });
    res.json({ success: true, data: categoriesWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add new category
router.post("/", async (req, res) => {
  try {
    const categories = (await readCollection("categories")) || [];
    const { name, icon = "Cpu", image = "/images/cat-laptop.jpg", description = "" } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });
    const id = `cat-${slugify(name)}-${crypto.randomBytes(2).toString("hex")}`;
    const newCat = { id, name, slug: slugify(name), icon, image, description, count: 0, createdAt: new Date().toISOString() };
    categories.push(newCat);
    await writeCollection("categories", categories);
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update category
router.put("/:id", async (req, res) => {
  try {
    const categories = (await readCollection("categories")) || [];
    const index = categories.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: "Category not found" });
    const existing = categories[index];
    const oldName = existing.name;
    const newName = req.body.name || existing.name;
    categories[index] = { ...existing, ...req.body, id: existing.id, slug: slugify(newName), updatedAt: new Date().toISOString() };
    await writeCollection("categories", categories);
    // If category name changed, update products
    if (oldName !== newName) {
      const products = (await readCollection("products")) || [];
      let changed = false;
      products.forEach((p) => { if (p.category.toLowerCase() === oldName.toLowerCase()) { p.category = newName; changed = true; } });
      if (changed) await writeCollection("products", products);
    }
    res.json({ success: true, data: categories[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    let categories = (await readCollection("categories")) || [];
    if (!categories.some((c) => c.id === req.params.id)) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    categories = categories.filter((c) => c.id !== req.params.id);
    await writeCollection("categories", categories);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
