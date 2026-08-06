"use client";

import { useMemo, useState } from "react";

import { ChatEmptyInbox } from "@/components/chats/chat-empty-inbox";
import { ChatEmptyPane } from "@/components/chats/chat-empty-pane";
import { ChatInboxPanel } from "@/components/chats/chat-inbox-panel";
import { filterConversations } from "@/lib/chats/chat.utils";
import { useChatStore, useFilterStore } from "@/store";
import { cn } from "@/lib/utils";

export function useChatInbox() {
  const { conversations } = useChatStore();
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
    const neu = filterConversations(conversations, { filter: "new" }).length;
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
  "overflow-hidden rounded-2xl border border-border/60 bg-background shadow-card";

/** Fits below mobile header + bottom nav + main padding without page scroll */
const CHAT_MOBILE_PANEL_HEIGHT = "h-[calc(100dvh-3.5rem-5rem-1.75rem)]";

/** Fits below desktop header + breadcrumb + main padding without page scroll */
const CHAT_DESKTOP_PANEL_HEIGHT = "md:h-[calc(100dvh-11.5rem)]";

export function ChatSplitShell({
  inbox,
  activeId,
  children,
  className,
}) {
  return (
    <div
      className={cn(
        CHAT_PANEL_SHELL,
        "md:grid md:grid-cols-[330px_minmax(0,1fr)] lg:grid-cols-[370px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)]",
        CHAT_DESKTOP_PANEL_HEIGHT,
        className,
      )}
    >
      <aside className="hidden min-h-0 overflow-hidden border-r border-[#EEF2F7] md:flex md:flex-col">
        <ChatInboxPanel
          conversations={inbox.filtered}
          filter={inbox.filter}
          onFilterChange={inbox.setFilter}
          search={inbox.search}
          onSearchChange={inbox.setSearch}
          searchOpen={inbox.searchOpen}
          counts={inbox.counts}
          activeId={activeId}
          showTitle
          className="min-h-0 flex-1"
        />
      </aside>

      <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">{children}</section>
    </div>
  );
}

export function ChatListMobile({ inbox }) {
  if (inbox.isEmpty) {
    return (
      <div className={cn(CHAT_PANEL_SHELL, CHAT_MOBILE_PANEL_HEIGHT, "flex flex-col md:hidden")}>
        <ChatEmptyInbox className="min-h-0 flex-1" />
      </div>
    );
  }

  return (
    <div className={cn(CHAT_PANEL_SHELL, CHAT_MOBILE_PANEL_HEIGHT, "flex flex-col md:hidden")}>
      <ChatInboxPanel
        conversations={inbox.filtered}
        filter={inbox.filter}
        onFilterChange={inbox.setFilter}
        search={inbox.search}
        onSearchChange={inbox.setSearch}
        searchOpen={inbox.searchOpen}
        counts={inbox.counts}
        className="min-h-0 flex-1"
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
    <div className="hidden md:block">
      <ChatSplitShell inbox={inbox}>
        {inbox.isEmpty ? <ChatEmptyInbox /> : <ChatEmptyPane />}
      </ChatSplitShell>
    </div>
  );
}
