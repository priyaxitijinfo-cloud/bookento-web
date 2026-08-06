import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { buildCategoryProviderDetailUrl, providerDetailRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

export function TopRatedProviderCard({ provider, compact = false, categorySlug = "salon" }) {
  const bookNowHref = (() => {
    const base = categorySlug
      ? buildCategoryProviderDetailUrl(provider.id, categorySlug, provider)
      : providerDetailRoute(provider.id);
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}backFrom=home`;
  })();

  return (
    <Card className="h-full overflow-hidden border-0 p-0 shadow-card transition-all hover:shadow-card-hover">
      <div className={cn("group relative overflow-hidden", compact ? "aspect-[3/4]" : "aspect-[4/5]")}>
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
            "pointer-events-none absolute inline-flex items-center gap-1 rounded-md bg-background/95 font-semibold text-foreground shadow-sm",
            compact ? "top-2 left-2 px-1.5 py-0.5 text-[10px]" : "top-3 left-3 px-2 py-1 text-xs",
          )}
        >
          <Star className={cn("fill-amber-400 text-amber-400", compact ? "size-2.5" : "size-3")} />
          {provider.rating}
        </span>

        <div className={cn("absolute inset-x-0 bottom-0 z-10", compact ? "p-2.5" : "p-3.5")}>
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
              "gradient-brand mt-3 flex w-full items-center justify-center rounded-lg font-semibold text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)] transition-opacity hover:opacity-95",
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
