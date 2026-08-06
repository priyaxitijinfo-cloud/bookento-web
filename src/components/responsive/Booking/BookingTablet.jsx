"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { HomeHeader } from "@/components/home/home-header";
import { DESKTOP_STICKY_HEADER_CLASS } from "@/lib/layout/page-layout.constants";

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
    <div className="bg-background min-h-dvh pb-24">
      <div className={DESKTOP_STICKY_HEADER_CLASS}>
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={props.backHref}
          backLabel="Back to Providers"
          currentLabel="Book Appointment"
        />
      </div>

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
