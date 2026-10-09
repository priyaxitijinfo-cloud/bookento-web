"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import {
  ProviderReviewCard,
  ProviderStarRating,
} from "@/features/provider/components/provider-review-card";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { providerRatingsReviewsRoute } from "@/constants/routes.constants";
import {
  PROVIDER_DESKTOP_GRID,
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { currentProvider } from "@/mock/providers";
import { getRatingOverview, getReviewsByProvider } from "@/mock/reviews";
import { cn } from "@/lib/utils";

const STAR_ORANGE = "#F5A623";

function providerDisplayName(provider) {
  const name = provider.ownerName || provider.businessName || "Provider";
  return name.startsWith("Dr.") || name.startsWith("Dr ") ? name : `Dr. ${name}`;
}

function ProviderSummaryCard({ provider, overview, isEmpty }) {
  const ratingLabel = isEmpty
    ? "0.0"
    : Number(overview.averageRating).toFixed(
        Number.isInteger(overview.averageRating) ? 1 : 2,
      );
  const ratingsCount = overview.totalRatings;

  return (
    <section className="rounded-2xl border border-[#EEEEEE] bg-white px-4 py-5 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="mx-auto size-[72px] overflow-hidden rounded-2xl bg-[#F3F4F6]">
        <img
          src={provider.avatar}
          alt={providerDisplayName(provider)}
          className="size-full object-cover"
        />
      </div>
      <h2 className="mt-3 text-lg font-bold text-[#111827]">
        {providerDisplayName(provider)}
      </h2>
      <p className="mt-0.5 text-sm text-[#64748B]">{provider.specialty}</p>

      <div className="mt-3 flex items-center justify-center gap-3 text-sm">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-semibold",
            isEmpty ? "text-[#94A3B8]" : "text-[#F5A623]",
          )}
        >
          <img
            src={isEmpty ? PROVIDER_ICONS.star : PROVIDER_ICONS.starFilled}
            alt=""
            className={cn("size-4 object-contain", isEmpty && "opacity-50 grayscale")}
            draggable={false}
          />
          {ratingLabel}
        </span>
        <span className="h-4 w-px bg-[#E5E7EB]" aria-hidden />
        <span
          className={cn("font-medium", isEmpty ? "text-[#94A3B8]" : "text-[#4B5563]")}
        >
          {ratingsCount} Ratings
        </span>
      </div>
    </section>
  );
}

function DistributionCard({ overview, isEmpty }) {
  const maxCount = Math.max(...Object.values(overview.distribution), 1);
  const score = isEmpty ? "0.0" : Number(overview.scoreOutOf10).toFixed(1);

  return (
    <section className="rounded-2xl border border-[#EEEEEE] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex items-stretch gap-4">
        <div className="flex w-[38%] shrink-0 flex-col items-center justify-center py-1 text-center">
          <p className="leading-none">
            <span
              className={cn(
                "text-[2rem] font-bold tracking-tight",
                isEmpty ? "text-[#64748B]" : "text-[#F5A623]",
              )}
            >
              {score}
            </span>
            <span className="text-base font-semibold text-[#64748B]">/10</span>
          </p>
          <ProviderStarRating value={isEmpty ? 0 : 5} size="md" className="mt-2" />
          <p className="mt-2 text-[12px] text-[#94A3B8]">
            ({overview.totalUsers} Users)
          </p>
        </div>

        <div className="w-px shrink-0 self-stretch bg-[#EEF2F7]" aria-hidden />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-0.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = overview.distribution[star] || 0;
            const pct = isEmpty ? 0 : (count / maxCount) * 100;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 text-right text-[12px] font-medium text-[#64748B]">
                  {star}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF2F7]">
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: STAR_ORANGE,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProviderRatingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const reviews = forceEmpty ? [] : getReviewsByProvider(currentProvider.id);
  const isEmpty = forceEmpty || reviews.length === 0;
  const overview = getRatingOverview(currentProvider.id, { empty: isEmpty });
  const previewReviews = reviews.slice(0, 3);

  const seeAllHref = providerRatingsReviewsRoute({ empty: forceEmpty });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className={PROVIDER_MOBILE_HEADER}>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <img
              src={PROVIDER_ICONS.arrowLeft}
              alt=""
              className="size-5 object-contain"
              draggable={false}
            />
          </button>
          <h1 className="flex-1 truncate text-[17px] font-bold text-[#111827]">
            My Ratings
          </h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className={cn(PROVIDER_PAGE_SHELL, "space-y-4 pt-4 pb-8")}>
          <div className={PROVIDER_DESKTOP_GRID}>
            <ProviderSummaryCard
              provider={currentProvider}
              overview={overview}
              isEmpty={isEmpty}
            />
            <DistributionCard overview={overview} isEmpty={isEmpty} />
          </div>

          {isEmpty ? (
            <IllustrationEmptyState
              src="/icons/reviews-empty.svg"
              title="Not Reviews Yet"
              description="Your reviews will appear here after patients share their feedback."
              className="min-h-0 py-10"
              imageClassName="size-[180px] w-[min(180px,70vw)]"
            />
          ) : (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3 px-0.5">
                <h2 className="text-base font-bold text-[#111827]">Reviews</h2>
                <Link
                  href={seeAllHref}
                  className="text-sm font-semibold text-[#1865EA] transition-opacity hover:opacity-80"
                >
                  See all &gt;
                </Link>
              </div>
              <div className={cn(PROVIDER_DESKTOP_GRID, "gap-3")}>
                {previewReviews.map((review) => (
                  <ProviderReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
