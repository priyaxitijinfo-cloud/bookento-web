"use client";

import { BookingPaymentView } from "@/components/provider-booking/booking-payment-view";

export function PaymentTablet({ provider, categorySlug }) {
  return <BookingPaymentView provider={provider} categorySlug={categorySlug} />;
}
