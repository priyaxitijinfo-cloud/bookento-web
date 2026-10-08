"use client";

import { DesktopLayout } from "@/components/responsive/layout";

import { SavedLoadingSkeleton, SavedProvidersContent } from "./saved-parts";

export function SavedDesktop({ hasHydrated, providers, savedIds, onWishlistToggle }) {
  return (
    <DesktopLayout
      maxWidth="wide"
      showHeaderBorder={false}
      contentClassName="md:!pt-5 lg:!pt-6"
      containerClassName="md:!pt-0"
    >
      {!hasHydrated ? (
        <SavedLoadingSkeleton variant="desktop" />
      ) : (
        <SavedProvidersContent
          providers={providers}
          savedIds={savedIds}
          onWishlistToggle={onWishlistToggle}
          variant="desktop"
        />
      )}
    </DesktopLayout>
  );
}
