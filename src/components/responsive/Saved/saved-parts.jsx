"use client";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";

import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { EmptyState } from "@/components/shared/empty-state";
import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";

function SavedEmptyHeartIcon({ className, ...props }) {
  return <HeroHeartIcon tone="dark" className={className} {...props} />;
}

export function SavedLoadingSkeleton({ variant = "mobile" }) {
  if (variant === "desktop") {
    return (
      <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-5">
        {Array.from({ length: 8 }).map((_, index) => (
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

function SavedEmptyStateMobile() {
  return (
    <IllustrationEmptyState
      src="/icons/saved.png"
      title="Not Saved Items Yet"
      description="You haven't saved anything yet. Save your favorite services to access them."
    />
  );
}

export function SavedProvidersContent({
  providers,
  savedIds,
  onWishlistToggle,
  variant = "mobile",
}) {
  if (providers.length === 0) {
    if (variant === "mobile") {
      return <SavedEmptyStateMobile />;
    }

    return (
      <EmptyState
        icon={SavedEmptyHeartIcon}
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
      <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-5">
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
