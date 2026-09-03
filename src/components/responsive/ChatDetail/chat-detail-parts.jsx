"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { ReportDoctorModal } from "@/components/provider-booking/report-doctor-modal";
import { ChatHeader } from "@/components/chats/chat-header";
import { ChatHeaderMenu } from "@/components/chats/chat-header-menu";
import { ClearChatModal } from "@/components/chats/clear-chat-modal";
import { Conversation } from "@/components/chats/conversation";
import { FlagChatModal } from "@/components/chats/flag-chat-modal";
import { FlaggedChatBanner } from "@/components/chats/flagged-chat-banner";
import { MessageInput } from "@/components/chats/message-input";
import { useChatStore } from "@/store";

export function ChatThreadPanel({
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
  showMobileBack = false,
  className,
}) {
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [clearOpen, setClearOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);

  const clearChat = useChatStore((state) => state.clearChat);
  const reportParticipant = useChatStore((state) => state.reportParticipant);
  const flagConversation = useChatStore((state) => state.flagConversation);

  const isFlagged = Boolean(conversation?.isFlagged);
  const messagingExhausted =
    isFlagged && (conversation?.flaggedMessagesRemaining ?? 0) <= 0;

  const handleSend = async (text, options) => {
    await onSend?.(text, options);
    setReplyTo(null);
    setEditingMessage(null);
  };

  const handleOpenFlag = () => {
    if (conversation?.isFlagged) {
      toast.message("This chat is already flagged");
      return;
    }
    setFlagOpen(true);
  };

  const handleSubmitFlag = (payload) => {
    const result = flagConversation(conversation.id, payload);
    setFlagOpen(false);

    if (result === "already") {
      toast.message("This chat is already flagged");
      return;
    }
    if (result) {
      toast.success("Chat flagged — messaging limited to 15 messages");
    }
  };

  const handleReply = (message) => {
    setEditingMessage(null);
    setReplyTo(message);
  };

  const handleEdit = (message) => {
    setReplyTo(null);
    setEditingMessage(message);
  };

  const handleConfirmClear = () => {
    const cleared = clearChat(conversation.id);
    setClearOpen(false);

    if (cleared) {
      toast.success("Chat cleared");
    }
  };

  const handleSubmitReport = (payload) => {
    reportParticipant(conversation.participantId, payload);
    setReportOpen(false);
    toast.success("Report submitted");
  };

  return (
    <div
      className={
        className ??
        "bg-background flex h-full min-h-0 w-full min-w-0 flex-1 flex-col max-md:h-full"
      }
    >
      <div className="sticky top-0 z-30 flex w-full min-w-0 shrink-0 items-center gap-2 border-b border-[#EEF2F7] bg-white px-4 pt-[env(safe-area-inset-top,0px)] md:static md:gap-1 md:px-0 md:pt-0">
        {showMobileBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to chats"
            className="text-foreground hover:bg-muted flex size-9 shrink-0 items-center justify-center rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="size-5" strokeWidth={2.25} />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <ChatHeader
            name={conversation.participantName}
            avatar={conversation.participantAvatar}
            isOnline={conversation.isOnline}
            onCall={onCall}
            onVideoCall={onVideoCall}
            trailing={
              <ChatHeaderMenu
                onClear={() => setClearOpen(true)}
                onReport={() => setReportOpen(true)}
                onFlag={handleOpenFlag}
              />
            }
            className={
              showMobileBack
                ? "w-full border-0 px-0 py-2.5 pr-0 md:px-5 md:py-4"
                : undefined
            }
          />
        </div>
      </div>

      <Conversation
        messages={messages}
        participantAvatar={conversation.participantAvatar}
        participantName={conversation.participantName}
        isTyping={isTyping}
        isLoading={isLoading}
        conversationId={conversation.id}
        onReply={handleReply}
        onReact={onReact}
        onDeleteMessage={onDeleteMessage}
        onPinMessage={onPinMessage}
        onForwardMessage={onForwardMessage}
        onEditMessage={handleEdit}
      />

      {isFlagged ? (
        <div className="flex shrink-0 flex-col gap-4 bg-transparent p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:p-5 md:pb-5">
          <FlaggedChatBanner />
          <MessageInput
            onSend={handleSend}
            onSendVoice={onSendVoice}
            onSendAttachment={onSendAttachment}
            disabled={messagingExhausted && !editingMessage}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
            className="!border-0 !bg-transparent !p-0 !pb-0 md:!p-0"
          />
        </div>
      ) : (
        <MessageInput
          onSend={handleSend}
          onSendVoice={onSendVoice}
          onSendAttachment={onSendAttachment}
          disabled={messagingExhausted && !editingMessage}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          editingMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
        />
      )}

      <ClearChatModal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={handleConfirmClear}
      />

      <ReportDoctorModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleSubmitReport}
      />

      <FlagChatModal
        open={flagOpen}
        onClose={() => setFlagOpen(false)}
        onSubmit={handleSubmitFlag}
      />
    </div>
  );
}
