import Order from "../models/Order.js";
import Products from "./models/Products";

export async function computeOrderWeight(orderId) {
  // populate products so we see product weightKg
  const order = await Order.findById(orderId)
    .populate({ path: "products.product", select: "weightKg name" })
    .lean();
  if (!order) throw new Error("Order not found");

  let total = 0;
  for (const line of order.products || []) {
    const w = Number(line?.product?.weightKg ?? 0); // treat null as 0
    const qty = Number(line?.quantity ?? 0);
    if (Number.isFinite(w) && Number.isFinite(qty)) total += w * qty;
  }
  // round to 2 decimals for neatness
  return Math.round(total * 100) / 100;
}