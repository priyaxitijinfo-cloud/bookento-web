"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  VisitHomeIcon,
  VisitOnlineIcon,
  VisitOnsiteIcon,
} from "@/components/icons/visit-type-icons";
import {
  HeroBackIcon,
  HeroHeartIcon,
  HeroShareIcon,
} from "@/components/icons/hero-nav-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DOCTOR_WELLNESS_PACKAGES,
  PACKAGE_THEMES,
} from "@/constants/doctor-booking.constants";
import { getCategoryPackageById } from "@/constants/category-booking.constants";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import {
  providerPackagePaymentRoute,
  appendCategoryFlowQuery,
} from "@/constants/routes.constants";
import { MOBILE_HEADER_BACK_TITLE_GROUP_CLASS } from "@/lib/layout/mobile-header.constants";
import { timeSlots } from "@/mock/appointments";
import { getPackageById } from "@/mock/packages";
import { getProviderById } from "@/mock/providers";
import { useBookingStore } from "@/store";
import { cn } from "@/lib/utils";
import { getLocalDateKey } from "@/utils/format.utils";
import {
  copyToClipboard,
  getPlatformShareUrl,
  openShareWindow,
  sharePageLink,
} from "@/utils/share.utils";

const VISIT_TYPES = [
  { value: "in_clinic", label: "Onsite", icon: VisitOnsiteIcon },
  { value: "online", label: "Online", icon: VisitOnlineIcon },
  { value: "home_visit", label: "Homevisit", icon: VisitHomeIcon },
];

const SHARE_PLATFORMS = [
  { id: "whatsapp", label: "WhatsApp", icon: "/images/icons/share/whatsapp.svg" },
  { id: "instagram", label: "Instagram", icon: "/images/icons/share/instagram.svg" },
  { id: "facebook", label: "Facebook", icon: "/images/icons/share/facebook.svg" },
  { id: "messenger", label: "Messenger", icon: "/images/icons/share/messenger.svg" },
  { id: "twitter", label: "Twitter", icon: "/images/icons/share/twitter.svg" },
];

const WEB_CARD_CLASS =
  "overflow-hidden rounded-2xl border border-[#E6EAF2] bg-white shadow-[0_2px_12px_rgba(24,39,75,0.04)]";

const PACKAGE_BOX_CLASS = "rounded-2xl border border-border/70 bg-background";

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

