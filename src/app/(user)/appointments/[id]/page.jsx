"use client";

import { useParams, useRouter } from "next/navigation";

import { BookingDetailsView } from "@/components/appointments/booking-details-view";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { getAppointmentById } from "@/mock/appointments";

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const appointment = getAppointmentById(id);

  if (!appointment) {
    return (
      <div className="bg-background flex min-h-dvh items-center justify-center overflow-x-hidden p-6 pb-20 md:pb-8">
        <EmptyState
          title="Booking not found"
          description="This appointment may have been removed or the link is invalid."
          actionLabel="Back to bookings"
          onAction={() => router.push(ROUTES.APPOINTMENTS)}
        />
      </div>
    );
  }

  return <BookingDetailsView appointment={appointment} />;
}
