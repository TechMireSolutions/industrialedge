const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// GET all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = (await readCollection("coupons")) || [];
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST verify coupon for cart
router.post("/verify", async (req, res) => {
  try {
    const code = req.body.code;
    const cartTotal = Number(req.body.cartTotal ?? req.body.subtotal ?? 0);
    if (!code) return res.status(400).json({ success: false, message: "Coupon code is required" });
    const coupons = (await readCollection("coupons")) || [];
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!coupon) return res.status(404).json({ success: false, message: "Invalid or expired coupon code" });
    if (coupon.minSpend && cartTotal < coupon.minSpend) {
      return res.status(400).json({ success: false, message: `Minimum order amount of $${coupon.minSpend} required for this coupon` });
    }
    let discountAmount = coupon.discountType === "percentage"
      ? (cartTotal * coupon.value) / 100
      : Math.min(cartTotal, coupon.value);
    res.json({ success: true, data: { code: coupon.code, discountType: coupon.discountType, value: coupon.value, discountAmount: Number(discountAmount.toFixed(2)) }, message: "Coupon applied successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create coupon
router.post("/", async (req, res) => {
  try {
    const coupons = (await readCollection("coupons")) || [];
    const { code, discountType = "percentage", value, minSpend = 0, maxUses = 100, expiresAt } = req.body;
    if (!code || value === undefined) return res.status(400).json({ success: false, message: "Coupon code and discount value are required" });
    const cleanCode = code.trim().toUpperCase();
    if (coupons.some((c) => c.code === cleanCode)) return res.status(400).json({ success: false, message: "A coupon with this code already exists" });
    const newCoupon = { id: `cp-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`, code: cleanCode, discountType, value: Number(value), minSpend: Number(minSpend), maxUses: Number(maxUses), usageCount: 0, expiresAt: expiresAt || "2027-12-31", active: true, createdAt: new Date().toISOString() };
    coupons.unshift(newCoupon);
    await writeCollection("coupons", coupons);
    res.status(201).json({ success: true, data: newCoupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update coupon
router.put("/:id", async (req, res) => {
  try {
    const coupons = (await readCollection("coupons")) || [];
    const index = coupons.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: "Coupon not found" });
    const existing = coupons[index];
    coupons[index] = { ...existing, ...req.body, id: existing.id, code: req.body.code ? req.body.code.trim().toUpperCase() : existing.code, value: req.body.value !== undefined ? Number(req.body.value) : existing.value, minSpend: req.body.minSpend !== undefined ? Number(req.body.minSpend) : existing.minSpend, updatedAt: new Date().toISOString() };
    await writeCollection("coupons", coupons);
    res.json({ success: true, data: coupons[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE coupon
router.delete("/:id", async (req, res) => {
  try {
    let coupons = (await readCollection("coupons")) || [];
    if (!coupons.some((c) => c.id === req.params.id)) return res.status(404).json({ success: false, message: "Coupon not found" });
    coupons = coupons.filter((c) => c.id !== req.params.id);
    await writeCollection("coupons", coupons);
    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
