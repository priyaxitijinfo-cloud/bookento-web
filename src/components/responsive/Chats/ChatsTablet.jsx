"use client";

import { Search } from "lucide-react";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ChatInboxListPanel } from "./chats-parts";

function ChatsSearchAction({ inbox }) {
  if (inbox.isEmpty) return null;

  return (
    <button
      type="button"
      aria-label={inbox.searchOpen ? "Close search" : "Search chats"}
      onClick={() => inbox.setSearchOpen(!inbox.searchOpen)}
      className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted md:size-10"
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
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page h-dvh overflow-hidden pb-0"
      mainClassName="mx-auto max-w-3xl overflow-hidden pb-0"
      rightAction={<ChatsSearchAction inbox={inbox} />}
    >
      <ChatInboxListPanel inbox={inbox} />
    </UserPageShell>
  );
}
