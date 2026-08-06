"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

import { SavedLoadingSkeleton, SavedProvidersContent } from "./saved-parts";

export function SavedDesktop({ hasHydrated, providers, savedIds, onWishlistToggle }) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.PROFILE}
          backLabel="Back to Profile"
          currentLabel="Saved Providers"
        />
      )}
    >
      <ResponsiveCard>
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
      </ResponsiveCard>
    </DesktopLayout>
  );
}
