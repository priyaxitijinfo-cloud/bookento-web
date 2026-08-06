"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

import { ReviewsContent } from "./reviews-parts";

export function ReviewsDesktop({ userReviews, providerMap }) {
  return (
    <DesktopLayout
      maxWidth="narrow"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.PROFILE}
          backLabel="Back to Profile"
          currentLabel="My Reviews"
        />
      )}
    >
      <ResponsiveCard>
        <ReviewsContent userReviews={userReviews} providerMap={providerMap} />
      </ResponsiveCard>
    </DesktopLayout>
  );
}
