import { generateId, isoDate } from "./helpers";

export const payouts = Array.from({ length: 15 }, (_, i) => ({
  id: generateId("pay", i + 1),
  transactionId: generateId("txn", i + 1),
  amount: 5000 + (i % 10) * 2500,
  method: ["bank_transfer", "upi"][i % 2],
  bankAccount: i % 2 === 0 ? "****4521" : null,
  upiId: i % 2 === 1 ? "provider@upi" : null,
  status: ["completed", "completed", "processing", "pending", "failed"][i % 5],
  createdAt: isoDate(i * 5),
  completedAt: i % 5 !== 3 ? isoDate(i * 5 - 1) : null,
}));
