"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Star } from "lucide-react";

import { formatDuration } from "@/constants/popular-services";
import {
  categoryListingRoute,
  providerDetailRoute,
} from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { formatCurrency } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

const IMAGE_FOCUS = [
  "object-center",
  "object-center",
  "object-[center_25%]",
  "object-[center_20%]",
];

/** Web-only — image gallery + floating dock (not poster overlay / not white card) */
function DesktopPopularServiceTile({ service, title, duration, href, imageFocus }) {
  const { t } = useWebLocale();

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="flex h-full flex-col" aria-label={`Book ${title}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#EEF2F7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.image}
            alt={title}
            className={cn(
              "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]",
              imageFocus,
            )}
            loading="lazy"
            decoding="async"
          />

          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(15,23,42,0.18)_100%)]"
          />

          <span className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#0F1B2D] shadow-sm backdrop-blur-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {service.rating}
          </span>

          <div className="absolute inset-x-3 bottom-3 z-10 rounded-2xl bg-white/95 p-3.5 shadow-[0_10px_28px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md">
            <h3 className="line-clamp-2 text-[15px] leading-snug font-bold text-[#0F1B2D]">
              {title}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#66758A]">
              {service.providerName ? (
                <span className="line-clamp-1 font-medium">{service.providerName}</span>
              ) : null}
              {service.providerName && duration ? (
                <span className="text-[#D0D5DD]" aria-hidden>
                  ·
                </span>
              ) : null}
              {duration ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3 shrink-0" strokeWidth={2.25} />
                  {duration}
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[1.05rem] leading-none font-bold text-[#0F1B2D]">
                {formatCurrency(service.price)}
              </p>
              <span className="gradient-brand inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(24,101,234,0.55)]">
                {t("bookNow")}
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-300 group-hover:rotate-12"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </span>
            </div>
          </div>
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
        duration={duration}
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
