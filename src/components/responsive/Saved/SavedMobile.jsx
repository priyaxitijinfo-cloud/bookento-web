"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { SavedLoadingSkeleton, SavedProvidersContent } from "./saved-parts";

export function SavedMobile({ hasHydrated, providers, savedIds, onWishlistToggle }) {
  return (
    <UserPageShell
      title="Saved Providers"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
    >
      {!hasHydrated ? (
        <SavedLoadingSkeleton />
      ) : (
        <SavedProvidersContent
          providers={providers}
          savedIds={savedIds}
          onWishlistToggle={onWishlistToggle}
        />
      )}
    </UserPageShell>
  );
}
