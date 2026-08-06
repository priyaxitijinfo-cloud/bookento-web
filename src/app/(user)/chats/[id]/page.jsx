"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CallRestrictionModal } from "@/components/chats/call-restriction-modal";
import { ChatHeader } from "@/components/chats/chat-header";
import { Conversation } from "@/components/chats/conversation";
import { MessageInput } from "@/components/chats/message-input";
import { ChatSplitShell, useChatInbox } from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { canStartCall, findLinkedAppointment } from "@/lib/chats/chat.utils";
import { getConversationById } from "@/mock/chat";
import { useChatStore } from "@/store";

function ChatThread({
  conversation,
  messages,
  isTyping,
  isLoading,
  onSend,
  onCall,
  onVideoCall,
  onBack,
  showMobileBack = false,
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex shrink-0 items-center gap-1 border-b border-[#EEF2F7] md:border-0">
        {showMobileBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to chats"
            className="text-foreground ml-2 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6] md:hidden"
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

export default function ChatDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const inbox = useChatInbox();
  const [callRestrictionOpen, setCallRestrictionOpen] = useState(false);

  const {
    activeConversation,
    messages,
    isTyping,
    isLoading,
    setActiveConversation,
    sendMessage,
  } = useChatStore();

  const conversation = getConversationById(id);
  const linkedAppointment = useMemo(
    () => (conversation ? findLinkedAppointment(conversation.participantId) : null),
    [conversation],
  );

  useEffect(() => {
    if (conversation) {
      setActiveConversation(conversation);
    }
  }, [conversation, setActiveConversation]);

  if (!conversation) {
    return (
      <UserPageShell
        title="Chat"
        backHref={ROUTES.CHATS}
        backLabel="Back to Chats"
        containerVariant="browseWithBreadcrumb"
        className="bg-surface-page"
      >
        <EmptyState
          title="Conversation not found"
          description="This chat may have been removed or the link is invalid."
          actionLabel="Back to chats"
          onAction={() => router.push(ROUTES.CHATS)}
        />
      </UserPageShell>
    );
  }

  const displayMessages =
    activeConversation?.id === conversation.id ? messages : [];

  const startCall = (kind) => {
    if (
      linkedAppointment &&
      canStartCall(linkedAppointment.scheduledDate, linkedAppointment.scheduledTime)
    ) {
      const params = new URLSearchParams({
        provider: conversation.participantId,
        from: conversation.id,
      });
      const route = kind === "video" ? ROUTES.CALL_VIDEO : ROUTES.CALL_AUDIO;
      router.push(`${route}?${params.toString()}`);
      return;
    }

    setCallRestrictionOpen(true);
  };

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  return (
    <>
      <UserPageShell
        title={conversation.participantName}
        backHref={ROUTES.CHATS}
        backLabel="Back to Chats"
        containerVariant="browseWithBreadcrumb"
        className="bg-surface-page h-dvh overflow-hidden pb-0"
        showBottomNav={false}
        mainClassName="overflow-hidden pb-0 md:pb-6"
      >
        {/* Mobile thread */}
        <div className="-mx-4 -mt-3 flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-white md:hidden">
          <ChatThread
            conversation={conversation}
            messages={displayMessages}
            isTyping={isTyping}
            isLoading={isLoading}
            onSend={handleSend}
            onCall={() => startCall("audio")}
            onVideoCall={() => startCall("video")}
            onBack={() => router.push(ROUTES.CHATS)}
            showMobileBack
          />
        </div>

        {/* Desktop split */}
        <div className="hidden md:block">
          <ChatSplitShell inbox={inbox} activeId={conversation.id}>
            <ChatThread
              conversation={conversation}
              messages={displayMessages}
              isTyping={isTyping}
              isLoading={isLoading}
              onSend={handleSend}
              onCall={() => startCall("audio")}
              onVideoCall={() => startCall("video")}
              onBack={() => router.push(ROUTES.CHATS)}
            />
          </ChatSplitShell>
        </div>
      </UserPageShell>

      <CallRestrictionModal
        open={callRestrictionOpen}
        onClose={() => setCallRestrictionOpen(false)}
        providerName={conversation.participantName}
        scheduledDate={linkedAppointment?.scheduledDate}
        scheduledTime={linkedAppointment?.scheduledTime}
      />
    </>
  );
}
