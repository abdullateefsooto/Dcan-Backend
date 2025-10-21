const mongoose = require("mongoose");

// Define the Order schema (the structure of how an order will look in the database)
const orderSchema = new mongoose.Schema(
  {
    // The user who placed the order (referencing the User collection)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This links to the 'User' model
      required: true,
    },

    // List of all items (products) in the order
    orderItems: [
      {
        // Each order item references a Product document
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Links to the 'Product' model
          required: true,
        },

        // Quantity of that specific product in the order
        qty: {
          type: Number,
          required: true,
        },
      },
    ],

    // The total price of the entire order (sum of all orderItems)
    totalPrice: {
      type: Number,
      required: true,
    },

    // Current order status (Pending by default)
    status: {
      type: String,
      default: "Pending",
    },

    // Shipping or delivery address
    address: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
