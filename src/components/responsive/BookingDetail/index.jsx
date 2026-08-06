"use client";

import { useParams, useRouter } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { ROUTES } from "@/constants/routes.constants";
import { getAppointmentById } from "@/mock/appointments";

import { BookingDetailDesktop } from "./BookingDetailDesktop";
import { BookingDetailMobile } from "./BookingDetailMobile";
import { BookingDetailTablet } from "./BookingDetailTablet";

export function BookingDetailResponsive() {
  const { id } = useParams();
  const router = useRouter();
  const appointment = getAppointmentById(id);

  if (!appointment) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-page p-6 pb-20">
        <EmptyState
          title="Booking not found"
          description="This appointment may have been removed or the link is invalid."
          actionLabel="Back to bookings"
          onAction={() => router.push(ROUTES.APPOINTMENTS)}
        />
      </div>
    );
  }

  return (
    <ResponsiveView
      mobile={<BookingDetailMobile appointment={appointment} />}
      tablet={<BookingDetailTablet appointment={appointment} />}
      desktop={<BookingDetailDesktop appointment={appointment} />}
    />
  );
}

export default BookingDetailResponsive;
