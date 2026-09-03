"use client";

import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { cn } from "@/lib/utils";

export function ChatEmptyInbox({
  title = "Not Chats Yet",
  description = "Start a conversation about all your Service appointment.",
  className,
}) {
  return (
    <IllustrationEmptyState
      src="/icons/chat-not-yet.png"
      title={title}
      description={description}
      className={cn("min-h-0 flex-1 md:hidden", className)}
    />
  );
}
