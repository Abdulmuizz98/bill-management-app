import express, { Request, Response } from "express";
import { getAuthPayload } from "./auth";
import axios from "axios";
import Bull, { Job } from "bull";

const billsRouter = express.Router();

interface Transaction {
  amount: number;
  provider: string;
  productId: string;
  customerRef: string;
  phone: string;
  category: "airtime" | "data";
}

const serviceHost = process.env.SERVICE_HOST || "";

const transactionQueue = new Bull("transaction", {
  redis: "localhost:6379",
});

async function queueTransactions(transactions: Transaction[]) {
  transactions.forEach((transaction) => {
    transactionQueue.add({ ...transaction });
  });
}

// TODO: Implement rety & refund after max retries logic
// TODO: Implement Notification Service to notify on status of transactions.
// TODO: Possibly save transaction records in a db
async function processTransactionQueue() {
  transactionQueue.process(async (job: Job) => {
    const { data } = job;
    console.log("Processing transaction: ", data);

    const { category, provider, amount, productId, customerRef, phone } =
      job.data;
    console.log(`Processing ${category} transaction for: `, customerRef);

    let isSuccess = false;
    switch (category) {
      case "airtime":
      case "data":
        isSuccess = await vendAirtimeOrData({
          category,
          amount,
          productId,
          customerRef,
          phone,
          provider,
        });
        break;
      default:
        break;
    }

    if (isSuccess) {
      console.log(
        `Transaction ${category} - ${customerRef} successfully completed`
      );
    } else {
      console.log(
        `Transaction ${category} - ${customerRef} failed... Retrying`
      );
    }
  });
}
transactionQueue.process(processTransactionQueue);

// Call API to vend airtime or data
async function vendAirtimeOrData({
  category,
  amount,
  productId,
  customerRef,
  phone,
}: Transaction) {
  const route = category === "airtime" ? "topup" : "datatopup";
  const endpoint = `https://${serviceHost}/api/${route}/exec/${phone}`;

  const payload = {
    product_id: productId,
    denomination: amount,
    send_sms: true,
    sms_text: "",
    customer_reference: customerRef,
  };
  const authPayload = await getAuthPayload();

  try {
    if (!authPayload) {
      throw new Error("Failed to get auth payload");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authPayload.token}`,
    };

    const response = await axios.post(endpoint, payload, { headers });
    return response.status === 201;
  } catch (err) {
    console.log("Error vending airtime: ", err);
    return false;
  }
}

// Callback to queue transactions on successful payment
billsRouter.post("/queue-transactions", async (req: Request, res: Response) => {
  const { transactions } = req.body;

  try {
    await queueTransactions(transactions);
    // Generate API key for the user
    console.log("Transactions queued successfully");

    res.status(200).json({ message: "Transactions are processing.." });
  } catch (error) {
    console.error("Error in queuing transaction: ", error);
    res.status(400).json({ error: "Failed to queue transaction" });
  }
});

// Gateway to get airtime info for a msisdn.
billsRouter.post(
  "/airtime-info/:phone",
  async (req: Request, res: Response) => {
    const { phone } = req.params;
    const endpoint = `https://${serviceHost}/api/topup/info/${phone}`;
    const authHeader = req.headers["authorization"];

    const headers = {
      "Content-Type": "application/json",
      Authorization: authHeader,
    };

    try {
      const response = await axios.get(endpoint, { headers });
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error("Error getting phone info:");
      res.status(error.response?.status || 400).json({ error: error.message });
    }
  }
);

// Gateway to get data info for a msisdn.
billsRouter.post("/data-info/:phone", async (req: Request, res: Response) => {
  const { phone } = req.params;
  const endpoint = `https://${serviceHost}/api/datatopup/info/${phone}`;
  const authHeader = req.headers["authorization"];

  const headers = {
    "Content-Type": "application/json",
    Authorization: authHeader,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error getting data info:");
    res.status(error.response?.status || 400).json({ error: error.message });
  }
});

export default billsRouter;
