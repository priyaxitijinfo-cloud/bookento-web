"use client";

import { cn } from "@/lib/utils";
import { ChatEmptyInbox } from "@/components/chats/chat-empty-inbox";
import { ChatInboxPanel } from "@/components/chats/chat-inbox-panel";
import { CHAT_LIST_SHELL_CLASS } from "@/components/chats/chat-workspace";

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
      <div className={cn(CHAT_LIST_SHELL_CLASS, panelClassName, className)}>
        <ChatEmptyInbox className="min-h-0 flex-1" />
      </div>
    );
  }

  const { emptyTitle, emptyDescription } = getInboxEmptyCopy(inbox);

  return (
    <div className={cn(CHAT_LIST_SHELL_CLASS, panelClassName, className)}>
      <ChatInboxPanel
        conversations={inbox.filtered}
        filter={inbox.filter}
        onFilterChange={inbox.setFilter}
        search={inbox.search}
        onSearchChange={inbox.setSearch}
        searchOpen={inbox.searchOpen}
        onSearchClose={() => inbox.setSearchOpen(false)}
        counts={inbox.counts}
        showSearch={inbox.searchOpen || Boolean(inbox.search)}
        className="min-h-0 flex-1"
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </div>
  );
}
