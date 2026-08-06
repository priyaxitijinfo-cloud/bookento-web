"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Heart,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LocationIcon } from "@/components/icons/location-icon";
import { getCategoryBookingData, getCategoryPackageById } from "@/constants/category-booking.constants";
import { PACKAGE_THEMES, DOCTOR_WELLNESS_PACKAGES } from "@/constants/doctor-booking.constants";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { PAYMENT_METHODS } from "@/constants/status.constants";
import { ROUTES } from "@/constants/routes.constants";
import { timeSlots } from "@/mock/appointments";
import { getPackageById } from "@/mock/packages";
import { getServicesByProvider } from "@/mock/services";
import { useBookingStore, useProfileStore } from "@/store";
import { cn } from "@/lib/utils";
import { formatBookingDateLabel, formatCurrency, getLocalDateKey } from "@/utils/format.utils";
import { sharePageLink } from "@/utils/share.utils";
import { BookingSuccessModal } from "@/components/provider-booking/booking-success-modal";
import { BranchPickerDialog } from "@/components/provider-booking/branch-picker-dialog";

const PLATFORM_FEE = 2000;

function UpiLogo({ className }) {
  return (
    <img
      src="/icons/Upi.svg"
      alt="UPI"
      className={cn("size-10 shrink-0 object-contain", className)}
      draggable={false}
    />
  );
}

function WalletLogo({ className }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EFF6FF]",
        className,
      )}
    >
      <img src="/icons/Frame.svg" alt="Wallet" className="size-8 object-contain" draggable={false} />
    </span>
  );
}

function PaymentRadioIndicator({ active, className }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        active ? "border-primary bg-primary" : "border-border bg-background",
        className,
      )}
      aria-hidden
    >
      {active && <span className="size-2 rounded-full bg-background" />}
    </span>
  );
}

function PaymentSectionTitle({ children }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4 md:mb-4">
      <h2 className="min-w-0 text-base font-bold text-foreground md:text-lg">{children}</h2>
    </div>
  );
}

function PaymentLineRow({ label, amount, strikethrough = false, amountClassName }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-medium text-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold",
          strikethrough ? "text-muted-foreground line-through" : "text-foreground",
          amountClassName,
        )}
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

export function resolveBookingPackage(packageId, bookingPackage = null) {
  if (bookingPackage) return bookingPackage;
  if (!packageId) return null;

  const doctorPackage = DOCTOR_WELLNESS_PACKAGES.find((pkg) => pkg.id === packageId);
  if (doctorPackage) return doctorPackage;

  const mockPackage = getPackageById(packageId);
  if (!mockPackage) return null;

  return {
    ...mockPackage,
    features: [
      `${mockPackage.serviceIds?.length ?? 0} included services`,
      "Priority support",
      "Flexible scheduling",
    ],
    theme: "blue",
  };
}

