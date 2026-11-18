const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// GET all inquiries
router.get("/", async (req, res) => {
  try {
    const inquiries = (await readCollection("inquiries")) || [];
    res.json({ success: true, total: inquiries.length, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST submit contact inquiry
router.post("/", async (req, res) => {
  try {
    const inquiries = (await readCollection("inquiries")) || [];
    const { name, email, phone = "", subject = "General Inquiry", message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    const newInquiry = { id: `inq-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`, name, email, phone, subject, message, status: "unread", createdAt: new Date().toISOString() };
    inquiries.unshift(newInquiry);
    await writeCollection("inquiries", inquiries);
    res.status(201).json({ success: true, data: newInquiry, message: "Thank you! Your message has been received." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH mark inquiry status
router.patch("/:id", async (req, res) => {
  try {
    const inquiries = (await readCollection("inquiries")) || [];
    const index = inquiries.findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: "Inquiry not found" });
    inquiries[index] = { ...inquiries[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeCollection("inquiries", inquiries);
    res.json({ success: true, data: inquiries[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE inquiry
router.delete("/:id", async (req, res) => {
  try {
    let inquiries = (await readCollection("inquiries")) || [];
    if (!inquiries.some((i) => i.id === req.params.id)) return res.status(404).json({ success: false, message: "Inquiry not found" });
    inquiries = inquiries.filter((i) => i.id !== req.params.id);
    await writeCollection("inquiries", inquiries);
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
