import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authController from './controllers/authController.js';

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

// ---- Mongo ----
const { MONGO_URI, PORT = 5000 } = process.env;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
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

// Health check route
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Registration route
app.post("/api/register", register);

// Login route
app.post("/api/login", login);

// Product routes
app.get("/api/products", async (_req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cart routes
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

// Order routes
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

// ---- Listen (once!) ----
app.listen(PORT, () => {
  console.log(`API at http://localhost:${PORT}`);
});
