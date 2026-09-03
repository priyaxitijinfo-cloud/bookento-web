"use client";

import { useMemo, useState } from "react";

import { ChatEmptyInbox } from "@/components/chats/chat-empty-inbox";
import { ChatEmptyPane } from "@/components/chats/chat-empty-pane";
import { ChatInboxPanel } from "@/components/chats/chat-inbox-panel";
import { filterConversations } from "@/lib/chats/chat.utils";
import { useChatStore, useFilterStore } from "@/store";
import { cn } from "@/lib/utils";

export function useChatInbox() {
  const conversations = useChatStore((state) => state.conversations);
  const { chatFilter, setChatFilter } = useFilterStore();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filter = chatFilter === "pinned" ? "new" : chatFilter;

  const filtered = useMemo(
    () => filterConversations(conversations, { filter, search }),
    [conversations, filter, search],
  );

  const counts = useMemo(() => {
    const unread = conversations.filter((c) => c.unreadCount > 0).length;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const neu = conversations.filter((c) => {
      const age = now - new Date(c.lastMessageAt).getTime();
      return age <= threeDaysMs || c.isPinned;
    }).length;
    return { all: conversations.length, unread, new: neu };
  }, [conversations]);

  const handleFilterChange = (next) => {
    setChatFilter(next);
  };

  return {
    conversations,
    filtered,
    filter,
    setFilter: handleFilterChange,
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    counts,
    isEmpty: conversations.length === 0,
  };
}

const CHAT_PANEL_SHELL =
  "overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[0_2px_12px_rgba(24,39,75,0.04)]";

/** Flat full-bleed list on mobile; card shell preserved on md+. */
export const CHAT_LIST_SHELL_CLASS = cn(
  "flex h-full min-h-0 flex-1 flex-col",
  "max-md:min-h-0 max-md:flex-1 max-md:overflow-hidden max-md:bg-transparent",
  "md:overflow-hidden md:rounded-2xl md:border md:border-border/70 md:bg-background md:shadow-[0_2px_12px_rgba(24,39,75,0.04)]",
);

/** Shared shell — full viewport on mobile; bottom-nav clearance lives in scroll areas, not shell padding. */
export const CHAT_PAGE_SHELL_CLASS =
  "chat-page-shell-mobile page-shell-transparent-mobile flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-surface-page max-md:!pb-0 md:min-h-dvh md:!pb-0 md:bg-surface-page";

export const CHAT_PAGE_MAIN_CLASS =
  "flex min-h-0 flex-1 flex-col overflow-hidden max-md:h-full max-md:min-h-0 max-md:bg-transparent";

export function ChatSplitShell({
  inbox,
  activeId,
  children,
  className,
  showInboxTitle = false,
}) {
  return (
    <div
      className={cn(
        CHAT_PANEL_SHELL,
        "flex min-h-0 flex-1 flex-col md:grid md:min-h-0 md:grid-cols-[330px_minmax(0,1fr)] lg:grid-cols-[370px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)]",
        className,
      )}
    >
      <aside className="hidden min-h-0 border-r border-[#EEF2F7] md:flex md:min-h-0 md:flex-col md:overflow-hidden">
        <ChatInboxPanel
          conversations={inbox.filtered}
          filter={inbox.filter}
          onFilterChange={inbox.setFilter}
          search={inbox.search}
          onSearchChange={inbox.setSearch}
          searchOpen={inbox.searchOpen}
          counts={inbox.counts}
          activeId={activeId}
          showTitle={showInboxTitle}
          showSearch
          className="min-h-0 flex-1"
        />
      </aside>

      <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </section>
    </div>
  );
}

export function ChatListMobile({ inbox }) {
  if (inbox.isEmpty) {
    return (
      <div className={cn(CHAT_LIST_SHELL_CLASS, "md:hidden")}>
        <ChatEmptyInbox className="min-h-0 flex-1 max-md:bg-transparent" />
      </div>
    );
  }

  return (
    <div className={cn(CHAT_LIST_SHELL_CLASS, "md:hidden")}>
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
        className="min-h-0 flex-1 max-md:h-full"
        emptyTitle={
          inbox.search.trim()
            ? "No matching chats"
            : inbox.filter === "unread"
              ? "No unread chats"
              : inbox.filter === "new"
                ? "No new chats"
                : "Not Chats Yet"
        }
        emptyDescription={
          inbox.search.trim()
            ? "Try a different name or message keyword."
            : "Start a conversation about all your Service appointment."
        }
      />
    </div>
  );
}

export function ChatDesktopEmpty({ inbox }) {
  return (
    <div className="hidden min-h-0 flex-1 flex-col md:flex md:h-full">
      <ChatSplitShell inbox={inbox} className="h-full min-h-0 flex-1">
        <ChatEmptyPane />
      </ChatSplitShell>
    </div>
  );
}
