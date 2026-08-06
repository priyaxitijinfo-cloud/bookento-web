"use client";

import { ArrowLeft } from "lucide-react";

import { ChatHeader } from "@/components/chats/chat-header";
import { Conversation } from "@/components/chats/conversation";
import { MessageInput } from "@/components/chats/message-input";

export function ChatThreadPanel({
  conversation,
  messages,
  isTyping,
  isLoading,
  onSend,
  onCall,
  onVideoCall,
  onBack,
  showMobileBack = false,
  className,
}) {
  return (
    <div className={className ?? "flex min-h-0 flex-1 flex-col bg-background"}>
      <div className="flex shrink-0 items-center gap-1 border-b border-[#EEF2F7] md:border-0">
        {showMobileBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to chats"
            className="text-foreground ml-2 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted md:hidden"
          >
            <ArrowLeft className="size-5" />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <ChatHeader
            name={conversation.participantName}
            avatar={conversation.participantAvatar}
            isOnline={conversation.isOnline}
            onCall={onCall}
            onVideoCall={onVideoCall}
            className={showMobileBack ? "border-0 pl-1" : undefined}
          />
        </div>
      </div>

      <Conversation
        messages={messages}
        isTyping={isTyping}
        isLoading={isLoading}
        className="bg-[#F8FAFC]"
      />

      <MessageInput onSend={onSend} />
    </div>
  );
}
