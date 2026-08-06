"use client";

import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { chatDetailRoute } from "@/constants/routes.constants";
import { formatChatListTime } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

export function ChatCard({ conversation, isActive = false }) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Link
      href={chatDetailRoute(conversation.id)}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 transition-colors md:gap-3.5 md:rounded-xl md:px-3 md:py-3",
        isActive ? "bg-[#EFF6FF] md:bg-primary/8 md:ring-1 md:ring-primary/15" : "hover:bg-[#F8FAFC]",
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={conversation.participantAvatar}
          name={conversation.participantName}
          size="lg"
          className="size-12 md:size-[52px]"
        />
        {conversation.isOnline ? (
          <span
            className="absolute bottom-0.5 right-0.5 size-3 rounded-full border-2 border-white bg-[#22C55E]"
            aria-label="Online"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              "min-w-0 truncate text-[15px] leading-tight md:text-base",
              hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground",
            )}
          >
            {conversation.participantName}
          </p>
          <span className="text-muted-foreground shrink-0 text-[11px] leading-none md:text-xs">
            {formatChatListTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-3">
          <p
            className={cn(
              "min-w-0 truncate text-sm leading-tight",
              hasUnread ? "font-medium text-foreground/80" : "text-muted-foreground",
            )}
          >
            {conversation.lastMessage}
          </p>
          {hasUnread ? (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
