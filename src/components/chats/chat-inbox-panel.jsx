"use client";

import { Search } from "lucide-react";

import { ChatFilterTabs } from "@/components/chats/chat-filter-tabs";
import { ChatList } from "@/components/chats/chat-list";
import { cn } from "@/lib/utils";

export function ChatInboxPanel({
  conversations,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  searchOpen = false,
  counts,
  activeId,
  className,
  showTitle = false,
  emptyTitle,
  emptyDescription,
}) {
  const showSearchField = searchOpen || Boolean(search) || showTitle;

  return (
    <div className={cn("flex min-h-0 flex-col bg-background", className)}>
      <div className="shrink-0 space-y-3 border-b border-[#EEF2F7] px-4 py-3 md:space-y-4 md:px-5 md:py-5">
        {showTitle ? (
          <h1 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">Chat</h1>
        ) : null}

        {showSearchField ? (
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3.5 top-1/2 size-4 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search conversations..."
              autoFocus={searchOpen && !showTitle}
              className="border-border/70 bg-[#F8FAFC] placeholder:text-muted-foreground h-11 w-full rounded-xl border pr-4 pl-10 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
        ) : null}

        <ChatFilterTabs value={filter} onChange={onFilterChange} counts={counts} />
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto md:px-2 md:py-2">
        <ChatList
          conversations={conversations}
          activeId={activeId}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
      </div>
    </div>
  );
}
