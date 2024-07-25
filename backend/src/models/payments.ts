import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
});

export const Payment = model("Payment", paymentSchema);
