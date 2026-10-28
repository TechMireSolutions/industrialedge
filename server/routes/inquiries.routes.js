const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// GET all inquiries
router.get("/", (req, res) => {
  const inquiries = readCollection("inquiries") || [];
  res.json({ success: true, total: inquiries.length, data: inquiries });
});

// POST submit contact inquiry (from customer)
router.post("/", (req, res) => {
  const inquiries = readCollection("inquiries") || [];
  const { name, email, phone = "", subject = "General Inquiry", message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required" });
  }

  const newInquiry = {
    id: `inq-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
    name,
    email,
    phone,
    subject,
    message,
    status: "unread",
    createdAt: new Date().toISOString(),
  };

  inquiries.unshift(newInquiry);
  writeCollection("inquiries", inquiries);

  res.status(201).json({ success: true, data: newInquiry, message: "Thank you! Your message has been received." });
});

// PATCH mark inquiry status (read / unread / replied)
router.patch("/:id", (req, res) => {
  const inquiries = readCollection("inquiries") || [];
  const index = inquiries.findIndex((i) => i.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Inquiry not found" });
  }

  inquiries[index] = {
    ...inquiries[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeCollection("inquiries", inquiries);
  res.json({ success: true, data: inquiries[index] });
});

// DELETE inquiry
router.delete("/:id", (req, res) => {
  let inquiries = readCollection("inquiries") || [];
  const exists = inquiries.some((i) => i.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ success: false, message: "Inquiry not found" });
  }

  inquiries = inquiries.filter((i) => i.id !== req.params.id);
  writeCollection("inquiries", inquiries);

  res.json({ success: true, message: "Inquiry deleted successfully" });
});

module.exports = router;
