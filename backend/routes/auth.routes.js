const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// In-memory active session store
const activeSessions = new Map();

// POST login (supports email or username for both admin and customer accounts)
router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body || {};
    const identifier = (email || username || "").trim().toLowerCase();
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Email/username and password are required" });
    }

    const users = (await readCollection("users")) || [];
    const user = users.find(
      (u) =>
        (u.email || "").toLowerCase() === identifier ||
        (u.name || "").toLowerCase() === identifier
    );

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
    const session = {
      userId: user.id,
      id: user.id,
      email: user.email,
      role: user.role || "customer",
      name: user.name,
      avatar: user.avatar || "/logo.png",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    activeSessions.set(token, session);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
        avatar: user.avatar || "/logo.png",
      },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST register (customer registration)
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body || {};
    const cleanName = (name || username || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const users = (await readCollection("users")) || [];
    if (users.some((u) => (u.email || "").toLowerCase() === cleanEmail)) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const newUser = {
      id: `user-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: password,
      role: "customer",
      avatar: "/logo.png",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeCollection("users", users);

    const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
    activeSessions.set(token, {
      userId: newUser.id,
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      avatar: newUser.avatar,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
      message: "Account created successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST logout
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.replace(/^Bearer\s+/i, "");
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

// GET verify session / me
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.replace(/^Bearer\s+/i, "");
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const session = activeSessions.get(token);
  if (session.expiresAt && session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return res.status(401).json({ success: false, message: "Session expired" });
  }
  res.json({ success: true, user: session });
});

// POST forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: "Email or username is required" });
    }
    res.json({
      success: true,
      message: "If an account exists for this email, password reset instructions have been sent.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST change password
router.post("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.replace(/^Bearer\s+/i, "");
    const session = token ? activeSessions.get(token) : null;

    const users = (await readCollection("users")) || [];
    const targetEmail = (email || session?.email || "").toLowerCase();
    const user = targetEmail
      ? users.find((u) => (u.email || "").toLowerCase() === targetEmail)
      : users.find((u) => u.role === "admin");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.passwordHash !== oldPassword) {
      return res.status(400).json({ success: false, message: "Current password does not match" });
    }

    user.passwordHash = newPassword;
    user.updatedAt = new Date().toISOString();
    await writeCollection("users", users);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
