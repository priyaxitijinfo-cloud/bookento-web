"use client";

import Link from "next/link";

import { formatCompactRelativeTime, getInitials } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

export function NotificationItem({ notification, onRead }) {
  const initials = notification.actorInitials
    || (notification.actorName ? getInitials(notification.actorName) : "BK");

  return (
    <Link
      href={notification.actionUrl || "#"}
      onClick={() => onRead?.(notification.id)}
      className="flex items-start gap-3 border-b border-[#EEF0F4]/60 px-4 py-3.5 transition-colors active:bg-background/40 md:px-5 md:py-4 md:hover:bg-muted/40"
    >
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-semibold text-[#2E7D32]"
        aria-hidden
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground text-[15px] leading-snug font-semibold">
          {notification.title}
        </p>
        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm leading-snug">
          {notification.message}
        </p>
      </div>

      <div className="flex shrink-0 items-start gap-1.5 pt-0.5">
        <span className="text-muted-foreground text-[11px] leading-none whitespace-nowrap">
          {formatCompactRelativeTime(notification.createdAt)}
        </span>
        <span
          className={cn(
            "mt-0.5 size-2 shrink-0 rounded-full",
            notification.isRead ? "bg-transparent" : "bg-primary",
          )}
          aria-hidden={notification.isRead}
          aria-label={notification.isRead ? undefined : "Unread"}
        />
      </div>
    </Link>
  );
}
