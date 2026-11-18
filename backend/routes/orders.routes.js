const express = require("express");
const router = express.Router();
const { readCollection, writeCollection } = require("../db");

// GET all orders (supports status, search, email, limit)
router.get("/", async (req, res) => {
  try {
    const orders = (await readCollection("orders")) || [];
    const { status, search, email, limit } = req.query;
    let filtered = [...orders];
    if (status && status !== "all") {
      filtered = filtered.filter((o) => (o.status || "").toLowerCase() === status.toLowerCase());
    }
    if (email) {
      const targetEmail = email.trim().toLowerCase();
      filtered = filtered.filter((o) => (o.customer?.email || "").toLowerCase() === targetEmail);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          (o.id || "").toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q) ||
          o.customer?.phone?.includes(q)
      );
    }
    if (limit) filtered = filtered.slice(0, parseInt(limit, 10));
    res.json({ success: true, total: filtered.length, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET order by ID
router.get("/:id", async (req, res) => {
  try {
    const orders = (await readCollection("orders")) || [];
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create new order
router.post("/", async (req, res) => {
  try {
    const orders = (await readCollection("orders")) || [];
    const {
      customer,
      shippingAddress,
      items = [],
      shipping = 0,
      discount = 0,
      couponCode = "",
      currency = "PKR",
      paymentMethod = "Cash on Delivery",
      notes = "",
    } = req.body;

    if (!customer || !customer.name || items.length === 0) {
      return res.status(400).json({ success: false, message: "Customer details and at least one item are required" });
    }

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
    const total = Math.max(0, subtotal + Number(shipping) - Number(discount));

    // Generate collision-safe Order ID
    let orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    let attempts = 0;
    while (orders.some((o) => o.id === orderId) && attempts < 10) {
      orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      attempts++;
    }

    const newOrder = {
      id: orderId,
      customer: {
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zip: customer.zip || "",
        country: customer.country || "Pakistan",
      },
      ...(shippingAddress ? { shippingAddress } : {}),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        qty: Number(item.qty) || 1,
        image: item.image || "/images/cat-laptop.jpg",
      })),
      subtotal: Math.round(subtotal),
      shipping: Math.round(Number(shipping)),
      discount: Math.round(Number(discount)),
      couponCode: couponCode || undefined,
      total: Math.round(total),
      currency: currency || "PKR",
      paymentMethod,
      paymentStatus: paymentMethod.toLowerCase().includes("cash on delivery") ? "Pending" : "Awaiting Verification",
      status: "pending",
      notes: notes || "",
      trackingNumber: "",
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    await writeCollection("orders", orders);

    // Decrement product stock
    const products = (await readCollection("products")) || [];
    let productsChanged = false;
    items.forEach((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (prod && typeof prod.stock === "number") {
        prod.stock = Math.max(0, prod.stock - (Number(item.qty) || 1));
        productsChanged = true;
      }
    });
    if (productsChanged) await writeCollection("products", products);

    // Increment coupon usage count if coupon applied
    if (couponCode) {
      const coupons = (await readCollection("coupons")) || [];
      const cp = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (cp) {
        cp.usageCount = (cp.usageCount || 0) + 1;
        await writeCollection("coupons", coupons);
      }
    }

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update order (restores stock if transitioned to cancelled)
router.put("/:id", async (req, res) => {
  try {
    const orders = (await readCollection("orders")) || [];
    const index = orders.findIndex((o) => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: "Order not found" });

    const prevStatus = orders[index].status;
    const nextStatus = req.body.status || prevStatus;

    orders[index] = { ...orders[index], ...req.body, id: orders[index].id, updatedAt: new Date().toISOString() };
    await writeCollection("orders", orders);

    // Restore stock when transitioning into cancelled
    if (prevStatus !== "cancelled" && nextStatus === "cancelled" && Array.isArray(orders[index].items)) {
      const products = (await readCollection("products")) || [];
      let changed = false;
      orders[index].items.forEach((item) => {
        const prod = products.find((p) => p.id === item.id);
        if (prod && typeof prod.stock === "number") {
          prod.stock += Number(item.qty) || 1;
          changed = true;
        }
      });
      if (changed) await writeCollection("products", products);
    }

    res.json({ success: true, data: orders[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    let orders = (await readCollection("orders")) || [];
    if (!orders.some((o) => o.id === req.params.id)) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    orders = orders.filter((o) => o.id !== req.params.id);
    await writeCollection("orders", orders);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
