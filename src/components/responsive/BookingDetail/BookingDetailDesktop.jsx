"use client";

import { BookingDetailsView } from "@/components/appointments/booking-details-view";

export function BookingDetailDesktop({ appointment }) {
  return <BookingDetailsView appointment={appointment} />;
}
