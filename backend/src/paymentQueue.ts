import Bull, { Job } from "bull";
import { addOptions, queueOptions } from "./utils";
import { Transaction, TransactionSet } from "./types";
import { verifyPayStack } from "./payments";
import { startSession } from "mongoose";
import { Transaction as TransColl } from "./models/transaction";
import { Payment } from "./models/payments";
import { queueTransactions } from "./transactionQueue";

const QUEUE_PROCESS_ATTEMPTS = Number(process.env.QUEUE_PROCESS_ATTEMPTS);
export const paymentQueue = new Bull("payment", queueOptions);

export async function queuePayments(transactionSet: TransactionSet) {
  paymentQueue.add({ ...transactionSet }, addOptions);
}

export async function processPaymentQueue(job: Job) {
  const { data } = job;

  // All items must have same transaction id portion
  const areAllTrueSubsets = data.transactions.every((trans: Transaction) =>
    trans.transactionId.startsWith(`${data.transactionId}-`)
  );

  if (!areAllTrueSubsets) {
    console.log("Invalid transaction set: ", data.transactionRef);
    return;
  }
  const amount = data.transactions.reduce(
    (acc: number, trans: Transaction) => acc + trans.amount,
    0
  );

  let isVerified = false;
  switch (data.paymentMethod) {
    case "paystack":
      isVerified = await verifyPayStack(data.transactionRef, amount);
      break;
    case "bnpl":
      // isVerified = verifyBnpl(data, amount);
      break;
    case "link":
      // isVerified = verifyLink(data, amount);
      break;
    default:
      break;
  }

  // If payment is verified, check db.
  // If exists do nothing;
  // If it doesnt exist in db, add to payment db, then add transactions to transaction db
  // queue transactions to transactionQueue for processing
  // (some of the transactions may not be resolved even if payment exists)
  if (isVerified) {
    const payment = await Payment.findOne({
      transactionId: data.transactionId,
    });
    if (!payment) {
      const session = await startSession();

      try {
        await session.withTransaction(async () => {
          console.log("Saving payment and transactions...");
          const newPayment = await Payment.create(
            [
              {
                transactionId: data.transactionId,
                amount: amount,
                paymentMethod: data.paymentMethod,
              },
            ],
            { session }
          );

          const transactions = data.transactions.map((trans: Transaction) => ({
            paymentId: data.transactionId,
            transactionId: trans.transactionId,
            amount: trans.amount,
            productId: trans.productId,
            provider: trans.provider,
            customerRef: trans.customerRef,
            phone: trans.phone,
            category: trans.category,
            email: trans.email,
          }));

          await TransColl.insertMany(transactions, { session });
        });
      } catch (err: any) {
        console.error("Error saving payment and transactions: ", err);
        isVerified = false;
      } finally {
        await session.endSession();
      }
    }

    isVerified && queueTransactions(data.transactions);
  }

  // Just because if dbTransaction fail, ill set isVerified to false
  if (!isVerified) {
    const errorMessage =
      job.attemptsMade === QUEUE_PROCESS_ATTEMPTS
        ? `Payment verification failed after 3 attempts for: ${data.transactionRef}`
        : `Payment verification failed for: ${data.transactionRef}. Retrying...`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}
