"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { providerPackagePaymentRoute, providerPaymentRoute, appendCategoryFlowQuery } from "@/constants/routes.constants";
import { useBookingStore } from "@/store";
import { cn } from "@/lib/utils";
import { formatBookingDateLabel, formatCurrency, formatDuration } from "@/utils/format.utils";

export function ProviderBookingSummaryBar({
  provider,
  services = [],
  bookingPackage = null,
  categorySlug = null,
  className = "",
  embedded = false,
  flat = false,
  profileGrid = false,
  attachedFooter = false,
  actionLabel = "Confirm Booking",
  containerClassName = "",
}) {
  const router = useRouter();
  const { draft } = useBookingStore();

  const selectedServices = services.filter((service) => draft.serviceIds.includes(service.id));
  const totalMinutes = bookingPackage
    ? bookingPackage.duration || 60
    : selectedServices.reduce((sum, service) => sum + service.duration, 0);
  const totalAmount = bookingPackage
    ? bookingPackage.price
    : selectedServices.reduce((sum, service) => sum + service.price, 0);
  const visitLabel = draft.visitType === "in_clinic"
    ? "In-clinic"
    : draft.visitType === "online"
      ? "Online"
      : draft.visitType === "home_visit"
        ? "Home visit"
        : "In-clinic";

  const canContinue = bookingPackage
    ? Boolean(draft.visitType && draft.scheduledDate && draft.scheduledTime && draft.packageId)
    : Boolean(
        draft.visitType &&
        selectedServices.length > 0 &&
        draft.scheduledDate &&
        draft.scheduledTime &&
        draft.branchId,
      );

  const summaryLabel = bookingPackage
    ? `1 package · ${formatDuration(totalMinutes || 0)} · ${visitLabel}`
    : `${selectedServices.length || 0} service${selectedServices.length !== 1 ? "s" : ""} · ${formatDuration(totalMinutes || 0)} · ${visitLabel}`;

  const dateLabel = formatBookingDateLabel(draft.scheduledDate);
  const isMobileBar = !embedded && !flat && !attachedFooter && className.includes("md:hidden");

  const handleContinue = () => {
    if (!canContinue) {
      toast.error(
        bookingPackage
          ? "Please select visit type, date, and time"
          : "Please select visit type, service, date, time, and branch",
      );
      return;
    }
    let url = bookingPackage
      ? providerPackagePaymentRoute(provider.id, bookingPackage.id)
      : providerPaymentRoute(provider.id);
    url = appendCategoryFlowQuery(url, categorySlug, provider);
    router.push(url);
  };

  const summaryRow = (
    <div className="flex items-center justify-between gap-4 md:gap-6">
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground truncate text-xs font-medium md:text-sm">
          {summaryLabel}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 md:mt-2">
          <span className="text-primary text-xl font-bold leading-none tracking-tight md:text-2xl">
            {formatCurrency(totalAmount || provider.startingPrice || 0)}
          </span>

          {(dateLabel || draft.scheduledTime) && (
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              {dateLabel && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-4 shrink-0 opacity-70" strokeWidth={2} />
                  <span className="font-medium">{dateLabel}</span>
                </span>
              )}
              {draft.scheduledTime && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-4 shrink-0 opacity-70" strokeWidth={2} />
                  <span className="font-medium">{draft.scheduledTime}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Button
        size="lg"
        className="gradient-brand h-12 shrink-0 rounded-xl px-5 text-sm font-semibold shadow-[0_4px_14px_rgba(24,101,234,0.35)] sm:min-w-[10.5rem] sm:px-6 sm:text-base"
        disabled={!canContinue}
        onClick={handleContinue}
      >
        {actionLabel}
      </Button>
    </div>
  );

  if (attachedFooter) {
    return (
      <div className={cn("p-4 md:p-5", className)}>
        {summaryRow}
      </div>
    );
  }

  if (flat) {
    const summaryCard = (
      <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-card md:p-5">
        {summaryRow}
      </div>
    );

    return (
      <div
        className={cn(
          "safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 md:px-6",
          className,
        )}
      >
        {profileGrid ? (
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
              <div className="hidden lg:block" aria-hidden />
              <div className="min-w-0">{summaryCard}</div>
            </div>
          </div>
        ) : (
          <div className={cn("mx-auto w-full max-w-lg md:max-w-5xl", containerClassName)}>
            {summaryCard}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        isMobileBar
          ? "safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2"
          : "mt-1",
        className,
      )}
    >
      <div
        className={cn(
          "border-border/70 bg-background",
          embedded
            ? "rounded-xl border p-4 md:p-5"
            : isMobileBar
              ? "rounded-2xl border p-4 shadow-[0_8px_32px_rgba(15,23,42,0.12)]"
              : "rounded-2xl border p-4 shadow-card md:p-5",
        )}
      >
        {summaryRow}
      </div>
    </div>
  );
}

export function ProviderBookingSidebar({ provider, services }) {
  const { draft } = useBookingStore();
  const selectedServices = services.filter((service) => draft.serviceIds.includes(service.id));
  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-lg border bg-background p-5 shadow-sm">
        <h3 className="font-bold">Booking Summary</h3>
        <p className="text-muted-foreground mt-1 text-sm">{provider.businessName}</p>
        <div className="mt-4 space-y-2 border-t pt-4 text-sm">
          {selectedServices.length === 0 ? (
            <p className="text-muted-foreground">Select services to see summary</p>
          ) : (
            selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{service.name}</span>
                <span className="font-medium">{formatCurrency(service.price)}</span>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="font-semibold">Total</span>
          <span className="text-primary text-lg font-bold">{formatCurrency(totalAmount || 0)}</span>
        </div>
        <Link
          href={providerPaymentRoute(provider.id)}
          className="gradient-brand mt-4 flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold text-white hover:opacity-95"
        >
          Continue to Payment
        </Link>
      </div>
    </aside>
  );
}
