"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";

import {
  MessageDeleteIcon,
  MessageEditIcon,
  MessageForwardIcon,
  MessagePinIcon,
  MessageReactIcon,
  MessageReplyIcon,
  MessageUnpinIcon,
} from "@/components/icons/message-action-icons";
import { cn } from "@/lib/utils";

export const MESSAGE_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const EXTENDED_REACTIONS = [
  "🙏",
  "👏",
  "🎉",
  "😍",
  "😊",
  "🤔",
  "😡",
  "👎",
  "💯",
  "✨",
  "😭",
  "🤣",
  "😎",
  "🥳",
  "💪",
  "🙌",
  "😘",
  "🤗",
  "🫡",
  "😅",
  "🥲",
  "😤",
  "🤩",
  "💔",
];

const MESSAGE_ACTIONS = [
  { id: "reply", label: "Reply" },
  { id: "forward", label: "Forward" },
  { id: "edit", label: "Edit", ownOnly: true },
  { id: "react", label: "React" },
  { id: "pin", label: "Pin Message", alternateLabel: "Unpin Message" },
  { id: "delete", label: "Delete", alternateLabel: "Delete for me", destructive: true },
];

function canEditMessage(message, isOwn) {
  if (!isOwn || !message) return false;
  return !message.type || message.type === "text";
}

function ActionIcon({ actionId, isPinned = false, className }) {
  if (actionId === "reply") return <MessageReplyIcon className={className} />;
  if (actionId === "forward") return <MessageForwardIcon className={className} />;
  if (actionId === "edit") return <MessageEditIcon className={className} />;
  if (actionId === "react") return <MessageReactIcon className={className} />;
  if (actionId === "pin") {
    return isPinned ? (
      <MessageUnpinIcon className={className} />
    ) : (
      <MessagePinIcon className={className} />
    );
  }
  return <MessageDeleteIcon className={className} />;
}

