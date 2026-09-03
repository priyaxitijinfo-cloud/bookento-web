import Link from "next/link";
import { Star } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";

import { SERVICE_MODE_LABELS } from "@/constants/category-listing.constants";
import {
  buildCategoryProviderDetailUrl,
  providerDetailFromSavedRoute,
  providerDetailRoute,
} from "@/constants/routes.constants";
import { ProviderWishlistButton } from "@/components/shared/provider-wishlist-button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";

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

  return tags.slice(0, 2);
}

export function CategoryProviderGridCard({
  provider,
  fromCategory,
  fromSaved = false,
  showWishlist = false,
  isSaved = false,
  onWishlistToggle,
}) {
  const tags = getModeTags(provider.serviceModes);
  const href = getProviderHref(provider, fromCategory, fromSaved);

  return (
    <article className="relative h-full">
      <Link href={href} className="group block h-full">
        <div className="border-border/60 bg-background shadow-card hover:shadow-card-hover flex h-full min-h-[17.5rem] flex-col rounded-xl border p-3 transition-shadow duration-300 sm:min-h-[18.5rem] sm:p-3.5">
          <div className="bg-muted relative aspect-[4/3] shrink-0 overflow-hidden rounded-xl">
            <img
              src={provider.avatar}
              alt={provider.businessName}
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col pt-3">
            <h3 className="text-foreground line-clamp-1 text-sm leading-snug font-bold">
              {provider.businessName}
            </h3>
            <p className="text-muted-foreground mt-1 line-clamp-1 text-xs leading-relaxed">
              {provider.specialty}
            </p>

            <div className="mt-2 flex min-h-[1.375rem] flex-wrap content-start gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag.key}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${tag.className}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            <div className="mt-auto w-full pt-1.5">
              <div className="border-border/50 flex items-center justify-between gap-2 border-t pt-3">
                <p className="text-foreground shrink-0 text-sm leading-none font-bold sm:text-base">
                  {formatCurrency(provider.startingPrice)}
                </p>

                <div className="text-muted-foreground flex min-w-0 items-center gap-2 text-[11px] sm:text-xs">
                  <span className="text-primary flex min-w-0 items-center gap-0.5 font-medium">
                    <LocationIcon className="size-3 shrink-0 sm:size-3.5" />
                    <span className="truncate">{provider.distance} km</span>
                  </span>
                  <span className="bg-border/80 h-3 w-px shrink-0" aria-hidden />
                  <span className="flex shrink-0 items-center gap-0.5 font-semibold text-amber-500">
                    <Star className="size-3 fill-amber-400 text-amber-400 sm:size-3.5" />
                    {provider.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {showWishlist ? (
        <ProviderWishlistButton
          isSaved={isSaved}
          onToggle={() => onWishlistToggle?.(provider.id)}
          className={cn(
            "absolute z-10 bg-white/95 shadow-sm",
            fromSaved ? "top-3.5 right-3.5 md:top-6 md:right-6" : "top-5 right-5",
          )}
        />
      ) : null}
    </article>
  );
}
