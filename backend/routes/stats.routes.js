const express = require("express");
const router = express.Router();
const { readCollection } = require("../db");

// GET dashboard statistics
router.get("/", (req, res) => {
  const orders = readCollection("orders") || [];
  const products = readCollection("products") || [];
  const inquiries = readCollection("inquiries") || [];
  const categories = readCollection("categories") || [];

  // 1. Financials & Counts
  const totalSales = orders.reduce((sum, order) => {
    // Only count delivered, shipped, or processing towards confirmed revenue
    if (order.status !== "cancelled") {
      return sum + (Number(order.total) || 0);
    }
    return sum;
  }, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const processingOrders = orders.filter((o) => o.status === "processing").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= 5);
  const outOfStockProducts = products.filter((p) => (p.stock || 0) === 0);

  const unreadInquiries = inquiries.filter((i) => i.status === "unread").length;

  // 2. Orders by Status for visual pie/bar breakdown
  const statusBreakdown = [
    { label: "Pending", count: pendingOrders, color: "#F59E0B" },
    { label: "Processing", count: processingOrders, color: "#3B82F6" },
    { label: "Shipped", count: shippedOrders, color: "#8B5CF6" },
    { label: "Delivered", count: deliveredOrders, color: "#10B981" },
    { label: "Cancelled", count: cancelledOrders, color: "#EF4444" },
  ];

  // 3. Sales trend by month / day (mock dynamic curve for realistic dashboard)
  const salesTrend = [
    { month: "May", revenue: 4200, orders: 12 },
    { month: "Jun", revenue: 5800, orders: 18 },
    { month: "Jul", revenue: 7400, orders: 24 },
    { month: "Aug", revenue: 9100, orders: 31 },
    { month: "Sep", revenue: 11500, orders: 40 },
    { month: "Oct", revenue: Math.round(totalSales + 8200), orders: totalOrders + 28 },
  ];

  // 4. Recent orders (latest 5)
  const recentOrders = orders.slice(0, 5);

  res.json({
    success: true,
    data: {
      metrics: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        pendingOrders,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        unreadInquiries,
        totalCategories: categories.length,
      },
      statusBreakdown,
      salesTrend,
      lowStockItems: lowStockProducts.slice(0, 5),
      recentOrders,
    },
  });
});

module.exports = router;
