const express = require("express");
const router = express.Router();
const { readCollection, writeCollection } = require("../db");

// GET site settings
router.get("/", async (req, res) => {
  try {
    const settings = (await readCollection("settings")) || {};
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update site settings
router.put("/", async (req, res) => {
  try {
    const current = (await readCollection("settings")) || {};
    const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
    await writeCollection("settings", updated);
    res.json({ success: true, data: updated, message: "Settings updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
