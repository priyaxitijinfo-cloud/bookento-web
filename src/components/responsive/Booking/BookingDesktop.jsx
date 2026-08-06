"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { formatCurrency, formatDate } from "@/utils/format.utils";

import {
  BookingProviderBar,
  BookingStepContent,
  BookingStepIndicator,
} from "./booking-wizard-parts";
import { BOOKING_STEPS } from "./booking-constants";

function DesktopBookingHeader() {
  return (
    <div className="mx-auto flex h-[68px] w-full max-w-[90rem] items-center px-6 lg:px-8">
      <div className="min-w-0">
        <Link
          href={ROUTES.PROVIDERS}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Back to Providers
        </Link>
        <h1 className="truncate text-xl font-semibold text-foreground">Book Appointment</h1>
      </div>
    </div>
  );
}

export function BookingDesktop(props) {
  const {
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
  } = props;

  return (
    <DesktopLayout header={<DesktopBookingHeader />} maxWidth="wide">
      <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-background">
        <BookingProviderBar displayProvider={displayProvider} />
        <BookingStepIndicator currentStep={currentStep} className="border-border" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <ResponsiveCard className="!p-6">
          <BookingStepContent
            currentStep={currentStep}
            draft={draft}
            availableVisitTypes={availableVisitTypes}
            setVisitType={setVisitType}
            addresses={addresses}
            setAddressId={setAddressId}
            services={services}
            toggleService={toggleService}
            packages={packages}
            setPackageId={setPackageId}
            dates={dates}
            setScheduledDate={setScheduledDate}
            setScheduledTime={setScheduledTime}
            selectedServices={selectedServices}
            selectedPackage={selectedPackage}
            totalAmount={totalAmount}
            profile={profile}
            setPaymentMethod={setPaymentMethod}
          />
        </ResponsiveCard>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <ResponsiveCard>
            <h3 className="text-base font-semibold text-foreground">Progress</h3>
            <div className="mt-4 space-y-2">
              {BOOKING_STEPS.slice(0, 5).map((step, i) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                    i === currentStep
                      ? "bg-[#EAF3FF] font-semibold text-primary"
                      : i < currentStep
                        ? "text-[#05B21F]"
                        : "text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? (
                    <Check className="size-4 shrink-0" />
                  ) : (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-xs">
                      {i + 1}
                    </span>
                  )}
                  {step.label}
                </div>
              ))}
            </div>
          </ResponsiveCard>

          <ResponsiveCard>
            <h3 className="text-base font-semibold text-foreground">Order summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visit</span>
                <span className="font-medium capitalize">{draft.visitType?.replace("_", " ")}</span>
              </div>
              {draft.scheduledDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{formatDate(draft.scheduledDate, "dd MMM yyyy")}</span>
                </div>
              )}
              {draft.scheduledTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{draft.scheduledTime}</span>
                </div>
              )}
            </div>
            <div className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                {currentStep === 0 ? "Back" : "Previous"}
              </Button>
              <Button onClick={handleNext} loading={processing} className="flex-1">
                {currentStep === 4 ? "Pay & Confirm" : "Continue"}
              </Button>
            </div>
          </ResponsiveCard>
        </aside>
      </div>
    </DesktopLayout>
  );
}
