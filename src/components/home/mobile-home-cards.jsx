"use client";

import Link from "next/link";
import { Clock, Star } from "lucide-react";

import { providerDetailRoute } from "@/constants/routes.constants";
import { formatCurrency } from "@/utils/format.utils";

export function TopRatedMobileCard({ provider }) {
  return (
    <Link
      href={providerDetailRoute(provider.id)}
      className="bg-background shadow-card block w-[9.75rem] shrink-0 snap-start overflow-hidden rounded-2xl"
    >
      <div className="relative h-[10.5rem] overflow-hidden">
        <img
          src={provider.coverImage || provider.avatar}
          alt={provider.businessName}
          className="size-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          <Star className="size-2.5 fill-amber-400 text-amber-400" />
          {provider.rating}
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-2.5 pt-8 pb-2">
          <h3 className="line-clamp-1 text-sm font-bold text-white">
            {provider.businessName}
          </h3>
          <p className="line-clamp-1 text-[11px] text-white/80">{provider.specialty}</p>
        </div>
      </div>
      <div className="p-2.5">
        <span className="gradient-brand flex w-full items-center justify-center rounded-lg py-2 text-xs font-medium text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)]">
          Book Now
        </span>
      </div>
    </Link>
  );
}

export function PopularServiceMobileCard({ service }) {
  const title = service.title ?? service.name;
  const duration = service.duration;

  return (
    <Link
      href={providerDetailRoute(service.providerId)}
      className="bg-background shadow-card block w-[8.75rem] shrink-0 snap-start overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={service.image}
          alt={title}
          className="size-full object-cover"
          loading="lazy"
        />
        <span className="bg-background/95 text-foreground absolute top-2 left-2 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold shadow-sm">
          <Star className="size-2.5 fill-amber-400 text-amber-400" />
          4.8
        </span>
      </div>
      <div className="space-y-1 p-2.5">
        <h3 className="text-foreground line-clamp-1 text-xs font-bold">{title}</h3>
        <p className="text-primary text-xs font-bold">
          From {formatCurrency(service.price)}
        </p>
        {duration ? (
          <p className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <Clock className="size-3" />
            {duration}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
