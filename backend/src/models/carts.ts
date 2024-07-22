import { Schema, model } from "mongoose";

const cartItemsSchema = new Schema({
  productId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  provider: { type: String, required: true },
});

const cartSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  cartItems: [cartItemsSchema],
});

export const Cart = model("Cart", cartSchema);
