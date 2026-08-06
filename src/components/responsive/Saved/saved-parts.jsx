"use client";

import { Heart } from "lucide-react";

import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";

export function SavedLoadingSkeleton({ variant = "mobile" }) {
  if (variant === "desktop") {
    return (
      <ResponsiveGrid cols={4} gap="md">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} className="h-56 rounded-2xl" />
        ))}
      </ResponsiveGrid>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonCard key={index} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export function SavedProvidersContent({
  providers,
  savedIds,
  onWishlistToggle,
  variant = "mobile",
}) {
  if (providers.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No saved providers"
        description="Tap the heart icon on any provider to save them here."
        actionLabel="Explore providers"
        onAction={() => {
          window.location.href = ROUTES.PROVIDERS;
        }}
      />
    );
  }

  if (variant === "desktop") {
    return (
      <ResponsiveGrid cols={4} gap="md">
        {providers.map((provider) => (
          <CategoryProviderGridCard
            key={provider.listingKey}
            provider={provider}
            fromSaved
            showWishlist
            isSaved={savedIds.includes(provider.id)}
            onWishlistToggle={onWishlistToggle}
          />
        ))}
      </ResponsiveGrid>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <CategoryProviderListCard
          key={provider.listingKey}
          provider={provider}
          fromSaved
          showWishlist
          isSaved={savedIds.includes(provider.id)}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}
