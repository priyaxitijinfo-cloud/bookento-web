"use client";

import { BookingDetailsView } from "@/components/appointments/booking-details-view";

export function BookingDetailMobile({ appointment }) {
  return <BookingDetailsView appointment={appointment} />;
}
