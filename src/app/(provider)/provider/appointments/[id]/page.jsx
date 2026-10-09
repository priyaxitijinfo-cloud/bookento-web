"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";

import { ProviderBookingDetailsView } from "@/features/provider/components/provider-booking-details-view";

function BookingDetailsContent() {
  const { id } = useParams();
  return <ProviderBookingDetailsView appointmentId={id} />;
}

export default function ProviderAppointmentDetailPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1 bg-[#F4F7FF]" />}>
        <BookingDetailsContent />
      </Suspense>
    </div>
  );
}
