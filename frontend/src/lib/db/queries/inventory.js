import { connectDB } from "@/lib/db/mongoose";
import { Inventory } from "@/lib/db/models/inventory";

export async function getInventory(userId, { page = 1, limit = 20 } = {}) {
  await connectDB();
  const filter = { userId };

  const [items, total] = await Promise.all([
    Inventory.find(filter)
      .populate("productId", "name sku imageUrl")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Inventory.countDocuments(filter),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getLowStockItems(userId) {
  await connectDB();
  return Inventory.find({
    userId,
    $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
  })
    .populate("productId", "name sku imageUrl")
    .lean();
}

export async function updateStock(userId, productId, quantity) {
  await connectDB();
  return Inventory.findOneAndUpdate(
    { productId, userId },
    { quantity },
    { new: true, upsert: true }
  ).lean();
}

export async function adjustStock(userId, productId, adjustment) {
  await connectDB();
  return Inventory.findOneAndUpdate(
    { productId, userId },
    { $inc: { quantity: adjustment } },
    { new: true, upsert: true }
  ).lean();
}
