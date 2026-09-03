"use client";

import { Search } from "lucide-react";

import {
  CHAT_PAGE_MAIN_CLASS,
  CHAT_PAGE_SHELL_CLASS,
} from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

import { ChatInboxListPanel } from "./chats-parts";

function ChatsSearchAction({ inbox }) {
  if (inbox.isEmpty) return null;

  return (
    <button
      type="button"
      aria-label={inbox.searchOpen ? "Close search" : "Search chats"}
      onClick={() => inbox.setSearchOpen(!inbox.searchOpen)}
      className="text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors md:size-10"
    >
      <Search className="size-5" />
    </button>
  );
}

export function ChatsTablet({ inbox }) {
  return (
    <UserPageShell
      title="Chat"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      containerVariant="chat"
      className={CHAT_PAGE_SHELL_CLASS}
      mainClassName={cn(CHAT_PAGE_MAIN_CLASS, "mx-auto max-w-3xl")}
      rightAction={<ChatsSearchAction inbox={inbox} />}
    >
      <ChatInboxListPanel inbox={inbox} />
    </UserPageShell>
  );
}
