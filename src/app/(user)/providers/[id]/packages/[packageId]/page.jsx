"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  Monitor,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DOCTOR_WELLNESS_PACKAGES,
  PACKAGE_THEMES,
} from "@/constants/doctor-booking.constants";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { providerBookingRoute, appendCategoryFlowQuery } from "@/constants/routes.constants";
import { timeSlots } from "@/mock/appointments";
import { getPackageById } from "@/mock/packages";
import { getProviderById } from "@/mock/providers";
import { useBookingStore } from "@/store";
import { cn } from "@/lib/utils";
import { getLocalDateKey } from "@/utils/format.utils";

const VISIT_TYPES = [
  { value: "in_clinic", label: "Onsite", icon: MapPin },
  { value: "online", label: "Online", icon: Monitor },
  { value: "home_visit", label: "Homevisit", icon: Home },
];

function getDateRange(count, startOffset = 0) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + startOffset + index);
    return date;
  });
}

function PackageSectionTitle({ children, action, className }) {
  return (
    <div className={cn("mb-3.5 flex items-center justify-between gap-3", className)}>
      <h2 className="text-base font-bold text-foreground">{children}</h2>
      {action}
    </div>
  );
}

function MonthNavigator({ monthLabel, dateOffset, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={dateOffset === 0}
        className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-white text-foreground transition-colors hover:bg-[#F8F9FC] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous dates"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-[8.5rem] text-center text-sm font-semibold text-foreground">
        {monthLabel}
      </span>
      <button
        type="button"
        onClick={onNext}
        className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-white text-foreground transition-colors hover:bg-[#F8F9FC]"
        aria-label="Next dates"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function DatePickerRow({ dates, selectedDate, onSelect, className }) {
  return (
    <div className={cn("scrollbar-hide flex gap-2 overflow-x-auto pb-0.5 md:gap-2.5", className)}>
      {dates.map((date) => {
        const iso = getLocalDateKey(date);
        const selected = selectedDate === iso;
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onSelect(iso)}
            className={cn(
              "flex min-w-[3.25rem] shrink-0 flex-col items-center rounded-xl border px-2.5 py-2.5 text-xs font-medium transition-colors md:min-w-0 md:flex-1",
              selected
                ? "border-primary bg-white text-primary shadow-sm"
                : "border-transparent bg-white/80 text-muted-foreground hover:border-primary/20",
            )}
          >
            <span className="text-base font-bold leading-none">
              {String(date.getDate()).padStart(2, "0")}
            </span>
            <span className="mt-1">{date.toLocaleDateString("en", { weekday: "short" })}</span>
          </button>
        );
      })}
    </div>
  );
}

function TimePickerGrid({ selectedTime, onSelect, columns = "grid-cols-4" }) {
  return (
    <div className={cn("grid gap-2", columns)}>
      {timeSlots.slice(0, 16).map((slot) => {
        const selected = selectedTime === slot.time;
        return (
          <button
            key={slot.id}
            type="button"
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            className={cn(
              "rounded-xl border px-1 py-2.5 text-xs font-semibold transition-colors sm:text-sm",
              !slot.available && "cursor-not-allowed opacity-40",
              selected
                ? "border-primary bg-white text-primary shadow-sm"
                : "border-transparent bg-white/80 text-muted-foreground hover:border-primary/20 hover:text-foreground",
            )}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}

function PackageBookingContent() {
  const { id, packageId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const isCategoryFlow = Boolean(categorySlug && getHomeCategoryBySlug(categorySlug));
  const isDoctorFlow = categorySlug === "doctor";

  const provider = getProviderById(id);
  const mockPackage = getPackageById(packageId);
  const doctorPackage = DOCTOR_WELLNESS_PACKAGES.find((pkg) => pkg.id === packageId);
  const pkg = isDoctorFlow && doctorPackage
    ? doctorPackage
    : mockPackage && {
        ...mockPackage,
        features: [`${mockPackage.serviceIds.length} included services`, "Priority support", "Flexible scheduling"],
        theme: "blue",
      };

  const { draft, setProviderId, setVisitType, setPackageId, setScheduledDate, setScheduledTime, setBranchId } = useBookingStore();
  const [dateOffset, setDateOffset] = useState(0);
  const [saved, setSaved] = useState(false);

  const dates = useMemo(() => getDateRange(14, dateOffset), [dateOffset]);
  const webDates = useMemo(() => dates.slice(0, 7), [dates]);
  const monthLabel = dates[0]
    ? `${dates[0].toLocaleDateString("en", { month: "short" })}, ${dates[0].getFullYear()}`
    : "";

  useEffect(() => {
    if (!provider || !pkg) return;
    setProviderId(provider.id);
    setPackageId(String(pkg.id));
    if (!draft.visitType) setVisitType("in_clinic");
    if (!draft.scheduledDate) setScheduledDate(getLocalDateKey(new Date()));
    if (!draft.scheduledTime) setScheduledTime("11:30 AM");
    if (!draft.branchId) setBranchId(PROVIDER_BRANCHES[0].id);
  }, [provider, pkg, setProviderId, setPackageId, setVisitType, setScheduledDate, setScheduledTime, setBranchId, draft.visitType, draft.scheduledDate, draft.scheduledTime, draft.branchId]);

  const paymentUrl = useMemo(() => {
    if (!provider) return providerBookingRoute("");
    let url = `${providerBookingRoute(provider.id)}&step=payment`;
    if (isCategoryFlow) {
      const name = searchParams.get("name") || provider.businessName;
      const specialty = searchParams.get("specialty") || provider.specialty;
      const avatar = searchParams.get("avatar") || provider.avatar;
      url = appendCategoryFlowQuery(url, categorySlug, {
        businessName: name,
        specialty,
        avatar,
      });
    }
    return url;
  }, [provider, isCategoryFlow, categorySlug, searchParams]);

  if (!provider || !pkg) {
    return <div className="flex min-h-dvh items-center justify-center">Package not found</div>;
  }

  const theme = PACKAGE_THEMES[pkg.theme || "blue"];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const handlePrevDates = () => setDateOffset((offset) => Math.max(0, offset - 7));
  const handleNextDates = () => setDateOffset((offset) => offset + 7);

  const continueButton = (
    <Link href={paymentUrl} className="block">
      <Button
        size="lg"
        className="gradient-brand h-12 w-full rounded-xl text-base font-semibold shadow-[0_4px_14px_rgba(24,101,234,0.3)]"
      >
        Continue
      </Button>
    </Link>
  );

  return (
    <div className="min-h-dvh bg-[#F7F8FC] md:bg-[#ECEEF2]">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-[#F7F8FC] pb-28 md:max-w-5xl md:pb-10">
        <header className="safe-top sticky top-0 z-30 border-b border-border/60 bg-white">
          <div className="mx-auto flex h-14 max-w-lg items-center gap-2 px-4 md:max-w-5xl md:px-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#F3F4F6]"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="min-w-0 flex-1 text-center text-base font-bold md:text-left">
              Packages Details
            </h1>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setSaved((current) => !current);
                  toast.success(saved ? "Removed from saved" : "Saved to favorites");
                }}
                className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#F3F4F6]"
                aria-label={saved ? "Unsave package" : "Save package"}
              >
                <Heart className={cn("size-5", saved && "fill-rose-500 text-rose-500")} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#F3F4F6]"
                aria-label="Share package"
              >
                <Share2 className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto flex-1 max-w-lg space-y-5 px-4 py-5 md:max-w-5xl md:space-y-6 md:px-6 md:py-6">
          <article className="rounded-2xl border border-border/60 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.06)] md:p-5">
            <div className="flex gap-3.5 md:gap-5">
              <div className="h-[5.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-xl bg-muted md:h-[7.5rem] md:w-[7.5rem]">
                <img src={pkg.image} alt={pkg.name} className="size-full object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold leading-snug text-foreground md:text-lg">{pkg.name}</h2>
                  <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold md:text-xs", theme.badge)}>
                    Save {pkg.discountPercent}%
                  </span>
                </div>

                <ul className="mt-3 space-y-2 md:mt-4 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2.5 md:space-y-0">
                  {pkg.features.map((feature) => (
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
          </article>

          <section className="rounded-2xl border border-border/60 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-5">
            <PackageSectionTitle>Visit type</PackageSectionTitle>
            <div className="grid grid-cols-3 gap-3 md:max-w-2xl md:gap-4">
              {VISIT_TYPES.map(({ value, label, icon: Icon }) => {
                const selected = draft.visitType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVisitType(value)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-xl border px-2 py-4 transition-colors md:py-5",
                      selected
                        ? "border-[#C3F4DC] bg-[#F7FFFB]"
                        : "border-border/70 bg-white hover:border-primary/20",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-lg md:size-12",
                        selected ? "bg-emerald-500 text-white" : "bg-[#F3F4F6] text-muted-foreground",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={2} />
                    </span>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        selected ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Mobile: stacked date + time */}
          <div className="space-y-5 md:hidden">
            <section>
              <PackageSectionTitle
                action={(
                  <MonthNavigator
                    monthLabel={monthLabel}
                    dateOffset={dateOffset}
                    onPrev={handlePrevDates}
                    onNext={handleNextDates}
                  />
                )}
              >
                Select Date
              </PackageSectionTitle>
              <div className="rounded-2xl border border-sky-100 bg-[#F4F8FF] p-3.5">
                <DatePickerRow
                  dates={dates}
                  selectedDate={draft.scheduledDate}
                  onSelect={setScheduledDate}
                />
              </div>
            </section>

            <section>
              <PackageSectionTitle>Select Time</PackageSectionTitle>
              <div className="rounded-2xl border border-sky-100 bg-[#F4F8FF] p-3.5">
                <TimePickerGrid
                  selectedTime={draft.scheduledTime}
                  onSelect={setScheduledTime}
                />
              </div>
            </section>
          </div>

          {/* Webview / desktop: side-by-side date + time (reference layout) */}
          <section className="hidden md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
            <div>
              <PackageSectionTitle>Select Date</PackageSectionTitle>
              <div className="mb-4">
                <MonthNavigator
                  monthLabel={monthLabel}
                  dateOffset={dateOffset}
                  onPrev={handlePrevDates}
                  onNext={handleNextDates}
                />
              </div>
              <div className="rounded-2xl border border-sky-100 bg-[#F4F8FF] p-4">
                <DatePickerRow
                  dates={webDates}
                  selectedDate={draft.scheduledDate}
                  onSelect={setScheduledDate}
                  className="overflow-visible"
                />
              </div>
            </div>

            <div>
              <PackageSectionTitle>Select Time</PackageSectionTitle>
              <div className="rounded-2xl border border-sky-100 bg-[#F4F8FF] p-4">
                <TimePickerGrid
                  selectedTime={draft.scheduledTime}
                  onSelect={setScheduledTime}
                />
              </div>
            </div>
          </section>
        </main>

        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-white px-4 py-4 md:px-6">
          <div className="mx-auto max-w-lg md:max-w-5xl">
            {continueButton}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProviderPackagePage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center">Loading...</div>}>
      <PackageBookingContent />
    </Suspense>
  );
}
