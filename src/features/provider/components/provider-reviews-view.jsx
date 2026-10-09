"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { ProviderReviewCard } from "@/features/provider/components/provider-review-card";
import { providerRatingsRoute } from "@/constants/routes.constants";
import { currentProvider } from "@/mock/providers";
import { getReviewsByProvider } from "@/mock/reviews";

export function ProviderReviewsView() {
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const reviews = forceEmpty ? [] : getReviewsByProvider(currentProvider.id);
  const backHref = providerRatingsRoute({ empty: forceEmpty });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-1 px-3 lg:px-6">
          <Link
            href={backHref}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="flex-1 truncate text-[17px] font-bold text-[#111827]">
            Reviews
          </h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className="mx-auto w-full max-w-3xl px-4 pt-4 pb-8 lg:px-6">
          {reviews.length === 0 ? (
            <IllustrationEmptyState
              src="/icons/reviews-empty.svg"
              title="No Reviews Yet"
              description="Your reviews will appear here after patients share their feedback."
              className="min-h-[60vh] py-10"
              imageClassName="size-[180px] w-[min(180px,70vw)]"
            />
          ) : (
            <div className="space-y-3">
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
