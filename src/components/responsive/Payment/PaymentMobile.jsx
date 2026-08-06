"use client";

import { BookingPaymentView } from "@/components/provider-booking/booking-payment-view";

export function PaymentMobile({ provider, categorySlug }) {
  return <BookingPaymentView provider={provider} categorySlug={categorySlug} />;
}
