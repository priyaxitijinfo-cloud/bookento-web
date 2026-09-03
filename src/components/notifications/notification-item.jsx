"use client";

import Link from "next/link";

import { formatCompactRelativeTime, getInitials } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

function NotificationTimeMeta({ notification }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="text-muted-foreground text-[11px] leading-none whitespace-nowrap">
        {formatCompactRelativeTime(notification.createdAt)}
      </span>
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          notification.isRead ? "bg-transparent" : "bg-primary",
        )}
        aria-hidden={notification.isRead}
        aria-label={notification.isRead ? undefined : "Unread"}
      />
    </div>
  );
}

export function NotificationItem({ notification, onRead }) {
  const initials =
    notification.actorInitials ||
    (notification.actorName ? getInitials(notification.actorName) : "BK");

  return (
    <Link
      href={notification.actionUrl || "#"}
      onClick={() => onRead?.(notification.id)}
      className={cn(
        "active:bg-background/40 w-full border-b border-[#EEF0F4]/60 transition-colors max-md:border-[#E9E9E9]",
        "max-md:flex max-md:w-full max-md:items-start max-md:gap-3 max-md:px-4 max-md:py-3.5",
        "md:hover:bg-muted/40 md:flex md:items-start md:gap-3 md:px-5 md:py-4",
      )}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-semibold text-[#2E7D32] max-md:mt-0.5 max-md:border max-md:border-[#C1EED8] max-md:bg-[#E2FBEF] max-md:text-[#3BBC7B] md:size-11"
        aria-hidden
      >
        {initials}
      </div>

      {/* Mobile: title + time on one row, message below (design layout) */}
      <div className="min-w-0 flex-1 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <p className="text-foreground min-w-0 flex-1 text-[15px] leading-snug font-semibold">
            {notification.title}
          </p>
          <NotificationTimeMeta notification={notification} />
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
          {notification.message}
        </p>
      </div>

      {/* Desktop/tablet */}
      <div className="min-w-0 flex-1 max-md:hidden">
        <p className="text-foreground text-[15px] leading-snug font-semibold">
          {notification.title}
        </p>
        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm leading-snug">
          {notification.message}
        </p>
      </div>

      <div className="max-md:hidden md:flex md:shrink-0 md:items-start md:gap-1.5 md:pt-0.5">
        <NotificationTimeMeta notification={notification} />
      </div>
    </Link>
  );
}
