"use client";

import {
  BookingMobileHeader,
  BookingProviderBar,
  BookingStepContent,
  BookingStepIndicator,
  BookingWizardFooter,
} from "./booking-wizard-parts";

export function BookingMobile(props) {
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
      <BookingMobileHeader />
      <BookingProviderBar displayProvider={displayProvider} />
      <BookingStepIndicator currentStep={currentStep} />

      <main className="mx-auto max-w-3xl px-4 py-6">
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
