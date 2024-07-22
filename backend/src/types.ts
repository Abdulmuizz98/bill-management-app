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
