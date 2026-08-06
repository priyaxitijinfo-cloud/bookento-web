"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { BookingPaymentView } from "@/components/provider-booking/booking-payment-view";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { getProviderById } from "@/mock/providers";
import { getServicesByProvider } from "@/mock/services";
import { getPackagesByProvider } from "@/mock/packages";
import { useBookingStore, useProfileStore } from "@/store";
import { formatDate } from "@/utils/format.utils";

import { BOOKING_VISIT_OPTIONS, getNextDates } from "./booking-constants";
import { BookingDesktop } from "./BookingDesktop";
import { BookingMobile } from "./BookingMobile";
import { BookingTablet } from "./BookingTablet";

export function BookingResponsive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider");

  const { profile, addresses } = useProfileStore();
  const {
    draft, currentStep, isComplete,
    setProviderId, setVisitType, toggleService, setPackageId,
    setAddressId, setScheduledDate, setScheduledTime,
    setPaymentMethod, setStep, nextStep, prevStep, completeBooking, reset,
  } = useBookingStore();

  const [processing, setProcessing] = useState(false);
  const provider = providerId ? getProviderById(providerId) : null;
  const categorySlug = searchParams.get("from");
  const isCategoryFlow = Boolean(categorySlug && getHomeCategoryBySlug(categorySlug));
  const displayProvider = provider && isCategoryFlow
    ? {
        ...provider,
        businessName: searchParams.get("name") || provider.businessName,
        specialty: searchParams.get("specialty") || provider.specialty,
        avatar: searchParams.get("avatar") || provider.avatar,
      }
    : provider;
  const services = displayProvider ? getServicesByProvider(displayProvider.id) : [];
  const packages = displayProvider ? getPackagesByProvider(displayProvider.id) : [];
  const dates = getNextDates();

  useEffect(() => {
    if (providerId) setProviderId(providerId);
  }, [providerId, setProviderId]);

  useEffect(() => {
    if (searchParams.get("step") === "payment") setStep(4);
  }, [searchParams, setStep]);

  useEffect(() => {
    if (isComplete) setStep(5);
  }, [isComplete, setStep]);

  const selectedServices = useMemo(
    () => services.filter((s) => draft.serviceIds.includes(s.id)),
    [services, draft.serviceIds],
  );

  const selectedPackage = packages.find((p) => p.id === draft.packageId);

  const totalAmount = useMemo(() => {
    if (selectedPackage) return selectedPackage.price;
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedPackage, selectedServices]);

  const availableVisitTypes = BOOKING_VISIT_OPTIONS.filter(
    (v) => displayProvider?.serviceModes.includes(v.value),
  );

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!draft.visitType;
      case 1: return draft.serviceIds.length > 0 || !!draft.packageId;
      case 2: return !!draft.scheduledDate && !!draft.scheduledTime;
      case 3: return true;
      case 4: return !!draft.paymentMethod;
      default: return true;
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      toast.error("Please complete this step");
      return;
    }
    if (currentStep === 4) {
      setProcessing(true);
      await new Promise((r) => setTimeout(r, 1500));
      completeBooking();
      setProcessing(false);
      toast.success("Booking confirmed!");
      nextStep();
      return;
    }
    nextStep();
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
      return;
    }
    prevStep();
  };

  if (!displayProvider) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">No provider selected</p>
        <Link href={ROUTES.PROVIDERS}><Button>Browse Providers</Button></Link>
      </div>
    );
  }

  if (searchParams.get("step") === "payment" || currentStep === 4) {
    return (
      <BookingPaymentView
        provider={displayProvider}
        categorySlug={isCategoryFlow ? categorySlug : null}
      />
    );
  }

  if (currentStep === 5 || isComplete) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-6 text-center">
        <div className="bg-success/10 mb-6 flex size-20 items-center justify-center rounded-full">
          <Check className="text-success size-10" />
        </div>
        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Your appointment with {displayProvider.businessName} is confirmed for{" "}
          {formatDate(draft.scheduledDate, "EEE, dd MMM")} at {draft.scheduledTime}.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href={ROUTES.APPOINTMENTS}><Button>View Bookings</Button></Link>
          <Button variant="outline" onClick={() => { reset(); router.push(ROUTES.HOME); }}>Go Home</Button>
        </div>
      </div>
    );
  }

  const sharedProps = {
    displayProvider,
    currentStep,
    draft,
    availableVisitTypes,
    setVisitType,
    addresses,
    setAddressId,
    services,
    toggleService,
    packages,
    setPackageId,
    dates,
    setScheduledDate,
    setScheduledTime,
    selectedServices,
    selectedPackage,
    totalAmount,
    profile,
    setPaymentMethod,
    processing,
    handleBack,
    handleNext,
    backHref: ROUTES.PROVIDERS,
  };

  return (
    <ResponsiveView
      mobile={<BookingMobile {...sharedProps} />}
      tablet={<BookingTablet {...sharedProps} />}
      desktop={<BookingDesktop {...sharedProps} />}
    />
  );
}

export default BookingResponsive;
