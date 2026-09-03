"use client";

import { SearchIcon } from "@/components/icons/search-icon";

import {
  CHAT_PAGE_MAIN_CLASS,
  CHAT_PAGE_SHELL_CLASS,
} from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ChatInboxListPanel } from "./chats-parts";

function ChatsSearchAction({ inbox }) {
  if (inbox.isEmpty || inbox.searchOpen) return null;

  return (
    <button
      type="button"
      aria-label="Search chats"
      onClick={() => inbox.setSearchOpen(true)}
      className="flex size-9 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F3F4F6] max-md:-mr-1"
    >
      <SearchIcon className="size-5" />
    </button>
  );
}

export function ChatsMobile({ inbox }) {
  return (
    <UserPageShell
      title="Chat"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      hideMobileHeader={inbox.searchOpen}
      containerVariant="chat"
      className={CHAT_PAGE_SHELL_CLASS}
      mainClassName={CHAT_PAGE_MAIN_CLASS}
      rightAction={<ChatsSearchAction inbox={inbox} />}
    >
      <ChatInboxListPanel inbox={inbox} panelClassName="md:hidden" />
    </UserPageShell>
  );
}
