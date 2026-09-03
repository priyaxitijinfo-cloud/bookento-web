"use client";

import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { cn } from "@/lib/utils";

export function ChatEmptyThread({ className }) {
  return (
    <IllustrationEmptyState
      src="/icons/chat-not-yet.png"
      title="Not Chats Yet"
      description="Start a conversation about all your Service appointment."
      className={cn("!min-h-full min-h-0 w-full flex-1 py-8", className)}
      imageClassName="size-[150px]"
    />
  );
}
