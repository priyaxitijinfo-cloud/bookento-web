"use client";

import { useState } from "react";
import { MessageCircle, Send, Star, ThumbsUp, X } from "lucide-react";
import { toast } from "sonner";

import { currentUser } from "@/mock/users";
import { TabPanelHeader } from "@/components/provider-booking/shared";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/format.utils";

const PATIENT_REVIEWS = [
  {
    id: "patient_review_1",
    userName: "Charlotte Hanlin",
    userAvatar: "/images/listing/doctors/doctor-1.png",
    rating: 5,
    comment: "Dr. Jenny is very professional in her work and responsive. I have consulted and my problem is solved.",
    likes: 965,
    isLiked: true,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    reply: {
      comment: "Thank you for your wonderful feedback! We look forward to serving you again.",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  },
  {
    id: "patient_review_2",
    userName: "Darron Kulikowaki",
    userAvatar: "/images/listing/doctors/doctor-2.png",
    rating: 4,
    comment: "The doctor is very beautiful and the service is excellent! I like it and want to consult again.",
    likes: 365,
    isLiked: false,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "patient_review_5",
    userName: "Ananya Desai",
    userAvatar: "/images/listing/doctors/doctor-2.png",
    rating: 4,
    comment: "Smooth booking process and friendly staff. The doctor explained everything clearly and made me feel comfortable.",
    likes: 242,
    isLiked: false,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "patient_review_3",
    userName: "Priya Shah",
    userAvatar: "/images/listing/doctors/doctor-3.png",
    rating: 3,
    comment: "Very professional and caring doctor. The consultation was detailed and the staff was helpful throughout.",
    likes: 165,
    isLiked: false,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    reply: {
      comment: "Thank you for sharing your experience. We're glad the consultation was helpful for you.",
      createdAt: new Date(Date.now() - 13 * 86400000).toISOString(),
    },
  },
  {
    id: "patient_review_4",
    userName: "Rahul Mehta",
    userAvatar: "/images/listing/doctors/doctor-4.png",
    rating: 5,
    comment: "Excellent experience. Clear diagnosis, minimal wait time, and a very clean clinic environment.",
    likes: 428,
    isLiked: false,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
];

function StarRating({ value, className }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < value
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-[#D1D5DB]",
          )}
          strokeWidth={index < value ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

function ThreadReply({ avatar, name, badge, badgeClassName, comment, createdAt }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border/50 bg-[#F8F9FC] p-3 md:p-4">
      <div className="size-9 shrink-0 overflow-hidden rounded-xl bg-background ring-1 ring-primary/10 md:size-10">
        <img src={avatar} alt={name} className="size-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-foreground">{name}</p>
          {badge && (
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badgeClassName)}>
              {badge}
            </span>
          )}
          <span className="text-muted-foreground text-xs">
            • {formatRelativeTime(createdAt)}
          </span>
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{comment}</p>
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  provider,
  liked,
  initiallyLiked,
  onToggleLike,
  isReplying,
  replyDraft,
  userReplies,
  onToggleReply,
  onReplyDraftChange,
  onSubmitReply,
}) {
  const likeCount =
    review.likes
    + (liked && !initiallyLiked ? 1 : 0)
    - (!liked && initiallyLiked ? 1 : 0);

  const doctorName = provider?.businessName?.startsWith("Dr.")
    ? provider.businessName
    : `Dr. ${provider?.businessName || "Doctor"}`;

  return (
    <article className="rounded-2xl border border-border/60 bg-background p-4 md:p-5">
      <div className="flex gap-3">
        <div className="size-10 shrink-0 overflow-hidden rounded-xl bg-muted md:size-11">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="size-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">{review.userName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <StarRating value={review.rating} />
            <span className="text-muted-foreground text-xs">
              • {formatRelativeTime(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {review.comment}
      </p>

      {review.reply && (
        <div className="mt-4">
          <ThreadReply
            avatar={provider?.avatar}
            name={doctorName}
            badge="Doctor"
            badgeClassName="bg-primary/10 text-primary"
            comment={review.reply.comment}
            createdAt={review.reply.createdAt}
          />
        </div>
      )}

      {userReplies.length > 0 && (
        <div className="mt-3 space-y-3">
          {userReplies.map((reply) => (
            <ThreadReply
              key={reply.id}
              avatar={reply.userAvatar}
              name={reply.userName}
              comment={reply.comment}
              createdAt={reply.createdAt}
            />
          ))}
        </div>
      )}

      {isReplying && (
        <div className="mt-4 rounded-xl border border-border/60 bg-[#F8F9FC] p-3 md:p-4">
          <div className="flex items-start gap-3">
            <div className="size-9 shrink-0 overflow-hidden rounded-xl bg-background ring-1 ring-primary/10">
              <img src={currentUser.avatar} alt={currentUser.name} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-semibold text-foreground">{currentUser.name}</p>
              <textarea
                value={replyDraft}
                onChange={(event) => onReplyDraftChange(event.target.value)}
                placeholder="Write your reply..."
                rows={3}
                className="w-full resize-none rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none ring-primary/20 focus:ring-2"
              />
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onToggleReply}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSubmitReply}
                  className="gradient-brand inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                >
                  <Send className="size-3.5" />
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center border-t border-border/60 pt-3">
        <button
          type="button"
          onClick={onToggleReply}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
            isReplying ? "text-primary" : "text-muted-foreground hover:text-primary",
          )}
        >
          <MessageCircle className="size-4" />
          Reply
        </button>

        <span className="mx-4 h-4 w-px bg-border/70" aria-hidden />

        <button
          type="button"
          onClick={onToggleLike}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
            liked ? "text-primary" : "text-muted-foreground hover:text-primary",
          )}
        >
          <ThumbsUp className={cn("size-4", liked && "fill-current")} />
          {likeCount}
        </button>
      </div>
    </article>
  );
}

