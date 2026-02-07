import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/order";

export async function getOrders(userId, { page = 1, limit = 20, status } = {}) {
  await connectDB();
  const filter = { userId };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getOrderById(userId, orderId) {
  await connectDB();
  return Order.findOne({ _id: orderId, userId }).lean();
}

export async function createOrder(userId, data) {
  await connectDB();
  return Order.create({ ...data, userId });
}

export async function updateOrder(userId, orderId, data) {
  await connectDB();
  return Order.findOneAndUpdate({ _id: orderId, userId }, data, {
    new: true,
  }).lean();
}

export async function updateOrderStatus(userId, orderId, status) {
  return updateOrder(userId, orderId, { status });
}
