"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { BookingPaymentView, resolveBookingPackage } from "@/components/provider-booking/booking-payment-view";
import { getProviderById } from "@/mock/providers";

function PackagePaymentContent() {
  const { id, packageId } = useParams();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const isDoctorFlow = categorySlug === "doctor";

  const provider = getProviderById(id);
  const pkg = resolveBookingPackage(packageId);

  if (!provider || !pkg) {
    return <div className="flex min-h-dvh items-center justify-center">Payment details not found</div>;
  }

  const flowProvider = {
    ...provider,
    businessName: searchParams.get("name") || provider.businessName,
    specialty: searchParams.get("specialty") || provider.specialty,
    avatar: searchParams.get("avatar") || provider.avatar,
  };

  return (
    <BookingPaymentView
      provider={flowProvider}
      isDoctorFlow={isDoctorFlow}
      bookingPackage={pkg}
    />
  );
}

export default function PackagePaymentPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center">Loading...</div>}>
      <PackagePaymentContent />
    </Suspense>
  );
}
