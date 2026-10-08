"use client";

import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DESKTOP_STICKY_HEADER_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

import {
  BookingProviderBar,
  BookingStepContent,
  BookingStepIndicator,
  BookingWizardFooter,
} from "./booking-wizard-parts";

export function BookingTablet(props) {
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
    <div className="bg-background flex h-dvh flex-col overflow-hidden pb-24 md:pb-0">
      <div className={cn(DESKTOP_STICKY_HEADER_CLASS, "shrink-0")}>
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={props.backHref}
          backLabel="Back to Providers"
          currentLabel="Book Appointment"
        />
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <BookingProviderBar displayProvider={displayProvider} />
        <BookingStepIndicator currentStep={currentStep} />

        <main className="mx-auto max-w-4xl px-6 py-6">
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
        </main>

        <HomeFooter className="mt-0 md:mt-10" />
      </div>

      <BookingWizardFooter
        currentStep={currentStep}
        totalAmount={totalAmount}
        processing={processing}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}
