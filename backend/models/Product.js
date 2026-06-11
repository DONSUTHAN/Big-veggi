const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Fruit", "Vegetable", "Grain", "Dairy", "Other"],
      required: true
    },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "kg", trim: true },
    image: { type: String },
    selfie: { type: String },
    location: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
    // The farmer reference connects each product to the farmer who uploaded it.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
