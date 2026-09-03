"use client";

import { SearchIcon } from "@/components/icons/search-icon";

import { ChatEmptyPane } from "@/components/chats/chat-empty-pane";
import {
  CHAT_PAGE_MAIN_CLASS,
  CHAT_PAGE_SHELL_CLASS,
  ChatSplitShell,
  useChatInbox,
} from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

import { ChatInboxListPanel } from "./chats-parts";

function ChatsSearchAction({ inbox }) {
  if (inbox.isEmpty || inbox.searchOpen) return null;

  return (
    <button
      type="button"
      aria-label="Search chats"
      onClick={() => inbox.setSearchOpen(true)}
      className="flex size-9 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F3F4F6] max-md:-mr-1 md:size-10"
    >
      <SearchIcon className="size-5" />
    </button>
  );
}

export function ChatsResponsive() {
  const inbox = useChatInbox();

  return (
    <UserPageShell
      title="Chat"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      hideMobileHeader={inbox.searchOpen}
      showBreadcrumb
      breadcrumbCurrentLabel="Chat"
      containerVariant="chat"
      className={cn(
        CHAT_PAGE_SHELL_CLASS,
        "max-md:h-dvh max-md:max-h-dvh max-md:min-h-0",
      )}
      mainClassName={CHAT_PAGE_MAIN_CLASS}
      rightAction={<ChatsSearchAction inbox={inbox} />}
    >
      <ChatInboxListPanel inbox={inbox} panelClassName="md:hidden" />

      <div className="hidden min-h-0 flex-1 flex-col overflow-hidden md:flex">
        <ChatSplitShell inbox={inbox} className="min-h-0 flex-1" showInboxTitle>
          <ChatEmptyPane />
        </ChatSplitShell>
      </div>
    </UserPageShell>
  );
}

export default ChatsResponsive;
