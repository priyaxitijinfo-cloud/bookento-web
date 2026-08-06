import { avatarUrl, generateId, isoDate, personName } from "./helpers";
import { services } from "./services";

export const transactions = Array.from({ length: 30 }, (_, i) => {
  const gross = 500 + (i % 20) * 350;
  const commission = Math.round(gross * 0.15);
  return {
    id: generateId("txn", i + 1),
    userId: generateId("user", i + 1),
    userName: personName(i),
    userAvatar: avatarUrl(`txn-user-${i}`),
    serviceName: services[i % services.length].name,
    appointmentId: generateId("apt", i + 1),
    grossAmount: gross,
    commission,
    netEarnings: gross - commission,
    paymentMethod: ["upi", "card", "wallet", "net_banking"][i % 4],
    status: ["completed", "completed", "pending", "completed"][i % 4],
    createdAt: isoDate(i),
  };
});

export const walletTransactions = Array.from({ length: 20 }, (_, i) => ({
  id: generateId("wtxn", i + 1),
  type: i % 3 === 0 ? "credit" : "debit",
  amount: 200 + (i % 8) * 150,
  balance: 5000 - i * 200,
  description: i % 3 === 0 ? "Wallet top-up" : `Booking payment #${1000 + i}`,
  status: "completed",
  createdAt: isoDate(i * 2),
}));
