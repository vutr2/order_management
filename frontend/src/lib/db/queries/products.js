import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/db/models/product";

export async function getProducts(userId, { page = 1, limit = 20, category, platform } = {}) {
  await connectDB();
  const filter = { userId, isActive: true };
  if (category) filter.category = category;
  if (platform) filter.platform = { $in: [platform, "all"] };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getProductById(userId, productId) {
  await connectDB();
  return Product.findOne({ _id: productId, userId }).lean();
}

export async function createProduct(userId, data) {
  await connectDB();
  return Product.create({ ...data, userId });
}

export async function updateProduct(userId, productId, data) {
  await connectDB();
  return Product.findOneAndUpdate({ _id: productId, userId }, data, {
    new: true,
  }).lean();
}

export async function deleteProduct(userId, productId) {
  await connectDB();
  return Product.findOneAndUpdate(
    { _id: productId, userId },
    { isActive: false },
    { new: true }
  ).lean();
}
