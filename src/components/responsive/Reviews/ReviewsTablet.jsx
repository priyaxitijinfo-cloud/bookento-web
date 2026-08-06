"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ReviewsContent } from "./reviews-parts";

export function ReviewsTablet({ userReviews, providerMap }) {
  return (
    <UserPageShell
      title="My Reviews"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      containerVariant="narrow"
      mainClassName="mx-auto max-w-2xl space-y-4"
    >
      <ReviewsContent userReviews={userReviews} providerMap={providerMap} />
    </UserPageShell>
  );
}
