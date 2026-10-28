const express = require("express");
const router = express.Router();
const { readCollection, writeCollection } = require("../db");

// GET all banner settings
router.get("/", (req, res) => {
  const banners = readCollection("banners") || {};
  res.json({ success: true, data: banners });
});

// PUT update all or specific banner settings
router.put("/", (req, res) => {
  const current = readCollection("banners") || {};
  const updated = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeCollection("banners", updated);
  res.json({ success: true, data: updated, message: "Banners updated successfully" });
});

// PUT update specific banner section (e.g. /api/banners/hero)
router.put("/:section", (req, res) => {
  const { section } = req.params;
  const current = readCollection("banners") || {};

  if (!current[section]) {
    current[section] = {};
  }

  current[section] = {
    ...current[section],
    ...req.body,
  };
  current.updatedAt = new Date().toISOString();

  writeCollection("banners", current);
  res.json({ success: true, data: current[section], message: `${section} updated successfully` });
});

module.exports = router;
