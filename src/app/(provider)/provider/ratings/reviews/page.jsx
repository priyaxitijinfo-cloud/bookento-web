"use client";

import { Suspense } from "react";

import { ProviderReviewsView } from "@/features/provider/components/provider-reviews-view";

export default function ProviderRatingsReviewsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1 bg-[#F4F7FF]" />}>
        <ProviderReviewsView />
      </Suspense>
    </div>
  );
}
