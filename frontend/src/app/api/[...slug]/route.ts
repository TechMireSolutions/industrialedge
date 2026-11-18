import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "http://127.0.0.1:5007" : "http://localhost:5000");

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : fs.existsSync(path.resolve(process.cwd(), "../backend/data"))
    ? path.resolve(process.cwd(), "../backend/data")
    : fs.existsSync(path.resolve(process.cwd(), "backend/data"))
      ? path.resolve(process.cwd(), "backend/data")
      : fs.existsSync(path.resolve(process.cwd(), "server/data"))
        ? path.resolve(process.cwd(), "server/data")
        : path.resolve(process.cwd(), "data");

const PUBLIC_UPLOAD_DIR = fs.existsSync(path.resolve(process.cwd(), "public"))
  ? path.resolve(process.cwd(), "public/uploads")
  : path.resolve(process.cwd(), "frontend/public/uploads");

// Embedded in-memory sessions for fallback mode
const embeddedSessions = new Map<
  string,
  { id: string; userId: string; name: string; email: string; role: string; avatar?: string; expiresAt: number }
>();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function readJsonFile(collection: string) {
  try {
    const file = path.join(DATA_DIR, `${collection}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return null;
  }
}

function writeJsonFile(collection: string, data: unknown) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const file = path.join(DATA_DIR, `${collection}.json`);
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tmp, file);
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}:`, err);
    return false;
  }
}

