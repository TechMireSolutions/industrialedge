const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// GET all coupons
router.get("/", (req, res) => {
  const coupons = readCollection("coupons") || [];
  res.json({ success: true, data: coupons });
});

// POST verify coupon for cart
router.post("/verify", (req, res) => {
  const { code, cartTotal = 0 } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: "Coupon code is required" });
  }

  const coupons = readCollection("coupons") || [];
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
  );

  if (!coupon) {
    return res.status(404).json({ success: false, message: "Invalid or expired coupon code" });
  }

  if (coupon.minSpend && cartTotal < coupon.minSpend) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount of $${coupon.minSpend} required for this coupon`,
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (cartTotal * coupon.value) / 100;
  } else {
    discountAmount = Math.min(cartTotal, coupon.value);
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discountAmount: Number(discountAmount.toFixed(2)),
    },
    message: "Coupon applied successfully!",
  });
});

// POST create coupon
router.post("/", (req, res) => {
  const coupons = readCollection("coupons") || [];
  const { code, discountType = "percentage", value, minSpend = 0, maxUses = 100, expiresAt } = req.body;

  if (!code || value === undefined) {
    return res.status(400).json({ success: false, message: "Coupon code and discount value are required" });
  }

  const cleanCode = code.trim().toUpperCase();
  if (coupons.some((c) => c.code === cleanCode)) {
    return res.status(400).json({ success: false, message: "A coupon with this code already exists" });
  }

  const newCoupon = {
    id: `cp-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
    code: cleanCode,
    discountType,
    value: Number(value),
    minSpend: Number(minSpend),
    maxUses: Number(maxUses),
    usageCount: 0,
    expiresAt: expiresAt || "2027-12-31",
    active: true,
    createdAt: new Date().toISOString(),
  };

  coupons.unshift(newCoupon);
  writeCollection("coupons", coupons);

  res.status(201).json({ success: true, data: newCoupon });
});

// PUT update coupon
router.put("/:id", (req, res) => {
  const coupons = readCollection("coupons") || [];
  const index = coupons.findIndex((c) => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Coupon not found" });
  }

  const existing = coupons[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    code: req.body.code ? req.body.code.trim().toUpperCase() : existing.code,
    value: req.body.value !== undefined ? Number(req.body.value) : existing.value,
    minSpend: req.body.minSpend !== undefined ? Number(req.body.minSpend) : existing.minSpend,
    updatedAt: new Date().toISOString(),
  };

  coupons[index] = updated;
  writeCollection("coupons", coupons);

  res.json({ success: true, data: updated });
});

// DELETE coupon
router.delete("/:id", (req, res) => {
  let coupons = readCollection("coupons") || [];
  const exists = coupons.some((c) => c.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ success: false, message: "Coupon not found" });
  }

  coupons = coupons.filter((c) => c.id !== req.params.id);
  writeCollection("coupons", coupons);

  res.json({ success: true, message: "Coupon deleted successfully" });
});

module.exports = router;
