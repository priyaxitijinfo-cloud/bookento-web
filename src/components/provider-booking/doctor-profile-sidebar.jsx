"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  Flag,
  Heart,
  Mail,
  Phone,
  Share2,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { LocationIcon } from "@/components/icons/location-icon";

import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { DOCTOR_PROFILE_COVER } from "@/constants/doctor-booking.constants";
import { getCategoryProviderDisplayName, getHomeCategoryBySlug } from "@/constants/home-categories";
import { cn } from "@/lib/utils";

function handleShareProfile() {
  navigator.clipboard?.writeText(window.location.href);
  toast.success("Profile link copied!");
}

export function DoctorProfileSidebar({
  provider,
  categorySlug,
  saved,
  onToggleSaved,
  onBlockClick,
  onReportClick,
  className = "",
}) {
  const category = categorySlug ? getHomeCategoryBySlug(categorySlug) : null;
  const displayName = getCategoryProviderDisplayName(provider.businessName, categorySlug);
  const saveLabel = categorySlug === "doctor" ? "Save Doctor" : "Save";

  return (
    <aside className={cn("space-y-4", className)}>
      <div className="overflow-hidden rounded-xl border bg-background shadow-card">
        <div className="relative h-32 md:h-36">
          <img
            src={DOCTOR_PROFILE_COVER}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
          <div className="absolute right-3 top-3 flex gap-1.5">
            <button
              type="button"
              onClick={onBlockClick}
              className="flex size-8 items-center justify-center rounded-lg bg-background/20 text-white backdrop-blur transition-colors hover:bg-background/30"
              aria-label="Block doctor"
            >
              <Ban className="size-4" />
            </button>
            <button
              type="button"
              onClick={onReportClick}
              className="flex size-8 items-center justify-center rounded-lg bg-background/20 text-white backdrop-blur transition-colors hover:bg-background/30"
              aria-label="Report doctor"
            >
              <Flag className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative px-5 pb-5 pt-0">
          <div className="-mt-12 flex justify-center">
            <div className="size-24 overflow-hidden rounded-xl border-4 border-white bg-background shadow-lg">
              <img src={provider.avatar} alt={displayName} className="size-full object-cover" />
            </div>
          </div>

          <div className="mt-3 text-center">
            <h1 className="text-lg font-bold leading-tight">{displayName}</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">{provider.specialty}</p>
            <p className="text-muted-foreground mt-2 inline-flex items-center justify-center gap-1 text-xs">
              <LocationIcon className="text-primary size-3.5 shrink-0" />
              <span>{provider.address}, {provider.city}</span>
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x rounded-xl border bg-[#F8F9FC]">
            <div className="px-2 py-3 text-center">
              <p className="text-primary text-base font-bold">{provider.totalBookings}+</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium uppercase tracking-wide">Patients</p>
            </div>
            <div className="px-2 py-3 text-center">
              <p className="text-primary text-base font-bold">{provider.rating}</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium uppercase tracking-wide">Rating</p>
            </div>
            <div className="px-2 py-3 text-center">
              <p className="text-primary text-base font-bold">{provider.yearsOfExperience}+</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium uppercase tracking-wide">Years Exp</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onToggleSaved}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
                saved
                  ? "border-primary/25 bg-primary/10 text-primary"
                  : "border-transparent gradient-brand text-white hover:opacity-95",
              )}
            >
              <Heart className={cn("size-4 shrink-0", saved && "fill-primary")} />
              <span>{saved ? "Saved" : saveLabel}</span>
            </button>
            <button
              type="button"
              onClick={handleShareProfile}
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-[#F8F9FC]"
              aria-label="Share doctor profile"
            >
              <Share2 className="size-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-5 shadow-card">
        <h2 className="text-sm font-bold">Contact Information</h2>
        <ul className="mt-3 space-y-3">
          <li className="flex items-start gap-3 text-sm">
            <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Mail className="size-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-muted-foreground text-xs">Email</p>
              <p className="truncate font-medium">{provider.email}</p>
            </div>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Phone className="size-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="font-medium">{provider.phone}</p>
            </div>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
              <LocationIcon className="size-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-muted-foreground text-xs">Clinic Address</p>
              <p className="leading-relaxed">{provider.address}, {provider.city} - {provider.pincode}</p>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export function DoctorProfileSidebarFixed({
  provider,
  categorySlug,
  saved,
  onToggleSaved,
  onBlockClick,
  onReportClick,
}) {
  return (
    <>
      <div className="pointer-events-none invisible hidden lg:block" aria-hidden>
        <DoctorProfileSidebar
          provider={provider}
          categorySlug={categorySlug}
          saved={saved}
          onToggleSaved={onToggleSaved}
          onBlockClick={onBlockClick}
          onReportClick={onReportClick}
        />
      </div>
      <div className="fixed top-[7.875rem] z-20 hidden w-[320px] lg:block xl:w-[340px] left-[max(1rem,calc((100vw-80rem)/2+1rem))] md:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
        <DoctorProfileSidebar
          provider={provider}
          categorySlug={categorySlug}
          saved={saved}
          onToggleSaved={onToggleSaved}
          onBlockClick={onBlockClick}
          onReportClick={onReportClick}
        />
      </div>
    </>
  );
}

export function DoctorProfileMobileHeader({
  provider,
  categorySlug,
  backHref,
  backLabel,
  saved,
  onToggleSaved,
  onBlockClick,
  onReportClick,
}) {
  const category = categorySlug ? getHomeCategoryBySlug(categorySlug) : null;
  const displayName = getCategoryProviderDisplayName(provider.businessName, categorySlug);
  const resolvedBackHref = backHref ?? (categorySlug ? categoryListingRoute(categorySlug) : ROUTES.HOME);
  const resolvedBackLabel = backLabel ?? (categorySlug === "doctor"
    ? "Back to doctors"
    : category
      ? `Back to ${category.name.toLowerCase()}`
      : "Back");

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm lg:hidden">
      <div className="relative h-28 md:h-32">
        <img
          src={DOCTOR_PROFILE_COVER}
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />
        <Link
          href={resolvedBackHref}
          className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur"
          aria-label={resolvedBackLabel}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            type="button"
            onClick={onBlockClick}
            className="flex size-9 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur"
            aria-label="Block doctor"
          >
            <Ban className="size-4" />
          </button>
          <button
            type="button"
            onClick={onReportClick}
            className="flex size-9 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur"
            aria-label="Report doctor"
          >
            <Flag className="size-4" />
          </button>
        </div>
      </div>
      <div className="relative px-4 pb-4">
        <div className="-mt-10 flex items-end gap-3">
          <div className="size-20 shrink-0 overflow-hidden rounded-xl border-4 border-white shadow-md">
            <img src={provider.avatar} alt={displayName} className="size-full object-cover" />
          </div>
          <div className="min-w-0 pb-1">
            <h1 className="truncate font-bold">{displayName}</h1>
            <p className="text-muted-foreground text-sm">{provider.specialty}</p>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {provider.rating} · {provider.distance} km
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
