const express = require("express");
const router = express.Router();
const { readCollection, writeCollection } = require("../db");

// GET all banner settings
router.get("/", async (req, res) => {
  try {
    const banners = (await readCollection("banners")) || {};
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update all banner settings
router.put("/", async (req, res) => {
  try {
    const current = (await readCollection("banners")) || {};
    const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
    await writeCollection("banners", updated);
    res.json({ success: true, data: updated, message: "Banners updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update specific banner section (e.g. /api/banners/hero)
router.put("/:section", async (req, res) => {
  try {
    const { section } = req.params;
    const current = (await readCollection("banners")) || {};
    if (!current[section]) current[section] = {};
    current[section] = { ...current[section], ...req.body };
    current.updatedAt = new Date().toISOString();
    await writeCollection("banners", current);
    res.json({ success: true, data: current[section], message: `${section} updated successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
