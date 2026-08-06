"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Verified } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";
import { providerDetailRoute } from "@/constants/routes.constants";

export function ProviderCard({ provider, className, horizontal = false }) {
  return (
    <Link href={providerDetailRoute(provider.id)}>
      <Card className={cn("group overflow-hidden transition-all hover:shadow-card-hover", horizontal ? "flex" : "", className)}>
        <div className={cn("relative overflow-hidden", horizontal ? "w-32 shrink-0" : "aspect-[4/3]")}>
          <Image
            src={provider.coverImage || provider.avatar}
            alt={provider.businessName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {provider.isVerified && (
            <Badge variant="success" className="absolute left-2 top-2 gap-1">
              <Verified className="size-3" /> Verified
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-1 font-semibold">{provider.businessName}</h3>
          <p className="text-muted-foreground text-sm">{provider.specialty}</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-medium">
              <Star className="size-4 fill-warning text-warning" />
              {provider.rating}
            </span>
            <span className="text-muted-foreground">({provider.totalReviews})</span>
            {provider.distance && (
              <span className="text-muted-foreground flex items-center gap-1">
                <LocationIcon className="size-3" /> {provider.distance} km
              </span>
            )}
          </div>
          <p className="text-primary mt-auto pt-2 text-sm font-semibold">
            From {formatCurrency(provider.startingPrice)}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export function ProviderCardCompact({ provider }) {
  return (
    <Link
      href={providerDetailRoute(provider.id)}
      className="group flex w-[4.75rem] shrink-0 flex-col items-center gap-2.5"
    >
      <div className="relative size-[4.75rem] overflow-hidden rounded-2xl ring-2 ring-border/60 transition-all group-hover:ring-primary/30">
        <Image
          src={provider.avatar}
          alt={provider.businessName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="w-full text-center">
        <p className="text-foreground truncate text-xs font-medium">{provider.businessName}</p>
        <p className="text-muted-foreground mt-0.5 flex items-center justify-center gap-0.5 text-[11px]">
          <Star className="size-3 fill-warning text-warning" />
          {provider.rating}
        </p>
      </div>
    </Link>
  );
}
