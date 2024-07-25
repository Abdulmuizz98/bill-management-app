import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  paymentId: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  done: { type: Boolean, required: true, default: false },
  amount: { type: Number, required: true },
  provider: { type: String, required: true },
  productId: { type: String, required: true },
  customerRef: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
});

export const Transaction = model("Transaction", transactionSchema);
