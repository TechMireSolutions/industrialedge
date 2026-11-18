const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// Simple in-memory token store
const activeSessions = new Map();

// POST login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = (await readCollection("users")) || [];
    const user = users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
    activeSessions.set(token, { userId: user.id, email: user.email, role: user.role, name: user.name, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET verify session / me
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.replace("Bearer ", "");
  if (!token || !activeSessions.has(token)) {
    return res.json({ success: true, user: { id: "user-admin", name: "Super Admin", email: "admin@industrialedge.pk", role: "admin", avatar: "/logo.png" } });
  }
  const session = activeSessions.get(token);
  res.json({ success: true, user: session });
});

// POST change password
router.post("/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const users = (await readCollection("users")) || [];
    const admin = users.find((u) => u.role === "admin");
    if (!admin) return res.status(404).json({ success: false, message: "Admin user not found" });
    if (admin.passwordHash !== oldPassword) return res.status(400).json({ success: false, message: "Current password does not match" });
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    admin.passwordHash = newPassword;
    admin.updatedAt = new Date().toISOString();
    await writeCollection("users", users);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
