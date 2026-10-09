import { format, isValid, parseISO } from "date-fns";

import { avatarUrl, generateId, isoDate, personName, timeSlot } from "./helpers";
import { services } from "./services";

const AVATAR_TONES = [
  { bg: "bg-[#E8F1FF]", text: "text-[#1865EA]" },
  { bg: "bg-[#E8F7EE]", text: "text-[#15803D]" },
  { bg: "bg-[#FFF0F3]", text: "text-[#E11D48]" },
  { bg: "bg-[#FFF7E8]", text: "text-[#D97706]" },
  { bg: "bg-[#F3E8FF]", text: "text-[#7C3AED]" },
];

const FIGMA_OVERRIDES = [
  {
    userName: "Priya Sharma",
    serviceName: "General Consultation",
    grossAmount: 899,
    commission: 120,
    scheduledTime: "11:30 AM",
    daysAgo: 115, // ~17 Apr 2026 from Aug 10 ref
  },
  {
    userName: "Amit Kumar",
    serviceName: "Follow-up Consultation",
    grossAmount: 599,
    commission: 100,
    scheduledTime: "11:30 AM",
    daysAgo: 115,
  },
];

function buildDisplayFields(createdAt, scheduledTime) {
  const parsed = parseISO(createdAt);
  const dateLabel = isValid(parsed) ? format(parsed, "dd MMM yyyy") : "";
  const dateGroup = isValid(parsed) ? format(parsed, "dd/MM/yyyy") : "";
  return {
    scheduledTime,
    displayDate: dateLabel,
    dateGroupLabel: dateGroup,
    scheduledLabel: scheduledTime ? `${scheduledTime} · ${dateLabel}` : dateLabel,
  };
}

export const transactions = Array.from({ length: 30 }, (_, i) => {
  const override = FIGMA_OVERRIDES[i];
  const gross = override?.grossAmount ?? 500 + (i % 20) * 350;
  const commission = override?.commission ?? Math.round(gross * 0.15);
  const daysAgo = override?.daysAgo ?? i;
  const createdAt = isoDate(daysAgo);
  const scheduledTime =
    override?.scheduledTime ?? timeSlot(9 + (i % 8), i % 2 === 0 ? 30 : 0);
  const display = buildDisplayFields(createdAt, scheduledTime);
  const tone = AVATAR_TONES[i % AVATAR_TONES.length];

  return {
    id: generateId("txn", i + 1),
    userId: generateId("user", i + 1),
    userName: override?.userName ?? personName(i),
    userAvatar: avatarUrl(`txn-user-${i}`),
    avatarTone: tone,
    serviceName: override?.serviceName ?? services[i % services.length].name,
    appointmentId: generateId("apt", i + 1),
    grossAmount: gross,
    commission,
    netEarnings: gross - commission,
    paymentMethod: ["upi", "card", "wallet", "net_banking"][i % 4],
    status: ["completed", "completed", "pending", "completed"][i % 4],
    createdAt,
    ...display,
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
