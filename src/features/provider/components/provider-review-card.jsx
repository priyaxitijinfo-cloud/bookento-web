"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { toast } from "sonner";

import { ReviewLikeIcon, ReviewMsgIcon } from "@/components/icons/review-action-icons";
import { currentProvider } from "@/mock/providers";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/format.utils";

const STAR_ORANGE = "#F5A623";
const STAR_EMPTY = "#D1D5DB";

export function ProviderStarRating({ value, size = "sm", className }) {
  const sizeClass = size === "lg" ? "size-5" : size === "md" ? "size-4" : "size-[15px]";

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(value);
        return (
          <Star
            key={index}
            className={cn(sizeClass)}
            style={
              filled
                ? { fill: STAR_ORANGE, color: STAR_ORANGE }
                : { fill: "none", color: STAR_EMPTY }
            }
            strokeWidth={filled ? 0 : 1.5}
          />
        );
      })}
    </div>
  );
}

export function ProviderReviewCard({ review }) {
  const [liked, setLiked] = useState(Boolean(review.isLiked));
  const [likeCount, setLikeCount] = useState(review.likes ?? 0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const [localReply, setLocalReply] = useState(review.reply ?? null);

  const handleToggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((count) => count + (next ? 1 : -1));
      return next;
    });
  };

  const handleSubmitReply = () => {
    const text = replyDraft.trim();
    if (!text) {
      toast.error("Please write a reply.");
      return;
    }

    setLocalReply({
      id: `local_reply_${Date.now()}`,
      comment: text,
      createdAt: new Date().toISOString(),
    });
    setReplyDraft("");
    setIsReplying(false);
    toast.success("Reply posted");
  };

  return (
    <article className="rounded-2xl border border-[#EEEEEE] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex gap-3">
        <div className="size-11 shrink-0 overflow-hidden rounded-xl bg-[#F3F4F6]">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-tight font-bold text-[#111827]">
            {review.userName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <ProviderStarRating value={review.rating} />
            <span className="text-[12px] text-[#9CA3AF]">
              • {formatRelativeTime(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-[#4B5563]">
        {review.comment}
      </p>

      {localReply ? (
        <div className="mt-3 rounded-xl border border-[#E8EEF8] bg-[#F8F9FC] p-3">
          <div className="flex items-center gap-2">
            <div className="size-8 shrink-0 overflow-hidden rounded-lg bg-[#E8F1FF]">
              <img
                src={currentProvider.avatar}
                alt=""
                className="size-full object-cover"
              />
            </div>
            <p className="text-xs font-semibold text-[#111827]">Your reply</p>
            <span className="text-[11px] text-[#9CA3AF]">
              • {formatRelativeTime(localReply.createdAt)}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[#64748B]">
            {localReply.comment}
          </p>
        </div>
      ) : null}

      {isReplying ? (
        <div className="mt-3 rounded-xl border border-[#E8EEF8] bg-[#F8F9FC] p-3">
          <textarea
            value={replyDraft}
            onChange={(event) => setReplyDraft(event.target.value)}
            placeholder="Write your reply..."
            rows={3}
            className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/15"
          />
          <div className="mt-2.5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsReplying(false);
                setReplyDraft("");
              }}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
            >
              <X className="size-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitReply}
              className="inline-flex items-center rounded-lg bg-[#1865EA] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            >
              Post Reply
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-3.5 flex items-center justify-end border-t border-[#F1F1F1] pt-3">
        <button
          type="button"
          onClick={() => setIsReplying((open) => !open)}
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors",
            isReplying ? "text-[#1865EA]" : "text-[#4D5972] hover:text-[#1865EA]",
          )}
        >
          <ReviewMsgIcon className="size-[18px]" />
          Reply
        </button>

        <span className="mx-4 h-4 w-px bg-[#E5E7EB]" aria-hidden />

        <button
          type="button"
          onClick={handleToggleLike}
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors",
            liked ? "text-[#1865EA]" : "text-[#4D5972] hover:text-[#1865EA]",
          )}
        >
          <ReviewLikeIcon className="size-[18px]" />
          <span className="inline-block translate-y-[1px]">{likeCount}</span>
        </button>
      </div>
    </article>
  );
}
