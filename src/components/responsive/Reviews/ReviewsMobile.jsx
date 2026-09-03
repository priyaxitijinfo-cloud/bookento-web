"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ReviewsMobileFeed } from "./reviews-parts";

export function ReviewsMobile({ userReviews }) {
  return (
    <UserPageShell
      title="Reviews"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page max-md:!pb-6"
      mainClassName="max-md:!pt-4"
      showBottomNav={false}
    >
      <ReviewsMobileFeed reviews={userReviews} />
    </UserPageShell>
  );
}
