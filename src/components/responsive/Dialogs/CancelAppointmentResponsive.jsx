"use client";

import { CancelAppointmentModal } from "@/components/appointments/cancel-appointment-modal";

/** Responsive wrapper around the existing cancel appointment modal. */
export function CancelAppointmentResponsive(props) {
  return <CancelAppointmentModal {...props} onClose={props.onClose ?? props.onOpenChange?.bind(null, false)} />;
}
