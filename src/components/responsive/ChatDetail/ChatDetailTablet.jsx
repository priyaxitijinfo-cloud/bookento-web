"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ChatThreadPanel } from "./chat-detail-parts";

export function ChatDetailTablet({
  conversation,
  messages,
  isTyping,
  isLoading,
  onSend,
  onCall,
  onVideoCall,
  onBack,
}) {
  return (
    <UserPageShell
      title={conversation.participantName}
      backHref={ROUTES.CHATS}
      backLabel="Back to Chats"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page h-dvh overflow-hidden pb-0"
      showBottomNav={false}
      mainClassName="mx-auto max-w-3xl overflow-hidden pb-0"
    >
      <div className="-mx-4 -mt-3 flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-card">
        <ChatThreadPanel
          conversation={conversation}
          messages={messages}
          isTyping={isTyping}
          isLoading={isLoading}
          onSend={onSend}
          onCall={onCall}
          onVideoCall={onVideoCall}
          onBack={onBack}
          showMobileBack
        />
      </div>
    </UserPageShell>
  );
}
