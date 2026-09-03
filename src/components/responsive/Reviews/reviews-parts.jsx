"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { ReviewLikeIcon, ReviewMsgIcon } from "@/components/icons/review-action-icons";
import { Card, CardContent } from "@/components/ui/card";
import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { providerDetailRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/format.utils";

function ReviewStarRow({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-[15px]",
            index < value
              ? "fill-[#FF9524] text-[#FF9524]"
              : "fill-none text-[#4D5972]",
          )}
          strokeWidth={index < value ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

function ReviewFeedCard({ review, liked, onToggleLike }) {
  const likeCount =
    review.likes +
    (liked && !review.isLiked ? 1 : 0) -
    (!liked && review.isLiked ? 1 : 0);

  return (
    <article className="rounded-2xl border border-[#EEEEEE] bg-white p-4 shadow-[0_1px_8px_rgba(16,24,40,0.04)]">
      <div className="flex gap-3">
        <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-[#F3F4F6]">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-tight font-semibold text-[#111827]">
            {review.userName}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <ReviewStarRow value={review.rating} />
            <span className="text-[12px] text-[#9CA3AF]">
              • {formatRelativeTime(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-[#4B5563]">
        {review.comment}
      </p>

      <div className="mt-3.5 flex items-center justify-end border-t border-[#F1F1F1] pt-3">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4D5972]"
        >
          <ReviewMsgIcon className="size-[18px]" />
          Reply
        </button>

        <span className="mx-4 h-4 w-px bg-[#E5E7EB]" aria-hidden />

        <button
          type="button"
          onClick={onToggleLike}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4D5972]"
        >
          <ReviewLikeIcon className="size-[18px]" />
          <span className="inline-block translate-y-[3px]">{likeCount}</span>
        </button>
      </div>
    </article>
  );
}

export function ReviewsEmptyStateMobile({
  title = "No Reviews Yet",
  description = (
    <>
      <span className="block">You haven&apos;t written any reviews yet.</span>
      <span className="block">Share your experience after completing a booking.</span>
    </>
  ),
  className,
}) {
  return (
    <IllustrationEmptyState
      src="/icons/reviews-empty.svg"
      title={title}
      description={description}
      className={className}
    />
  );
}

export function ReviewsEmptyStateDesktop({
  title = "No Reviews Yet",
  description = (
    <>
      <span className="block">Looks like no one has shared their thoughts yet.</span>
      <span className="block">Be the first to leave a review &amp; help others!</span>
    </>
  ),
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 text-center",
        "pt-[min(18vh,9.5rem)] pb-16",
        className,
      )}
    >
      <img
        src="/icons/reviews-empty.svg"
        alt=""
        width={220}
        height={180}
        className="h-auto w-[min(220px,70vw)] shrink-0 object-contain"
        draggable={false}
        aria-hidden
      />
      <h3 className="mt-6 text-[1.25rem] leading-tight font-bold text-[#111827]">
        {title}
      </h3>
      <p className="mt-2.5 max-w-[17.5rem] text-[14px] leading-relaxed text-[#64748B]">
        {description}
      </p>
    </div>
  );
}

export function ReviewsMobileFeed({ reviews }) {
  const [likedMap, setLikedMap] = useState(() =>
    Object.fromEntries(
      reviews.filter((item) => item.isLiked).map((item) => [item.id, true]),
    ),
  );

  if (reviews.length === 0) {
    return <ReviewsEmptyStateMobile />;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const liked = likedMap[review.id] ?? Boolean(review.isLiked);

        return (
          <ReviewFeedCard
            key={review.id}
            review={review}
            liked={liked}
            onToggleLike={() => {
              setLikedMap((prev) => ({ ...prev, [review.id]: !liked }));
            }}
          />
        );
      })}
    </div>
  );
}

export function ReviewsContent({ userReviews, providerMap }) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        {userReviews.length} review{userReviews.length !== 1 ? "s" : ""} written
      </p>

      {userReviews.length === 0 ? (
        <ReviewsEmptyStateDesktop />
      ) : (
        userReviews.map((review) => {
          const provider = providerMap.get(review.providerId);

          return (
            <Card key={review.id}>
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  {provider ? (
                    <Link
                      href={providerDetailRoute(provider.id)}
                      className="relative size-14 shrink-0 overflow-hidden rounded-xl"
                    >
                      <Image
                        src={provider.avatar}
                        alt={provider.businessName}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  ) : null}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={provider ? providerDetailRoute(provider.id) : "#"}
                        className="font-semibold hover:underline"
                      >
                        {provider?.businessName || "Provider"}
                      </Link>
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`size-4 ${index < review.rating ? "fill-warning text-warning" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {review.comment}
                    </p>
                    {review.reply ? (
                      <div className="bg-muted mt-3 rounded-xl p-3">
                        <p className="text-xs font-medium">Provider Response</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {review.reply.comment}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
