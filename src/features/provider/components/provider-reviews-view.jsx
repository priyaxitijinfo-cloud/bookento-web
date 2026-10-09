"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { ProviderReviewCard } from "@/features/provider/components/provider-review-card";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { providerRatingsRoute } from "@/constants/routes.constants";
import {
  PROVIDER_DESKTOP_GRID,
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { currentProvider } from "@/mock/providers";
import { getReviewsByProvider } from "@/mock/reviews";
import { cn } from "@/lib/utils";

export function ProviderReviewsView() {
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const reviews = forceEmpty ? [] : getReviewsByProvider(currentProvider.id);
  const backHref = providerRatingsRoute({ empty: forceEmpty });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className={PROVIDER_MOBILE_HEADER}>
          <Link
            href={backHref}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <img
              src={PROVIDER_ICONS.arrowLeft}
              alt=""
              className="size-5 object-contain"
              draggable={false}
            />
          </Link>
          <h1 className="flex-1 truncate text-[17px] font-bold text-[#111827]">
            Reviews
          </h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className={cn(PROVIDER_PAGE_SHELL, "pt-4 pb-8")}>
          {reviews.length === 0 ? (
            <IllustrationEmptyState
              src="/icons/reviews-empty.svg"
              title="Not Reviews Yet"
              description="Your reviews will appear here after patients share their feedback."
              className="min-h-[60vh] py-10"
              imageClassName="size-[180px] w-[min(180px,70vw)]"
            />
          ) : (
            <div className={cn(PROVIDER_DESKTOP_GRID, "gap-3")}>
              {reviews.map((review) => (
                <ProviderReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
