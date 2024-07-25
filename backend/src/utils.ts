import { QueueOptions } from "bull";

export function isExpired(expiry: Date) {
  return new Date() > expiry;
}

export const queueOptions: QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

export const addOptions = {
  removeOnComplete: true,
  removeOnFail: true,
  attempts: Number(process.env.QUEUE_PROCESS_ATTEMPS),
  backoff: 10000,
};
