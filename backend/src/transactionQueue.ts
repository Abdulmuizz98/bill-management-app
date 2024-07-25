import Bull, { Job } from "bull";
import { addOptions, queueOptions } from "./utils";
import axios from "axios";
import { Transaction } from "./types";
import { Transaction as TransColl } from "./models/transaction";
import { getAuthPayload } from "./auth";

const BASE_URL = process.env.SERVICE_BASE_URL || "";
const QUEUE_PROCESS_ATTEMPTS = Number(process.env.QUEUE_PROCESS_ATTEMPTS);

export const transactionQueue = new Bull("transaction", queueOptions);

export async function queueTransactions(transactions: Transaction[]) {
  transactions.forEach((transaction) => {
    transactionQueue.add({ ...transaction }, addOptions);
  });
}

// TODO: Implement refund after max retries.
// TODO: Implement Notification Service to notify on status of transactions.

// Check if transaction is not done.
// Perform transaction; if successful update, if not log (perhaps reque to retry).
export async function processTransactionQueue(job: Job) {
  const { data: transaction } = job;
  console.log("Processing transaction: ", transaction);
  const pendingTransaction = await TransColl.findOne({
    transactionId: transaction.transactionId,
    done: false,
  });

  if (!pendingTransaction) {
    console.log("Transaction already processed: ", transaction.customerRef);
    return;
  }
  console.log(
    `Processing ${transaction.category} transaction for: `,
    transaction.customerRef
  );

  let isSuccess = false;
  switch (transaction.category) {
    case "airtime":
    case "data":
      isSuccess = await vendAirtimeOrData(transaction);
      break;
    default:
      break;
  }

  if (isSuccess) {
    pendingTransaction.done = true;
    await pendingTransaction.save();
    console.log(
      `Transaction ${transaction.category} - ${transaction.customerRef} successfully completed`
    );
  } else {
    let errorMessage =
      job.attemptsMade === QUEUE_PROCESS_ATTEMPTS
        ? `Transaction ${transaction.category} - ${transaction.customerRef} failed after 3 attempts. You have to refund...`
        : `Transaction ${transaction.category} - ${transaction.customerRef} failed... Retrying`;

    throw new Error(errorMessage); // So bull knows that it fails.
  }
}

// Call API to vend airtime or data
async function vendAirtimeOrData({
  category,
  amount,
  productId,
  customerRef,
  phone,
}: Transaction) {
  const route = category === "airtime" ? "topup" : "datatopup";
  const endpoint = `${BASE_URL}/api/${route}/exec/${phone}`;

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
