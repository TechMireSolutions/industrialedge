const express = require("express");
const router = express.Router();
const { readCollection } = require("../db");

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function computeSalesTrend(orders) {
  const validOrders = (orders || []).filter((o) => o.status !== "cancelled");
  // Anchor the 6-month window to the latest order date or current date
  let anchor = new Date();
  for (const ord of validOrders) {
    const d = new Date(ord.createdAt);
    if (!Number.isNaN(d.getTime()) && d > anchor) {
      anchor = d;
    }
  }

  const buckets = [];
  for (let offset = 5; offset >= 0; offset--) {
    const dt = new Date(anchor.getFullYear(), anchor.getMonth() - offset, 1);
    buckets.push({
      year: dt.getFullYear(),
      monthIdx: dt.getMonth(),
      month: MONTH_NAMES[dt.getMonth()],
      revenue: 0,
      orders: 0,
    });
  }

  for (const ord of validOrders) {
    const d = new Date(ord.createdAt);
    if (Number.isNaN(d.getTime())) continue;
    const bucket = buckets.find((b) => b.year === d.getFullYear() && b.monthIdx === d.getMonth());
    if (bucket) {
      bucket.revenue += Math.round(Number(ord.total) || 0);
      bucket.orders += 1;
    }
  }

  return buckets.map(({ month, revenue, orders: count }) => ({ month, revenue, orders: count }));
}

// GET dashboard statistics (100% live computed from DB records)
router.get("/", async (req, res) => {
  try {
    const [orders, products, inquiries, categories] = await Promise.all([
      readCollection("orders"),
      readCollection("products"),
      readCollection("inquiries"),
      readCollection("categories"),
    ]);

    const o = orders || [];
    const p = products || [];
    const i = inquiries || [];
    const c = categories || [];

    const totalSales = o.reduce(
      (sum, order) => (order.status !== "cancelled" ? sum + (Number(order.total) || 0) : sum),
      0
    );
    const totalOrders = o.length;
    const pendingOrders = o.filter((x) => x.status === "pending").length;
    const processingOrders = o.filter((x) => x.status === "processing").length;
    const shippedOrders = o.filter((x) => x.status === "shipped").length;
    const deliveredOrders = o.filter((x) => x.status === "delivered").length;
    const cancelledOrders = o.filter((x) => x.status === "cancelled").length;
    const lowStockProducts = p.filter((x) => (x.stock || 0) <= 5);
    const outOfStockProducts = p.filter((x) => (x.stock || 0) === 0);
    const unreadInquiries = i.filter((x) => x.status === "unread").length;

    res.json({
      success: true,
      data: {
        metrics: {
          totalSales: Math.round(totalSales),
          totalOrders,
          pendingOrders,
          totalProducts: p.length,
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length,
          unreadInquiries,
          totalCategories: c.length,
        },
        statusBreakdown: [
          { label: "Pending", count: pendingOrders, color: "#F59E0B" },
          { label: "Processing", count: processingOrders, color: "#3B82F6" },
          { label: "Shipped", count: shippedOrders, color: "#8B5CF6" },
          { label: "Delivered", count: deliveredOrders, color: "#10B981" },
          { label: "Cancelled", count: cancelledOrders, color: "#EF4444" },
        ],
        salesTrend: computeSalesTrend(o),
        lowStockItems: lowStockProducts.slice(0, 5),
        recentOrders: o.slice(0, 5),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
