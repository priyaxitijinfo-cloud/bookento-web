import Link from "next/link";
import { ChevronRight, IndianRupee, Star } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";

import { SERVICE_MODE_LABELS } from "@/constants/category-listing.constants";
import {
  buildCategoryProviderDetailUrl,
  providerDetailFromSavedRoute,
  providerDetailRoute,
} from "@/constants/routes.constants";
import { ProviderWishlistButton } from "@/components/shared/provider-wishlist-button";
import { cn } from "@/lib/utils";

function getProviderHref(provider, fromCategory, fromSaved) {
  if (fromSaved) {
    return providerDetailFromSavedRoute(provider.id);
  }

  return fromCategory
    ? buildCategoryProviderDetailUrl(provider.id, fromCategory, provider)
    : providerDetailRoute(provider.id);
}

function getModeTags(serviceModes) {
  const tags = [];
  const seen = new Set();

  for (const mode of serviceModes) {
    const config = SERVICE_MODE_LABELS[mode];
    if (!config || seen.has(config.label)) continue;
    seen.add(config.label);
    tags.push({ key: mode, ...config });
  }

  return tags;
}

function StatDivider() {
  return <span aria-hidden className="mx-2.5 h-3.5 w-px shrink-0 bg-[#E5E7EB]" />;
}

export function CategoryProviderListCard({
  provider,
  fromCategory,
  fromSaved = false,
  className,
  showWishlist = false,
  isSaved = false,
  onWishlistToggle,
}) {
  const tags = getModeTags(provider.serviceModes);
  const href = getProviderHref(provider, fromCategory, fromSaved);

  return (
    <article
      className={cn(
        "bg-background relative flex items-start gap-3 rounded-2xl p-3",
        "md:shadow-card border border-[#F2F2F2] shadow-none md:border-0",
        className,
      )}
    >
      <div className="bg-muted h-[5.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-xl">
        <img
          src={provider.avatar}
          alt={provider.businessName}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="min-w-0 flex-1 pr-10">
        <h3 className="text-foreground truncate text-[15px] leading-tight font-bold">
          {provider.businessName}
        </h3>
        <p className="text-muted-foreground mt-0.5 truncate text-[13px]">
          {provider.specialty}
        </p>

        <div className="mt-2 flex items-center text-[13px]">
          <span className="md:text-primary flex items-center gap-1 font-medium text-[#4D5972]">
            <LocationIcon className="size-3.5 shrink-0 text-[#1964E9] md:text-inherit" />
            {provider.distance} mi
          </span>
          <StatDivider />
          <span className="flex items-center gap-1 font-semibold text-[#4D5972] md:text-amber-500">
            <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
            {provider.rating}
          </span>
          <StatDivider />
          <span className="md:text-primary flex items-center gap-0.5 font-semibold text-[#4D5972]">
            <IndianRupee className="size-3.5 shrink-0 text-[#1964E9] md:text-inherit" />
            {provider.startingPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.key}
                className={cn(
                  "rounded-sm px-2 py-0.5 text-[11px] font-medium md:rounded-md",
                  tag.key === "video_call"
                    ? "bg-[#E4EEFF] text-[#1865EA] md:bg-sky-50 md:text-sky-600"
                    : tag.key === "online"
                      ? "bg-[#E0F5EA] text-[#0F9250] md:bg-emerald-50 md:text-emerald-600"
                      : tag.key === "in_clinic" || tag.key === "home_visit"
                        ? "bg-[#FFF0E5] text-[#FE7F07] md:bg-orange-50 md:text-orange-600"
                        : tag.className,
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {showWishlist ? (
        <ProviderWishlistButton
          isSaved={isSaved}
          onToggle={() => onWishlistToggle?.(provider.id)}
          className="absolute top-3 right-3"
        />
      ) : (
        <Link
          href={href}
          className="text-muted-foreground absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-[#EEF4FF] transition-colors hover:bg-[#E3EDFF]"
          aria-label={`View ${provider.businessName}`}
        >
          <ChevronRight className="size-5" />
        </Link>
      )}
    </article>
  );
}
