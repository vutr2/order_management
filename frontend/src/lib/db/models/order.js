import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  sku: { type: String, default: "" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    platform: {
      type: String,
      enum: ["shopee", "lazada", "manual"],
      default: "manual",
    },
    platformOrderId: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    shippingAddress: { type: String, default: "" },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipping",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    trackingNumber: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
