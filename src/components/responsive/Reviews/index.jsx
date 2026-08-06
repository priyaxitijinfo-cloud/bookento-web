"use client";

import { useMemo } from "react";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { currentUser } from "@/mock/users";
import { reviews } from "@/mock/reviews";
import { mockProviders } from "@/mock/providers";

import { ReviewsDesktop } from "./ReviewsDesktop";
import { ReviewsMobile } from "./ReviewsMobile";
import { ReviewsTablet } from "./ReviewsTablet";

export function ReviewsResponsive() {
  const userReviews = useMemo(
    () => reviews.filter((item) => item.userId === currentUser.id),
    [],
  );
  const providerMap = useMemo(
    () => new Map(mockProviders.map((provider) => [provider.id, provider])),
    [],
  );

  const sharedProps = { userReviews, providerMap };

  return (
    <ResponsiveView
      mobile={<ReviewsMobile {...sharedProps} />}
      tablet={<ReviewsTablet {...sharedProps} />}
      desktop={<ReviewsDesktop {...sharedProps} />}
    />
  );
}

export default ReviewsResponsive;
