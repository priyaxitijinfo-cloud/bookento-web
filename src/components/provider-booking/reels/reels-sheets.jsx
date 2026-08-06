"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { ReelsModal } from "@/components/provider-booking/reels/reels-modal";
import { ReelsSheet } from "@/components/provider-booking/reels/reels-sheet";
import { CategoryIcon } from "@/components/home/category-item";
import { DOCTOR_WELLNESS_PACKAGES } from "@/constants/doctor-booking.constants";
import { HOME_CATEGORIES } from "@/constants/home-categories";
import { REEL_COMMENTS, REEL_REPORT_REASONS } from "@/mock/reels-comments";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/utils/format.utils";
import {
  buildReelShareText,
  buildReelShareUrl,
  copyToClipboard,
  getPlatformShareUrl,
  openShareWindow,
  shareWithNativeShare,
} from "@/utils/share.utils";

export const REELS_ACTION_ICONS = {
  like: "/images/icons/reels/01.svg",
  likeActive: "/images/icons/reels/06.svg",
  comment: "/images/icons/reels/02.svg",
  share: "/images/icons/reels/03.svg",
  save: "/images/icons/reels/04.svg",
  saveActive: "/images/icons/reels/07.svg",
  report: "/images/icons/reels/05.svg",
};

const REELS_SHARE_OVERLAY_ICONS = {
  copyLink: "/images/icons/reels/08.svg",
  addToStory: "/images/icons/reels/09.svg",
  savePost: "/images/icons/reels/10.svg",
};

const shareGlassButtonClass =
  "inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/30 bg-background/15 px-3 text-xs font-medium leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-xl whitespace-nowrap";

export function ReelsActionButton({ icon, activeIcon, label, onClick, active }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      className="pointer-events-auto flex min-h-11 min-w-11 cursor-pointer flex-col items-center justify-center gap-1 p-1 text-white"
      aria-pressed={active}
    >
      <span className="flex size-7 shrink-0 items-center justify-center">
        <img
          key={active ? "active" : "default"}
          src={active && activeIcon ? activeIcon : icon}
          alt=""
          draggable={false}
          className="pointer-events-none size-7 object-contain select-none"
          aria-hidden
        />
      </span>
      {label && (
        <span className="pointer-events-none text-xs font-bold tracking-wide text-white">
          {label}
        </span>
      )}
    </button>
  );
}

const SHARE_PLATFORMS = [
  { id: "whatsapp", label: "WhatsApp", icon: "/images/icons/share/whatsapp.svg" },
  { id: "instagram", label: "Instagram", icon: "/images/icons/share/instagram.svg" },
  { id: "facebook", label: "Facebook", icon: "/images/icons/share/facebook.svg" },
  { id: "messenger", label: "Messenger", icon: "/images/icons/share/messenger.svg" },
  { id: "twitter", label: "Twitter", icon: "/images/icons/share/twitter.svg" },
];

function ModalFooterButton({ children, onClick, disabled, variant = "blue", className }) {
  return (
    <div className={cn("border-t border-border/60 bg-background px-5 py-5", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
          variant === "blue" && "gradient-brand hover:opacity-95",
          variant === "pink" && "bg-gradient-to-r from-[#FF4D8D] to-[#FF6BA8] hover:opacity-95",
        )}
      >
        {children}
      </button>
    </div>
  );
}

function ReportReasonOption({ active, label, description, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
        active ? "border-primary bg-[#EFF6FF]" : "border-border/60 bg-background",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          active ? "border-primary bg-primary" : "border-border bg-background",
        )}
        aria-hidden
      >
        {active && <span className="size-2 rounded-full bg-background" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-foreground">{label}</span>
        <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">{description}</span>
      </span>
    </button>
  );
}

