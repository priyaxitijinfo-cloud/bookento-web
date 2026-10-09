import { generateId, isoDate } from "./helpers";

const BANKS = [
  { name: "HDFC", mask: "****4567" },
  { name: "SBI", mask: "****7890" },
  { name: "ICICI", mask: "****2345" },
  { name: "Axis", mask: "****6789" },
];

const FIGMA_OVERRIDE = {
  payoutCode: "PY123456",
  txnId: "TXN9876543210",
  amount: 45200,
  bankName: "HDFC",
  bankMask: "****4567",
  status: "completed",
  daysAgo: 122, // ~10 Apr 2026
};

export const payouts = Array.from({ length: 15 }, (_, i) => {
  const isFirst = i === 0;
  const bank = BANKS[i % BANKS.length];
  const method = isFirst || i % 2 === 0 ? "bank_transfer" : "upi";
  const status = isFirst
    ? "completed"
    : ["completed", "completed", "processing", "pending", "failed"][i % 5];
  const daysAgo = isFirst ? FIGMA_OVERRIDE.daysAgo : i * 5;

  return {
    id: generateId("pay", i + 1),
    payoutCode: isFirst
      ? FIGMA_OVERRIDE.payoutCode
      : `PY${String(100000 + i).slice(0, 6)}`,
    transactionId: generateId("txn", i + 1),
    txnId: isFirst ? FIGMA_OVERRIDE.txnId : `TXN${String(9000000000 + i * 1111)}`,
    amount: isFirst ? FIGMA_OVERRIDE.amount : 5000 + (i % 10) * 2500,
    method,
    bankName:
      method === "bank_transfer"
        ? isFirst
          ? FIGMA_OVERRIDE.bankName
          : bank.name
        : null,
    bankMask:
      method === "bank_transfer"
        ? isFirst
          ? FIGMA_OVERRIDE.bankMask
          : bank.mask
        : null,
    bankAccount:
      method === "bank_transfer"
        ? isFirst
          ? FIGMA_OVERRIDE.bankMask
          : bank.mask
        : null,
    bankLabel:
      method === "bank_transfer"
        ? `Bank: ${isFirst ? FIGMA_OVERRIDE.bankName : bank.name} ${isFirst ? FIGMA_OVERRIDE.bankMask : bank.mask}`
        : null,
    upiId: method === "upi" ? "provider@upi" : null,
    status,
    statusLabel: status.charAt(0).toUpperCase() + status.slice(1),
    createdAt: isoDate(daysAgo),
    completedAt: status !== "pending" ? isoDate(daysAgo - 1) : null,
  };
});
