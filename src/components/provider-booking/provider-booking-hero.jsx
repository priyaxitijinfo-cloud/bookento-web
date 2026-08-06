"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Heart, MoreVertical, Share2, Star } from "lucide-react";
import { toast } from "sonner";

import { LocationIcon } from "@/components/icons/location-icon";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

export function ProviderBookingHero({
  provider,
  coverImage,
  isDoctorFlow,
  saved,
  onToggleSaved,
  backHref = ROUTES.HOME,
}) {
  const displayName = isDoctorFlow && !provider.businessName.startsWith("Dr.")
    ? provider.businessName
    : provider.businessName;

  return (
    <section className="relative">
      <div className="relative h-44 overflow-hidden md:h-56 lg:h-64">
        <img
          src={coverImage}
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/35 to-[#0f172a]/10" />
      </div>

      <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href={backHref}
          className="flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSaved}
            className="flex size-10 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur"
            aria-label="Save provider"
          >
            <Heart className={cn("size-5", saved ? "fill-rose-500 text-rose-500" : "text-foreground")} />
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className="flex size-10 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur"
            aria-label="Share"
          >
            <Share2 className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur"
            aria-label="More options"
          >
            <MoreVertical className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="-mt-16 flex flex-col gap-4 md:-mt-20 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="size-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg md:size-24">
              <img src={provider.avatar} alt={displayName} className="size-full object-cover" />
            </div>
            <div className="min-w-0 pb-1 text-white">
              <h1 className="truncate text-xl font-bold md:text-2xl">{displayName}</h1>
              <p className="text-sm text-white/85 md:text-base">{provider.specialty}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-white/75 md:text-sm">
                <LocationIcon className="size-3.5 shrink-0" />
                <span className="truncate">{provider.address}, {provider.city}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm md:text-sm">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {provider.rating} ({provider.totalReviews}+)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm md:text-sm">
              <LocationIcon className="text-primary size-3.5" />
              {provider.distance} km
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm md:text-sm">
              <Clock className="text-primary size-3.5" />
              {provider.yearsOfExperience}+ Years Exp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
