const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { initDatabase } = require("./db");

// Initialize Database Collections
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Serve static uploads
const uploadsPath = path.resolve(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Industrial Edge Node.js API",
    version: "1.0.0",
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
