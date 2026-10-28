const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const INITIAL_SETTINGS = {
  storeName: "Industrial Edge",
  storeTagline: "Premium Technology & Industrial Computing",
  logo: "/logo.png",
  supportPhone: "+92 300 1234567",
  supportEmail: "support@industrialedge.pk",
  address: "Industrial Area, Phase 2, Karachi, Pakistan",
  workingHours: "Mon - Sat: 9:00 AM - 8:00 PM",
  currency: "$",
  currencyCode: "USD",
  freeShippingThreshold: 150,
  taxRate: 5,
  announcementBar: {
    enabled: true,
    text: "⚡ Flash Sale: Get up to 50% OFF on Selected Industrial & Gaming Gear! Free shipping on orders over $150",
    linkText: "Shop Now",
    linkUrl: "/shop",
  },
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  copyrightText: "© 2026 IndustrialEdge.pk. All rights reserved.",
  aboutText: "Industrial Edge is Pakistan's leading technology provider for high-performance enterprise systems, gaming rigs, industrial IoT hardware, and premium consumer electronics.",
};

const INITIAL_BANNERS = {
  hero: {
    brandTag: "Price",
    price: 450,
    subtitle: "Let power flow through you",
    titleLine1: "DELL G5",
    titleLine2: "GAMING LAPTOP",
    image: "/images/dell-g5-hero.png",
    backgroundImage: "/images/hero-bg-exact.webp",
    ctaLink: "/shop?cat=Laptop+%26+Tablet",
    badge: "BEST DEAL",
  },
  heroSideProducts: [
    {
      id: "hero-airpods-max",
      name: "Apple AirPods Max Wireless Over-Ear Headphones – Green",
      category: "AirPods",
      categoryLink: "/shop?cat=Headphone",
      price: 549.0,
      image: "/images/product-airpods-max.webp",
      description: "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise.",
    },
    {
      id: "hero-fire-tv",
      name: 'Amazon Fire TV 50" 4-Series 4K UHD smart TV',
      category: "Apple products",
      categoryLink: "/shop?cat=TV+%26+Computer+Screen",
      price: 299.99,
      image: "/images/product-fire-tv.webp",
      description: "Brilliant 4K entertainment - Bring movies and shows to life with support for vivid 4K Ultra HD and HDR 10.",
    },
  ],
  gameConsoleBanner: {
    title: "GameConsole Destiny Special Edition",
    originalPrice: "$99.000",
    currentPrice: "$80.000",
    saleBadge: "SALE 70%",
    image: "/images/img-prd8.webp",
    backgroundImage: "/images/bg2-home01.webp",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=TV+%26+Computer+Screen",
  },
  dualPromoBanner: {
    badgeText: "SAVE $80.00",
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

const INITIAL_PRODUCTS = [
  {
    id: "tr-1",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Gold (Copy)",
    slug: "apple-iphone-11-pro-max-64gb-gold",
    category: "Apple products",
    price: 475.0,
    originalPrice: 599.0,
    status: "discount",
    stock: 25,
    rating: 4.8,
    ratingCount: 38,
    image: "/images/o_4901-540x540.webp",
    images: ["/images/o_4901-540x540.webp"],
    description: "Fully unlocked and compatible with any carrier of choice. Stunning 6.5-inch Super Retina XDR OLED display with A13 Bionic chip.",
    specs: { Screen: "6.5-inch Super Retina XDR", Storage: "64GB", Color: "Gold", Battery: "3969 mAh" },
    isTrending: true,
    isBestSeller: false,
    isFeaturedTab: true,
    createdAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: "tr-7",
    name: "Canon Mirrorless Camera [EOS M6 Mark II] for Vlogging + EF-M 15-45mm",
    slug: "canon-eos-m6-mark-ii",
    category: "Camera & Video",
    price: 898.0,
    originalPrice: 1598.0,
    status: "discount",
    stock: 12,
    rating: 4.9,
    ratingCount: 52,
    image: "/images/o_3801-540x540.webp",
    images: ["/images/o_3801-540x540.webp"],
    description: "High image quality with 32.5 Megapixel CMOS (APS-C) sensor, high-speed continuous shooting up to 14 fps with Dual Pixel CMOS AF.",
    specs: { Sensor: "32.5 MP APS-C", Video: "4K UHD 30p", Connectivity: "Wi-Fi & Bluetooth", Mount: "EF-M" },
    isTrending: true,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-02T11:00:00.000Z",
  },
  {
    id: "tr-2",
    name: "Apple iPhone 11 Pro Max, US Version, 64GB, Space Gray",
    slug: "apple-iphone-11-pro-max-space-gray",
    category: "Apple products",
    price: 475.0,
    originalPrice: 620.0,
    status: "none",
    stock: 18,
    rating: 4.7,
    ratingCount: 29,
    image: "/images/o_4901-540x540.webp",
    images: ["/images/o_4901-540x540.webp"],
    description: "Triple-camera system with 12MP Ultra Wide, Wide, and Telephoto cameras; Night mode and 4K video up to 60fps.",
    specs: { Screen: "6.5-inch OLED", Storage: "64GB", Color: "Space Gray", Processor: "A13 Bionic" },
    isTrending: true,
    isBestSeller: false,
    isFeaturedTab: false,
    createdAt: "2026-10-03T09:30:00.000Z",
  },
  {
    id: "tr-8",
    name: "Canon EOS M50 Mark II Mirrorless Camera with 15-45mm Lens",
    slug: "canon-eos-m50-mark-ii",
    category: "Camera & Video",
    price: 519.0,
    originalPrice: 699.0,
    status: "discount",
    stock: 8,
    rating: 4.8,
    ratingCount: 44,
    image: "/images/o_3801-540x540.webp",
    images: ["/images/o_3801-540x540.webp"],
    description: "24.1 Megapixel CMOS sensor with DIGIC 8 Image Processor, improved Dual Pixel CMOS AF and Eye Detection AF.",
    specs: { Sensor: "24.1 MP", Screen: "Vari-angle Touchscreen LCD", Video: "4K 24p", Weight: "387g" },
    isTrending: true,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-04T14:20:00.000Z",
  },
  {
    id: "bs-1",
    name: "Acer Aspire 5 A515-56-347N Slim Laptop – 15.6\" Full HD IPS Display",
    slug: "acer-aspire-5-slim-laptop",
    category: "Laptop & Tablet",
    price: 529.75,
    originalPrice: 650.0,
    status: "new",
    stock: 15,
    rating: 4.6,
    ratingCount: 31,
    image: "/images/o_3603-540x540.webp",
    images: ["/images/o_3603-540x540.webp"],
    description: "Powerful 11th Gen Intel Core i3 processor, 15.6-inch Full HD IPS display with narrow bezels, ergonomic hinge, and all-day battery life.",
    specs: { Processor: "Intel Core i3-1115G4", RAM: "8GB DDR4", Storage: "256GB NVMe SSD", Display: "15.6\" FHD IPS" },
    isTrending: false,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-05T08:00:00.000Z",
  },
  {
    id: "bs-2",
    name: "AirPods (2nd generation) with Wired Charging Case",
    slug: "airpods-2nd-generation",
    category: "Headphone",
    price: 129.0,
    originalPrice: 159.0,
    status: "discount",
    stock: 40,
    rating: 4.9,
    ratingCount: 110,
    image: "/images/o_2003-540x540.webp",
    images: ["/images/o_2003-540x540.webp"],
    description: "Effortless setup, high-quality audio, hands-free Siri access, and over 24 hours of listening time with the charging case.",
    specs: { Chip: "Apple H1", Battery: "Up to 5 hours listening", Connectivity: "Bluetooth 5.0", Sensors: "Dual beamforming mics" },
    isTrending: true,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-06T12:00:00.000Z",
  },
  {
    id: "bs-3",
    name: "AirPods (3rd generation) with Lightning Charging Case",
    slug: "airpods-3rd-generation",
    category: "Headphone",
    price: 169.0,
    originalPrice: 199.0,
    status: "new",
    stock: 22,
    rating: 4.8,
    ratingCount: 65,
    image: "/images/o_2101-540x540.webp",
    images: ["/images/o_2101-540x540.webp"],
    description: "Personalized Spatial Audio with dynamic head tracking, sweat and water resistance, and contoured design with force sensor control.",
    specs: { Audio: "Spatial Audio with head tracking", WaterResistance: "IPX4", Battery: "Up to 6 hours", Case: "Lightning Case" },
    isTrending: true,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-07T15:00:00.000Z",
  },
  {
    id: "bs-4",
    name: "Amazfit GTS 2 Smart Watch for Men Android iPhone, Bluetooth Calls",
    slug: "amazfit-gts-2-smart-watch",
    category: "Smartwatch",
    price: 134.99,
    originalPrice: 179.99,
    status: "discount",
    stock: 19,
    rating: 4.7,
    ratingCount: 42,
    image: "/images/o_0601-540x540.webp",
    images: ["/images/o_0601-540x540.webp"],
    description: "Curved 3D bezel-less design, all-round health tracking, 90 built-in sports modes, and Bluetooth phone call support.",
    specs: { Display: "1.65\" AMOLED", BatteryLife: "Up to 7 days", WaterProof: "5 ATM", HealthSensors: "BioTracker 2 PPG" },
    isTrending: false,
    isBestSeller: true,
    isFeaturedTab: false,
    createdAt: "2026-10-08T16:00:00.000Z",
  },
  {
    id: "bs-5",
    name: "Amazon Fire HD 8 tablet, 2 GB RAM, 32 GB, Black",
    slug: "amazon-fire-hd-8-tablet",
    category: "Laptop & Tablet",
    price: 99.99,
    originalPrice: 119.99,
    status: "discount",
    stock: 30,
    rating: 4.5,
    ratingCount: 88,
    image: "/images/o_1101-540x540.webp",
    images: ["/images/o_1101-540x540.webp"],
    description: "8-inch vibrant HD display, 30% faster quad-core processor, all-day battery life up to 12 hours, and enhanced USB-C charging.",
    specs: { Screen: "8\" HD (1280 x 800)", RAM: "2GB", Storage: "32GB (expandable up to 1TB)", Battery: "12 Hours" },
    isTrending: false,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-09T18:00:00.000Z",
  },
  {
    id: "hero-dell-g5",
    name: "Dell G5 15 Gaming Laptop – Intel Core i7, 16GB RAM, RTX 3060",
    slug: "dell-g5-gaming-laptop",
    category: "Laptop & Tablet",
    price: 450.0,
    originalPrice: 799.0,
    status: "discount",
    stock: 14,
    rating: 4.9,
    ratingCount: 140,
    image: "/images/dell-g5-hero.png",
    images: ["/images/dell-g5-hero.png"],
    description: "Engineered with 10th Gen Intel Core processors and powerful NVIDIA GeForce graphics for unstoppable gaming performance.",
    specs: { CPU: "Intel Core i7-10750H", GPU: "NVIDIA GeForce RTX 3060 6GB", RAM: "16GB DDR4", Storage: "512GB PCIe M.2 SSD" },
    isTrending: true,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-10T10:00:00.000Z",
  },
  {
    id: "prd-beats-headphone",
    name: "Beats Studio Pro Wireless Over-Ear Headphones – Deep Black",
    slug: "beats-studio-pro-wireless",
    category: "Headphone",
    price: 249.99,
    originalPrice: 349.99,
    status: "discount",
    stock: 20,
    rating: 4.7,
    ratingCount: 57,
    image: "/images/beats-headphones.png",
    images: ["/images/beats-headphones.png"],
    description: "Custom acoustic platform delivers rich, immersive sound. Personalized Spatial Audio with dynamic head tracking.",
    specs: { Battery: "Up to 40 hours", Connectivity: "Lossless Audio via USB-C + Bluetooth", ANC: "Active Noise Cancelling" },
    isTrending: true,
    isBestSeller: true,
    isFeaturedTab: true,
    createdAt: "2026-10-11T11:00:00.000Z",
  },
  {
    id: "prd-bose-speaker",
    name: "Bose SoundLink Revolve+ II Bluetooth Speaker – 360 Sound",
    slug: "bose-soundlink-revolve-ii",
    category: "Audio Equipments",
    price: 199.0,
    originalPrice: 249.0,
    status: "none",
    stock: 16,
    rating: 4.8,
    ratingCount: 62,
    image: "/images/bose-speaker.png",
    images: ["/images/bose-speaker.png"],
    description: "Astonishingly loud. Surprisingly small. Delivers true 360-degree sound for consistent, uniform coverage.",
    specs: { Battery: "Up to 17 hours", WaterResistance: "IP55 dust and water resistant", Mic: "Built-in microphone for speakerphone" },
    isTrending: true,
    isBestSeller: false,
    isFeaturedTab: true,
    createdAt: "2026-10-12T13:00:00.000Z",
  },
];

const INITIAL_ORDERS = [
  {
    id: "ORD-9481",
    customer: {
      name: "Tariq Mahmood",
      email: "tariq.mahmood@example.com",
      phone: "+92 321 9876543",
      address: "House 45, Street 12, F-8/2, Islamabad, Pakistan",
      city: "Islamabad",
    },
    items: [
      { id: "hero-dell-g5", name: "Dell G5 15 Gaming Laptop", price: 450.0, qty: 1, image: "/images/dell-g5-hero.png" },
      { id: "bs-2", name: "AirPods (2nd generation)", price: 129.0, qty: 1, image: "/images/o_2003-540x540.webp" },
    ],
    subtotal: 579.0,
    shipping: 0.0,
    discount: 0.0,
    total: 579.0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "processing",
    notes: "Please call before delivery.",
    trackingNumber: "TCS-9021882",
    createdAt: "2026-10-27T14:32:00.000Z",
  },
  {
    id: "ORD-9480",
    customer: {
      name: "Ayesha Khan",
      email: "ayesha.khan@techcorp.pk",
      phone: "+92 333 4567890",
      address: "Plot 88-C, Commercial Lane 4, DHA Phase 6, Karachi",
      city: "Karachi",
    },
    items: [
      { id: "tr-7", name: "Canon Mirrorless Camera [EOS M6 Mark II]", price: 898.0, qty: 1, image: "/images/o_3801-540x540.webp" },
    ],
    subtotal: 898.0,
    shipping: 0.0,
    discount: 50.0,
    total: 848.0,
    paymentMethod: "Bank Transfer (BACS)",
    paymentStatus: "Paid",
    status: "shipped",
    notes: "Leave with security reception if unavailable.",
    trackingNumber: "LEO-449102",
    createdAt: "2026-10-26T09:15:00.000Z",
  },
  {
    id: "ORD-9479",
    customer: {
      name: "Zubair Ahmed",
      email: "zubair.ahmed@gmail.com",
      phone: "+92 300 8112233",
      address: "Apartment 402, Gulberg Heights, Lahore, Pakistan",
      city: "Lahore",
    },
    items: [
      { id: "tr-1", name: "Apple iPhone 11 Pro Max, US Version, 64GB", price: 475.0, qty: 1, image: "/images/o_4901-540x540.webp" },
    ],
    subtotal: 475.0,
    shipping: 10.0,
    discount: 0.0,
    total: 485.0,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Completed",
    status: "delivered",
    notes: "",
    trackingNumber: "TCS-8199201",
    createdAt: "2026-10-24T18:40:00.000Z",
  },
  {
    id: "ORD-9478",
    customer: {
      name: "Hamza Farooq",
      email: "hamza.farooq@outlook.com",
      phone: "+92 312 3344556",
      address: "Street 7, Sector G-11/3, Islamabad",
      city: "Islamabad",
    },
    items: [
      { id: "bs-4", name: "Amazfit GTS 2 Smart Watch", price: 134.99, qty: 2, image: "/images/o_0601-540x540.webp" },
    ],
    subtotal: 269.98,
    shipping: 0.0,
    discount: 20.0,
    total: 249.98,
    paymentMethod: "Direct Bank Transfer",
    paymentStatus: "Pending",
    status: "pending",
    notes: "Urgent shipment requested.",
    trackingNumber: "",
    createdAt: "2026-10-28T08:20:00.000Z",
  },
];

const INITIAL_COUPONS = [
  { id: "cp-1", code: "EDGE20", discountType: "percentage", value: 20, minSpend: 100, active: true, usageCount: 45, maxUses: 200, expiresAt: "2027-12-31" },
  { id: "cp-2", code: "WELCOME10", discountType: "percentage", value: 10, minSpend: 50, active: true, usageCount: 112, maxUses: 500, expiresAt: "2027-12-31" },
  { id: "cp-3", code: "FREESHIP", discountType: "fixed", value: 15, minSpend: 80, active: true, usageCount: 68, maxUses: 1000, expiresAt: "2027-12-31" },
];

const INITIAL_INQUIRIES = [
  {
    id: "inq-1",
    name: "Bilal Raza",
    email: "bilal.raza@automation.pk",
    phone: "+92 301 5566778",
    subject: "Bulk inquiry for 10x Dell G5 Laptops",
    message: "Hi Industrial Edge team, we are setting up a machine vision engineering lab and need 10 units of the Dell G5 laptop. Do you offer corporate GST invoices and quantity discounts?",
    status: "unread",
    createdAt: "2026-10-28T09:10:00.000Z",
  },
  {
    id: "inq-2",
    name: "Sana Mir",
    email: "sana.mir@creativestudio.com",
    phone: "+92 345 1122334",
    subject: "Warranty and return policy question for Canon EOS",
    message: "Is the Canon EOS M6 Mark II covered by official manufacturer warranty in Pakistan, and what is your return policy?",
    status: "read",
    createdAt: "2026-10-27T16:45:00.000Z",
  },
];

const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Super Admin",
    email: "admin@industrialedge.pk",
    passwordHash: "admin123", // In production hash with bcrypt
    role: "admin",
    avatar: "/images/apple-imac.jpg",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

// Helper to get file path
function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

// Ensure all collections exist with seed data
function ensureCollection(collection, initialData) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), "utf8");
  }
}

function initDatabase() {
  ensureCollection("settings", INITIAL_SETTINGS);
  ensureCollection("banners", INITIAL_BANNERS);
  ensureCollection("categories", INITIAL_CATEGORIES);
  ensureCollection("products", INITIAL_PRODUCTS);
  ensureCollection("orders", INITIAL_ORDERS);
  ensureCollection("coupons", INITIAL_COUPONS);
  ensureCollection("inquiries", INITIAL_INQUIRIES);
  ensureCollection("users", INITIAL_USERS);
}

// Read collection
function readCollection(collection) {
  initDatabase();
  const filePath = getFilePath(collection);
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return null;
  }
}

// Write collection atomically
function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  const tempPath = `${filePath}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}:`, err);
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch {}
    return false;
  }
}

// Initialize on module load
initDatabase();

module.exports = {
  readCollection,
  writeCollection,
  initDatabase,
};
