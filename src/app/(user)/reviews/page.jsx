"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ReviewsMobile } from "@/components/responsive/Reviews/ReviewsMobile";
import {
  ReviewsEmptyStateDesktop,
  ReviewsMobileFeed,
} from "@/components/responsive/Reviews/reviews-parts";
import { ROUTES } from "@/constants/routes.constants";
import { currentUser } from "@/mock/users";
import { reviews } from "@/mock/reviews";

export default function ReviewsPage() {
  const userReviews = reviews.filter((r) => r.userId === currentUser.id);
  const isEmpty = userReviews.length === 0;

  return (
    <>
      <div className="md:hidden">
        <ReviewsMobile userReviews={userReviews} />
      </div>

      <div className="hidden md:block">
        <UserPageShell
          title="Reviews"
          backHref={ROUTES.PROFILE}
          backLabel="Back to Profile"
          showBottomNav={false}
          showDesktopHeader={true}
          showBreadcrumb={true}
          containerVariant="browseWithBreadcrumb"
          className="md:!bg-[#F7F8FC]"
          mainClassName="mx-auto w-full max-w-lg !pt-0 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem] md:!pt-0 md:pb-12"
        >
          <div className="overflow-hidden sm:p-0">
            {isEmpty ? (
              <ReviewsEmptyStateDesktop className="!pt-8 !pb-8" />
            ) : (
              <ReviewsMobileFeed reviews={userReviews} />
            )}
          </div>
        </UserPageShell>
      </div>
    </>
  );
}
