import express, { Request, Response } from "express";
import { getAuthPayload } from "./auth";
import axios from "axios";
import { paymentQueue, processPaymentQueue } from "./paymentQueue";
import { transactionQueue, processTransactionQueue } from "./transactionQueue";
import { queuePayments } from "./paymentQueue";

const billsRouter = express.Router();
const BASE_URL = process.env.SERVICE_BASE_URL || "";

paymentQueue.process(processPaymentQueue);
transactionQueue.process(processTransactionQueue);

// Callback to queue transactions on successful payment
billsRouter.post("/queue-transactions", async (req: Request, res: Response) => {
  const { transactionSet } = req.body;

  try {
    await queuePayments(transactionSet);
    // Generate API key for the user
    console.log("Transactions queued successfully");

    res.status(200).json({ message: "Transactions are processing.." });
  } catch (error) {
    console.error("Error in queuing transaction: ", error);
    res.status(400).json({ error: "Failed to queue transaction" });
  }
});

// Gateway to get airtime info for a msisdn.
billsRouter.get("/airtime-info/:phone", async (req: Request, res: Response) => {
  const { phone } = req.params;
  const endpoint = `${BASE_URL}/api/topup/info/${phone}`;
  const authHeader = req.headers["authorization"];

  const headers = {
    "Content-Type": "application/json",
    Authorization: authHeader,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error getting phone info: ", error.message);
    res.status(error.response?.status || 400).json({ error: error.message });
  }
});

// Gateway to get data info for a msisdn.
billsRouter.get("/data-info/:phone", async (req: Request, res: Response) => {
  const { phone } = req.params;
  const endpoint = `${BASE_URL}/api/datatopup/info/${phone}`;
  const authHeader = req.headers["authorization"];

  const headers = {
    "Content-Type": "application/json",
    Authorization: authHeader,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error getting data info: ", error.message);
    res.status(error.response?.status || 400).json({ error: error.message });
  }
});

export default billsRouter;
