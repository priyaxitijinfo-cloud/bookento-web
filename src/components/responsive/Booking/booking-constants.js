import { Building2, Calendar, Check, CreditCard, Home, Monitor, Wallet } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";
import { PAYMENT_METHODS } from "@/constants/status.constants";

export const BOOKING_STEPS = [
  { id: "visit", label: "Visit Type", icon: LocationIcon },
  { id: "services", label: "Services", icon: Check },
  { id: "datetime", label: "Date & Time", icon: Calendar },
  { id: "summary", label: "Summary", icon: Check },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "success", label: "Done", icon: Check },
];

export const BOOKING_VISIT_OPTIONS = [
  { value: "in_clinic", label: "In Clinic", icon: Building2, desc: "Visit the provider's location" },
  { value: "home_visit", label: "Home Visit", icon: Home, desc: "Provider comes to you" },
  { value: "online", label: "Online", icon: Monitor, desc: "Virtual consultation" },
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
