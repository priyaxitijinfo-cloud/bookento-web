"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  buildCategoryProviderDetailUrl,
  providerDetailRoute,
} from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";

function getAvailability(provider) {
  const seed = Number(String(provider.id).replace(/\D/g, "")) || 0;
  const isToday = seed % 2 === 0;
  const hour = 9 + (seed % 8);
  const minute = seed % 2 === 0 ? "00" : "30";
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = ((hour + 11) % 12) + 1;

  return {
    isToday,
    label: `${isToday ? "Today" : "Tomorrow"}, ${displayHour}:${minute} ${period}`,
  };
}

function getPriceUnit(categorySlug) {
  if (categorySlug === "doctor") return "/ consultation";
  if (categorySlug === "fitness" || categorySlug === "tutoring") return "/ session";
  return null;
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
    const specialty =
      provider.specialty || provider.categoryName || "Trusted professional";
    const years = provider.yearsOfExperience;
    const subtitle = [
      specialty,
      years != null ? `${years} years experience` : provider.city,
    ]
      .filter(Boolean)
      .join(" • ");
    const availability = getAvailability(provider);
    const priceUnit = getPriceUnit(categorySlug);
    const pricePrefix =
      categorySlug !== "doctor" && categorySlug !== "fitness" ? "From " : "";

    return (
      <article className="flex h-full flex-col rounded-2xl border border-[#E8EDF5] bg-white px-3.5 pt-3.5 pb-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
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
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(min-width: 768px) 22vw, 50vw"
            />
          </Link>

          <button
            type="button"
            aria-label={`Save ${provider.businessName}`}
            className={cn(
              "absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full",
              "bg-[#0F1B2D]/35 shadow-sm backdrop-blur-[2px]",
              "transition-colors hover:bg-[#0F1B2D]/50",
              "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
            )}
          >
            <Image
              src="/icons/Heart.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
              aria-hidden
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col pt-3.5">
          <Link href={providerDetailRoute(provider.id)} className="block">
            <h3 className="line-clamp-1 text-[15px] leading-snug font-bold text-[#0F1B2D]">
              {provider.businessName}
            </h3>
          </Link>

          <p className="mt-1 line-clamp-1 text-[12.5px] leading-snug text-[#6B7A8D]">
            {subtitle}
          </p>

          <div className="mt-2 flex items-center gap-1 text-[13px]">
            <Star className="size-3.5 fill-[#F5A623] text-[#F5A623]" aria-hidden />
            <span className="font-semibold text-[#0F1B2D]">{provider.rating}</span>
            {provider.totalReviews != null ? (
              <span className="text-[#8A95A8]">({provider.totalReviews})</span>
            ) : null}
          </div>

          <p className="mt-2 text-[15px] leading-none font-bold text-[#0F1B2D]">
            {provider.startingPrice != null ? (
              <>
                {pricePrefix}
                {formatCurrency(provider.startingPrice)}
                {priceUnit ? (
                  <span className="text-[12.5px] font-medium text-[#6B7A8D]">
                    {" "}
                    {priceUnit}
                  </span>
                ) : null}
              </>
            ) : (
              "—"
            )}
          </p>

          <div
            className={cn(
              "mt-3 inline-flex w-full items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium",
              availability.isToday
                ? "bg-[#E8F8EF] text-[#067647]"
                : "bg-[#EAF2FF] text-[#175CD3]",
            )}
          >
            <CalendarClock className="size-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{availability.label}</span>
          </div>

          <Link
            href={bookNowHref}
            className={cn(
              "gradient-brand mt-3 flex w-full items-center justify-center rounded-xl py-2.5",
              "text-[13px] font-semibold text-white",
              "transition-opacity hover:opacity-95",
              "focus-visible:ring-2 focus-visible:ring-[#1865EA]/35 focus-visible:outline-none",
            )}
          >
            {t("bookAppointment")}
          </Link>
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
