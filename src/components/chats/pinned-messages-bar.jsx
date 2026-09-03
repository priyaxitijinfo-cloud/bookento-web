"use client";

import { Pin } from "lucide-react";

import { cn } from "@/lib/utils";

const PINNED_ITEM_HEIGHT = "3.875rem";
const VISIBLE_PINNED_COUNT = 2;

function getMessagePreview(message) {
  if (message.type === "image") return "Photo";
  if (message.type === "file") return message.fileName || "Document";
  if (message.type === "audio") return "Voice message";
  return message.content;
}

export function PinnedMessagesBar({ pinnedMessages, onSelect, className }) {
  if (!pinnedMessages.length) return null;

  const hasScroll = pinnedMessages.length > VISIBLE_PINNED_COUNT;

  return (
    <div
      className={cn(
        "shrink-0 border-b border-[#EEF2F7] bg-[#F8FAFC]",
        hasScroll && "scrollbar-hide overflow-y-auto",
        className,
      )}
      style={
        hasScroll
          ? { maxHeight: `calc(${VISIBLE_PINNED_COUNT} * ${PINNED_ITEM_HEIGHT})` }
          : undefined
      }
    >
      {pinnedMessages.map((message, index) => (
        <button
          key={message.id}
          type="button"
          onClick={() => onSelect(message.id)}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white md:px-6",
            index > 0 && "border-t border-[#EEF2F7]",
          )}
          style={{ minHeight: PINNED_ITEM_HEIGHT }}
        >
          <span className="text-primary flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF]">
            <Pin className="size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-primary text-xs font-semibold">Pinned message</p>
            <p className="text-foreground truncate text-sm">
              {getMessagePreview(message)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
