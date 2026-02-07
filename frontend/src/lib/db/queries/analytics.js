import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/order";
import { Product } from "@/lib/db/models/product";

export async function getOrderStats(userId) {
  await connectDB();

  const [statusCounts, platformCounts, totalRevenue, orderCount, productCount] =
    await Promise.all([
      Order.aggregate([
        { $match: { userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$platform",
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ userId }),
      Product.countDocuments({ userId, isActive: true }),
    ]);

  return {
    statusCounts,
    platformCounts,
    totalRevenue: totalRevenue[0]?.total || 0,
    orderCount,
    productCount,
  };
}
