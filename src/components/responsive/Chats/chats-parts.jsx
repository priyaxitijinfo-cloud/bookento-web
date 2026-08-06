"use client";

import { cn } from "@/lib/utils";
import { ChatEmptyInbox } from "@/components/chats/chat-empty-inbox";
import { ChatInboxPanel } from "@/components/chats/chat-inbox-panel";

const CHAT_PANEL_SHELL =
  "overflow-hidden rounded-2xl border border-border/60 bg-background shadow-card";

const CHAT_MOBILE_PANEL_HEIGHT = "h-[calc(100dvh-3.5rem-5rem-1.75rem)]";

function getInboxEmptyCopy(inbox) {
  return {
    emptyTitle: inbox.search.trim()
      ? "No matching chats"
      : inbox.filter === "unread"
        ? "No unread chats"
        : inbox.filter === "new"
          ? "No new chats"
          : "Not Chats Yet",
    emptyDescription: inbox.search.trim()
      ? "Try a different name or message keyword."
      : "Start a conversation about all your Service appointment.",
  };
}

export function ChatInboxListPanel({ inbox, className, panelClassName }) {
  if (inbox.isEmpty) {
    return (
      <div className={cn(CHAT_PANEL_SHELL, CHAT_MOBILE_PANEL_HEIGHT, "flex flex-col", panelClassName, className)}>
        <ChatEmptyInbox className="min-h-0 flex-1" />
      </div>
    );
  }

  const { emptyTitle, emptyDescription } = getInboxEmptyCopy(inbox);

  return (
    <div className={cn(CHAT_PANEL_SHELL, CHAT_MOBILE_PANEL_HEIGHT, "flex flex-col", panelClassName, className)}>
      <ChatInboxPanel
        conversations={inbox.filtered}
        filter={inbox.filter}
        onFilterChange={inbox.setFilter}
        search={inbox.search}
        onSearchChange={inbox.setSearch}
        searchOpen={inbox.searchOpen}
        counts={inbox.counts}
        className="min-h-0 flex-1"
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </div>
  );
}