export function BookingPaymentView({ provider, categorySlug = null, bookingPackage = null }) {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [saved, setSaved] = useState(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const categoryBookingData = categorySlug ? getCategoryBookingData(categorySlug, provider.businessName) : null;
  const draft = useBookingStore((state) => state.draft);
  const setProviderId = useBookingStore((state) => state.setProviderId);
  const setPackageId = useBookingStore((state) => state.setPackageId);
  const setVisitType = useBookingStore((state) => state.setVisitType);
  const setScheduledDate = useBookingStore((state) => state.setScheduledDate);
  const setScheduledTime = useBookingStore((state) => state.setScheduledTime);
  const setBranchId = useBookingStore((state) => state.setBranchId);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  const completeBooking = useBookingStore((state) => state.completeBooking);
  const reset = useBookingStore((state) => state.reset);
  const isComplete = useBookingStore((state) => state.isComplete);

  useEffect(() => {
    if (!provider?.id) return;

    const { draft: currentDraft } = useBookingStore.getState();

    setProviderId(provider.id);

    if (bookingPackage?.id) {
      setPackageId(String(bookingPackage.id));
    }

    if (!currentDraft.visitType) setVisitType("in_clinic");
    if (!currentDraft.scheduledDate) setScheduledDate(getLocalDateKey(new Date()));
    if (!currentDraft.scheduledTime) setScheduledTime(timeSlots[2]?.time || "11:00 AM");
    if (!currentDraft.branchId) setBranchId(PROVIDER_BRANCHES[0].id);
    if (!currentDraft.paymentMethod) setPaymentMethod(PAYMENT_METHODS.WALLET);
  }, [
    provider?.id,
    bookingPackage?.id,
    setProviderId,
    setPackageId,
    setVisitType,
    setScheduledDate,
    setScheduledTime,
    setBranchId,
    setPaymentMethod,
  ]);

  const services = categoryBookingData
    ? categoryBookingData.services
    : getServicesByProvider(provider.id).map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
      }));

  const selectedServices = services.filter((service) => draft.serviceIds.includes(service.id));
  const billingServices = selectedServices.length > 0
    ? selectedServices
    : categoryBookingData
      ? [categoryBookingData.services[0]]
      : services.slice(0, 1);
  const selectedPackage = bookingPackage
    ?? (categorySlug
      ? getCategoryPackageById(categorySlug, draft.packageId)
      : getPackageById(draft.packageId));

  const branch = PROVIDER_BRANCHES.find((item) => item.id === draft.branchId) || PROVIDER_BRANCHES[0];
  const visitLabel = draft.visitType === "in_clinic"
    ? "Onsite"
    : draft.visitType === "online"
      ? "Online"
      : draft.visitType === "home_visit"
        ? "Homevisit"
        : "Onsite";

  const subtotal = selectedPackage
    ? selectedPackage.price
    : billingServices.reduce((sum, service) => sum + service.price, 0);
  const originalPrice = selectedPackage
    ? selectedPackage.originalPrice
    : billingServices.reduce((sum, service) => sum + (service.originalPrice ?? service.price), 0);
  const discount = Math.max(originalPrice - subtotal, 0);
  const amountToPay = selectedPackage ? subtotal : subtotal + PLATFORM_FEE;
  const theme = selectedPackage ? PACKAGE_THEMES[selectedPackage.theme || "rose"] : PACKAGE_THEMES.rose;
  const dateLabel = formatBookingDateLabel(draft.scheduledDate);

  const handlePay = async () => {
    if (!draft.paymentMethod) {
      toast.error("Select a payment method");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    completeBooking();
    toast.success("Booking confirmed!");
  };

  const handleShare = async () => {
    const result = await sharePageLink({
      title: selectedPackage?.name || provider.businessName,
      text: selectedPackage
        ? `${selectedPackage.name} — ${provider.businessName}`
        : provider.businessName,
    });

    if (result === "copied") {
      toast.success("Link copied!");
      return;
    }

    if (result === "failed") {
      toast.error("Could not share link");
    }
  };

  const handleBranchSelect = (selectedBranch) => {
    setBranchId(selectedBranch.id);
    setBranchPickerOpen(false);
    toast.success(`Branch updated to ${selectedBranch.name}`);
  };

  if (isComplete) {
    return (
      <BookingSuccessModal
        open
        doctorName={provider.businessName}
        serviceCount={
          selectedPackage
            ? selectedPackage.features.length
            : billingServices.length
        }
        scheduledTime={draft.scheduledTime || "11:00 AM"}
        onDone={() => {
          reset();
          router.push(ROUTES.HOME);
        }}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-surface-page md:bg-[#ECEEF2]">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-surface-page pb-36 md:max-w-5xl md:pb-32">
        <header className="safe-top sticky top-0 z-30 border-b border-border/60 bg-background">
          <div className="flex h-14 w-full items-center gap-2 px-4 md:px-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="min-w-0 flex-1 text-center text-base font-bold md:text-left">
              Payment Method
            </h1>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setSaved((current) => !current);
                  toast.success(saved ? "Removed from saved" : "Saved to favorites");
                }}
                className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                aria-label={saved ? "Unsave" : "Save"}
              >
                <Heart className={cn("size-5", saved && "fill-rose-500 text-rose-500")} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                aria-label="Share"
              >
                <Share2 className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full space-y-5 px-4 py-4 md:space-y-6 md:px-6 md:py-6">
          <section className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-card">
            {selectedPackage ? (
              <>
                <div className="p-4 md:p-5">
                  <div className="flex items-stretch gap-3.5 md:gap-5">
                    <div className="w-[4.75rem] min-h-[7rem] shrink-0 overflow-hidden rounded-xl bg-muted md:w-[7rem] md:min-h-[8.5rem]">
                      <img
                        src={selectedPackage.image}
                        alt={selectedPackage.name}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base font-bold leading-snug text-foreground md:text-lg">
                          {selectedPackage.name}
                        </h2>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-primary md:text-sm">
                          <img
                            src="/icons/Location1.svg"
                            alt=""
                            className="size-4 shrink-0 object-contain"
                            draggable={false}
                            aria-hidden
                          />
                          {visitLabel}
                        </span>
                      </div>

                      <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
                        {selectedPackage.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm">
                            <span
                              className={cn(
                                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                                theme.checkBg,
                              )}
                            >
                              <Check className="size-2.5 text-white" strokeWidth={3} />
                            </span>
                            <span className="text-muted-foreground leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="px-4 md:px-5">
                  <div className="space-y-2.5 border-t border-border/60 py-4 text-sm md:py-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-foreground">Original Price</span>
                      <span className="font-semibold text-muted-foreground line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-emerald-600">Discount</span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(discount)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pb-4 pt-4 md:pb-5 md:pt-4">
                    <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 md:py-4">
                      <span className="text-sm font-semibold text-primary md:text-base">Amount to Pay</span>
                      <span className="text-primary text-lg font-bold md:text-xl">
                        {formatCurrency(amountToPay)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl md:size-24">
                      <img src={provider.avatar} alt={provider.businessName} className="size-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2.5 md:space-y-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold leading-tight text-foreground md:text-xl">
                            {provider.businessName}
                          </h2>
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-primary md:text-sm">
                            <img
                              src="/icons/Location1.svg"
                              alt=""
                              className="size-4 shrink-0 object-contain"
                              draggable={false}
                              aria-hidden
                            />
                            {visitLabel}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-snug md:text-base">
                          {provider.specialty}
                        </p>
                      </div>

                      {(dateLabel || draft.scheduledTime) && (
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-base">
                          {dateLabel && (
                            <span className="inline-flex items-center gap-2">
                              <img
                                src="/icons/calander.svg"
                                alt=""
                                className="size-5 shrink-0 object-contain"
                                draggable={false}
                                aria-hidden
                              />
                              <span className="font-medium">{dateLabel}</span>
                            </span>
                          )}
                          {draft.scheduledTime && (
                            <span className="inline-flex items-center gap-2">
                              <img
                                src="/icons/time.svg"
                                alt=""
                                className="size-5 shrink-0 object-contain"
                                draggable={false}
                                aria-hidden
                              />
                              <span className="font-medium">{draft.scheduledTime}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 md:px-5">
                  <div className="space-y-2.5 border-t border-border/60 py-4 text-sm md:py-5">
                    {billingServices.map((service) => (
                      <PaymentLineRow key={service.id} label={service.name} amount={service.price} />
                    ))}
                    <PaymentLineRow label="Platform Fees" amount={PLATFORM_FEE} />
                    <PaymentLineRow label="Original Price" amount={originalPrice} strikethrough />
                    {discount > 0 && (
                      <PaymentLineRow
                        label="Discount"
                        amount={discount}
                        amountClassName="text-emerald-600"
                      />
                    )}
                  </div>

                  <div className="border-t border-border/60 pb-4 pt-4 md:pb-5 md:pt-4">
                    <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 md:py-4">
                      <span className="text-sm font-semibold text-primary md:text-base">Amount to Pay</span>
                      <span className="text-primary text-lg font-bold md:text-xl">
                        {formatCurrency(amountToPay)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          <section>
            <PaymentSectionTitle>Branch</PaymentSectionTitle>
            <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-card md:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-[37px] shrink-0 items-center justify-center">
                  <LocationIcon className="size-[25px] text-[#4D5972] md:size-[29px]" />
                </span>
                <button
                  type="button"
                  onClick={() => setBranchPickerOpen(true)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="font-semibold text-foreground">{branch.name}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{branch.address}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setBranchPickerOpen(true)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted"
                  aria-label="Edit branch"
                >
                  <img
                    src="/icons/edit.svg"
                    alt=""
                    className="size-9 object-contain"
                    draggable={false}
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </section>

          <section>
            <PaymentSectionTitle>Payment Options</PaymentSectionTitle>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.UPI)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border bg-background p-4 text-left transition-colors md:p-5",
                  draft.paymentMethod === PAYMENT_METHODS.UPI
                    ? "border-[#B5CEF8] bg-[#EEF4FD] shadow-[0_0_0_1px_rgba(24,101,234,0.08)]"
                    : "border-border/70 hover:border-primary/20",
                )}
              >
                <UpiLogo />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">UPI</p>
                  <p className="text-muted-foreground mt-0.5 text-xs md:text-sm">
                    Google Pay · PhonePe · Paytm · BHIM
                  </p>
                </div>
                <PaymentRadioIndicator active={draft.paymentMethod === PAYMENT_METHODS.UPI} />
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.WALLET)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border bg-background p-4 text-left transition-colors md:p-5",
                  draft.paymentMethod === PAYMENT_METHODS.WALLET
                    ? "border-[#B5CEF8] bg-[#EEF4FD] shadow-[0_0_0_1px_rgba(24,101,234,0.08)]"
                    : "border-border/70 hover:border-primary/20",
                )}
              >
                <WalletLogo />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">Pay with Wallet</p>
                  <p className="text-muted-foreground mt-0.5 text-xs md:text-sm">
                    Available Balance: {formatCurrency(profile.walletBalance || 20000)}
                  </p>
                </div>
                <PaymentRadioIndicator active={draft.paymentMethod === PAYMENT_METHODS.WALLET} />
              </button>
            </div>
          </section>
        </main>

        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 md:px-6">
          <div className="mx-auto w-full max-w-lg md:max-w-5xl">
            <div className="border border-border/70 bg-background p-4 shadow-card md:p-5">
              <div className="flex items-center justify-end">
                <Button
                  size="lg"
                  className="gradient-brand h-12 shrink-0 rounded-xl px-5 text-sm font-semibold shadow-[0_4px_14px_rgba(24,101,234,0.35)] sm:min-w-[10.5rem] sm:px-6 sm:text-base"
                  onClick={handlePay}
                >
                  Pay {formatCurrency(amountToPay)} Securely
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BranchPickerDialog
        open={branchPickerOpen}
        onOpenChange={setBranchPickerOpen}
        selectedBranchId={draft.branchId}
        onSelect={handleBranchSelect}
      />
    </div>
  );
}
