"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ReviewsEmptyStateDesktop, ReviewsMobileFeed } from "./reviews-parts";

export function ReviewsDesktop({ userReviews }) {
  const isEmpty = userReviews.length === 0;

  return (
    <UserPageShell
      title="Reviews"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      showBottomNav={false}
      showDesktopHeader={true}
      showBreadcrumb={true}
      containerVariant="browseWithBreadcrumb"
      className="md:!bg-[#F7F8FC]"
      mainClassName="mx-auto w-full max-w-[calc(96rem-60px)] px-[4.875rem] xl:px-[5.875rem] !pt-0 pb-12"
    >
      <div className="overflow-hidden sm:p-0">
        {isEmpty ? (
          <ReviewsEmptyStateDesktop className="!pt-8 !pb-8" />
        ) : (
          <ReviewsMobileFeed reviews={userReviews} />
        )}
      </div>
    </UserPageShell>
  );
}
