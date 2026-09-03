"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { CallRestrictionModal } from "@/components/chats/call-restriction-modal";
import {
  CHAT_PAGE_MAIN_CLASS,
  CHAT_PAGE_SHELL_CLASS,
  ChatSplitShell,
  useChatInbox,
} from "@/components/chats/chat-workspace";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { canStartCall, findLinkedAppointment } from "@/lib/chats/chat.utils";
import { resolveChatBackNavigation } from "@/lib/navigation/back-navigation";
import { getConversationById, getMessages } from "@/mock/chat";
import { useChatStore } from "@/store";
import { cn } from "@/lib/utils";

import { ChatThreadPanel } from "./chat-detail-parts";

export function ChatDetailResponsive() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inbox = useChatInbox();
  const [callRestrictionOpen, setCallRestrictionOpen] = useState(false);

  const conversations = useChatStore((state) => state.conversations);
  const activeConversation = useChatStore((state) => state.activeConversation);
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);
  const isLoading = useChatStore((state) => state.isLoading);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const sendVoiceMessage = useChatStore((state) => state.sendVoiceMessage);
  const sendAttachmentMessage = useChatStore((state) => state.sendAttachmentMessage);
  const toggleMessageReaction = useChatStore((state) => state.toggleMessageReaction);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const pinMessage = useChatStore((state) => state.pinMessage);
  const forwardMessage = useChatStore((state) => state.forwardMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const blockedParticipantIds = useChatStore((state) => state.blockedParticipantIds);

  const conversationId = Array.isArray(id) ? id[0] : id;
  const conversation = useMemo(() => {
    const found =
      conversations.find((item) => item.id === conversationId) ||
      getConversationById(conversationId);

    if (!found) return null;
    if (blockedParticipantIds.includes(found.participantId)) return null;
    return found;
  }, [conversations, conversationId, blockedParticipantIds]);
  const linkedAppointment = useMemo(
    () => (conversation ? findLinkedAppointment(conversation.participantId) : null),
    [conversation],
  );

  useEffect(() => {
    if (!conversationId) return;

    const conv =
      useChatStore
        .getState()
        .conversations.find((item) => item.id === conversationId) ||
      getConversationById(conversationId);

    if (conv) {
      setActiveConversation(conv);
    }
  }, [conversationId, setActiveConversation]);

  const returnTo = searchParams.get("returnTo");
  const from = searchParams.get("from");

  const desktopBackNav = useMemo(() => {
    if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      return resolveChatBackNavigation({ returnTo, from });
    }

    return {
      href: ROUTES.PROFILE,
      label: "Back to Profile",
    };
  }, [returnTo, from]);

  const handleDesktopBack = () => {
    router.push(desktopBackNav.href);
  };

  const handleMobileBack = () => {
    if (typeof window === "undefined") {
      router.push(ROUTES.CHATS);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const nav = resolveChatBackNavigation({
      returnTo: params.get("returnTo"),
      from: params.get("from"),
    });
    router.push(nav.href);
  };

  const displayMessages = useMemo(() => {
    if (!conversation) return [];
    if (activeConversation?.id === conversation.id) {
      return messages;
    }
    return getMessages(conversation.id);
  }, [activeConversation?.id, conversation, messages]);

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

  const handleSend = async (text, options) => {
    if (options?.editMessageId) {
      editMessage(options.editMessageId, text);
      return;
    }
    await sendMessage(text, options);
  };

  const threadProps = {
    conversation,
    messages: displayMessages,
    isTyping,
    isLoading,
    onSend: handleSend,
    onSendVoice: sendVoiceMessage,
    onSendAttachment: sendAttachmentMessage,
    onReact: toggleMessageReaction,
    onDeleteMessage: deleteMessage,
    onPinMessage: pinMessage,
    onForwardMessage: forwardMessage,
    onCall: () => startCall("audio"),
    onVideoCall: () => startCall("video"),
    onBack: handleMobileBack,
  };

  return (
    <>
      <UserPageShell
        title={conversation.participantName}
        backHref={desktopBackNav.href}
        backLabel={desktopBackNav.label}
        onBack={handleDesktopBack}
        hideMobileHeader
        showBreadcrumb
        breadcrumbCurrentLabel="Chat"
        containerVariant="chat"
        className={cn(
          CHAT_PAGE_SHELL_CLASS,
          "overflow-x-hidden max-md:h-dvh max-md:max-h-dvh max-md:min-h-0",
        )}
        showBottomNav={false}
        mainClassName={CHAT_PAGE_MAIN_CLASS}
      >
        <ChatSplitShell
          inbox={inbox}
          activeId={conversation.id}
          className="min-h-0 flex-1 max-md:h-full max-md:min-h-0 max-md:rounded-none max-md:border-0 max-md:shadow-none"
          showInboxTitle
        >
          <ChatThreadPanel {...threadProps} showMobileBack />
        </ChatSplitShell>
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

export default ChatDetailResponsive;
