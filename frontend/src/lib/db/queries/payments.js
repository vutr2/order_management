import { connectDB } from "@/lib/db/mongoose";
import { Payment } from "@/lib/db/models/payment";

export async function createPayment(userId, data) {
  await connectDB();
  return Payment.create({ ...data, userId });
}

export async function getPaymentByTxnRef(txnRef) {
  await connectDB();
  return Payment.findOne({ vnpayTxnRef: txnRef }).lean();
}

export async function updatePaymentStatus(txnRef, data) {
  await connectDB();
  return Payment.findOneAndUpdate({ vnpayTxnRef: txnRef }, data, {
    new: true,
  }).lean();
}

export async function getPaymentHistory(userId, { page = 1, limit = 10 } = {}) {
  await connectDB();
  const [payments, total] = await Promise.all([
    Payment.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Payment.countDocuments({ userId }),
  ]);
  return { payments, total, page, totalPages: Math.ceil(total / limit) };
}
