import { connectDB } from "@/lib/db/mongoose";
import { Subscription } from "@/lib/db/models/subscription";

export async function getSubscription(userId) {
  await connectDB();
  let sub = await Subscription.findOne({ userId }).lean();
  if (!sub) {
    sub = await Subscription.create({ userId, plan: "free", status: "active" });
    sub = sub.toObject();
  }
  return sub;
}

export async function updateSubscription(userId, data) {
  await connectDB();
  return Subscription.findOneAndUpdate({ userId }, data, {
    new: true,
    upsert: true,
  }).lean();
}
