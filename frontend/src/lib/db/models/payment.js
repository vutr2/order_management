import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    plan: {
      type: String,
      enum: ["pro", "business"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    vnpayTxnRef: { type: String, unique: true },
    vnpayTransactionNo: { type: String },
    vnpayResponseCode: { type: String },
    bankCode: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
