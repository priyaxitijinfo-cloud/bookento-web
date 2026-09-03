"use client";

import Link from "next/link";
import { memo } from "react";

import { Avatar } from "@/components/ui/avatar";
import { chatDetailRoute } from "@/constants/routes.constants";
import { formatChatListTime } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

export const ChatCard = memo(function ChatCard({ conversation, isActive = false }) {
  const hasUnread = conversation.unreadCount > 0;
  const timestamp = formatChatListTime(conversation.lastMessageAt);

  return (
    <Link
      href={chatDetailRoute(conversation.id)}
      prefetch={false}
      className={cn(
        "flex w-full items-start gap-3 transition-colors",
        "max-md:mx-auto max-md:w-full max-md:max-w-lg max-md:px-4",
        "max-md:gap-3 max-md:border-b-0 max-md:pt-3.5 max-md:pb-0",
        "md:items-center md:rounded-xl md:border-b-0 md:px-3 md:py-3",
        isActive
          ? "md:bg-primary/8 md:ring-primary/15 bg-[#EFF6FF] md:ring-1"
          : "hover:bg-[#F8FAFC] max-md:active:bg-black/[0.02]",
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={conversation.participantAvatar}
          name={conversation.participantName}
          size="lg"
          className="size-12 max-md:size-12 md:size-[52px]"
        />
        {conversation.isOnline ? (
          <span
            className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-[#22C55E] max-md:hidden"
            aria-label="Online"
          />
        ) : null}
      </div>

      {/* Mobile — divider starts at text column (after avatar), extends to right edge */}
      <div
        className={cn(
          "chat-row-body min-w-0 flex-1 md:hidden",
          "max-md:border-b max-md:border-[#EEF2F7] max-md:pb-3.5",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-[15px] leading-[1.25] text-[#111827]",
                hasUnread ? "font-bold" : "font-semibold",
              )}
            >
              {conversation.participantName}
            </p>
            <p
              className={cn(
                "mt-1 truncate text-[13px] leading-[1.35]",
                hasUnread ? "font-medium text-[#6B7280]" : "text-[#9CA3AF]",
              )}
            >
              {conversation.lastMessage}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
            {hasUnread ? (
              <span className="flex size-[18px] items-center justify-center rounded-full bg-[#1865EA] text-[10px] leading-none font-bold text-white">
                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
              </span>
            ) : null}
            <span className="text-[11px] leading-none text-[#9CA3AF]">{timestamp}</span>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden min-w-0 flex-1 md:block">
        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              "min-w-0 truncate text-base leading-tight",
              hasUnread ? "text-foreground font-bold" : "text-foreground font-semibold",
            )}
          >
            {conversation.participantName}
          </p>
          <span className="text-muted-foreground shrink-0 text-xs leading-none">
            {timestamp}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-3">
          <p
            className={cn(
              "min-w-0 truncate text-sm leading-tight",
              hasUnread ? "text-foreground/80 font-medium" : "text-muted-foreground",
            )}
          >
            {conversation.lastMessage}
          </p>
          {hasUnread ? (
            <span className="bg-primary flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
});
