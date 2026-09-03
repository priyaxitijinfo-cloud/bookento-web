"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  HeroBackIcon,
  HeroHeartIcon,
  HeroShareIcon,
} from "@/components/icons/hero-nav-icons";
import { LocationIcon } from "@/components/icons/location-icon";
import {
  getCategoryBookingData,
  getCategoryPackageById,
} from "@/constants/category-booking.constants";
import {
  PACKAGE_THEMES,
  DOCTOR_WELLNESS_PACKAGES,
} from "@/constants/doctor-booking.constants";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { PAYMENT_METHODS } from "@/constants/status.constants";
import { ROUTES } from "@/constants/routes.constants";
import { timeSlots } from "@/mock/appointments";
import { getPackageById } from "@/mock/packages";
import { getServicesByProvider } from "@/mock/services";
import { useBookingStore, useProfileStore, useAppointmentStore } from "@/store";
import { cn } from "@/lib/utils";
import { RadioIndicator } from "@/components/ui/radio-indicator";
import { createAppointmentFromDraft } from "@/lib/booking/create-appointment-from-draft";
import {
  MOBILE_HEADER_BACK_TITLE_GROUP_CLASS,
  MOBILE_HEADER_CLASS,
  MOBILE_HEADER_INNER_CLASS,
} from "@/lib/layout/mobile-header.constants";
import {
  formatBookingDateLabel,
  formatCurrency,
  getLocalDateKey,
} from "@/utils/format.utils";
import { copyToClipboard, sharePageLink } from "@/utils/share.utils";
import { BookingSuccessModal } from "@/components/provider-booking/booking-success-modal";
import { BranchPickerDialog } from "@/components/provider-booking/branch-picker-dialog";

const PLATFORM_FEE = 2000;
const WEB_CARD_CLASS =
  "overflow-hidden rounded-2xl border border-[#E6EAF2] bg-white shadow-[0_2px_12px_rgba(24,39,75,0.04)]";

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
      <img
        src="/icons/Frame.svg"
        alt="Wallet"
        className="size-8 object-contain"
        draggable={false}
      />
    </span>
  );
}

function PaymentRadioIndicator({ active, className }) {
  return <RadioIndicator selected={active} className={className} />;
}

function PaymentSectionTitle({ children }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-4 md:mb-3">
      <h2 className="text-foreground min-w-0 text-[15px] font-bold md:text-[16px] md:font-semibold">
        {children}
      </h2>
    </div>
  );
}

function PaymentLineRow({
  label,
  amount,
  muted = false,
  green = false,
  strikethrough = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "font-medium",
          green
            ? "text-emerald-600"
            : muted
              ? "text-muted-foreground"
              : "text-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          green
            ? "text-emerald-600"
            : muted || strikethrough
              ? "text-muted-foreground"
              : "text-foreground",
          strikethrough && "line-through",
        )}
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

