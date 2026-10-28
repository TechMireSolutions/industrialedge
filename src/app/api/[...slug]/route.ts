import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const BACKEND_URL = "http://localhost:5000";
const DATA_DIR = path.resolve(process.cwd(), "server/data");

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

async function forwardOrFallback(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const pathStr = slug.join("/");
  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${url.search}`;

  const method = req.method;
  let body: string | undefined = undefined;

  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await req.text();
    } catch {
      // no body
    }
  }

  // 1. Try forwarding to standalone Node.js server
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host") {
        headers[key] = value;
      }
    });

    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    // 2. Standalone server is offline -> Direct filesystem read/write fallback
    const collectionName = slug[0];
    const itemId = slug[1];

    if (method === "GET") {
      if (collectionName === "health") {
        return NextResponse.json({ status: "ok", service: "Next.js Embedded API", time: new Date().toISOString() });
      }

      if (collectionName === "stats") {
        const orders = readJsonFile("orders") || [];
        const products = readJsonFile("products") || [];
        const inquiries = readJsonFile("inquiries") || [];
        const totalSales = orders.reduce((sum: number, o: { total: number; status: string }) => o.status !== "cancelled" ? sum + (Number(o.total) || 0) : sum, 0);
        return NextResponse.json({
          success: true,
          data: {
            metrics: {
              totalSales: Number(totalSales.toFixed(2)),
              totalOrders: orders.length,
              pendingOrders: orders.filter((o: { status: string }) => o.status === "pending").length,
              totalProducts: products.length,
              lowStockCount: products.filter((p: { stock: number }) => (p.stock || 0) <= 5).length,
              outOfStockCount: products.filter((p: { stock: number }) => (p.stock || 0) === 0).length,
              unreadInquiries: inquiries.filter((i: { status: string }) => i.status === "unread").length,
            },
            statusBreakdown: [
              { label: "Pending", count: orders.filter((o: { status: string }) => o.status === "pending").length, color: "#F59E0B" },
              { label: "Processing", count: orders.filter((o: { status: string }) => o.status === "processing").length, color: "#3B82F6" },
              { label: "Shipped", count: orders.filter((o: { status: string }) => o.status === "shipped").length, color: "#8B5CF6" },
              { label: "Delivered", count: orders.filter((o: { status: string }) => o.status === "delivered").length, color: "#10B981" },
              { label: "Cancelled", count: orders.filter((o: { status: string }) => o.status === "cancelled").length, color: "#EF4444" },
            ],
            salesTrend: [
              { month: "May", revenue: 4200, orders: 12 },
              { month: "Jun", revenue: 5800, orders: 18 },
              { month: "Jul", revenue: 7400, orders: 24 },
              { month: "Aug", revenue: 9100, orders: 31 },
              { month: "Sep", revenue: 11500, orders: 40 },
              { month: "Oct", revenue: Math.round(totalSales + 8200), orders: orders.length + 28 },
            ],
            recentOrders: orders.slice(0, 5),
          },
        });
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

      return NextResponse.json({ success: true, data });
    }

    if (method === "POST") {
      const parsedBody = body ? JSON.parse(body) : {};
      if (collectionName === "orders") {
        const orders = readJsonFile("orders") || [];
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder = {
          id: orderId,
          ...parsedBody,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        orders.unshift(newOrder);
        writeJsonFile("orders", orders);
        return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
      }

      if (collectionName === "inquiries") {
        const inquiries = readJsonFile("inquiries") || [];
        const newInquiry = {
          id: `inq-${Date.now()}`,
          ...parsedBody,
          status: "unread",
          createdAt: new Date().toISOString(),
        };
        inquiries.unshift(newInquiry);
        writeJsonFile("inquiries", inquiries);
        return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
      }

      const items = readJsonFile(collectionName) || [];
      if (Array.isArray(items)) {
        const newItem = { id: `${collectionName.slice(0, 3)}-${Date.now()}`, ...parsedBody, createdAt: new Date().toISOString() };
        items.unshift(newItem);
        writeJsonFile(collectionName, items);
        return NextResponse.json({ success: true, data: newItem }, { status: 201 });
      }
    }

    if (method === "PUT") {
      const parsedBody = body ? JSON.parse(body) : {};
      if (collectionName === "settings" || collectionName === "banners") {
        const current = readJsonFile(collectionName) || {};
        const updated = { ...current, ...parsedBody, updatedAt: new Date().toISOString() };
        writeJsonFile(collectionName, updated);
        return NextResponse.json({ success: true, data: updated });
      }

      const items = readJsonFile(collectionName) || [];
      if (Array.isArray(items) && itemId) {
        const idx = items.findIndex((i: { id: string }) => i.id === itemId);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...parsedBody, id: items[idx].id, updatedAt: new Date().toISOString() };
          writeJsonFile(collectionName, items);
          return NextResponse.json({ success: true, data: items[idx] });
        }
      }
    }

    if (method === "DELETE" && itemId) {
      let items = readJsonFile(collectionName) || [];
      if (Array.isArray(items)) {
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
