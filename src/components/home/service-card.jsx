"use client";

import Link from "next/link";
import { Clapperboard, Star, Trophy } from "lucide-react";
import { toast } from "sonner";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";
import { formatDuration } from "@/constants/popular-services";
import {
  categoryListingRoute,
  providerDetailRoute,
} from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { useSavedProvidersStore } from "@/store";
import { formatCurrency } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

const IMAGE_FOCUS = [
  "object-center",
  "object-center",
  "object-[center_25%]",
  "object-[center_20%]",
];

function BadgeIcon({ tone }) {
  if (tone === "star") {
    return <Star className="size-3.5 fill-amber-400 text-amber-400" />;
  }
  if (tone === "featured") {
    return <Clapperboard className="size-3.5 text-[#6366F1]" strokeWidth={2.2} />;
  }
  return <Trophy className="size-3.5 text-[#7C3AED]" strokeWidth={2.2} />;
}

function formatReviews(count) {
  if (!count && count !== 0) return null;
  return new Intl.NumberFormat("en-IN").format(count);
}

/** Web-only — reference marketplace card (image + details below) */
function DesktopPopularServiceTile({ service, title, href, imageFocus }) {
  const displayTitle = service.providerName || title;
  const location = service.location || service.tagline || null;
  const categoryLabel = service.categoryLabel || null;
  const reviews = formatReviews(service.reviewCount);
  const saveId = service.id;
  const isSaved = useSavedProvidersStore((state) =>
    saveId ? state.savedIds.includes(saveId) : false,
  );
  const toggleSaved = useSavedProvidersStore((state) => state.toggleSaved);

  const handleToggleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!saveId) return;

    const isNowSaved = toggleSaved(saveId);
    toast.success(isNowSaved ? "Saved to favorites" : "Removed from saved");
  };

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        className="flex h-full flex-col"
        aria-label={`View ${displayTitle}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#EEF2F7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.image}
            alt={displayTitle}
            className={cn(
              "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]",
              imageFocus,
            )}
            loading="lazy"
            decoding="async"
          />

          {service.badge ? (
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-[#0F1B2D] shadow-sm backdrop-blur-sm">
              <BadgeIcon tone={service.badgeTone} />
              {service.badge}
            </span>
          ) : null}

          <button
            type="button"
            aria-label={isSaved ? "Remove from saved" : "Save provider"}
            aria-pressed={isSaved}
            className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-colors hover:bg-black/35"
            onClick={handleToggleSave}
          >
            <HeroHeartIcon tone="hero" filled={isSaved} className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col pt-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 min-w-0 flex-1 text-[0.98rem] leading-snug font-bold text-[#0F1B2D]">
              {displayTitle}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1 pt-0.5 text-[0.92rem] font-bold text-[#0F1B2D]">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {service.rating}
            </span>
          </div>

          {location ? (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[#6B7A8D]">
              {location}
            </p>
          ) : null}

          <p className="mt-1 line-clamp-1 text-[12px] text-[#6B7A8D]">
            {[categoryLabel, reviews ? `${reviews} reviews` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function ServiceCard({ service, index = 0, desktop = false }) {
  const { t } = useWebLocale();
  const title = service.titleKey
    ? t(service.titleKey)
    : (service.title ?? service.name);
  const duration = formatDuration(service.duration);
  const imageFocus = IMAGE_FOCUS[index] ?? "object-center";
  const href = service.categorySlug
    ? categoryListingRoute(service.categorySlug)
    : providerDetailRoute(service.providerId);

  if (desktop) {
    return (
      <DesktopPopularServiceTile
        service={service}
        title={title}
        href={href}
        imageFocus={imageFocus}
      />
    );
  }

  return (
    <Link href={href} className="group block h-full">
      <article className="border-border/60 bg-background shadow-card hover:shadow-card-hover flex h-full flex-col rounded-xl border p-3 transition-shadow duration-300 sm:p-3.5">
        <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-xl">
          <img
            src={service.image}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]",
              imageFocus,
            )}
            loading="lazy"
            decoding="async"
          />
          <span className="bg-background/95 text-foreground absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold shadow-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {service.rating}
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-3">
          <h3 className="text-foreground line-clamp-1 text-sm font-bold">{title}</h3>

          <div className="border-border/50 mt-3 flex items-center justify-between gap-2 border-t pt-3">
            <p className="text-foreground text-base leading-none font-bold">
              {formatCurrency(service.price)}
            </p>
            {duration && (
              <span className="text-muted-foreground shrink-0 text-xs">{duration}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
