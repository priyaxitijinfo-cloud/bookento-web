"use client";

import { ChatSplitShell } from "@/components/chats/chat-workspace";
import { HomeHeader } from "@/components/home/home-header";
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
  onSendVoice,
  onSendAttachment,
  onReact,
  onDeleteMessage,
  onPinMessage,
  onForwardMessage,
  onCall,
  onVideoCall,
  onBack,
}) {
  return (
    <DesktopLayout
      maxWidth="wide"
      showHeaderBorder={false}
      className="h-dvh overflow-hidden"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden !py-0"
      containerClassName="flex min-h-0 flex-1 flex-col overflow-hidden !pt-0 pb-5 md:!pt-0"
      header={
        <>
          <HomeHeader embedded />
          <DesktopBreadcrumbBar
            backHref={ROUTES.PROFILE}
            backLabel="Back to Profile"
            currentLabel="Chat"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatSplitShell
          inbox={inbox}
          activeId={conversation.id}
          className="min-h-0 flex-1"
          showInboxTitle
        >
          <ChatThreadPanel
            conversation={conversation}
            messages={messages}
            isTyping={isTyping}
            isLoading={isLoading}
            onSend={onSend}
            onSendVoice={onSendVoice}
            onSendAttachment={onSendAttachment}
            onReact={onReact}
            onDeleteMessage={onDeleteMessage}
            onPinMessage={onPinMessage}
            onForwardMessage={onForwardMessage}
            onCall={onCall}
            onVideoCall={onVideoCall}
            onBack={onBack}
          />
        </ChatSplitShell>
      </div>
    </DesktopLayout>
  );
}
