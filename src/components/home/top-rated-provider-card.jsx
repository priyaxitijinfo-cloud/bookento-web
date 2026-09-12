"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SERVICE_MODE_LABELS } from "@/constants/category-listing.constants";
import {
  buildCategoryProviderDetailUrl,
  providerDetailRoute,
} from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";

function getDesktopModeTags(serviceModes = []) {
  const tags = [];
  const seen = new Set();

  for (const mode of serviceModes) {
    const config = SERVICE_MODE_LABELS[mode];
    if (!config || seen.has(config.label)) continue;
    seen.add(config.label);
    tags.push({ key: mode, ...config });
  }

  return tags.slice(0, 2);
}

export function TopRatedProviderCard({
  provider,
  compact = false,
  desktop = false,
  categorySlug = "salon",
}) {
  const { t } = useWebLocale();

  const bookNowHref = (() => {
    const base = categorySlug
      ? buildCategoryProviderDetailUrl(provider.id, categorySlug, provider)
      : providerDetailRoute(provider.id);
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}backFrom=home`;
  })();

  if (desktop) {
    const modeTags = getDesktopModeTags(provider.serviceModes);
    const subtitle =
      provider.specialty || provider.categoryName || "Trusted professional";
    const description =
      provider.description ||
      (provider.ownerName
        ? `Led by ${provider.ownerName} · premium service nearby`
        : null);

    return (
      <article className="flex h-full flex-col rounded-xl border border-[#E8EDF5] bg-white px-3.5 pt-3.5 pb-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#EEF2F7]">
          <Link
            href={providerDetailRoute(provider.id)}
            className="absolute inset-0"
            aria-label={`View ${provider.businessName}`}
          >
            <Image
              src={provider.coverImage || provider.avatar}
              alt={provider.businessName}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              sizes="(min-width: 768px) 22vw, 50vw"
            />
          </Link>

          <span className="absolute right-2.5 bottom-2.5 z-10 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-[#0F1B2D] shadow-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {provider.rating}
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-3.5">
          <div className="space-y-1.5 pb-2.5">
            <Link href={providerDetailRoute(provider.id)} className="block">
              <h3 className="line-clamp-1 text-[15px] leading-snug font-bold text-[#0F1B2D]">
                {provider.businessName}
              </h3>
            </Link>

            <p className="line-clamp-1 text-[13px] leading-snug font-medium text-[#4B5C73]">
              {subtitle}
            </p>

            {description ? (
              <p className="line-clamp-2 text-[12px] leading-relaxed text-[#8A95A8]">
                {description}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[13px] leading-snug text-[#66758A]">
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPin className="size-3.5 shrink-0 text-[#94A3B8]" strokeWidth={2} />
                <span className="truncate">
                  {[
                    provider.city,
                    provider.distance != null ? `${provider.distance} km` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              {provider.appointmentDuration != null ? (
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Clock className="size-3.5 text-[#94A3B8]" strokeWidth={2} />
                  {provider.appointmentDuration} min
                </span>
              ) : null}
            </div>

            {modeTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {modeTags.map((tag) => (
                  <span
                    key={tag.key}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-medium",
                      tag.className,
                    )}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-auto border-t border-[#EEF2F7] pt-2.5">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 text-[17px] leading-none font-bold text-[#0F1B2D]">
                {provider.startingPrice != null
                  ? formatCurrency(provider.startingPrice)
                  : "—"}
              </p>
              <Link
                href={bookNowHref}
                className={cn(
                  "group gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2",
                  "text-[13px] font-semibold text-white",
                  "transition-opacity hover:opacity-95",
                  "focus-visible:ring-2 focus-visible:ring-[#1865EA]/35 focus-visible:outline-none",
                )}
              >
                {t("bookNow")}
                <ArrowUpRight
                  className="size-[18px] transition-transform duration-200 group-hover:rotate-12"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Card className="shadow-card hover:shadow-card-hover h-full overflow-hidden border-0 p-0 transition-all">
      <div
        className={cn(
          "group relative overflow-hidden",
          compact ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <Link
          href={providerDetailRoute(provider.id)}
          className="absolute inset-0 z-0"
          aria-label={`View ${provider.businessName}`}
        >
          <Image
            src={provider.coverImage || provider.avatar}
            alt={provider.businessName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={compact ? "45vw" : "(max-width: 640px) 50vw, 25vw"}
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#1A1A2E]/75 via-[#1A1A2E]/20 to-transparent" />

        <span
          className={cn(
            "bg-background/95 text-foreground absolute inline-flex items-center gap-1 rounded-md font-semibold shadow-sm",
            compact
              ? "top-2 left-2 z-10 px-2 py-1 text-xs"
              : "pointer-events-none top-3 left-3 px-2 py-1 text-xs",
          )}
        >
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {provider.rating}
        </span>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10",
            compact ? "p-2.5" : "p-3.5",
          )}
        >
          <Link href={providerDetailRoute(provider.id)} className="block">
            <h3
              className={cn(
                "line-clamp-1 font-semibold text-white",
                compact ? "text-base leading-tight" : "text-xl",
              )}
            >
              {provider.businessName}
            </h3>
            <p
              className={cn(
                "mt-0.5 line-clamp-1 text-white/75",
                compact ? "text-[13px] leading-snug" : "text-[15px]",
              )}
            >
              {provider.specialty}
            </p>
          </Link>

          <Link
            href={bookNowHref}
            className={cn(
              "gradient-brand mt-3 flex w-full items-center justify-center rounded-lg font-medium text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)] transition-opacity hover:opacity-95 md:font-semibold",
              compact ? "mt-2 py-1.5 text-xs" : "py-2 text-[13px]",
            )}
          >
            Book Now
          </Link>
        </div>
      </div>
    </Card>
  );
}
