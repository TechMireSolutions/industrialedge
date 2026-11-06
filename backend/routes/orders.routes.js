const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { readCollection, writeCollection } = require("../db");

// GET all orders
router.get("/", (req, res) => {
  const orders = readCollection("orders") || [];
  const { status, search, limit } = req.query;

  let filtered = [...orders];

  if (status && status !== "all") {
    filtered = filtered.filter((o) => o.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        (o.customer && o.customer.name && o.customer.name.toLowerCase().includes(q)) ||
        (o.customer && o.customer.email && o.customer.email.toLowerCase().includes(q)) ||
        (o.customer && o.customer.phone && o.customer.phone.includes(q))
    );
  }

  if (limit) {
    filtered = filtered.slice(0, parseInt(limit, 10));
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
});

// GET order by ID
router.get("/:id", (req, res) => {
  const orders = readCollection("orders") || [];
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.json({ success: true, data: order });
});

// POST create new order (from checkout)
router.post("/", (req, res) => {
  const orders = readCollection("orders") || [];
  const {
    customer,
    items = [],
    shipping = 0,
    discount = 0,
    paymentMethod = "Cash on Delivery",
    notes = "",
  } = req.body;

  if (!customer || !customer.name || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Customer details and at least one item are required",
    });
  }

  // Calculate subtotal and total
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
  const total = Math.max(0, subtotal + Number(shipping) - Number(discount));

  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: orderId,
    customer: {
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      zip: customer.zip || "",
      country: customer.country || "Pakistan",
    },
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty) || 1,
      image: item.image || "/images/cat-laptop.jpg",
    })),
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping),
    discount: Number(discount),
    total: Number(total.toFixed(2)),
    paymentMethod,
    paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Awaiting Verification",
    status: "pending",
    notes: notes || "",
    trackingNumber: "",
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  writeCollection("orders", orders);

  // Decrement product stock
  const products = readCollection("products") || [];
  items.forEach((item) => {
    const prod = products.find((p) => p.id === item.id);
    if (prod && typeof prod.stock === "number") {
      prod.stock = Math.max(0, prod.stock - (item.qty || 1));
    }
  });
  writeCollection("products", products);

  res.status(201).json({ success: true, data: newOrder });
});

// PUT update order status / tracking / notes
router.put("/:id", (req, res) => {
  const orders = readCollection("orders") || [];
  const index = orders.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const existing = orders[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  orders[index] = updated;
  writeCollection("orders", orders);

  res.json({ success: true, data: updated });
});

// DELETE order
router.delete("/:id", (req, res) => {
  let orders = readCollection("orders") || [];
  const exists = orders.some((o) => o.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  orders = orders.filter((o) => o.id !== req.params.id);
  writeCollection("orders", orders);

  res.json({ success: true, message: "Order deleted successfully" });
});

module.exports = router;
