"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";

import {
  BookingPaymentView,
  resolveBookingPackage,
} from "@/components/provider-booking/booking-payment-view";
import { getProviderById } from "@/mock/providers";
import { useBookingStore } from "@/store";

function ProviderPaymentContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const draftPackageId = useBookingStore((state) => state.draft.packageId);
  const clearComplete = useBookingStore((state) => state.clearComplete);

  const provider = getProviderById(id);
  const bookingPackage = resolveBookingPackage(draftPackageId, null, categorySlug);

  if (!provider) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        Payment details not found
      </div>
    );
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
      categorySlug={categorySlug}
      bookingPackage={bookingPackage}
    />
  );
}

export default function ProviderPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">Loading...</div>
      }
    >
      <ProviderPaymentContent />
    </Suspense>
  );
}
