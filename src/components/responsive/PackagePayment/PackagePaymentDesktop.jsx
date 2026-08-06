"use client";

import { BookingPaymentView } from "@/components/provider-booking/booking-payment-view";
import { DesktopLayout } from "@/components/responsive/layout";

export function PackagePaymentDesktop({ provider, categorySlug, bookingPackage }) {
  return (
    <DesktopLayout maxWidth="wide" contentClassName="!py-0">
      <BookingPaymentView
        provider={provider}
        categorySlug={categorySlug}
        bookingPackage={bookingPackage}
      />
    </DesktopLayout>
  );
}
