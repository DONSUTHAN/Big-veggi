const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Packed", "Delivered", "Cancelled"],
      default: "Pending"
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "GPay"],
      required: true
    },
    shippingAddress: { type: String, required: true },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // ref:"User" lets Mongoose populate the customer details when needed.

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true, min: 1 },
        priceAtOrder: { type: Number, required: true }
      }
    ]
    // priceAtOrder keeps the old price even if the farmer changes the product later.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
