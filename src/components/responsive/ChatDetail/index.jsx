"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { CallRestrictionModal } from "@/components/chats/call-restriction-modal";
import { useChatInbox } from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { canStartCall, findLinkedAppointment } from "@/lib/chats/chat.utils";
import { getConversationById } from "@/mock/chat";
import { useChatStore } from "@/store";

import { ChatDetailDesktop } from "./ChatDetailDesktop";
import { ChatDetailMobile } from "./ChatDetailMobile";
import { ChatDetailTablet } from "./ChatDetailTablet";

export function ChatDetailResponsive() {
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

  const sharedProps = {
    conversation,
    inbox,
    messages: displayMessages,
    isTyping,
    isLoading,
    onSend: handleSend,
    onCall: () => startCall("audio"),
    onVideoCall: () => startCall("video"),
    onBack: () => router.push(ROUTES.CHATS),
  };

  return (
    <>
      <ResponsiveView
        mobile={<ChatDetailMobile {...sharedProps} />}
        tablet={<ChatDetailTablet {...sharedProps} />}
        desktop={<ChatDetailDesktop {...sharedProps} />}
      />

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

export default ChatDetailResponsive;
