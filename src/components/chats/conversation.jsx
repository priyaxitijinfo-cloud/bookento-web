"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { MessageActionsLayer } from "@/components/chats/message-actions-layer";
import { ChatEmptyThread } from "@/components/chats/chat-empty-thread";
import { DeleteMessageModal } from "@/components/chats/delete-message-modal";
import { ForwardMessageModal } from "@/components/chats/forward-message-modal";
import { MessageBubble } from "@/components/chats/message-bubble";
import { PinnedMessagesBar } from "@/components/chats/pinned-messages-bar";
import { currentUser } from "@/mock/users";
import { useChatStore } from "@/store";
import { cn } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="bg-muted-foreground/50 size-1.5 animate-bounce rounded-full"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function MessagePreview({ message, isOwn }) {
  const isMediaAttachment = message.type === "image" || message.type === "file";

  return (
    <div
      className={cn(
        isMediaAttachment
          ? "overflow-hidden p-1"
          : "px-4 py-2.5 text-sm leading-relaxed md:text-[15px]",
        isOwn
          ? "bg-primary rounded-lg rounded-br-[2px] text-white shadow-[0_8px_24px_rgba(24,101,234,0.35)]"
          : "text-foreground rounded-lg rounded-bl-[2px] bg-white shadow-[0_8px_24px_rgba(77,89,114,0.18)]",
      )}
    >
      {message.type === "image" && message.attachmentUrl ? (
        <img
          src={message.attachmentUrl}
          alt={message.fileName || "Shared image"}
          className="max-h-52 max-w-[220px] object-cover"
        />
      ) : message.type === "file" ? (
        <span className="text-sm">{message.fileName || message.content}</span>
      ) : (
        message.content
      )}
    </div>
  );
}

