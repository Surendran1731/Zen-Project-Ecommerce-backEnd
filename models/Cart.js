import mongoose from "mongoose";

const schema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Cart = mongoose.model("Cart", schema);