export function ProviderReviewsPanel({ provider }) {
  const [likedReviews, setLikedReviews] = useState(() =>
    Object.fromEntries(
      PATIENT_REVIEWS.filter((review) => review.isLiked).map((review) => [review.id, true]),
    ),
  );
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [userReplies, setUserReplies] = useState({});

  const handleToggleLike = (reviewId) => {
    setLikedReviews((prev) => {
      const review = PATIENT_REVIEWS.find((item) => item.id === reviewId);
      const current = prev[reviewId] ?? Boolean(review?.isLiked);
      return { ...prev, [reviewId]: !current };
    });
  };

  const handleToggleReply = (reviewId) => {
    setReplyingReviewId((current) => (current === reviewId ? null : reviewId));
  };

  const handleReplyDraftChange = (reviewId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleSubmitReply = (reviewId) => {
    const text = replyDrafts[reviewId]?.trim();
    if (!text) {
      toast.error("Please write a reply.");
      return;
    }

    setUserReplies((prev) => ({
      ...prev,
      [reviewId]: [
        ...(prev[reviewId] || []),
        {
          id: `user_reply_${Date.now()}`,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          comment: text,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
    setReplyingReviewId(null);
    toast.success("Reply posted!");
  };

  return (
    <div>
      <TabPanelHeader
        title="Patient Reviews"
        description="Real feedback from patients who have consulted with this doctor."
      />

      <div className="space-y-4">
        {PATIENT_REVIEWS.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            provider={provider}
            liked={Boolean(likedReviews[review.id] ?? review.isLiked)}
            initiallyLiked={Boolean(review.isLiked)}
            onToggleLike={() => handleToggleLike(review.id)}
            isReplying={replyingReviewId === review.id}
            replyDraft={replyDrafts[review.id] || ""}
            userReplies={userReplies[review.id] || []}
            onToggleReply={() => handleToggleReply(review.id)}
            onReplyDraftChange={(value) => handleReplyDraftChange(review.id, value)}
            onSubmitReply={() => handleSubmitReply(review.id)}
          />
        ))}
      </div>
    </div>
  );
}
