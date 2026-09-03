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
        className="min-h-0"
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col md:gap-0.5",
        "max-md:[&>a:last-child_.chat-row-body]:border-b-0",
        className,
      )}
    >
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
