"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ChatCard } from "@/components/chats/chat-card";
import { ChatEmptyInbox } from "@/components/chats/chat-empty-inbox";
import { ChatFilterTabs } from "@/components/chats/chat-filter-tabs";
import { ChatMobileSearchBar } from "@/components/chats/chat-mobile-search-bar";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { providerChatDetailRoute } from "@/constants/routes.constants";
import { filterConversations } from "@/lib/chats/chat.utils";
import {
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { useChatStore } from "@/store";
import { cn } from "@/lib/utils";

export function ProviderChatsView() {
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";

  const providerConversations = useChatStore((s) => s.providerConversations);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const conversations = forceEmpty ? [] : providerConversations;

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

  const isEmptyInbox = conversations.length === 0;

  const emptyTitle = search.trim()
    ? "No matching chats"
    : filter === "unread"
      ? "No unread chats"
      : filter === "new"
        ? "No new chats"
        : "Not Chats Yet";

  const emptyDescription = search.trim()
    ? "Try a different name or message keyword."
    : "Start a conversation about all your Service appointment.";

  const handleSearchClose = () => {
    setSearch("");
    setSearchOpen(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      {searchOpen ? (
        <ChatMobileSearchBar
          value={search}
          onChange={setSearch}
          onClose={handleSearchClose}
          className="border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm lg:hidden"
        />
      ) : (
        <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
          <div className={cn(PROVIDER_MOBILE_HEADER, "justify-between")}>
            <h1 className="truncate text-xl font-bold text-[#111827]">Chat</h1>
            {!isEmptyInbox ? (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80 lg:hidden"
                aria-label="Search chats"
              >
                <img
                  src={PROVIDER_ICONS.search}
                  alt=""
                  className="size-5 object-contain"
                  draggable={false}
                />
              </button>
            ) : (
              <span className="size-10 shrink-0" aria-hidden />
            )}
          </div>
        </header>
      )}

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={cn(
            PROVIDER_PAGE_SHELL,
            "flex min-h-0 flex-1 flex-col max-lg:!px-0",
          )}
        >
          {isEmptyInbox ? (
            <ChatEmptyInbox
              title="Not Chats Yet"
              description="Start a conversation about all your Service appointment."
              className="min-h-0 flex-1"
            />
          ) : (
            <>
              <div className="shrink-0 space-y-3 px-4 pt-3 pb-2 lg:px-0 lg:pt-4">
                <div className="relative hidden lg:block">
                  <img
                    src={PROVIDER_ICONS.search}
                    alt=""
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 object-contain opacity-50"
                    draggable={false}
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations..."
                    className={cn(
                      "h-11 w-full rounded-xl border border-[#E6E8EF] bg-white py-0 pr-4 pl-10 text-sm text-[#111827]",
                      "outline-none placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1865EA]/20",
                    )}
                  />
                </div>

                <ChatFilterTabs value={filter} onChange={setFilter} counts={counts} />
              </div>

              <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white lg:mb-4 lg:rounded-2xl lg:border lg:border-[#EEF2F7] lg:shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                {filtered.length === 0 ? (
                  <ChatEmptyInbox
                    title={emptyTitle}
                    description={emptyDescription}
                    className="min-h-0 flex-1"
                  />
                ) : (
                  <div className="flex flex-col md:gap-0.5 md:p-2 max-md:[&>a:last-child_.chat-row-body]:border-b-0">
                    {filtered.map((conversation) => (
                      <ChatCard
                        key={conversation.id}
                        conversation={conversation}
                        href={providerChatDetailRoute(conversation.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
