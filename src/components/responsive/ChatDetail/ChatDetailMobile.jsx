"use client";

import {
  CHAT_PAGE_MAIN_CLASS,
  CHAT_PAGE_SHELL_CLASS,
} from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { cn } from "@/lib/utils";

import { ChatThreadPanel } from "./chat-detail-parts";

export function ChatDetailMobile({
  conversation,
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
    <UserPageShell
      title={conversation.participantName}
      onBack={onBack}
      backLabel="Back to Chats"
      hideMobileHeader
      showBottomNav={false}
      showBreadcrumb={false}
      containerVariant="chat"
      className={cn(CHAT_PAGE_SHELL_CLASS, "overflow-x-hidden !pb-0")}
      mainClassName={CHAT_PAGE_MAIN_CLASS}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
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
          showMobileBack
        />
      </div>
    </UserPageShell>
  );
}