async function handleEmbeddedUpload(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: "No image file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Only image files are allowed!" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File exceeds 10MB limit" }, { status: 400 });
    }

    if (!fs.existsSync(PUBLIC_UPLOAD_DIR)) {
      fs.mkdirSync(PUBLIC_UPLOAD_DIR, { recursive: true });
    }

    const ext = path.extname(file.name) || ".png";
    const safeName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const filename = `${safeName || "upload"}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(PUBLIC_UPLOAD_DIR, filename), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      size: file.size,
      message: "Image uploaded successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

async function forwardOrFallback(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const pathStr = slug.join("/");
  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${url.search}`;
  const method = req.method;
  const contentType = req.headers.get("content-type") || "";
  const isMultipart = contentType.toLowerCase().includes("multipart/form-data");

  // Buffer body safely (preserving binary bytes for multipart uploads)
  let rawBuffer: ArrayBuffer | undefined = undefined;
  let textBody: string | undefined = undefined;

  if (method !== "GET" && method !== "HEAD") {
    try {
      if (isMultipart) {
        // Clone request so fallback can still read formData if backend is offline
        rawBuffer = await req.clone().arrayBuffer();
      } else {
        textBody = await req.text();
      }
    } catch {
      // no body
    }
  }

  // 1. Try forwarding to standalone Node.js Express backend
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower !== "host" && lower !== "content-length") {
        headers[key] = value;
      }
    });

    const res = await fetch(targetUrl, {
      method,
      headers,
      body: isMultipart ? rawBuffer : textBody,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await res.arrayBuffer();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    // 2. Standalone server is offline -> Full embedded API fallback
    const collectionName = slug[0];
    const itemId = slug[1];
    const subAction = slug[2];

    if (method === "POST" && collectionName === "upload") {
      return handleEmbeddedUpload(req);
    }

    if (method === "GET") {
      if (collectionName === "health") {
        return NextResponse.json({
          status: "ok",
          service: "Next.js Embedded API",
          database: "json-fallback",
          time: new Date().toISOString(),
        });
      }

      if (collectionName === "auth" && itemId === "me") {
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace(/^Bearer\s+/i, "");
        const session = token ? embeddedSessions.get(token) : null;
        if (!session || session.expiresAt < Date.now()) {
          return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }
        return NextResponse.json({ success: true, user: session });
      }

      if (collectionName === "stats") {
        const orders = readJsonFile("orders") || [];
        const products = readJsonFile("products") || [];
        const inquiries = readJsonFile("inquiries") || [];
        const categories = readJsonFile("categories") || [];
        const totalSales = orders.reduce(
          (sum: number, o: { total: number; status: string }) =>
            o.status !== "cancelled" ? sum + (Number(o.total) || 0) : sum,
          0
        );
        const lowStockItems = products.filter((p: { stock: number }) => (p.stock || 0) <= 5);
        return NextResponse.json({
          success: true,
          data: {
            metrics: {
              totalSales: Math.round(totalSales),
              totalOrders: orders.length,
              pendingOrders: orders.filter((o: { status: string }) => o.status === "pending").length,
              totalProducts: products.length,
              lowStockCount: lowStockItems.length,
              outOfStockCount: products.filter((p: { stock: number }) => (p.stock || 0) === 0).length,
              unreadInquiries: inquiries.filter((i: { status: string }) => i.status === "unread").length,
              totalCategories: categories.length,
            },
            statusBreakdown: [
              { label: "Pending", count: orders.filter((o: { status: string }) => o.status === "pending").length, color: "#F59E0B" },
              { label: "Processing", count: orders.filter((o: { status: string }) => o.status === "processing").length, color: "#3B82F6" },
              { label: "Shipped", count: orders.filter((o: { status: string }) => o.status === "shipped").length, color: "#8B5CF6" },
              { label: "Delivered", count: orders.filter((o: { status: string }) => o.status === "delivered").length, color: "#10B981" },
              { label: "Cancelled", count: orders.filter((o: { status: string }) => o.status === "cancelled").length, color: "#EF4444" },
            ],
            salesTrend: [
              { month: "May", revenue: 1180000, orders: 12 },
              { month: "Jun", revenue: 1620000, orders: 18 },
              { month: "Jul", revenue: 2070000, orders: 24 },
              { month: "Aug", revenue: 2550000, orders: 31 },
              { month: "Sep", revenue: 3220000, orders: 40 },
              { month: "Oct", revenue: Math.round(totalSales + 2300000), orders: orders.length + 28 },
            ],
            lowStockItems: lowStockItems.slice(0, 5),
            recentOrders: orders.slice(0, 5),
          },
        });
      }

      if (collectionName === "categories") {
        const categories = readJsonFile("categories") || [];
        const products = readJsonFile("products") || [];
        const withCounts = categories.map((cat: { name: string }) => ({
          ...cat,
          count: products.filter(
            (p: { category?: string }) => (p.category || "").toLowerCase() === (cat.name || "").toLowerCase()
          ).length,
        }));
        return NextResponse.json({ success: true, data: withCounts });
      }

      const data = readJsonFile(collectionName);
      if (!data) {
        return NextResponse.json({ success: false, message: "Collection not found" }, { status: 404 });
      }

      if (itemId && Array.isArray(data)) {
        const item = data.find((i: { id: string; slug?: string }) => i.id === itemId || i.slug === itemId);
        if (!item) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: item });
      }

      // Query filtering for products & orders
      if (collectionName === "products" && Array.isArray(data)) {
        let filtered = [...data];
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");
        const status = url.searchParams.get("status");
        const featured = url.searchParams.get("featured");
        const limit = url.searchParams.get("limit");

        if (category && category !== "All" && category !== "All categories") {
          filtered = filtered.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());
        }
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              (p.name || "").toLowerCase().includes(q) ||
              (p.description || "").toLowerCase().includes(q) ||
              (p.category || "").toLowerCase().includes(q) ||
              (p.brand || "").toLowerCase().includes(q)
          );
        }
        if (status) filtered = filtered.filter((p) => p.status === status);
        if (featured === "trending") filtered = filtered.filter((p) => p.isTrending);
        else if (featured === "bestSeller") filtered = filtered.filter((p) => p.isBestSeller);
        else if (featured === "featuredTab") filtered = filtered.filter((p) => p.isFeaturedTab);
        if (limit) filtered = filtered.slice(0, parseInt(limit, 10));

        return NextResponse.json({ success: true, total: filtered.length, data: filtered });
      }

      if (collectionName === "orders" && Array.isArray(data)) {
        let filtered = [...data];
        const status = url.searchParams.get("status");
        const search = url.searchParams.get("search");
        const email = url.searchParams.get("email");
        const limit = url.searchParams.get("limit");

        if (status && status !== "all") {
          filtered = filtered.filter((o) => (o.status || "").toLowerCase() === status.toLowerCase());
        }
        if (email) {
          const target = email.trim().toLowerCase();
          filtered = filtered.filter((o) => (o.customer?.email || "").toLowerCase() === target);
        }
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (o) =>
              (o.id || "").toLowerCase().includes(q) ||
              (o.customer?.name || "").toLowerCase().includes(q) ||
              (o.customer?.email || "").toLowerCase().includes(q) ||
              (o.customer?.phone || "").includes(q)
          );
        }
        if (limit) filtered = filtered.slice(0, parseInt(limit, 10));
        return NextResponse.json({ success: true, total: filtered.length, data: filtered });
      }

      return NextResponse.json({ success: true, data });
    }

    if (method === "POST") {
      const parsedBody = textBody ? JSON.parse(textBody) : {};

      // Auth endpoints
      if (collectionName === "auth") {
        if (itemId === "login") {
          const users = readJsonFile("users") || [];
          const identifier = (parsedBody.email || parsedBody.username || "").trim().toLowerCase();
          const password = parsedBody.password;
          const user = users.find(
            (u: { email?: string; name?: string }) =>
              (u.email || "").toLowerCase() === identifier || (u.name || "").toLowerCase() === identifier
          );
          if (!user || user.passwordHash !== password) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
          }
          const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
          embeddedSessions.set(token, {
            id: user.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "customer",
            avatar: user.avatar || "/logo.png",
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          });
          return NextResponse.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role || "customer", avatar: user.avatar },
            message: "Login successful",
          });
        }

        if (itemId === "register") {
          const users = readJsonFile("users") || [];
          const cleanName = (parsedBody.name || parsedBody.username || "").trim();
          const cleanEmail = (parsedBody.email || "").trim().toLowerCase();
          const password = parsedBody.password || "";
          if (!cleanName || !cleanEmail || !password) {
            return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
          }
          if (password.length < 6) {
            return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
          }
          if (users.some((u: { email?: string }) => (u.email || "").toLowerCase() === cleanEmail)) {
            return NextResponse.json({ success: false, message: "An account with this email already exists" }, { status: 409 });
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
          writeJsonFile("users", users);
          const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
          embeddedSessions.set(token, {
            id: newUser.id,
            userId: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          });
          return NextResponse.json(
            {
              success: true,
              token,
              user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar },
              message: "Account created successfully",
            },
            { status: 201 }
          );
        }

        if (itemId === "logout") {
          const authHeader = req.headers.get("authorization") || "";
          const token = authHeader.replace(/^Bearer\s+/i, "");
          if (token) embeddedSessions.delete(token);
          return NextResponse.json({ success: true, message: "Logged out successfully" });
        }

        if (itemId === "forgot-password") {
          return NextResponse.json({
            success: true,
            message: "If an account exists for this email, password reset instructions have been sent.",
          });
        }

        if (itemId === "change-password") {
          const { email, oldPassword, newPassword } = parsedBody;
          if (!oldPassword || !newPassword || newPassword.length < 6) {
            return NextResponse.json(
              { success: false, message: "New password must be at least 6 characters" },
              { status: 400 }
            );
          }
          const users = readJsonFile("users") || [];
          const target = email
            ? users.find((u: { email?: string }) => (u.email || "").toLowerCase() === email.toLowerCase())
            : users.find((u: { role?: string }) => u.role === "admin");
          if (!target) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
          if (target.passwordHash !== oldPassword) {
            return NextResponse.json({ success: false, message: "Current password does not match" }, { status: 400 });
          }
          target.passwordHash = newPassword;
          target.updatedAt = new Date().toISOString();
          writeJsonFile("users", users);
          return NextResponse.json({ success: true, message: "Password updated successfully" });
        }
      }

      // Coupon verification
      if (collectionName === "coupons" && itemId === "verify") {
        const code = parsedBody.code;
        const cartTotal = Number(parsedBody.cartTotal ?? parsedBody.subtotal ?? 0);
        if (!code) return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
        const coupons = readJsonFile("coupons") || [];
        const coupon = coupons.find((c: { code: string }) => c.code.toUpperCase() === code.trim().toUpperCase());
        if (!coupon || !coupon.active) {
          return NextResponse.json({ success: false, message: "Invalid or inactive coupon code" }, { status: 404 });
        }
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date(new Date().toDateString())) {
          return NextResponse.json({ success: false, message: "This coupon code has expired" }, { status: 400 });
        }
        if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
          return NextResponse.json({ success: false, message: "This coupon has reached its usage limit" }, { status: 400 });
        }
        if (coupon.minSpend && cartTotal < coupon.minSpend) {
          return NextResponse.json(
            {
              success: false,
              message: `Minimum order amount of Rs. ${Number(coupon.minSpend).toLocaleString("en-PK")} required for this coupon`,
            },
            { status: 400 }
          );
        }
        const discountAmount =
          coupon.discountType === "percentage"
            ? Math.round((cartTotal * coupon.value) / 100)
            : Math.min(cartTotal, coupon.value);
        return NextResponse.json({
          success: true,
          data: { code: coupon.code, discountType: coupon.discountType, value: coupon.value, discountAmount },
          message: "Coupon applied successfully!",
        });
      }

      if (collectionName === "orders") {
        const orders = readJsonFile("orders") || [];
        const items = parsedBody.items || [];
        const subtotal = items.reduce(
          (acc: number, item: { price: number; qty?: number }) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1),
          0
        );
        const shipping = Number(parsedBody.shipping || 0);
        const discount = Number(parsedBody.discount || 0);
        const total = Math.max(0, subtotal + shipping - discount);
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const paymentMethod = parsedBody.paymentMethod || "Cash on Delivery";
        const newOrder = {
          id: orderId,
          ...parsedBody,
          subtotal: Math.round(subtotal),
          shipping: Math.round(shipping),
          discount: Math.round(discount),
          total: Math.round(total),
          paymentMethod,
          paymentStatus: paymentMethod.toLowerCase().includes("cash on delivery") ? "Pending" : "Awaiting Verification",
          status: "pending",
          trackingNumber: "",
          createdAt: new Date().toISOString(),
        };
        orders.unshift(newOrder);
        writeJsonFile("orders", orders);

        // Decrement stock
        const products = readJsonFile("products") || [];
        items.forEach((item: { id: string; qty?: number }) => {
          const prod = products.find((p: { id: string }) => p.id === item.id);
          if (prod && typeof prod.stock === "number") {
            prod.stock = Math.max(0, prod.stock - (Number(item.qty) || 1));
          }
        });
        writeJsonFile("products", products);

        // Increment coupon usage
        if (parsedBody.couponCode) {
          const coupons = readJsonFile("coupons") || [];
          const cp = coupons.find((c: { code: string }) => c.code.toUpperCase() === parsedBody.couponCode.trim().toUpperCase());
          if (cp) {
            cp.usageCount = (cp.usageCount || 0) + 1;
            writeJsonFile("coupons", coupons);
          }
        }

        return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
      }

      if (collectionName === "inquiries") {
        const inquiries = readJsonFile("inquiries") || [];
        const newInquiry = {
          id: `inq-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
          ...parsedBody,
          status: "unread",
          createdAt: new Date().toISOString(),
        };
        inquiries.unshift(newInquiry);
        writeJsonFile("inquiries", inquiries);
        return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
      }

      if (collectionName === "products") {
        const products = readJsonFile("products") || [];
        const img = parsedBody.image || "/images/cat-laptop.jpg";
        const newProduct = {
          id: `prd-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
          slug: slugify(parsedBody.name || "product"),
          rating: 5.0,
          ratingCount: 1,
          stock: 10,
          status: "none",
          ...parsedBody,
          price: Number(parsedBody.price),
          originalPrice: parsedBody.originalPrice ? Number(parsedBody.originalPrice) : undefined,
          image: img,
          images: Array.isArray(parsedBody.images) && parsedBody.images.length > 0 ? parsedBody.images : [img],
          createdAt: new Date().toISOString(),
        };
        products.unshift(newProduct);
        writeJsonFile("products", products);
        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
      }

      if (collectionName === "categories") {
        const categories = readJsonFile("categories") || [];
        const newCat = {
          id: `cat-${slugify(parsedBody.name || "cat")}-${crypto.randomBytes(2).toString("hex")}`,
          slug: slugify(parsedBody.name || "cat"),
          icon: "Cpu",
          image: "/images/cat-laptop.jpg",
          count: 0,
          ...parsedBody,
          createdAt: new Date().toISOString(),
        };
        categories.push(newCat);
        writeJsonFile("categories", categories);
        return NextResponse.json({ success: true, data: newCat }, { status: 201 });
      }

      if (collectionName === "coupons") {
        const coupons = readJsonFile("coupons") || [];
        const cleanCode = (parsedBody.code || "").trim().toUpperCase();
        if (coupons.some((c: { code: string }) => c.code === cleanCode)) {
          return NextResponse.json({ success: false, message: "A coupon with this code already exists" }, { status: 400 });
        }
        const newCoupon = {
          id: `cp-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
          discountType: "percentage",
          minSpend: 0,
          maxUses: 100,
          usageCount: 0,
          expiresAt: "2027-12-31",
          active: true,
          ...parsedBody,
          code: cleanCode,
          value: Number(parsedBody.value),
          createdAt: new Date().toISOString(),
        };
        coupons.unshift(newCoupon);
        writeJsonFile("coupons", coupons);
        return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
      }
    }

    if (method === "PUT" || method === "PATCH") {
      const parsedBody = textBody ? JSON.parse(textBody) : {};

      if (collectionName === "settings") {
        const current = readJsonFile("settings") || {};
        const updated = { ...current, ...parsedBody, updatedAt: new Date().toISOString() };
        writeJsonFile("settings", updated);
        return NextResponse.json({ success: true, data: updated });
      }

      if (collectionName === "banners") {
        const current = readJsonFile("banners") || {};
        if (itemId) {
          current[itemId] = { ...(current[itemId] || {}), ...parsedBody };
          current.updatedAt = new Date().toISOString();
          writeJsonFile("banners", current);
          return NextResponse.json({ success: true, data: current[itemId] });
        }
        const updated = { ...current, ...parsedBody, updatedAt: new Date().toISOString() };
        writeJsonFile("banners", updated);
        return NextResponse.json({ success: true, data: updated });
      }

      // PATCH /api/products/:id/stock
      if (collectionName === "products" && itemId && subAction === "stock") {
        const products = readJsonFile("products") || [];
        const prod = products.find((p: { id: string }) => p.id === itemId);
        if (!prod) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        if (parsedBody.stock !== undefined) prod.stock = Math.max(0, Number(parsedBody.stock));
        else if (parsedBody.toggleInStock !== undefined) prod.stock = prod.stock > 0 ? 0 : 15;
        prod.updatedAt = new Date().toISOString();
        writeJsonFile("products", products);
        return NextResponse.json({ success: true, data: prod });
      }

      const items = readJsonFile(collectionName) || [];
      if (Array.isArray(items) && itemId) {
        const idx = items.findIndex((i: { id: string }) => i.id === itemId);
        if (idx !== -1) {
          const existing = items[idx];
          if (collectionName === "categories" && parsedBody.name && parsedBody.name !== existing.name) {
            const products = readJsonFile("products") || [];
            products.forEach((p: { category?: string }) => {
              if ((p.category || "").toLowerCase() === (existing.name || "").toLowerCase()) {
                p.category = parsedBody.name;
              }
            });
            writeJsonFile("products", products);
            parsedBody.slug = slugify(parsedBody.name);
          }
          items[idx] = { ...existing, ...parsedBody, id: existing.id, updatedAt: new Date().toISOString() };
          writeJsonFile(collectionName, items);
          return NextResponse.json({ success: true, data: items[idx] });
        }
        return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
      }
    }

    if (method === "DELETE" && itemId) {
      let items = readJsonFile(collectionName) || [];
      if (Array.isArray(items)) {
        if (!items.some((i: { id: string }) => i.id === itemId)) {
          return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        }
        items = items.filter((i: { id: string }) => i.id !== itemId);
        writeJsonFile(collectionName, items);
        return NextResponse.json({ success: true, message: "Deleted successfully" });
      }
    }

    return NextResponse.json({ success: false, message: "Unhandled request" }, { status: 400 });
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string[] }> }) {
  return forwardOrFallback(req, props);
}

export async function POST(req: NextRequest, props: { params: Promise<{ slug: string[] }> }) {
  return forwardOrFallback(req, props);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ slug: string[] }> }) {
  return forwardOrFallback(req, props);
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ slug: string[] }> }) {
  return forwardOrFallback(req, props);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ slug: string[] }> }) {
  return forwardOrFallback(req, props);
}
