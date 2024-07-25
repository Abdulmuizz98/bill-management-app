import express, { Request } from "express";

export interface CustomRequest extends Request {
  user?: any;
}

export interface CartItem {
  productId: string;
  amount: number;
  date: Date;
  phone: string;
  category: string;
  provider: string;
  _id?: string;
}

export interface Transaction {
  amount: number;
  provider: string;
  productId: string;
  customerRef: string;
  phone: string;
  email: string;
  transactionId: string;
  category: "airtime" | "data";
}

export interface TransactionSet {
  paymentMethod: PaymentMethod;
  transactionId: string;
  transactionRef: string;
  transactions: Transaction[];
}

export type PaymentMethod = "paystack" | "bnpl" | "link";
