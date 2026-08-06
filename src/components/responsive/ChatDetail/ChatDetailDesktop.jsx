"use client";

import { ChatSplitShell } from "@/components/chats/chat-workspace";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ROUTES } from "@/constants/routes.constants";

import { ChatThreadPanel } from "./chat-detail-parts";

export function ChatDetailDesktop({
  conversation,
  inbox,
  messages,
  isTyping,
  isLoading,
  onSend,
  onCall,
  onVideoCall,
  onBack,
}) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.CHATS}
          backLabel="Back to Chats"
          currentLabel={conversation.participantName}
        />
      )}
      contentClassName="!py-0"
    >
      <ChatSplitShell inbox={inbox} activeId={conversation.id}>
        <ChatThreadPanel
          conversation={conversation}
          messages={messages}
          isTyping={isTyping}
          isLoading={isLoading}
          onSend={onSend}
          onCall={onCall}
          onVideoCall={onVideoCall}
          onBack={onBack}
        />
      </ChatSplitShell>
    </DesktopLayout>
  );
}
