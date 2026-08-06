"use client";

import { ChatCard } from "@/components/chats/chat-card";
import { ChatEmptyInbox } from "@/components/chats/chat-empty-inbox";
import { cn } from "@/lib/utils";

export function ChatList({
  conversations,
  activeId,
  className,
  emptyTitle,
  emptyDescription,
}) {
  if (conversations.length === 0) {
    return (
      <ChatEmptyInbox
        title={emptyTitle}
        description={emptyDescription}
        className="min-h-0 py-12"
      />
    );
  }

  return (
    <div className={cn("flex flex-col divide-y divide-[#F1F5F9] md:divide-y-0 md:gap-0.5", className)}>
      {conversations.map((conversation) => (
        <ChatCard
          key={conversation.id}
          conversation={conversation}
          isActive={activeId === conversation.id}
        />
      ))}
    </div>
  );
}
