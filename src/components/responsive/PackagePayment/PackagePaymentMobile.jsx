"use client";

import { BookingPaymentView } from "@/components/provider-booking/booking-payment-view";

export function PackagePaymentMobile({ provider, categorySlug, bookingPackage }) {
  return (
    <BookingPaymentView
      provider={provider}
      categorySlug={categorySlug}
      bookingPackage={bookingPackage}
    />
  );
}
