"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Verified } from "lucide-react";
import { toast } from "sonner";

import {
  HeroDistanceIcon,
  HeroExperienceIcon,
  HeroRatingIcon,
} from "@/components/icons/hero-info-badge-icons";
import {
  HeroBackIcon,
  HeroHeartIcon,
  HeroMoreIcon,
  HeroShareIcon,
} from "@/components/icons/hero-nav-icons";
import { LocationIcon } from "@/components/icons/location-icon";
import { BlockIcon, ReportIcon } from "@/components/icons/profile-action-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { DOCTOR_PROFILE_COVER } from "@/constants/doctor-booking.constants";
import {
  getCategoryProviderDisplayName,
  getHomeCategoryBySlug,
} from "@/constants/home-categories";
import { cn } from "@/lib/utils";
import {
  copyToClipboard,
  getPlatformShareUrl,
  openShareWindow,
  sharePageLink,
} from "@/utils/share.utils";

const SHARE_PLATFORMS = [
  { id: "whatsapp", label: "WhatsApp", icon: "/images/icons/share/whatsapp.svg" },
  { id: "instagram", label: "Instagram", icon: "/images/icons/share/instagram.svg" },
  { id: "facebook", label: "Facebook", icon: "/images/icons/share/facebook.svg" },
  { id: "messenger", label: "Messenger", icon: "/images/icons/share/messenger.svg" },
  { id: "twitter", label: "Twitter", icon: "/images/icons/share/twitter.svg" },
];

async function handleShareProfile(providerName) {
  const result = await sharePageLink({
    title: providerName || "Bookento profile",
    text: providerName
      ? `Check out ${providerName} on Bookento`
      : "Check out this profile on Bookento",
  });

  if (result === "copied") {
    toast.success("Profile link copied!");
    return;
  }

  if (result === "shared" || result === "cancelled") return;

  toast.error("Could not share link");
}