function getMonthDates(year, month) {
  const today = startOfDay(new Date());
  const monthStart = startOfDay(new Date(year, month, 1));
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const start = isCurrentMonth ? today : monthStart;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startDay = start.getDate();
  const count = Math.max(1, lastDay - startDay + 1);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function PackageSectionTitle({ children, action, className }) {
  return (
    <div
      className={cn("mb-3 flex items-center justify-between gap-4 md:mb-4", className)}
    >
      <h2 className="text-foreground min-w-0 truncate text-base font-semibold md:text-lg md:font-bold">
        {children}
      </h2>
      {action}
    </div>
  );
}

function PackageBookingContent() {
  const { id, packageId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const isCategoryFlow = Boolean(categorySlug && getHomeCategoryBySlug(categorySlug));

  const provider = getProviderById(id);
  const categoryPackage = getCategoryPackageById(categorySlug, packageId);
  const mockPackage = getPackageById(packageId);
  const doctorPackage = DOCTOR_WELLNESS_PACKAGES.find(
    (entry) => entry.id === packageId,
  );

  const pkg =
    categoryPackage ??
    (mockPackage
      ? {
          ...mockPackage,
          features: mockPackage.features?.length
            ? mockPackage.features
            : [
                `${mockPackage.serviceIds?.length || 3} included services`,
                "Priority support",
                "Flexible scheduling",
              ],
          theme: mockPackage.theme || "blue",
        }
      : null) ??
    doctorPackage ??
    null;

  const {
    draft,
    setProviderId,
    setVisitType,
    setPackageId,
    setScheduledDate,
    setScheduledTime,
    setBranchId,
  } = useBookingStore();
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const dates = useMemo(
    () => getMonthDates(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const monthLabel = new Date(viewYear, viewMonth, 1)
    .toLocaleDateString("en", { month: "long", year: "numeric" })
    .replace(" ", ", ");

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const goToPrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
      return;
    }
    setViewMonth((month) => month - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
      return;
    }
    setViewMonth((month) => month + 1);
  };

  useEffect(() => {
    if (!provider || !pkg) return;
    setProviderId(provider.id);
    setPackageId(String(pkg.id));
    if (!draft.visitType) setVisitType("in_clinic");
    if (!draft.scheduledDate) setScheduledDate(getLocalDateKey(new Date()));
    if (!draft.scheduledTime) setScheduledTime("11:30 AM");
    if (!draft.branchId) setBranchId(PROVIDER_BRANCHES[0].id);
  }, [
    provider,
    pkg,
    setProviderId,
    setPackageId,
    setVisitType,
    setScheduledDate,
    setScheduledTime,
    setBranchId,
    draft.visitType,
    draft.scheduledDate,
    draft.scheduledTime,
    draft.branchId,
  ]);

  const paymentUrl = useMemo(() => {
    if (!provider || !pkg) return "#";
    let url = providerPackagePaymentRoute(provider.id, pkg.id);
    if (isCategoryFlow) {
      url = appendCategoryFlowQuery(url, categorySlug, {
        businessName: searchParams.get("name") || provider.businessName,
        specialty: searchParams.get("specialty") || provider.specialty,
        avatar: searchParams.get("avatar") || provider.avatar,
      });
    }
    return url;
  }, [provider, pkg, isCategoryFlow, categorySlug, searchParams]);

  if (!provider || !pkg) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        Package not found
      </div>
    );
  }

  const theme = PACKAGE_THEMES[pkg.theme || "blue"];
  const shareText = `${pkg.name} — ${provider.businessName}`;

  const handleShare = async () => {
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

    if (isDesktop) {
      setShareOpen(true);
      return;
    }

    const result = await sharePageLink({
      title: pkg.name,
      text: shareText,
    });

    if (result === "copied") {
      toast.success("Link copied!");
      return;
    }

    if (result === "failed") {
      toast.error("Could not share link");
    }
  };

  const handleCopyShareLink = async () => {
    const url = window.location.href;
    const copied = await copyToClipboard(url);
    if (copied) {
      toast.success("Link copied!");
      return;
    }
    toast.error("Could not copy link");
  };

  const handlePlatformShare = async (platformId) => {
    const url = window.location.href;

    if (platformId === "instagram") {
      const copied = await copyToClipboard(url);
      if (copied) {
        toast.success("Link copied! Open Instagram to share.");
      } else {
        toast.error("Could not copy link. Please try again.");
      }
      return;
    }

    const platformUrl = getPlatformShareUrl(platformId, { url, text: shareText });
    if (!platformUrl) {
      toast.error("Sharing is not available for this platform.");
      return;
    }

    openShareWindow(platformUrl);
  };

  const handleSelectDate = (date) => {
    setScheduledDate(getLocalDateKey(date));
  };

  return (
    <div className="bg-surface-page min-h-dvh md:bg-[#F7F8FC]">
      {/* Mobile */}
      <div className="bg-surface-page mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-36 md:hidden">
        <header className="safe-top border-border/60 bg-background sticky top-0 z-30 border-b">
          <div className="flex h-14 w-full items-center justify-between px-4">
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
                Packages Details
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
                aria-label={saved ? "Unsave package" : "Save package"}
              >
                <HeroHeartIcon tone="dark" filled={saved} className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label="Share package"
              >
                <HeroShareIcon tone="dark" className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="w-full flex-1 space-y-5 px-4 py-4">
          <article className={cn(PACKAGE_BOX_CLASS, "overflow-hidden p-4")}>
            <div className="flex items-stretch gap-3.5">
              <div className="bg-muted min-h-[7rem] w-[6rem] shrink-0 overflow-hidden rounded-xl">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="size-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-foreground line-clamp-2 min-w-0 flex-1 overflow-hidden text-base leading-snug font-semibold">
                    {pkg.name}
                  </h2>
                  <span className="shrink-0 rounded-md bg-[#FEE7F1] px-2.5 py-1 text-[10px] font-semibold text-[#FD4685]">
                    Save {pkg.discountPercent}%
                  </span>
                </div>

                <ul className="mt-2.5 space-y-1.5">
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
                      <span className="text-muted-foreground leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <section>
            <PackageSectionTitle>Visit type</PackageSectionTitle>
            <div className="grid grid-cols-3 gap-3">
              {VISIT_TYPES.map(({ value, label, icon: Icon }) => {
                const selected = draft.visitType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVisitType(value)}
                    className={cn(
                      "bg-background flex flex-col items-center gap-3 rounded-2xl border px-2 py-4 text-left transition-colors",
                      selected
                        ? "border-[#C3F4DC] bg-[#F7FFFB]"
                        : "border-border/70 hover:border-primary/20",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-lg",
                        selected
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-6" />
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

          <section>
            <PackageSectionTitle
              action={
                <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#5B6B8C]">
                  <button
                    type="button"
                    onClick={goToPrevMonth}
                    disabled={!canGoPrev}
                    className="hover:text-foreground flex size-6 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="size-4" strokeWidth={2} />
                  </button>
                  <span className="min-w-[6.75rem] text-center tabular-nums">
                    {monthLabel}
                  </span>
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="hover:text-foreground flex size-6 items-center justify-center transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="size-4" strokeWidth={2} />
                  </button>
                </div>
              }
            >
              Select Date
            </PackageSectionTitle>

            <div className={cn(PACKAGE_BOX_CLASS, "p-4")}>
              <div className="scrollbar-hide flex gap-2.5 overflow-x-auto pb-1">
                {dates.map((date) => {
                  const iso = getLocalDateKey(date);
                  const isSelected = draft.scheduledDate === iso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => handleSelectDate(date)}
                      className="flex min-w-[3.25rem] flex-col items-center gap-1.5"
                    >
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-xl border text-base font-bold transition-colors",
                          isSelected
                            ? "border-primary text-primary bg-white"
                            : "border-border/70 text-foreground bg-[#F7F8FC]",
                        )}
                      >
                        {String(date.getDate()).padStart(2, "0")}
                      </span>
                      <span className="text-foreground text-xs font-medium">
                        {date.toLocaleDateString("en", { weekday: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <PackageSectionTitle>Select Time</PackageSectionTitle>
            <div className={cn(PACKAGE_BOX_CLASS, "p-4")}>
              <div className="grid grid-cols-4 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = draft.scheduledTime === slot.time;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setScheduledTime(slot.time)}
                      className={cn(
                        "w-full rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors",
                        "focus-visible:ring-primary/25 focus-visible:ring-2 focus-visible:outline-none",
                        isSelected
                          ? "border-primary text-primary bg-white"
                          : slot.available
                            ? "border-border/70 text-foreground hover:border-primary/30 bg-[#F7F8FC]"
                            : "border-border/70 text-muted-foreground/40 cursor-not-allowed bg-[#F7F8FC]",
                      )}
                      aria-disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 py-4">
          <div className="w-full">
            <div
              className={cn(
                PACKAGE_BOX_CLASS,
                "rounded-t-[1.25rem] border-x-0 border-b-0 p-4 shadow-[0_-4px_24px_rgba(15,23,42,0.08)]",
              )}
            >
              <Link href={paymentUrl} className="block w-full">
                <Button
                  size="lg"
                  className="gradient-brand h-12 w-full rounded-xl px-5 text-sm font-medium shadow-[0_4px_14px_rgba(24,101,234,0.35)]"
                >
                  Continue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Web — Booking Details style */}
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
                Packages Details
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
                aria-label={saved ? "Unsave package" : "Save package"}
              >
                <HeroHeartIcon tone="dark" filled={saved} className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label="Share package"
              >
                <HeroShareIcon tone="dark" className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-6 py-6 pb-32">
          <section className={WEB_CARD_CLASS}>
            <div className="p-5">
              <div className="flex items-stretch gap-5">
                <div className="bg-muted w-[7rem] shrink-0 overflow-hidden rounded-2xl lg:w-[7.5rem]">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="size-full min-h-[9rem] object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-foreground text-lg leading-snug font-semibold">
                      {pkg.name}
                    </h2>
                    <span className="shrink-0 rounded-md bg-[#FEE7F1] px-3 py-1.5 text-xs font-semibold text-[#FD4685]">
                      Save {pkg.discountPercent}%
                    </span>
                  </div>

                  <ul className="mt-3.5 space-y-2">
                    {pkg.features.map((feature) => (
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
                        <span className="leading-snug text-[#4D5972]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-[16px] font-semibold">
              Visit type
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {VISIT_TYPES.map(({ value, label, icon: Icon }) => {
                const selected = draft.visitType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVisitType(value)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-2xl border px-3 py-5 transition-colors",
                      selected
                        ? "border-[#C3F4DC] bg-[#F7FFFB]"
                        : "hover:border-primary/20 border-[#E6EAF2] bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-xl",
                        selected
                          ? "bg-emerald-500 text-white"
                          : "bg-[#F3F4F6] text-[#4D5972]",
                      )}
                    >
                      <Icon className="size-6" />
                    </span>
                    <span
                      className={cn(
                        "text-[15px] font-semibold",
                        selected ? "text-foreground" : "text-[#7A8699]",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-foreground text-[16px] font-semibold">Select Date</h2>
              <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#5B6B8C]">
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  disabled={!canGoPrev}
                  className="hover:text-foreground flex size-7 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="size-4" strokeWidth={2} />
                </button>
                <span className="min-w-[7.5rem] text-center tabular-nums">
                  {monthLabel}
                </span>
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="hover:text-foreground flex size-7 items-center justify-center transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="size-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className={cn(WEB_CARD_CLASS, "p-5")}>
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {dates.map((date) => {
                  const iso = getLocalDateKey(date);
                  const isSelected = draft.scheduledDate === iso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => handleSelectDate(date)}
                      className="flex min-w-[3.5rem] flex-col items-center gap-1.5"
                    >
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-xl border text-base font-semibold transition-colors",
                          isSelected
                            ? "border-primary text-primary bg-white"
                            : "text-foreground border-[#E6EAF2] bg-[#F7F8FC]",
                        )}
                      >
                        {String(date.getDate()).padStart(2, "0")}
                      </span>
                      <span className="text-foreground text-xs font-medium">
                        {date.toLocaleDateString("en", { weekday: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-foreground mb-3 text-[16px] font-semibold">
              Select Time
            </h2>
            <div className={cn(WEB_CARD_CLASS, "p-5")}>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
                {timeSlots.map((slot) => {
                  const isSelected = draft.scheduledTime === slot.time;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setScheduledTime(slot.time)}
                      className={cn(
                        "w-full rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors",
                        "focus-visible:ring-primary/25 focus-visible:ring-2 focus-visible:outline-none",
                        isSelected
                          ? "border-primary text-primary bg-white"
                          : slot.available
                            ? "text-foreground hover:border-primary/30 border-[#E6EAF2] bg-[#F7F8FC]"
                            : "text-muted-foreground/40 cursor-not-allowed border-[#E6EAF2] bg-[#F7F8FC]",
                      )}
                      aria-disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[#E6EAF2] bg-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-4">
            <Link href={paymentUrl} className="block w-full">
              <Button
                size="lg"
                className="gradient-brand h-12 w-full rounded-xl px-6 text-base font-semibold shadow-[0_4px_14px_rgba(24,101,234,0.35)]"
              >
                Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md gap-5 p-6">
          <DialogHeader>
            <DialogTitle>Share package</DialogTitle>
            <DialogDescription>
              Share this service package with friends and family.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 rounded-xl border border-[#E6EAF2] bg-[#F7F8FC] p-3">
            <div className="bg-muted size-14 shrink-0 overflow-hidden rounded-lg">
              <img src={pkg.image} alt={pkg.name} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-semibold">
                {pkg.name}
              </p>
              <p className="text-muted-foreground mt-0.5 truncate text-xs">
                {provider.businessName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {SHARE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformShare(platform.id)}
                className="flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-[#F3F4F6]"
              >
                <img
                  src={platform.icon}
                  alt=""
                  className="size-11 object-contain"
                  draggable={false}
                />
                <span className="text-[11px] font-medium text-[#6B7280]">
                  {platform.label}
                </span>
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCopyShareLink}
          >
            Copy link
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProviderPackagePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">Loading...</div>
      }
    >
      <PackageBookingContent />
    </Suspense>
  );
}
