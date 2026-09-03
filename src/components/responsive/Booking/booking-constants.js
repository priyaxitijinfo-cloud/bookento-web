import { Calendar, Check, CreditCard, Wallet } from "lucide-react";

import {
  VisitHomeIcon,
  VisitOnlineIcon,
  VisitOnsiteIcon,
} from "@/components/icons/visit-type-icons";
import { PAYMENT_METHODS } from "@/constants/status.constants";

export const BOOKING_STEPS = [
  { id: "visit", label: "Visit Type", icon: VisitOnsiteIcon },
  { id: "services", label: "Services", icon: Check },
  { id: "datetime", label: "Date & Time", icon: Calendar },
  { id: "summary", label: "Summary", icon: Check },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "success", label: "Done", icon: Check },
];

export const BOOKING_VISIT_OPTIONS = [
  {
    value: "in_clinic",
    label: "In Clinic",
    icon: VisitOnsiteIcon,
    desc: "Visit the provider's location",
  },
  {
    value: "home_visit",
    label: "Home Visit",
    icon: VisitHomeIcon,
    desc: "Provider comes to you",
  },
  {
    value: "online",
    label: "Online",
    icon: VisitOnlineIcon,
    desc: "Virtual consultation",
  },
];

export const BOOKING_PAYMENT_OPTIONS = [
  { value: PAYMENT_METHODS.UPI, label: "UPI", icon: CreditCard },
  { value: PAYMENT_METHODS.WALLET, label: "Wallet", icon: Wallet },
  { value: PAYMENT_METHODS.CARD, label: "Card", icon: CreditCard },
];

export function getNextDates(count = 14) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}