function profileCoverSrc() {
  return DOCTOR_PROFILE_COVER;
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
  const [shareOpen, setShareOpen] = useState(false);
  const displayName = getCategoryProviderDisplayName(
    provider.businessName,
    categorySlug,
  );
  const saveLabel = categorySlug === "doctor" ? "Save Doctor" : "Save";
  const shareText = displayName
    ? `Check out ${displayName} on Bookento`
    : "Check out this profile on Bookento";

  const handleCopyShareLink = async () => {
    const copied = await copyToClipboard(window.location.href);
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

  return (
    <aside className={cn("space-y-4", className)}>
      {/* Hero profile card */}
      <div className="bg-background shadow-card overflow-hidden rounded-xl border">
        <div className="relative h-[184px]">
          <img src={profileCoverSrc()} alt="" className="size-full object-cover" />
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              type="button"
              onClick={onBlockClick}
              className="bg-background/20 hover:bg-background/30 flex size-8 items-center justify-center rounded-lg text-white backdrop-blur transition-colors"
              aria-label="Block"
            >
              <BlockIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={onReportClick}
              className="bg-background/20 hover:bg-background/30 flex size-8 items-center justify-center rounded-lg text-white backdrop-blur transition-colors"
              aria-label="Report"
            >
              <ReportIcon className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative px-5 pt-0 pb-5">
          <div className="-mt-12 flex justify-center">
            <div className="bg-background size-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <img
                src={provider.avatar}
                alt={displayName}
                className="size-full object-cover"
              />
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-lg leading-tight font-bold">{displayName}</h1>
              {provider.isVerified ? (
                <Verified
                  className="text-primary fill-primary/15 size-4 shrink-0"
                  aria-label="Verified"
                />
              ) : null}
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">{provider.specialty}</p>
            <p className="text-muted-foreground mt-2 inline-flex items-center justify-center gap-1 text-xs">
              <LocationIcon className="text-primary size-3.5 shrink-0" />
              <span>
                {provider.address}
                {provider.city ? `, ${provider.city}` : ""}
              </span>
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x rounded-xl border bg-[#F8F9FC]">
            <div className="px-2 py-3 text-center">
              <p className="text-primary text-base font-bold">
                {provider.totalBookings}+
              </p>
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-wide uppercase">
                Bookings
              </p>
            </div>
            <div className="px-2 py-3 text-center">
              <p className="text-primary text-base font-bold">{provider.rating}</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-wide uppercase">
                Rating
              </p>
            </div>
            <div className="px-2 py-3 text-center">
              <p className="text-primary text-base font-bold">
                {provider.yearsOfExperience}+
              </p>
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-wide uppercase">
                Years Exp
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={onToggleSaved}
              className={cn(
                "flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
                saved
                  ? "border-primary/25 bg-primary/10 text-primary"
                  : "gradient-brand border-transparent text-white hover:opacity-95",
              )}
            >
              <HeroHeartIcon tone="dark" filled={saved} className="size-4 shrink-0" />
              <span>{saved ? "Saved" : saveLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="border-border bg-background text-foreground flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors hover:bg-[#F8F9FC]"
              aria-label="Share profile"
            >
              <HeroShareIcon tone="dark" className="size-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md gap-5 p-6">
          <DialogHeader>
            <DialogTitle>Share profile</DialogTitle>
            <DialogDescription>
              Share this service profile with friends and family.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 rounded-xl border border-[#E6EAF2] bg-[#F7F8FC] p-3">
            <div className="bg-muted size-14 shrink-0 overflow-hidden rounded-full">
              <img
                src={provider.avatar}
                alt={displayName}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-semibold">
                {displayName}
              </p>
              <p className="text-muted-foreground mt-0.5 truncate text-xs">
                {provider.specialty}
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
    <div className="hidden lg:sticky lg:top-[7.5rem] lg:block lg:self-start">
      <DoctorProfileSidebar
        provider={provider}
        categorySlug={categorySlug}
        saved={saved}
        onToggleSaved={onToggleSaved}
        onBlockClick={onBlockClick}
        onReportClick={onReportClick}
      />
    </div>
  );
}

function HeroNavButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-9 items-center justify-center transition-opacity hover:opacity-80",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function HeroInfoBadge({ icon: Icon, children }) {
  return (
    <span className="text-foreground inline-flex items-center gap-1.5 rounded-full bg-[#FFFFFF] px-2.5 py-1 text-xs font-medium">
      <Icon className="size-[18px] shrink-0" />
      {children}
    </span>
  );
}

export function DoctorProfileMobileHeroHeader({
  provider,
  categorySlug,
  backHref,
  backLabel,
  saved,
  onToggleSaved,
  onBlockClick,
  onReportClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const category = categorySlug ? getHomeCategoryBySlug(categorySlug) : null;
  const displayName = getCategoryProviderDisplayName(
    provider.businessName,
    categorySlug,
  );
  const resolvedBackHref =
    backHref ?? (categorySlug ? categoryListingRoute(categorySlug) : ROUTES.HOME);
  const resolvedBackLabel =
    backLabel ??
    (categorySlug === "doctor"
      ? "Back to doctors"
      : category
        ? `Back to ${category.name.toLowerCase()}`
        : "Back");

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  return (
    <div className="relative h-[15.5rem] w-full shrink-0 overflow-hidden">
      <img
        src={profileCoverSrc()}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
        <Link
          href={resolvedBackHref}
          className="flex size-9 items-center justify-center transition-opacity hover:opacity-80"
          aria-label={resolvedBackLabel}
        >
          <HeroBackIcon className="size-6" />
        </Link>

        <div className="flex items-center gap-2">
          <HeroNavButton
            onClick={onToggleSaved}
            aria-label={saved ? "Remove from saved" : "Save provider"}
          >
            <HeroHeartIcon className="size-6" filled={saved} />
          </HeroNavButton>
          <HeroNavButton
            onClick={() => handleShareProfile(displayName)}
            aria-label="Share profile"
          >
            <HeroShareIcon className="size-6" />
          </HeroNavButton>
          <div className="relative" ref={menuRef}>
            <HeroNavButton
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <HeroMoreIcon className="size-6" />
            </HeroNavButton>
            {menuOpen ? (
              <div className="border-border/60 bg-background absolute top-full right-0 z-20 mt-2 min-w-[10rem] overflow-hidden rounded-xl border py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onBlockClick();
                  }}
                  className="text-foreground hover:bg-muted flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors"
                >
                  <BlockIcon className="size-4 text-[#F13339]" />
                  Block
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onReportClick();
                  }}
                  className="text-foreground hover:bg-muted flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors"
                >
                  <ReportIcon className="size-4 text-[#4E5A73]" />
                  Report
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 px-4 pb-4">
        <div className="flex items-end gap-3">
          <div className="size-16 shrink-0 overflow-hidden rounded-xl border-2 border-white/90 shadow-md">
            <img
              src={provider.avatar}
              alt={displayName}
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 pb-0.5">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-lg leading-tight font-bold text-white">
                {displayName}
              </h1>
              {provider.isVerified ? (
                <Verified
                  className="size-4 shrink-0 fill-white/20 text-white"
                  aria-label="Verified"
                />
              ) : null}
            </div>
            <p className="mt-0.5 text-sm text-white/85">{provider.specialty}</p>
            <p className="mt-1 flex items-start gap-1 text-xs leading-snug text-white/75">
              <LocationIcon className="mt-0.5 size-3 shrink-0" />
              <span className="line-clamp-2">
                {provider.address}
                {provider.city ? `, ${provider.city}` : ""}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <HeroInfoBadge icon={HeroRatingIcon}>
            <span className="text-[#202020]">{provider.rating}</span>
            <span className="text-muted-foreground">({provider.totalReviews}+)</span>
          </HeroInfoBadge>
          <HeroInfoBadge icon={HeroDistanceIcon}>{provider.distance} km</HeroInfoBadge>
          <HeroInfoBadge icon={HeroExperienceIcon}>
            {provider.yearsOfExperience} Years Exp
          </HeroInfoBadge>
        </div>
      </div>
    </div>
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
  const displayName = getCategoryProviderDisplayName(
    provider.businessName,
    categorySlug,
  );
  const resolvedBackHref =
    backHref ?? (categorySlug ? categoryListingRoute(categorySlug) : ROUTES.HOME);
  const resolvedBackLabel =
    backLabel ??
    (categorySlug === "doctor"
      ? "Back to doctors"
      : category
        ? `Back to ${category.name.toLowerCase()}`
        : "Back");

  return (
    <div className="bg-background shadow-card overflow-hidden rounded-xl border lg:hidden">
      <div className="relative h-28 md:h-32">
        <img src={profileCoverSrc()} alt="" className="size-full object-cover" />
        <div className="from-primary/50 absolute inset-0 bg-gradient-to-t via-black/20 to-transparent" />
        <Link
          href={resolvedBackHref}
          className="bg-background/20 absolute top-3 left-3 flex size-9 items-center justify-center rounded-full text-white backdrop-blur"
          aria-label={resolvedBackLabel}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            type="button"
            onClick={onBlockClick}
            className="bg-background/20 flex size-9 items-center justify-center rounded-full text-white backdrop-blur"
            aria-label="Block"
          >
            <BlockIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={onReportClick}
            className="bg-background/20 flex size-9 items-center justify-center rounded-full text-white backdrop-blur"
            aria-label="Report"
          >
            <ReportIcon className="size-4" />
          </button>
        </div>
      </div>
      <div className="relative px-4 pb-4">
        <div className="-mt-10 flex items-end gap-3">
          <div className="size-20 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md">
            <img
              src={provider.avatar}
              alt={displayName}
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 pb-1">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate font-bold">{displayName}</h1>
              {provider.isVerified ? (
                <Verified
                  className="text-primary fill-primary/15 size-4 shrink-0"
                  aria-label="Verified"
                />
              ) : null}
            </div>
            <p className="text-muted-foreground text-sm">{provider.specialty}</p>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {provider.rating} · {provider.distance} km
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onToggleSaved}
            className={cn(
              "flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
              saved
                ? "border-primary/25 bg-primary/10 text-primary"
                : "gradient-brand border-transparent text-white hover:opacity-95",
            )}
          >
            <HeroHeartIcon tone="dark" filled={saved} className="size-4 shrink-0" />
            <span>{saved ? "Saved" : "Save"}</span>
          </button>
          <button
            type="button"
            onClick={() => handleShareProfile(displayName)}
            className="border-border bg-background text-foreground flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors hover:bg-[#F8F9FC]"
            aria-label="Share profile"
          >
            <HeroShareIcon tone="dark" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
