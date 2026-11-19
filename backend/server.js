// Load environment variables
try {
  require("dotenv").config();
} catch {}
if (process.loadEnvFile && typeof process.loadEnvFile === "function") {
  const fs = require("fs");
  const path = require("path");
  const envPath = path.resolve(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    try {
      process.loadEnvFile(envPath);
    } catch {}
  }
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { initDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Initialize DB (async — connects MySQL, falls back to JSON if unavailable)
initDatabase().catch((err) => console.error("DB init error:", err.message));

// Enable CORS for frontend
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3005",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3005",
  "https://industrialedgev2.techmiresolutions.com",
  "http://industrialedgev2.techmiresolutions.com",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Next.js server-side fetch, mobile apps, curl)
      if (!origin) return callback(null, true);
      if (
        FRONTEND_URL === "*" ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".techmiresolutions.com") ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow to avoid dropping frontend connections
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Serve static uploads
const uploadsPath = path.resolve(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// Also serve frontend uploads if present
const frontendUploadsPath = path.resolve(__dirname, "../frontend/public/uploads");
if (fs.existsSync(frontendUploadsPath)) {
  app.use("/uploads", express.static(frontendUploadsPath));
}

// API Health Check
app.get("/api/health", (req, res) => {
  const { isDbReady } = require("./db");
  res.json({
    status: "ok",
    service: "Industrial Edge Node.js API",
    version: "1.0.0",
    database: isDbReady ? "mysql" : "json-fallback",
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/products", require("./routes/products.routes"));
app.use("/api/categories", require("./routes/categories.routes"));
app.use("/api/orders", require("./routes/orders.routes"));
app.use("/api/banners", require("./routes/banners.routes"));
app.use("/api/settings", require("./routes/settings.routes"));
app.use("/api/coupons", require("./routes/coupons.routes"));
app.use("/api/inquiries", require("./routes/inquiries.routes"));
app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/stats", require("./routes/stats.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

// Root route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Industrial Edge Backend</title></head>
      <body style="font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
        <h1 style="color: #f97316;">⚡ Industrial Edge - Node.js Backend API</h1>
        <p style="color: #94a3b8;">Server is live and running on port ${PORT}</p>
        <div style="margin-top: 24px;">
          <a href="/api/health" style="color: #38bdf8; margin: 0 10px;">Health Check</a>
          <a href="/api/products" style="color: #38bdf8; margin: 0 10px;">Products API</a>
          <a href="/api/orders" style="color: #38bdf8; margin: 0 10px;">Orders API</a>
          <a href="/api/stats" style="color: #38bdf8; margin: 0 10px;">Dashboard Stats API</a>
        </div>
      </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Industrial Edge Node.js Backend Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🛒 Products: http://localhost:${PORT}/api/products`);
    console.log(`=================================================\n`);
  });
}

module.exports = app;
