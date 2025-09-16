import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";                    // ⬅️ add
import { register, login } from "./controllers/authController.js";
import User from "./models/User.js";               // ⬅️ add (for /api/me)

dotenv.config();

const app = express();

// CORS: allow your frontend dev origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ---- Env & Mongo ----
const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env");
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected successfully");
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}

// ---- Simple JWT auth middleware ----
const auth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const [scheme, token] = hdr.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ---- Schemas/Models ----
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  category: String,
});

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  imageUrl: String,
  quantity: Number,
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [cartItemSchema],
  total: Number,
  address: String,
  paymentMethod: String,
  gcashNumber: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Order = mongoose.model("Order", orderSchema);

// ---- Routes ----

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Auth
app.post("/api/register", register);
app.post("/api/login", login);

// Current user (token-based)
app.get("/api/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Product routes
app.get("/api/products", async (_req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------- CART -------------------- */
/** Preferred, secure (uses token’s userId) */
app.get("/api/me/cart", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart ?? { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/me/cart", auth, async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    let cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ userId: req.user.id, items });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** Legacy (kept for compatibility) */
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ?? { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/api/cart", async (req, res) => {
  try {
    const { userId, items } = req.body ?? {};
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = Array.isArray(items) ? items : [];
      await cart.save();
    } else {
      cart = await Cart.create({ userId, items: Array.isArray(items) ? items : [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------- ORDERS -------------------- */
/** Preferred, secure (uses token’s userId) */
app.post("/api/me/orders", auth, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, userId: req.user.id });
    await Cart.deleteOne({ userId: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/me/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** Legacy */
app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    await Cart.deleteOne({ userId: req.body.userId });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- 404 + error fallbacks (optional, nice to have) ----
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// ---- Listen ----
app.listen(PORT, () => {
  console.log(`API at http://localhost:${PORT}`);
});
