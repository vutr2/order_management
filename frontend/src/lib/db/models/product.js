import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    sku: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    category: { type: String, default: "" },
    platform: {
      type: String,
      enum: ["shopee", "lazada", "all"],
      default: "all",
    },
    platformProductId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