function ExpandedReactionPicker({ onSelect, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8EDF5] bg-white p-2.5 shadow-[0_12px_32px_rgba(15,23,42,0.14)]",
        className,
      )}
    >
      <div className="grid grid-cols-6 gap-0.5">
        {EXTENDED_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect?.(emoji)}
            className="flex size-9 items-center justify-center rounded-xl text-[20px] transition-colors hover:bg-[#F8FAFC]"
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReactionBar({ onReact, onMore, showMore, className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-[#E8EDF5] bg-white px-2 py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)]",
        className,
      )}
    >
      {MESSAGE_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onReact?.(emoji)}
          className="flex size-8 items-center justify-center rounded-full text-[18px] transition-transform hover:scale-110"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
      <button
        type="button"
        onClick={onMore}
        aria-expanded={showMore}
        className={cn(
          "ml-0.5 flex size-8 items-center justify-center rounded-lg transition-colors",
          showMore
            ? "bg-primary text-white"
            : "text-primary bg-[#EEF4FF] hover:bg-[#E3EBFF]",
        )}
        aria-label="More reactions"
      >
        <Plus className="size-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}

function ActionMenu({
  onAction,
  isPinned = false,
  canEdit = false,
  isOwn = false,
  className,
}) {
  const actions = MESSAGE_ACTIONS.filter((action) => !action.ownOnly || canEdit);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[#E8EDF5] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.14)]",
        className,
      )}
    >
      {actions.map((action, index) => {
        let label = action.label;
        if (action.id === "pin" && isPinned) label = action.alternateLabel;
        if (action.id === "delete" && !isOwn) label = action.alternateLabel;

        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction?.(action.id)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] font-medium transition-colors hover:bg-[#F8FAFC]",
              action.destructive ? "text-[#EF4444]" : "text-[#334155]",
              index > 0 && "border-t border-[#F1F5F9]",
            )}
          >
            <ActionIcon
              actionId={action.id}
              isPinned={action.id === "pin" ? isPinned : false}
              className="size-5 shrink-0"
            />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function getActivePointers() {
  if (typeof window === "undefined") return 0;
  return window.__bookentoActivePointers ?? 0;
}

if (typeof window !== "undefined" && !window.__bookentoActivePointerTracking) {
  window.__bookentoActivePointerTracking = true;
  window.__bookentoActivePointers = 0;
  window.addEventListener("pointerdown", () => {
    window.__bookentoActivePointers = getActivePointers() + 1;
  });
  window.addEventListener("pointerup", () => {
    window.__bookentoActivePointers = Math.max(0, getActivePointers() - 1);
  });
  window.addEventListener("pointercancel", () => {
    window.__bookentoActivePointers = Math.max(0, getActivePointers() - 1);
  });
}

function useDismissGuard(open) {
  const readyRef = useRef(false);

  useEffect(() => {
    if (!open) {
      readyRef.current = false;
      return undefined;
    }

    if (getActivePointers() === 0) {
      readyRef.current = true;
      return undefined;
    }

    readyRef.current = false;
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      window.setTimeout(() => {
        readyRef.current = true;
      }, 80);
    };

    window.addEventListener("pointerup", arm, { once: true });
    window.addEventListener("pointercancel", arm, { once: true });

    return () => {
      window.removeEventListener("pointerup", arm);
      window.removeEventListener("pointercancel", arm);
    };
  }, [open]);

  return () => readyRef.current;
}

const ACTION_ROW_HEIGHT = 52;
const REACTION_BAR_HEIGHT = 52;
const EXTENDED_PICKER_HEIGHT = 176;
const STACK_GAP = 10;

export function MessageActionsLayer({
  open,
  anchorRect,
  message,
  preview,
  isOwn,
  isPinned = false,
  onClose,
  onReact,
  onAction,
}) {
  const mounted = useMounted();
  const canDismiss = useDismissGuard(open);
  const [showMoreReactions, setShowMoreReactions] = useState(false);

  useEffect(() => {
    if (!open) setShowMoreReactions(false);
  }, [open]);

  const canEdit = canEditMessage(message, isOwn);
  const menuHeight =
    MESSAGE_ACTIONS.filter((action) => !action.ownOnly || canEdit).length *
    ACTION_ROW_HEIGHT;

  const layout = useMemo(() => {
    if (!anchorRect || typeof window === "undefined") return null;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 768;
    const menuWidth = isMobile ? 220 : 220;
    const reactionWidth = isMobile ? Math.min(320, viewportWidth - 32) : 320;
    const previewWidth = Math.min(anchorRect.width, viewportWidth - 32);
    const bubbleHeight = anchorRect.height;

    if (isMobile) {
      const extraPicker = showMoreReactions ? EXTENDED_PICKER_HEIGHT + STACK_GAP : 0;
      const menuBlock = showMoreReactions ? 0 : menuHeight + STACK_GAP;

      let previewTop = anchorRect.top;
      let stackTop = previewTop - REACTION_BAR_HEIGHT - extraPicker - STACK_GAP;

      if (stackTop < 16) {
        stackTop = 16;
        previewTop = stackTop + REACTION_BAR_HEIGHT + extraPicker + STACK_GAP;
      }

      const stackBottom = previewTop + bubbleHeight + menuBlock;
      if (stackBottom > viewportHeight - 16) {
        const overflow = stackBottom - (viewportHeight - 16);
        stackTop = Math.max(16, stackTop - overflow);
        previewTop = stackTop + REACTION_BAR_HEIGHT + extraPicker + STACK_GAP;
      }

      let previewLeft = isOwn
        ? Math.min(anchorRect.left, viewportWidth - previewWidth - 16)
        : Math.max(16, Math.min(anchorRect.left, viewportWidth - previewWidth - 16));

      let reactionLeft = previewLeft + previewWidth / 2 - reactionWidth / 2;
      reactionLeft = Math.max(
        16,
        Math.min(reactionLeft, viewportWidth - reactionWidth - 16),
      );

      let menuLeft = isOwn ? previewLeft + previewWidth - menuWidth : previewLeft;
      menuLeft = Math.max(16, Math.min(menuLeft, viewportWidth - menuWidth - 16));

      return {
        isMobile: true,
        reactionLeft,
        reactionTop: stackTop,
        menuLeft,
        menuTop: previewTop + bubbleHeight + STACK_GAP,
        previewLeft,
        previewTop,
        previewWidth,
      };
    }

    const centerX = anchorRect.left + anchorRect.width / 2;
    const bubbleTop = anchorRect.top;

    let reactionLeft = centerX - reactionWidth / 2;
    reactionLeft = Math.max(
      16,
      Math.min(reactionLeft, viewportWidth - reactionWidth - 16),
    );

    const reactionTop = Math.max(16, bubbleTop - 64);

    let menuLeft = isOwn
      ? Math.max(16, anchorRect.left - menuWidth - 12)
      : Math.min(viewportWidth - menuWidth - 16, anchorRect.right + 12);

    const menuTop = Math.max(16, Math.min(bubbleTop, viewportHeight - menuHeight - 16));
    const previewLeft = Math.max(
      16,
      Math.min(anchorRect.left, viewportWidth - previewWidth - 16),
    );
    const previewTop = Math.max(reactionTop + 56, bubbleTop);

    return {
      isMobile: false,
      reactionLeft,
      reactionTop,
      menuLeft,
      menuTop,
      previewLeft,
      previewTop,
      previewWidth,
    };
  }, [anchorRect, isOwn, menuHeight, showMoreReactions]);

  if (!mounted || !open || !message || !layout) return null;

  const handleDismiss = () => {
    if (!canDismiss()) return;
    onClose?.();
  };

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Close message actions"
        className={cn(
          "absolute inset-0",
          layout.isMobile ? "bg-[#0F172A]/40 backdrop-blur-[3px]" : "bg-black/10",
        )}
        onClick={handleDismiss}
      />

      {preview ? (
        <div
          className="pointer-events-none absolute z-[81]"
          style={{
            top: layout.previewTop,
            left: layout.previewLeft,
            width: layout.previewWidth,
          }}
        >
          {preview}
        </div>
      ) : null}

      <div
        className="absolute z-[82]"
        style={{ top: layout.reactionTop, left: layout.reactionLeft }}
      >
        <ReactionBar
          showMore={showMoreReactions}
          onReact={(emoji) => {
            onReact?.(emoji);
            onClose?.();
          }}
          onMore={() => setShowMoreReactions((current) => !current)}
        />
        {showMoreReactions ? (
          <ExpandedReactionPicker
            className="mt-2 w-[min(320px,calc(100vw-32px))]"
            onSelect={(emoji) => {
              onReact?.(emoji);
              onClose?.();
            }}
          />
        ) : null}
      </div>

      {!showMoreReactions || !layout.isMobile ? (
        <div
          className="absolute z-[82]"
          style={{
            top: layout.menuTop,
            left: layout.menuLeft,
            width: layout.isMobile ? 220 : 220,
          }}
        >
          <ActionMenu
            isPinned={isPinned}
            canEdit={canEdit}
            isOwn={isOwn}
            onAction={(actionId) => {
              if (actionId === "react") {
                setShowMoreReactions(true);
                return;
              }
              onAction?.(actionId);
              onClose?.();
            }}
          />
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