export function Conversation({
  messages,
  participantAvatar,
  participantName,
  isTyping = false,
  isLoading = false,
  className,
  conversationId,
  onReply,
  onReact,
  onDeleteMessage,
  onPinMessage,
  onForwardMessage,
  onEditMessage,
}) {
  const endRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [isForwarding, setIsForwarding] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const conversations = useChatStore((state) => state.conversations);

  const pinnedMessages = useMemo(
    () =>
      [...messages]
        .filter((message) => message.isPinned && !message.isDeleted)
        .sort(
          (a, b) =>
            new Date(b.pinnedAt || b.createdAt) - new Date(a.pinnedAt || a.createdAt),
        ),
    [messages],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, [messages.length, isTyping]);

  const closeActions = useCallback(() => {
    setActiveMessage(null);
    setAnchorRect(null);
  }, []);

  useEffect(() => {
    if (!activeMessage) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeActions();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMessage, closeActions]);

  const handleOpenActions = useCallback((message, rect) => {
    setActiveMessage(message);
    setAnchorRect(rect);
  }, []);

  const handleAction = useCallback(
    (actionId) => {
      if (!activeMessage) return;

      if (actionId === "reply") {
        onReply?.(activeMessage);
        closeActions();
        return;
      }

      if (actionId === "forward") {
        setForwardMessage(activeMessage);
        closeActions();
        return;
      }

      if (actionId === "edit") {
        onEditMessage?.(activeMessage);
        closeActions();
        return;
      }

      if (actionId === "pin") {
        const wasPinned = Boolean(activeMessage.isPinned);
        onPinMessage?.(activeMessage.id);
        toast.success(wasPinned ? "Message unpinned" : "Message pinned");
        closeActions();
        return;
      }

      if (actionId === "delete") {
        const isOwnMessage =
          activeMessage.senderId === "current_user" ||
          activeMessage.senderId === currentUser.id;

        if (!isOwnMessage) {
          onDeleteMessage?.(activeMessage.id, { scope: "me" });
          toast.success("Message deleted for you");
          closeActions();
          return;
        }

        setDeleteMessage(activeMessage);
        closeActions();
      }
    },
    [
      activeMessage,
      closeActions,
      onDeleteMessage,
      onEditMessage,
      onPinMessage,
      onReply,
    ],
  );

  const handleConfirmDelete = useCallback(
    (scope) => {
      if (!deleteMessage) return;
      onDeleteMessage?.(deleteMessage.id, { scope });
      setDeleteMessage(null);
      toast.success(
        scope === "everyone"
          ? "Message deleted for everyone"
          : "Message deleted for you",
      );
    },
    [deleteMessage, onDeleteMessage],
  );

  const handleReact = useCallback(
    (emoji) => {
      if (!activeMessage) return;
      onReact?.(activeMessage.id, emoji);
    },
    [activeMessage, onReact],
  );

  const handleScrollToMessage = useCallback((messageId) => {
    const node = scrollRef.current?.querySelector(`[data-message-id="${messageId}"]`);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleForward = useCallback(
    async (targetConversationIds) => {
      if (!forwardMessage || !onForwardMessage || !targetConversationIds.length) return;
      setIsForwarding(true);
      const success = await onForwardMessage(forwardMessage, targetConversationIds);
      setIsForwarding(false);
      if (success) {
        toast.success(
          targetConversationIds.length > 1
            ? `Message forwarded to ${targetConversationIds.length} chats`
            : "Message forwarded",
        );
        setForwardMessage(null);
      }
    },
    [forwardMessage, onForwardMessage],
  );

  const handleForwardModalOpenChange = useCallback((open) => {
    if (!open) setForwardMessage(null);
  }, []);

  if (isLoading) {
    return (
      <div className={cn("flex flex-1 items-center justify-center", className)}>
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  const activeIsOwn =
    activeMessage &&
    (activeMessage.senderId === "current_user" ||
      activeMessage.senderId === currentUser.id);

  const deleteIsOwn =
    deleteMessage &&
    (deleteMessage.senderId === "current_user" ||
      deleteMessage.senderId === currentUser.id);

  const isEmpty = messages.length === 0 && !isTyping;

  return (
    <>
      <PinnedMessagesBar
        pinnedMessages={pinnedMessages}
        onSelect={handleScrollToMessage}
      />

      <div
        ref={scrollRef}
        className={cn(
          "scrollbar-hide relative min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5",
          "bg-[url('/icons/chat-bg.jpg')] bg-cover bg-center bg-no-repeat md:bg-[url('/icons/bg.jpg')] md:bg-cover md:bg-center md:bg-no-repeat",
          isEmpty && "flex flex-col",
          activeMessage && "max-md:overflow-hidden",
          className,
        )}
      >
        {isEmpty ? (
          <ChatEmptyThread />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 md:max-w-full">
            {messages.map((msg) => {
              const isOwn =
                msg.senderId === "current_user" || msg.senderId === currentUser.id;
              return (
                <div key={msg.id} data-message-id={msg.id}>
                  <MessageBubble
                    message={msg}
                    isOwn={isOwn}
                    participantAvatar={participantAvatar}
                    participantName={participantName}
                    onOpenActions={handleOpenActions}
                    isActionsOpen={activeMessage?.id === msg.id}
                  />
                </div>
              );
            })}
            {isTyping ? <TypingIndicator /> : null}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <MessageActionsLayer
        open={Boolean(activeMessage && anchorRect)}
        anchorRect={anchorRect}
        message={activeMessage}
        isOwn={Boolean(activeIsOwn)}
        isPinned={Boolean(activeMessage?.isPinned)}
        preview={
          activeMessage ? (
            <MessagePreview message={activeMessage} isOwn={Boolean(activeIsOwn)} />
          ) : null
        }
        onClose={closeActions}
        onReact={handleReact}
        onAction={handleAction}
      />

      <ForwardMessageModal
        open={Boolean(forwardMessage)}
        onOpenChange={handleForwardModalOpenChange}
        message={forwardMessage}
        conversations={conversations}
        currentConversationId={conversationId}
        onForward={handleForward}
        isSubmitting={isForwarding}
      />

      <DeleteMessageModal
        open={Boolean(deleteMessage)}
        onClose={() => setDeleteMessage(null)}
        canDeleteForEveryone={Boolean(deleteIsOwn)}
        onDeleteForMe={() => handleConfirmDelete("me")}
        onDeleteForEveryone={() => handleConfirmDelete("everyone")}
      />
    </>
  );
}
