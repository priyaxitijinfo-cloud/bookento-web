import Link from "next/link";
import { Star } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";

import { providerDetailRoute } from "@/constants/routes.constants";

export function NearbyProviderCard({ provider }) {
  return (
    <Link href={providerDetailRoute(provider.id)} className="block h-full w-full">
      <article className="relative h-[12.75rem] overflow-hidden rounded-xl bg-[#1A1A2E] shadow-[0_2px_12px_rgba(15,23,42,0.08)] sm:h-[13.25rem]">
        <img
          src={provider.coverImage || provider.avatar}
          alt={provider.businessName}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/95 via-[#1A1A2E]/35 to-[#1A1A2E]/10" />

        {provider.distance != null && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
            <LocationIcon className="size-2.5 shrink-0" strokeWidth={2.5} />
            {provider.distance} km
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="line-clamp-1 text-sm font-bold text-white">{provider.businessName}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/75">{provider.specialty}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {provider.rating}
          </span>
        </div>
      </article>
    </Link>
  );
}
