"use client";

import { ChatFilterTabs } from "@/components/chats/chat-filter-tabs";
import { ChatList } from "@/components/chats/chat-list";
import { ChatMobileSearchBar } from "@/components/chats/chat-mobile-search-bar";
import { SearchInput } from "@/components/responsive/Search/SearchMobile";
import { MOBILE_PAGE_INSET_ALIGN_ACTION_CLASS } from "@/lib/layout/mobile-header.constants";
import { cn } from "@/lib/utils";

export function ChatInboxPanel({
  conversations,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  searchOpen = false,
  onSearchClose,
  counts,
  activeId,
  className,
  showTitle = false,
  showSearch = false,
  emptyTitle,
  emptyDescription,
}) {
  const showSearchField = showSearch || searchOpen || Boolean(search) || showTitle;

  const handleSearchClose = () => {
    onSearchChange("");
    onSearchClose?.();
  };

  return (
    <div
      className={cn(
        "bg-background flex min-h-0 flex-col max-md:h-full max-md:flex-1 max-md:bg-transparent",
        className,
      )}
    >
      {searchOpen ? (
        <ChatMobileSearchBar
          value={search}
          onChange={onSearchChange}
          onClose={handleSearchClose}
        />
      ) : null}

      <div
        className={cn(
          "shrink-0 max-md:pb-3",
          "max-md:pt-4",
          MOBILE_PAGE_INSET_ALIGN_ACTION_CLASS,
          "md:space-y-3 md:space-y-3.5 md:border-b md:border-[#EEF2F7] md:px-4 md:py-4",
        )}
      >
        {showTitle ? (
          <h2 className="text-foreground text-lg font-bold tracking-tight md:text-xl">
            Chat
          </h2>
        ) : null}

        {showSearchField ? (
          <SearchInput
            className="hidden md:block"
            query={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations..."
          />
        ) : null}

        <ChatFilterTabs value={filter} onChange={onFilterChange} counts={counts} />
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain max-md:bg-transparent max-md:px-0 max-md:py-0 max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:bg-white md:px-2 md:pt-[10px] md:pb-2">
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
