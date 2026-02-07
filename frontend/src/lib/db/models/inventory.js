import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
