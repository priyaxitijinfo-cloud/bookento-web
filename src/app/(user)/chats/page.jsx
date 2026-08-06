"use client";

import { Search } from "lucide-react";

import {
  ChatDesktopEmpty,
  ChatListMobile,
  useChatInbox,
} from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

function ChatsSearchAction({ inbox }) {
  if (inbox.isEmpty) return null;

  return (
    <button
      type="button"
      aria-label={inbox.searchOpen ? "Close search" : "Search chats"}
      onClick={() => inbox.setSearchOpen(!inbox.searchOpen)}
      className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6] md:size-10"
    >
      <Search className="size-5" />
    </button>
  );
}

export default function ChatsPage() {
  const inbox = useChatInbox();

  return (
    <UserPageShell
      title="Chat"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page h-dvh overflow-hidden pb-0"
      mainClassName="overflow-hidden pb-6"
      rightAction={<ChatsSearchAction inbox={inbox} />}
    >
      <ChatListMobile inbox={inbox} />
      <ChatDesktopEmpty inbox={inbox} />
    </UserPageShell>
  );
}
