import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    plan: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    vnpayTransactionId: { type: String },
  },
  { timestamps: true }
);

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
