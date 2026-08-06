"use client";

import { RebookAppointmentModal } from "@/components/appointments/rebook-appointment-modal";

/** Responsive wrapper around the existing rebook / reschedule modal. */
export function RescheduleDialogResponsive(props) {
  return <RebookAppointmentModal {...props} onClose={props.onClose ?? props.onOpenChange?.bind(null, false)} />;
}