function PaymentTotalBar({ amount }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3 md:py-3.5">
      <span className="text-primary text-sm font-semibold md:text-[15px]">
        Amount to Pay
      </span>
      <span className="text-primary text-lg font-bold tabular-nums md:text-lg">
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

export function resolveBookingPackage(
  packageId,
  bookingPackage = null,
  categorySlug = null,
) {
  if (bookingPackage) return bookingPackage;
  if (!packageId) return null;

  const categoryPackage = getCategoryPackageById(categorySlug, packageId);
  if (categoryPackage) return categoryPackage;

  const doctorPackage = DOCTOR_WELLNESS_PACKAGES.find((pkg) => pkg.id === packageId);
  if (doctorPackage) return doctorPackage;

  const mockPackage = getPackageById(packageId);
  if (!mockPackage) return null;

  return {
    ...mockPackage,
    features: mockPackage.features?.length
      ? mockPackage.features
      : [
          `${mockPackage.serviceIds?.length ?? 0} included services`,
          "Priority support",
          "Flexible scheduling",
        ],
    theme: mockPackage.theme || "blue",
  };
}

export function BookingPaymentView({
  provider,
  categorySlug = null,
  bookingPackage = null,
}) {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [saved, setSaved] = useState(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const categoryBookingData = categorySlug
    ? getCategoryBookingData(categorySlug, provider.businessName)
    : null;
  const draft = useBookingStore((state) => state.draft);
  const setProviderId = useBookingStore((state) => state.setProviderId);
  const setPackageId = useBookingStore((state) => state.setPackageId);
  const setVisitType = useBookingStore((state) => state.setVisitType);
  const setScheduledDate = useBookingStore((state) => state.setScheduledDate);
  const setScheduledTime = useBookingStore((state) => state.setScheduledTime);
  const setBranchId = useBookingStore((state) => state.setBranchId);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  const completeBooking = useBookingStore((state) => state.completeBooking);
  const clearComplete = useBookingStore((state) => state.clearComplete);
  const reset = useBookingStore((state) => state.reset);
  const isComplete = useBookingStore((state) => state.isComplete);
  const [isPaying, setIsPaying] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    // Allow a fresh Pay → confirmation cycle when landing on payment
    clearComplete();
    setSuccessOpen(false);
  }, [clearComplete]);

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

  const selectedPackage =
    bookingPackage ??
    (categorySlug
      ? getCategoryPackageById(categorySlug, draft.packageId)
      : getPackageById(draft.packageId));

  const selectedServices = services.filter((service) =>
    draft.serviceIds.includes(service.id),
  );
  const billingServices =
    selectedServices.length > 0
      ? selectedServices
      : selectedPackage
        ? [
            {
              id: selectedPackage.id || "package",
              name: selectedPackage.name,
              price: selectedPackage.price,
              duration: 60,
            },
          ]
        : categoryBookingData
          ? [categoryBookingData.services[0]]
          : services.slice(0, 1);

  const branch =
    PROVIDER_BRANCHES.find((item) => item.id === draft.branchId) ||
    PROVIDER_BRANCHES[0];
  const visitLabel =
    draft.visitType === "in_clinic"
      ? "Onsite"
      : draft.visitType === "online"
        ? "Online"
        : draft.visitType === "home_visit"
          ? "Homevisit"
          : "Onsite";

  const subtotal = selectedPackage
    ? selectedPackage.price
    : billingServices.reduce((sum, service) => sum + service.price, 0);
  const servicesOriginal = selectedPackage
    ? selectedPackage.originalPrice
    : billingServices.reduce(
        (sum, service) => sum + (service.originalPrice ?? service.price),
        0,
      );
  const amountToPay = selectedPackage ? subtotal : subtotal + PLATFORM_FEE;
  const originalPrice = selectedPackage
    ? servicesOriginal
    : servicesOriginal + PLATFORM_FEE;
  const discount = Math.max(originalPrice - amountToPay, 0);
  const theme = selectedPackage
    ? PACKAGE_THEMES[selectedPackage.theme || "rose"]
    : PACKAGE_THEMES.rose;
  const dateLabel = formatBookingDateLabel(draft.scheduledDate);

  const handlePay = async () => {
    if (isPaying || successOpen) return;

    let paymentMethod = draft.paymentMethod;
    if (!paymentMethod) {
      paymentMethod = PAYMENT_METHODS.WALLET;
      setPaymentMethod(PAYMENT_METHODS.WALLET);
    }

    setIsPaying(true);

    try {
      if (paymentMethod === PAYMENT_METHODS.WALLET) {
        const { profile: currentProfile, updateProfile } = useProfileStore.getState();
        // Match displayed balance fallback so Pay isn't blocked when balance is unset
        const balance = Number(
          currentProfile.walletBalance != null ? currentProfile.walletBalance : 20000,
        );
        if (balance < amountToPay) {
          toast.error("Insufficient wallet balance");
          return;
        }
        await updateProfile({ walletBalance: balance - amountToPay });
      }

      await new Promise((resolve) => setTimeout(resolve, 400));

      const appointment = createAppointmentFromDraft({
        draft: { ...draft, paymentMethod },
        provider,
        billingServices,
        selectedPackage,
        amountToPay,
      });

      if (appointment) {
        useAppointmentStore.getState().createAppointment(appointment);
      }

      completeBooking();
      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = selectedPackage?.name || provider.businessName;
    const text = selectedPackage
      ? `${selectedPackage.name} — ${provider.businessName}`
      : provider.businessName;

    // Desktop: copy link directly (native share is unreliable on web)
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      const copied = await copyToClipboard(url);
      if (copied) {
        toast.success("Link copied!");
        return;
      }
      toast.error("Could not copy link");
      return;
    }

    const result = await sharePageLink({ title, text, url });

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

  const serviceCount = selectedPackage
    ? selectedPackage.features?.length || 1
    : billingServices.length;

  return (
    <div className="bg-surface-page min-h-dvh md:bg-[#F7F8FC]">
      {/* Mobile */}
      <div className="bg-surface-page mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-36 md:hidden">
        <header className={MOBILE_HEADER_CLASS}>
          <div className={cn(MOBILE_HEADER_INNER_CLASS, "justify-between")}>
            <div className={MOBILE_HEADER_BACK_TITLE_GROUP_CLASS}>
              <button
                type="button"
                onClick={() => router.back()}
                className="text-foreground hover:bg-muted flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
                aria-label="Go back"
              >
                <HeroBackIcon tone="dark" className="size-5" />
              </button>
              <h1 className="min-w-0 truncate text-base font-semibold">
                Payment Method
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setSaved((current) => !current);
                  toast.success(saved ? "Removed from saved" : "Saved to favorites");
                }}
                className="text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label={saved ? "Unsave" : "Save"}
              >
                <HeroHeartIcon tone="dark" filled={saved} className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label="Share"
              >
                <HeroShareIcon tone="dark" className="size-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile layout (unchanged) */}
        <main className="w-full flex-1 space-y-4 px-4 py-4">
          <section className="border-border/70 bg-background overflow-hidden rounded-2xl border">
            {selectedPackage ? (
              <>
                <div className="p-4">
                  <div className="flex items-stretch gap-3.5">
                    <div className="bg-muted min-h-[7rem] w-[6rem] shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={selectedPackage.image}
                        alt={selectedPackage.name}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-foreground line-clamp-2 min-w-0 flex-1 overflow-hidden text-base leading-snug font-semibold">
                          {selectedPackage.name}
                        </h2>
                        <span className="text-primary inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold">
                          <img
                            src="/icons/Location1.svg"
                            alt=""
                            className="size-3.5 shrink-0 object-contain"
                            draggable={false}
                            aria-hidden
                          />
                          {visitLabel}
                        </span>
                      </div>

                      <ul className="mt-2.5 space-y-1.5">
                        {selectedPackage.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                                theme.checkBg,
                              )}
                            >
                              <Check className="size-2.5 text-white" strokeWidth={3} />
                            </span>
                            <span className="text-muted-foreground leading-snug">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="px-4">
                  <div className="border-border/70 space-y-2 border-t py-3.5 text-sm">
                    <PaymentLineRow
                      label="Original Price"
                      amount={originalPrice}
                      muted
                      strikethrough
                    />
                    <PaymentLineRow label="Discount" amount={discount} green />
                  </div>

                  <div className="pb-4">
                    <PaymentTotalBar amount={amountToPay} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={provider.avatar}
                        alt={provider.businessName}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-foreground text-lg leading-tight font-bold">
                            {provider.businessName}
                          </h2>
                          <span className="text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold">
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
                        <p className="text-muted-foreground text-sm leading-snug">
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

                <div className="px-4">
                  <div className="border-border/70 space-y-2.5 border-t py-4 text-sm">
                    {billingServices.map((service) => (
                      <PaymentLineRow
                        key={service.id}
                        label={service.name}
                        amount={service.price}
                      />
                    ))}
                    <PaymentLineRow label="Platform Fees" amount={PLATFORM_FEE} />
                  </div>

                  <div className="border-border/70 space-y-2.5 border-t py-4 text-sm">
                    <PaymentLineRow
                      label="Original Price"
                      amount={originalPrice}
                      muted
                      strikethrough
                    />
                    <PaymentLineRow label="Discount" amount={discount} green />
                  </div>

                  <div className="pb-4">
                    <PaymentTotalBar amount={amountToPay} />
                  </div>
                </div>
              </>
            )}
          </section>

          <section>
            <PaymentSectionTitle>Branch</PaymentSectionTitle>
            <div className="border-border/70 bg-background rounded-2xl border p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center">
                  <LocationIcon className="size-[22px] text-[#4D5972]" />
                </span>
                <button
                  type="button"
                  onClick={() => setBranchPickerOpen(true)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-foreground text-sm font-semibold">{branch.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {branch.address}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setBranchPickerOpen(true)}
                  className="hover:bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                  aria-label="Edit branch"
                >
                  <img
                    src="/icons/edit.svg"
                    alt=""
                    className="size-8 object-contain"
                    draggable={false}
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </section>

          <section>
            <PaymentSectionTitle>Payment Options</PaymentSectionTitle>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.UPI)}
                className={cn(
                  "bg-background flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                  draft.paymentMethod === PAYMENT_METHODS.UPI
                    ? "border-[#B5CEF8] bg-[#EEF4FD] shadow-[0_0_0_1px_rgba(24,101,234,0.08)]"
                    : "border-border/70 hover:border-primary/20",
                )}
              >
                <UpiLogo className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-semibold">UPI</p>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    Google Pay · PhonePe · Paytm · BHIM
                  </p>
                </div>
                <PaymentRadioIndicator
                  active={draft.paymentMethod === PAYMENT_METHODS.UPI}
                />
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.WALLET)}
                className={cn(
                  "bg-background flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                  draft.paymentMethod === PAYMENT_METHODS.WALLET
                    ? "border-[#B5CEF8] bg-[#EEF4FD] shadow-[0_0_0_1px_rgba(24,101,234,0.08)]"
                    : "border-border/70 hover:border-primary/20",
                )}
              >
                <WalletLogo className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-semibold">
                    Pay with Wallet
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    Available Balance: {formatCurrency(profile.walletBalance || 20000)}
                  </p>
                </div>
                <PaymentRadioIndicator
                  active={draft.paymentMethod === PAYMENT_METHODS.WALLET}
                />
              </button>
            </div>
          </section>
        </main>

        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 py-4">
          <div className="w-full">
            <div className="border-border/70 bg-background rounded-t-[1.25rem] border-t p-4 shadow-[0_-4px_24px_rgba(15,23,42,0.08)]">
              <Button
                size="lg"
                className="gradient-brand h-12 w-full rounded-xl px-5 text-sm font-medium shadow-[0_4px_14px_rgba(24,101,234,0.35)]"
                onClick={handlePay}
                disabled={isPaying || successOpen}
              >
                {isPaying
                  ? "Processing..."
                  : `Pay ${formatCurrency(amountToPay)} Securely`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Web — same shell as Package Details */}
      <div className="hidden min-h-dvh flex-col bg-[#F7F8FC] md:flex">
        <header className="sticky top-0 z-30 border-b border-[#E6EAF2] bg-white">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </button>
              <h1 className="text-foreground min-w-0 truncate text-base font-semibold">
                Payment Method
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setSaved((current) => !current);
                  toast.success(saved ? "Removed from saved" : "Saved to favorites");
                }}
                className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label={saved ? "Unsave" : "Save"}
              >
                <HeroHeartIcon tone="dark" filled={saved} className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleShare();
                }}
                className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label="Share"
              >
                <HeroShareIcon tone="dark" className="pointer-events-none size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-6 py-6 pb-32">
          <section className={WEB_CARD_CLASS}>
            {selectedPackage ? (
              <>
                <div className="p-5">
                  <div className="flex items-stretch gap-5">
                    <div className="bg-muted w-[7rem] shrink-0 overflow-hidden rounded-2xl lg:w-[7.5rem]">
                      <img
                        src={selectedPackage.image}
                        alt={selectedPackage.name}
                        className="size-full min-h-[9rem] object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-foreground text-lg leading-snug font-semibold">
                          {selectedPackage.name}
                        </h2>
                        <span className="text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold">
                          <img
                            src="/icons/Location1.svg"
                            alt=""
                            className="size-3.5 shrink-0 object-contain"
                            draggable={false}
                            aria-hidden
                          />
                          {visitLabel}
                        </span>
                      </div>

                      <ul className="mt-3.5 space-y-2">
                        {(selectedPackage.features || []).map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-[15px]"
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full",
                                theme.checkBg,
                              )}
                            >
                              <Check className="size-2.5 text-white" strokeWidth={3} />
                            </span>
                            <span className="leading-snug text-[#4D5972]">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="px-5">
                  <div className="space-y-2 border-t border-[#E6EAF2] py-4 text-[15px]">
                    <PaymentLineRow
                      label="Original Price"
                      amount={originalPrice}
                      muted
                      strikethrough
                    />
                    <PaymentLineRow label="Discount" amount={discount} green />
                  </div>
                  <div className="pb-5">
                    <PaymentTotalBar amount={amountToPay} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-5">
                  <div className="flex items-center gap-5">
                    <div className="bg-muted size-[7.5rem] shrink-0 overflow-hidden rounded-2xl">
                      <img
                        src={provider.avatar}
                        alt={provider.businessName}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-foreground text-lg font-semibold">
                          {provider.businessName}
                        </h2>
                        <span className="text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold">
                          <img
                            src="/icons/Location1.svg"
                            alt=""
                            className="size-3.5 shrink-0 object-contain"
                            draggable={false}
                            aria-hidden
                          />
                          {visitLabel}
                        </span>
                      </div>
                      <p className="text-[15px] text-[#7A8699]">{provider.specialty}</p>
                      {(dateLabel || draft.scheduledTime) && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-[#4D5972]">
                          {dateLabel && (
                            <span className="inline-flex items-center gap-2 font-medium">
                              <img
                                src="/icons/calander.svg"
                                alt=""
                                className="size-5 shrink-0 object-contain"
                                draggable={false}
                                aria-hidden
                              />
                              {dateLabel}
                            </span>
                          )}
                          {draft.scheduledTime && (
                            <span className="inline-flex items-center gap-2 font-medium">
                              <img
                                src="/icons/time.svg"
                                alt=""
                                className="size-5 shrink-0 object-contain"
                                draggable={false}
                                aria-hidden
                              />
                              {draft.scheduledTime}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5">
                  <div className="space-y-2 border-t border-[#E6EAF2] py-4 text-[15px]">
                    {billingServices.map((service) => (
                      <PaymentLineRow
                        key={service.id}
                        label={service.name}
                        amount={service.price}
                      />
                    ))}
                    <PaymentLineRow label="Platform Fees" amount={PLATFORM_FEE} />
                  </div>
                  <div className="space-y-2 border-t border-[#E6EAF2] py-4 text-[15px]">
                    <PaymentLineRow
                      label="Original Price"
                      amount={originalPrice}
                      muted
                      strikethrough
                    />
                    <PaymentLineRow label="Discount" amount={discount} green />
                  </div>
                  <div className="pb-5">
                    <PaymentTotalBar amount={amountToPay} />
                  </div>
                </div>
              </>
            )}
          </section>

          <section>
            <PaymentSectionTitle>Branch</PaymentSectionTitle>
            <div className={cn(WEB_CARD_CLASS, "p-5")}>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center">
                  <LocationIcon className="size-[22px] text-[#4D5972]" />
                </span>
                <button
                  type="button"
                  onClick={() => setBranchPickerOpen(true)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-foreground text-[15px] font-semibold">
                    {branch.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#7A8699]">
                    {branch.address}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setBranchPickerOpen(true)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[#F3F4F6]"
                  aria-label="Edit branch"
                >
                  <img
                    src="/icons/edit.svg"
                    alt=""
                    className="size-8 object-contain"
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
                  "flex w-full items-center gap-3 p-5 text-left transition-colors",
                  WEB_CARD_CLASS,
                  draft.paymentMethod === PAYMENT_METHODS.UPI
                    ? "border-[#B5CEF8] bg-[#EEF4FD]"
                    : "hover:border-primary/20",
                )}
              >
                <UpiLogo className="size-10" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-[15px] font-semibold">UPI</p>
                  <p className="mt-0.5 text-sm text-[#7A8699]">
                    Google Pay · PhonePe · Paytm · BHIM
                  </p>
                </div>
                <PaymentRadioIndicator
                  active={draft.paymentMethod === PAYMENT_METHODS.UPI}
                />
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.WALLET)}
                className={cn(
                  "flex w-full items-center gap-3 p-5 text-left transition-colors",
                  WEB_CARD_CLASS,
                  draft.paymentMethod === PAYMENT_METHODS.WALLET
                    ? "border-[#B5CEF8] bg-[#EEF4FD]"
                    : "hover:border-primary/20",
                )}
              >
                <WalletLogo className="size-10" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-[15px] font-semibold">
                    Pay with Wallet
                  </p>
                  <p className="mt-0.5 text-sm text-[#7A8699]">
                    Available Balance: {formatCurrency(profile.walletBalance || 20000)}
                  </p>
                </div>
                <PaymentRadioIndicator
                  active={draft.paymentMethod === PAYMENT_METHODS.WALLET}
                />
              </button>
            </div>
          </section>
        </main>

        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[#E6EAF2] bg-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-4">
            <Button
              type="button"
              size="lg"
              className="gradient-brand h-12 w-full rounded-xl px-6 text-base font-semibold shadow-[0_4px_14px_rgba(24,101,234,0.35)]"
              onClick={handlePay}
              disabled={isPaying || successOpen}
            >
              {isPaying
                ? "Processing..."
                : `Pay ${formatCurrency(amountToPay)} Securely`}
            </Button>
          </div>
        </div>
      </div>

      <BranchPickerDialog
        open={branchPickerOpen}
        onOpenChange={setBranchPickerOpen}
        selectedBranchId={draft.branchId}
        onSelect={handleBranchSelect}
      />

      <BookingSuccessModal
        open={successOpen || isComplete}
        doctorName={provider.businessName}
        serviceCount={serviceCount}
        scheduledTime={draft.scheduledTime || "10:00 AM"}
        onDone={() => {
          setSuccessOpen(false);
          reset();
          router.push(ROUTES.APPOINTMENTS);
        }}
      />
    </div>
  );
}
