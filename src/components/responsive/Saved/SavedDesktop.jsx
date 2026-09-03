"use client";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ROUTES } from "@/constants/routes.constants";

import { SavedLoadingSkeleton, SavedProvidersContent } from "./saved-parts";

export function SavedDesktop({ hasHydrated, providers, savedIds, onWishlistToggle }) {
  return (
    <DesktopLayout
      maxWidth="wide"
      showHeaderBorder={false}
      contentClassName="md:!pt-0 lg:!pt-0"
      containerClassName="md:!pt-0"
      header={
        <>
          <HomeHeader embedded />
          <DesktopBreadcrumbBar
            backHref={ROUTES.PROFILE}
            backLabel="Back to Profile"
            currentLabel="Saved Providers"
          />
        </>
      }
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
