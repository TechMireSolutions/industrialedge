// Load environment variables
try { require("dotenv").config(); } catch {}

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const DATA_DIR = path.resolve(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── MySQL Pool ───────────────────────────────────────────────────────────────
let pool = null;
let dbReady = false; // true once MySQL is confirmed reachable

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "remotemysql.com",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000,
    });
  }
  return pool;
}

// Test connection on startup
async function testConnection() {
  if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.warn("⚠️  MySQL credentials not set — using JSON file fallback.");
    return false;
  }
  try {
    const conn = await getPool().getConnection();
    conn.release();
    console.log("✅ MySQL connected to", process.env.DB_HOST);
    return true;
  } catch (err) {
    console.warn("⚠️  MySQL connection failed:", err.message);
    console.warn("   → Falling back to local JSON files.");
    return false;
  }
}

// ─── SQL Table Schemas ────────────────────────────────────────────────────────
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS ie_settings (
  id INT PRIMARY KEY DEFAULT 1,
  data JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ie_banners (
  id INT PRIMARY KEY DEFAULT 1,
  data JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ie_categories (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ie_products (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ie_orders (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ie_coupons (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ie_inquiries (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ie_users (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Collection → table map for multi-row collections
const MULTI_ROW = ["categories", "products", "orders", "coupons", "inquiries", "users"];
// Single-row collections stored as one JSON blob
const SINGLE_ROW = ["settings", "banners"];

function getTable(collection) {
  return `ie_${collection}`;
}

// ─── MySQL CRUD helpers ───────────────────────────────────────────────────────
async function mysqlRead(collection) {
  const db = getPool();
  const table = getTable(collection);

  if (SINGLE_ROW.includes(collection)) {
    const [rows] = await db.query(`SELECT data FROM ${table} WHERE id = 1`);
    if (rows.length === 0) return null;
    return typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
  }

  // multi-row
  const [rows] = await db.query(`SELECT data FROM ${table} ORDER BY created_at DESC`);
  return rows.map((r) => (typeof r.data === "string" ? JSON.parse(r.data) : r.data));
}

async function mysqlWrite(collection, data) {
  const db = getPool();
  const table = getTable(collection);

  if (SINGLE_ROW.includes(collection)) {
    await db.query(
      `INSERT INTO ${table} (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(data)]
    );
    return true;
  }

  // multi-row: replace all rows for the collection
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(`DELETE FROM ${table}`);
    if (Array.isArray(data) && data.length > 0) {
      const values = data.map((item) => [item.id, JSON.stringify(item)]);
      await conn.query(`INSERT INTO ${table} (id, data) VALUES ?`, [values]);
    }
    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// ─── JSON File helpers (fallback) ─────────────────────────────────────────────
function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function fileRead(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function fileWrite(collection, data) {
  const filePath = getFilePath(collection);
  const tempPath = `${filePath}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}:`, err);
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
    return false;
  }
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const INITIAL_SETTINGS = {
  storeName: "Industrial Edge",
  storeTagline: "Premium Technology & Industrial Computing",
  logo: "/logo.png",
  supportPhone: "+92 332 2316225",
  supportEmail: "info@industrialedge.pk",
  address: "Suite M-107 Odeon Center, Regal Chowk, Saddar, Karachi, Pakistan",
  workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
  currency: "Rs.",
  currencyCode: "PKR",
  freeShippingThreshold: 25000,
  flatShippingRate: 500,
  taxRate: 5,
  announcementBar: {
    enabled: true,
    text: "Flash Sale: Get up to 50% OFF on Selected Industrial & Gaming Gear! Free shipping across Pakistan on orders over Rs. 25,000",
    linkText: "Shop Now",
    linkUrl: "/shop",
  },
  socialLinks: {
    facebook: "https://www.facebook.com/people/Industrial-Edge/61575052006846/",
    twitter: "https://twitter.com",
    instagram: "https://www.instagram.com/industrial_edge.pk/",
    linkedin: "https://www.linkedin.com/company/industrial-edge1/",
    youtube: "https://youtube.com",
  },
  copyrightText: "© 2026 IndustrialEdge.pk. All rights reserved.",
  aboutText: "Industrial Edge is Pakistan's leading technology provider for high-performance enterprise systems, gaming rigs, industrial IoT hardware, and premium consumer electronics.",
};

const INITIAL_BANNERS = {
  hero: {
    brandTag: "Price",
    price: 126000,
    subtitle: "Let power flow through you",
    titleLine1: "DELL G5",
    titleLine2: "GAMING LAPTOP",
    image: "/images/dell-g5-hero.png",
    backgroundImage: "/images/hero-bg-exact.webp",
    ctaLink: "/product/hero-dell-g5",
    badge: "BEST DEAL",
  },
  heroSideProducts: [
    {
      id: "hero-airpods-max",
      name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
      category: "Headphone",
      categoryLink: "/shop?cat=Headphone",
      price: 153700,
      image: "/images/product-airpods-max.webp",
      description: "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise.",
    },
    {
      id: "hero-fire-tv",
      name: 'Amazon Fire TV 50" 4-Series 4K UHD Smart TV',
      category: "TV & Computer Screen",
      categoryLink: "/shop?cat=TV+%26+Computer+Screen",
      price: 84000,
      image: "/images/product-fire-tv.webp",
      description: "Brilliant 4K entertainment - Bring movies and shows to life with support for vivid 4K Ultra HD and HDR 10.",
    },
  ],
  gameConsoleBanner: {
    title: "GameConsole Destiny Special Edition",
    originalPrice: "Rs. 99,000",
    currentPrice: "Rs. 79,900",
    saleBadge: "SALE 20%",
    image: "/images/img-prd8.webp",
    backgroundImage: "/images/bg2-home01.webp",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=TV+%26+Computer+Screen",
  },
  dualPromoBanner: {
    badgeText: "SAVE Rs. 22,400",
    title: "Shop and SAVE BIG",
    titleHighlight: "SAVE BIG",
    subtitle: "on the hottest professional 4K camera gear",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=Camera+%26+Video",
    image1: "/images/img-prd16.webp",
    image2: "/images/img-prd15.webp",
  },
};

const INITIAL_CATEGORIES = [
  { id: "cat-apple", name: "Apple products", slug: "apple-products", image: "/images/cat-imac.jpg", icon: "Smartphone", count: 18 },
  { id: "cat-audio", name: "Audio Equipments", slug: "audio-equipments", image: "/images/cat-speakers.jpg", icon: "Speaker", count: 12 },
  { id: "cat-camera", name: "Camera & Video", slug: "camera-video", image: "/images/cat-camera.jpg", icon: "Camera", count: 9 },
  { id: "cat-computers", name: "Computers & Accessories", slug: "computers-accessories", image: "/images/cat-pc-tower.jpg", icon: "Cpu", count: 24 },
  { id: "cat-furniture", name: "Game & Room Furniture", slug: "game-room-furniture", image: "/images/cat-gaming-chair.jpg", icon: "Armchair", count: 7 },
  { id: "cat-gaming", name: "Gaming Accessories", slug: "gaming-accessories", image: "/images/cat-gamepad.jpg", icon: "Gamepad2", count: 16 },
  { id: "cat-headphone", name: "Headphone", slug: "headphone", image: "/images/cat-headphones.jpg", icon: "Headphones", count: 14 },
  { id: "cat-laptop", name: "Laptop & Tablet", slug: "laptop-tablet", image: "/images/cat-laptop.jpg", icon: "Laptop", count: 20 },
  { id: "cat-smartwatch", name: "Smartwatch", slug: "smartwatch", image: "/images/cat-imac.jpg", icon: "Watch", count: 11 },
  { id: "cat-tv", name: "TV & Computer Screen", slug: "tv-computer-screen", image: "/images/img-prd8.webp", icon: "Tv", count: 15 },
];

const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Super Admin",
    email: "admin@industrialedge.pk",
    passwordHash: "admin123",
    role: "admin",
    avatar: "/images/apple-imac.jpg",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const INITIAL_COUPONS = [
  { id: "cp-1", code: "EDGE20", discountType: "percentage", value: 20, minSpend: 20000, active: true, usageCount: 45, maxUses: 200, expiresAt: "2027-12-31" },
  { id: "cp-2", code: "WELCOME10", discountType: "percentage", value: 10, minSpend: 10000, active: true, usageCount: 112, maxUses: 500, expiresAt: "2027-12-31" },
  { id: "cp-3", code: "FREESHIP", discountType: "fixed", value: 500, minSpend: 15000, active: true, usageCount: 68, maxUses: 1000, expiresAt: "2027-12-31" },
];

const INITIAL_INQUIRIES = [
  {
    id: "inq-1",
    name: "Bilal Raza",
    email: "bilal.raza@automation.pk",
    phone: "+92 301 5566778",
    subject: "Bulk inquiry for 10x Dell G5 Laptops",
    message: "Hi Industrial Edge team, we are setting up a machine vision engineering lab and need 10 units of the Dell G5 laptop.",
    status: "unread",
    createdAt: "2026-10-28T09:10:00.000Z",
  },
];

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Read a collection. Returns the data or null on error.
 * Uses MySQL if connected, otherwise JSON file fallback.
 */
async function readCollection(collection) {
  if (dbReady) {
    try {
      return await mysqlRead(collection);
    } catch (err) {
      console.error(`MySQL read failed for ${collection}:`, err.message, "→ falling back to JSON");
    }
  }
  return fileRead(collection);
}

/**
 * Write a collection.
 * Uses MySQL if connected, otherwise JSON file fallback.
 * Also always writes JSON file as a local backup.
 */
async function writeCollection(collection, data) {
  // Always keep local JSON in sync as a backup
  fileWrite(collection, data);

  if (dbReady) {
    try {
      await mysqlWrite(collection, data);
      return true;
    } catch (err) {
      console.error(`MySQL write failed for ${collection}:`, err.message, "→ data saved to JSON fallback");
    }
  }
  return true;
}

// ─── Sync JSON → MySQL (seed on first connect) ───────────────────────────────
async function seedFromJson(collection, initialData) {
  const db = getPool();
  const table = getTable(collection);

  if (SINGLE_ROW.includes(collection)) {
    // Check if row exists
    const [rows] = await db.query(`SELECT id FROM ${table} WHERE id = 1`);
    if (rows.length === 0) {
      // Try loading from JSON file first, then fall back to initial data
      const fileData = fileRead(collection);
      const seedData = fileData || initialData;
      await db.query(`INSERT INTO ${table} (id, data) VALUES (1, ?)`, [JSON.stringify(seedData)]);
      console.log(`  ✓ Seeded ${collection}`);
    }
    return;
  }

  // multi-row: check if table is empty
  const [rows] = await db.query(`SELECT COUNT(*) as cnt FROM ${table}`);
  if (rows[0].cnt === 0) {
    const fileData = fileRead(collection);
    const seedData = Array.isArray(fileData) && fileData.length > 0 ? fileData : initialData;
    if (seedData && seedData.length > 0) {
      const values = seedData.map((item) => [item.id, JSON.stringify(item)]);
      await db.query(`INSERT INTO ${table} (id, data) VALUES ?`, [values]);
      console.log(`  ✓ Seeded ${collection} (${seedData.length} rows)`);
    }
  }
}

// ─── Database Initialization ──────────────────────────────────────────────────
async function initDatabase() {
  // Always ensure JSON files exist as a baseline
  function ensureJsonFile(collection, initialData) {
    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), "utf8");
    }
  }

  ensureJsonFile("settings", INITIAL_SETTINGS);
  ensureJsonFile("banners", INITIAL_BANNERS);
  ensureJsonFile("categories", INITIAL_CATEGORIES);
  ensureJsonFile("coupons", INITIAL_COUPONS);
  ensureJsonFile("inquiries", INITIAL_INQUIRIES);
  ensureJsonFile("users", INITIAL_USERS);

  // Try MySQL
  dbReady = await testConnection();

  if (dbReady) {
    try {
      const db = getPool();
      // Create tables (safe — uses IF NOT EXISTS)
      const statements = CREATE_TABLES_SQL.split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const sql of statements) {
        await db.query(sql);
      }
      console.log("📦 MySQL tables ready.");

      // Seed each collection from JSON files if tables are empty
      console.log("🌱 Checking seed data...");
      await seedFromJson("settings", INITIAL_SETTINGS);
      await seedFromJson("banners", INITIAL_BANNERS);
      await seedFromJson("categories", INITIAL_CATEGORIES);
      await seedFromJson("coupons", INITIAL_COUPONS);
      await seedFromJson("inquiries", INITIAL_INQUIRIES);
      await seedFromJson("users", INITIAL_USERS);
      // products and orders are seeded from their JSON files if they exist
      const productsSeed = fileRead("products") || [];
      const ordersSeed = fileRead("orders") || [];
      await seedFromJson("products", productsSeed);
      await seedFromJson("orders", ordersSeed);

      console.log("✅ Database initialization complete.");
    } catch (err) {
      console.error("❌ MySQL init error:", err.message);
      console.warn("   → Falling back to JSON file storage.");
      dbReady = false;
    }
  }
}

module.exports = {
  readCollection,
  writeCollection,
  initDatabase,
  getPool,
  get isDbReady() { return dbReady; },
};