export function ReelsCommentsSheet({ open, onClose, reel, provider, contained = false }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(REEL_COMMENTS);
  const [likedComments, setLikedComments] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({ comment_1: true });
  const [replyingTo, setReplyingTo] = useState(null);
  const listEndRef = useRef(null);
  const inputRef = useRef(null);

  const baseCount = reel?.comments || REEL_COMMENTS.length;
  const extraTopLevel = Math.max(0, comments.length - REEL_COMMENTS.length);
  const extraReplies = comments.reduce((sum, item) => {
    const original = REEL_COMMENTS.find((entry) => entry.id === item.id);
    if (!original) return sum + item.replies.length;
    return sum + Math.max(0, item.replies.length - original.replies.length);
  }, 0);
  const displayCount = baseCount + extraTopLevel + extraReplies;

  useEffect(() => {
    if (!open) return;
    setComments(REEL_COMMENTS);
    setComment("");
    setLikedComments({});
    setExpandedReplies({ comment_1: true });
    setReplyingTo(null);
  }, [open, reel?.id]);

  useEffect(() => {
    if (comments.length > REEL_COMMENTS.length || extraReplies > 0) {
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [comments, extraReplies]);

  const handleStartReply = (commentId, userName, userHandle) => {
    setReplyingTo({ commentId, userName, userHandle });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handlePostComment = () => {
    const text = comment.trim();
    if (!text) return;

    if (replyingTo) {
      setComments((prev) =>
        prev.map((item) => {
          if (item.id !== replyingTo.commentId) return item;
          return {
            ...item,
            replies: [
              ...item.replies,
              {
                id: `reply_${Date.now()}`,
                userName: "You",
                userHandle: "you",
                userAvatar: provider.avatar,
                text,
                likes: 0,
                createdAt: "Just now",
              },
            ],
            moreReplies: 0,
          };
        }),
      );
      setExpandedReplies((prev) => ({ ...prev, [replyingTo.commentId]: true }));
      setReplyingTo(null);
    } else {
      setComments((prev) => [
        ...prev,
        {
          id: `comment_${Date.now()}`,
          userName: "You",
          userHandle: "you",
          userAvatar: provider.avatar,
          text,
          likes: 0,
          createdAt: "Just now",
          replies: [],
          moreReplies: 0,
        },
      ]);
    }

    setComment("");
  };

  const handleCommentKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlePostComment();
    }
  };

  return (
    <ReelsSheet
      open={open}
      onClose={onClose}
      title={`${displayCount} Comments`}
      contained={contained}
      className="max-h-[75vh]"
      footer={(
        <div className="border-t border-border/60 bg-background px-4 py-3">
          {replyingTo && (
            <div className="mb-2.5 flex items-center justify-between rounded-lg bg-[#F8F9FC] px-3 py-2">
              <p className="text-muted-foreground text-xs">
                Replying to{" "}
                <span className="font-semibold text-foreground">@{replyingTo.userHandle}</span>
              </p>
              <button
                type="button"
                onClick={handleCancelReply}
                className="text-muted-foreground flex size-6 items-center justify-center rounded-full hover:bg-background hover:text-foreground"
                aria-label="Cancel reply"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <img src={provider.avatar} alt={provider.businessName} className="size-9 shrink-0 rounded-full object-cover" />
            <div className="relative min-w-0 flex-1">
              <input
                ref={inputRef}
                type="text"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                onKeyDown={handleCommentKeyDown}
                placeholder={replyingTo ? `Reply to @${replyingTo.userHandle}...` : "Add a comment..."}
                className="w-full rounded-full border border-border/70 bg-[#F8F9FC] py-2.5 pl-4 pr-12 text-sm outline-none ring-primary/20 focus:ring-2"
              />
              <button
                type="button"
                onClick={handlePostComment}
                className="gradient-brand pointer-events-auto absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-white transition-opacity hover:opacity-95"
                aria-label="Post comment"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <div className="divide-y divide-border/60">
        {comments.map((item) => (
          <div key={item.id} className="px-5 py-4">
            <div className="flex gap-3">
              <img src={item.userAvatar} alt={item.userName} className="size-10 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-bold">{item.userName}</span>
                  <span className="text-muted-foreground text-xs">@{item.userHandle}</span>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">Posted {item.createdAt}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{item.text}</p>
                <div className="mt-2 flex items-center gap-4 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => handleStartReply(item.id, item.userName, item.userHandle)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Reply
                  </button>
                  {item.moreReplies > 0 && !expandedReplies[item.id] && (
                    <button
                      type="button"
                      onClick={() => setExpandedReplies((prev) => ({ ...prev, [item.id]: true }))}
                      className="text-primary font-semibold hover:opacity-80"
                    >
                      View {item.moreReplies} more replies
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLikedComments((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                className="flex shrink-0 flex-col items-center gap-1 pt-1"
              >
                <Heart className={cn("size-4", likedComments[item.id] ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                <span className="text-muted-foreground text-[10px]">{item.likes + (likedComments[item.id] ? 1 : 0)}</span>
              </button>
            </div>

            {expandedReplies[item.id] && item.replies.map((reply) => (
              <div key={reply.id} className="mt-4 flex gap-3 pl-12">
                <img src={reply.userAvatar} alt={reply.userName} className="size-9 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold">{reply.userName}</span>
                    {reply.isCreator && (
                      <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-semibold">
                        Creator
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">Posted {reply.createdAt}</p>
                  <p className="mt-2 text-sm leading-relaxed">{reply.text}</p>
                  <button
                    type="button"
                    onClick={() => handleStartReply(item.id, reply.userName, reply.userHandle)}
                    className="text-muted-foreground mt-2 text-xs font-medium hover:text-foreground"
                  >
                    Reply
                  </button>
                </div>
                <button type="button" className="flex shrink-0 flex-col items-center gap-1 pt-1">
                  <Heart className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground text-[10px]">{reply.likes}</span>
                </button>
              </div>
            ))}
          </div>
        ))}
        <div ref={listEndRef} />
      </div>
    </ReelsSheet>
  );
}

export function ReelsShareSheet({ open, onClose, reel, provider, saved, onToggleSave, contained = false }) {
  const handleLabel = reel?.handle || provider?.businessName || reel?.providerName;
  const isSaved = Boolean(saved && reel?.id && saved[reel.id]);
  const shareUrl = buildReelShareUrl(provider?.id, reel?.id);
  const shareText = buildReelShareText(reel, provider);

  const handleCopyLink = async () => {
    if (!shareUrl) {
      toast.error("Unable to copy link right now.");
      return;
    }

    const copied = await copyToClipboard(shareUrl);
    if (copied) {
      toast.success("Link copied!");
    } else {
      toast.error("Could not copy link. Please try again.");
    }
  };

  const handleAddToStory = async () => {
    if (!shareUrl) {
      toast.error("Unable to share right now.");
      return;
    }

    const result = await shareWithNativeShare({
      title: reel?.title || "Bookento Reel",
      text: shareText,
      url: shareUrl,
    });

    if (result === "shared") {
      toast.success("Shared successfully!");
      return;
    }

    if (result === "cancelled") return;

    const copied = await copyToClipboard(shareUrl);
    if (copied) {
      toast.success("Link copied! Paste it in your story.");
    } else {
      toast.error("Could not share this reel. Please try again.");
    }
  };

  const handleSavePost = () => {
    if (!reel?.id || !onToggleSave) {
      toast.error("Unable to save this post.");
      return;
    }

    onToggleSave(reel.id);
  };

  const handlePlatformShare = async (platformId) => {
    if (!shareUrl) {
      toast.error("Unable to share right now.");
      return;
    }

    if (platformId === "instagram") {
      const copied = await copyToClipboard(shareUrl);
      if (copied) {
        toast.success("Link copied! Open Instagram to share.");
      } else {
        toast.error("Could not copy link. Please try again.");
      }
      return;
    }

    const platformUrl = getPlatformShareUrl(platformId, { url: shareUrl, text: shareText });
    if (!platformUrl) {
      toast.error("Sharing is not available for this platform.");
      return;
    }

    openShareWindow(platformUrl);
  };

  return (
    <ReelsSheet open={open} onClose={onClose} title="Share" contained={contained} className="max-h-[80vh]">
      <div className="space-y-5 px-5 py-4">
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <div className="relative h-[400px] w-full">
            <img src={reel?.thumbnailUrl} alt={reel?.title || reel?.caption} className="size-full object-cover" />
            <span className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {handleLabel}
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-stretch gap-2 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2.5 pt-12">
              <button
                type="button"
                onClick={handleCopyLink}
                className={shareGlassButtonClass}
              >
                <img src={REELS_SHARE_OVERLAY_ICONS.copyLink} alt="" className="block size-[18px] shrink-0 object-contain" draggable={false} />
                Copy Link
              </button>
              <button
                type="button"
                onClick={handleAddToStory}
                className={shareGlassButtonClass}
              >
                <img src={REELS_SHARE_OVERLAY_ICONS.addToStory} alt="" className="block size-[18px] shrink-0 object-contain" draggable={false} />
                Add to Story
              </button>
              <button
                type="button"
                onClick={handleSavePost}
                aria-pressed={isSaved}
                className={cn(
                  shareGlassButtonClass,
                  isSaved && "border-white/50 bg-background/25",
                )}
              >
                <img src={REELS_SHARE_OVERLAY_ICONS.savePost} alt="" className="block size-[18px] shrink-0 object-contain" draggable={false} />
                {isSaved ? "Saved" : "Save Post"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 overflow-x-auto pb-1">
          {SHARE_PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => handlePlatformShare(platform.id)}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <img
                src={platform.icon}
                alt={platform.label}
                className="size-12 shrink-0 rounded-full object-cover"
                draggable={false}
              />
              <span className="text-muted-foreground text-[11px] font-medium">{platform.label}</span>
            </button>
          ))}
        </div>
      </div>
    </ReelsSheet>
  );
}

export function ReelsReportSheet({ open, onClose, contained = false }) {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedReason(null);
      setDescription("");
    }
  }, [open]);

  const handleClose = () => onClose();

  const handleSubmit = () => {
    if (step === 1) {
      if (!selectedReason) {
        toast.error("Please select a reason for reporting.");
        return;
      }

      if (selectedReason === "other") {
        setStep(2);
        return;
      }

      toast.success("Report submitted. We'll review it shortly.");
      handleClose();
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a description.");
      return;
    }

    toast.success("Report submitted. We'll review it shortly.");
    handleClose();
  };

  const footerLabel = step === 2 ? "Submit" : selectedReason === "other" ? "Next" : "Submit";

  return (
    <ReelsSheet
      open={open}
      onClose={handleClose}
      title="Report"
      contained={contained}
      className="max-h-[85vh]"
      footer={(
        <ModalFooterButton onClick={handleSubmit}>
          {footerLabel}
        </ModalFooterButton>
      )}
    >
      {step === 1 ? (
        <div className="px-5 py-5">
          <p className="mb-4 text-sm font-medium text-foreground">
            Please select a reason for reporting
          </p>
          <div
            className="space-y-3"
            role="radiogroup"
            aria-label="Report reason"
          >
            {REEL_REPORT_REASONS.map((reason) => (
              <ReportReasonOption
                key={reason.id}
                active={selectedReason === reason.id}
                label={reason.label}
                description={reason.description}
                onSelect={() => setSelectedReason(reason.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-5 py-5">
          <p className="mb-4 text-sm text-foreground">
            Please provide more details about the issue.
          </p>
          <label htmlFor="report-description" className="mb-2 block text-sm font-bold">
            Description
          </label>
          <div className="relative">
            <textarea
              id="report-description"
              value={description}
              onChange={(event) => setDescription(event.target.value.slice(0, 500))}
              placeholder="Describe the issue..."
              rows={5}
              className="w-full resize-none rounded-xl border border-border/70 bg-[#F8F9FC] p-4 pb-8 text-sm outline-none ring-primary/20 focus:ring-2"
            />
            <span className="text-muted-foreground absolute bottom-3 right-3 text-xs">
              {description.length}/500
            </span>
          </div>
        </div>
      )}
    </ReelsSheet>
  );
}

export function ReelsBlockSheet({ open, onClose, providerName }) {
  return (
    <ReelsModal
      open={open}
      onClose={onClose}
      title="Block"
      titleCenter
      footer={<ModalFooterButton variant="pink" onClick={() => { toast.success("User blocked"); onClose(); }}>Block</ModalFooterButton>}
    >
      <div className="space-y-4 px-5 py-5 text-center">
        <h3 className="text-lg font-bold">Block {providerName}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Blocked user won&apos;t be able to message you, find your profile or see your content.
        </p>
        <ul className="text-muted-foreground space-y-2 text-left text-sm">
          <li className="flex gap-2"><span className="text-foreground">•</span> You can no longer access blocked user&apos;s content.</li>
          <li className="flex gap-2"><span className="text-foreground">•</span> You can unblock user at any time.</li>
          <li className="flex gap-2"><span className="text-foreground">•</span> All new or future accounts by user will be blocked.</li>
        </ul>
      </div>
    </ReelsModal>
  );
}

export function ReelsMenuSheet({ open, onClose, onReport }) {
  if (!open) return null;

  return (
    <ReelsModal open={open} onClose={onClose} title="More Options" titleCenter>
      <div className="space-y-1 p-3">
        <button
          type="button"
          onClick={() => { onClose(); onReport(); }}
          className="hover:bg-muted/60 w-full rounded-xl px-4 py-3.5 text-left text-sm font-semibold"
        >
          Report
        </button>
      </div>
    </ReelsModal>
  );
}

export function ReelsCategorySheet({ open, onClose, selectedCategory, onApply, contained = false }) {
  const [draftCategory, setDraftCategory] = useState(selectedCategory || "doctor");
  const categories = HOME_CATEGORIES.slice(0, 9);

  useEffect(() => {
    if (open) setDraftCategory(selectedCategory || "doctor");
  }, [open, selectedCategory]);

  return (
    <ReelsSheet
      open={open}
      onClose={onClose}
      title="Category"
      contained={contained}
      className="max-h-[min(88vh,680px)]"
      footer={(
        <ModalFooterButton
          onClick={() => {
            onApply?.(draftCategory);
            toast.success("Category applied");
            onClose();
          }}
        >
          Apply Category
        </ModalFooterButton>
      )}
    >
      <div className="px-5 pb-4 pt-3">
        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((category) => {
            const active = draftCategory === category.slug;

            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => setDraftCategory(category.slug)}
                aria-pressed={active}
                className={cn(
                  "flex aspect-square min-w-0 flex-col items-center justify-center gap-2 rounded-2xl px-1.5 py-3 shadow-card transition-all",
                  category.bg,
                  active
                    ? "border-2 border-primary shadow-[0_2px_8px_rgba(24,101,234,0.12)]"
                    : "border-[3px] border-white",
                )}
              >
                <CategoryIcon category={category} compact />

                <span className="line-clamp-2 w-full text-center text-[13px] font-semibold leading-tight text-foreground">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ReelsSheet>
  );
}

export function ReelFeedCard({
  reel,
  provider,
  isActive,
  muted,
  liked,
  saved,
  following,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
  onOpenReport,
  onOpenMenu,
  onBookNow,
}) {
  const videoRef = useRef(null);
  const linkedPackage = reel.packageId
    ? DOCTOR_WELLNESS_PACKAGES.find((pkg) => pkg.id === reel.packageId)
    : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <article className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-card">
      <div className="flex items-center gap-3 px-4 py-3">
        <img src={provider.avatar} alt={provider.businessName} className="size-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{reel.handle || provider.businessName}</p>
          <p className="text-muted-foreground text-xs">6h ago</p>
        </div>
        <button
          type="button"
          onClick={onToggleFollow}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
            following
              ? "border border-border bg-background text-foreground"
              : "bg-[#FF4D8D] text-white hover:bg-[#FF3A7F]",
          )}
        >
          {following ? (
            <>
              <Check className="size-3.5" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="size-3.5" />
              Follow
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onOpenMenu}
          className="text-muted-foreground hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-muted/60"
          aria-label="More options"
        >
          <MoreVertical className="size-5" />
        </button>
      </div>

      <div className="relative mx-4 aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        <img src={reel.thumbnailUrl} alt={reel.title || reel.caption} className="size-full object-cover" />
        {reel.videoUrl && (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            className={cn(
              "absolute inset-0 size-full object-cover",
              isActive ? "opacity-100" : "opacity-0",
            )}
            loop
            muted={muted}
            playsInline
            preload="metadata"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="absolute bottom-16 right-3 z-10 flex flex-col items-center gap-5">
          <ReelsActionButton
            icon={REELS_ACTION_ICONS.like}
            activeIcon={REELS_ACTION_ICONS.likeActive}
            label={formatCompactNumber(reel.likes + (liked[reel.id] ? 1 : 0))}
            onClick={() => onToggleLike(reel.id)}
            active={liked[reel.id]}
          />
          <ReelsActionButton
            icon={REELS_ACTION_ICONS.comment}
            label={String(reel.comments)}
            onClick={onOpenComments}
          />
          <ReelsActionButton
            icon={REELS_ACTION_ICONS.share}
            onClick={onOpenShare}
          />
          <ReelsActionButton
            icon={REELS_ACTION_ICONS.save}
            activeIcon={REELS_ACTION_ICONS.saveActive}
            onClick={() => onToggleSave(reel.id)}
            active={saved[reel.id]}
          />
          <ReelsActionButton
            icon={REELS_ACTION_ICONS.report}
            onClick={onOpenReport}
          />
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div>
          <h3 className="text-sm font-bold">{reel.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{reel.caption}</p>
        </div>

        {linkedPackage && onBookNow && (
          <button
            type="button"
            onClick={() => onBookNow(linkedPackage.id)}
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF4D8D] to-[#FF6BA8] py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Book Now — {linkedPackage.name}
          </button>
        )}
      </div>
    </article>
  );
}
