"use client";

import { BookingPaymentView } from "@/components/provider-booking/booking-payment-view";
import { DesktopLayout } from "@/components/responsive/layout";

export function PaymentDesktop({ provider, categorySlug }) {
  return (
    <DesktopLayout maxWidth="wide" contentClassName="!py-0">
      <BookingPaymentView provider={provider} categorySlug={categorySlug} />
    </DesktopLayout>
  );
}
