const express = require("express");
const router = express.Router();
const { readCollection, writeCollection } = require("../db");

// GET site settings
router.get("/", (req, res) => {
  const settings = readCollection("settings") || {};
  res.json({ success: true, data: settings });
});

// PUT update site settings
router.put("/", (req, res) => {
  const current = readCollection("settings") || {};
  const updated = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeCollection("settings", updated);
  res.json({ success: true, data: updated, message: "Settings updated successfully" });
});

module.exports = router;
