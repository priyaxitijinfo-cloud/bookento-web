import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  conversations,
  getMessages,
  providerConversations,
  messages as messageMap,
} from "@/mock/chat";
import { delay } from "@/mock/helpers";

export const FLAGGED_MESSAGE_LIMIT = 15;

function withFlaggedQuotaConsumed(list, conversationId) {
  return list.map((item) => {
    if (item.id !== conversationId || !item.isFlagged) return item;
    const remaining = Math.max(0, (item.flaggedMessagesRemaining ?? 0) - 1);
    return { ...item, flaggedMessagesRemaining: remaining };
  });
}

function canSendWhileFlagged(conv) {
  if (!conv?.isFlagged) return true;
  return (conv.flaggedMessagesRemaining ?? 0) > 0;
}

export const useChatStore = create(
  devtools(
    (set, get) => ({
      conversations,
      providerConversations,
      activeConversation: null,
      messages: [],
      isTyping: false,
      isLoading: false,

      fetchConversations: async (role = "user") => {
        set({ isLoading: true });
        await delay(400);
        set({ isLoading: false });
        return role === "provider" ? get().providerConversations : get().conversations;
      },

      setActiveConversation: (conversation) => {
        if (!conversation) return;

        const state = get();
        const conversationId = conversation.id;
        const cachedMessages = getMessages(conversationId);
        const isSameConversation = state.activeConversation?.id === conversationId;

        const clearUnreadInList = (list) => {
          let changed = false;
          const next = list.map((item) => {
            if (item.id !== conversationId) return item;
            if (item.unreadCount === 0) return item;
            changed = true;
            return { ...item, unreadCount: 0 };
          });
          return changed ? next : list;
        };

        const mockConversation =
          conversations.find((item) => item.id === conversationId) ??
          providerConversations.find((item) => item.id === conversationId);
        if (mockConversation && mockConversation.unreadCount !== 0) {
          mockConversation.unreadCount = 0;
        }

        const nextConversations = clearUnreadInList(state.conversations);
        const nextProviderConversations = clearUnreadInList(
          state.providerConversations,
        );
        const listsChanged =
          nextConversations !== state.conversations ||
          nextProviderConversations !== state.providerConversations;
        const activeUnreadCleared = (state.activeConversation?.unreadCount ?? 0) === 0;

        if (isSameConversation) {
          const messagesAlreadyLoaded = state.messages.length > 0;

          if (messagesAlreadyLoaded && activeUnreadCleared && !listsChanged) {
            return;
          }

          const patch = {};
          if (!activeUnreadCleared || listsChanged) {
            patch.activeConversation = {
              ...(state.activeConversation ?? conversation),
              unreadCount: 0,
            };
          }
          if (listsChanged) {
            patch.conversations = nextConversations;
            patch.providerConversations = nextProviderConversations;
          }
          if (!messagesAlreadyLoaded) {
            patch.messages = cachedMessages;
            patch.isLoading = false;
          }

          if (Object.keys(patch).length > 0) {
            set(patch);
          }
          return;
        }

        set({
          activeConversation: { ...conversation, unreadCount: 0 },
          isLoading: false,
          messages: cachedMessages,
          conversations: nextConversations,
          providerConversations: nextProviderConversations,
        });
      },

      sendMessage: async (content, options = {}) => {
        const conv = get().activeConversation;
        if (!conv) return;
        if (!canSendWhileFlagged(conv)) return false;

        const newMsg = {
          id: `msg_${Date.now()}`,
          conversationId: conv.id,
          senderId: "current_user",
          content,
          type: "text",
          status: "sending",
          replyToId: options.replyToId ?? null,
          createdAt: new Date().toISOString(),
        };
        set((s) => {
          const nextConversations = withFlaggedQuotaConsumed(
            s.conversations.map((item) =>
              item.id === conv.id
                ? { ...item, lastMessage: content, lastMessageAt: newMsg.createdAt }
                : item,
            ),
            conv.id,
          );
          const nextActive =
            s.activeConversation?.id === conv.id
              ? (nextConversations.find((item) => item.id === conv.id) ??
                s.activeConversation)
              : s.activeConversation;

          return {
            messages: [...s.messages, newMsg],
            conversations: nextConversations,
            activeConversation: nextActive,
          };
        });
        await delay(500);
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === newMsg.id ? { ...m, status: "sent" } : m,
          ),
        }));
        set({ isTyping: true });
        await delay(1500);
        const reply = {
          id: `msg_${Date.now() + 1}`,
          conversationId: conv.id,
          senderId: conv.participantId,
          content: "Thanks for your message! I'll get back to you shortly.",
          type: "text",
          status: "delivered",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          messages: [...s.messages, reply],
          isTyping: false,
          conversations: s.conversations.map((item) =>
            item.id === conv.id
              ? {
                  ...item,
                  lastMessage: reply.content,
                  lastMessageAt: reply.createdAt,
                }
              : item,
          ),
        }));
      },

      sendVoiceMessage: async ({ blob, durationMs, durationLabel }) => {
        const conv = get().activeConversation;
        if (!conv || !blob) return;
        if (!canSendWhileFlagged(conv)) return false;

        const audioUrl = URL.createObjectURL(blob);
        const preview = `Voice message (${durationLabel})`;
        const newMsg = {
          id: `msg_${Date.now()}`,
          conversationId: conv.id,
          senderId: "current_user",
          content: durationLabel,
          type: "audio",
          audioUrl,
          durationMs,
          status: "sending",
          createdAt: new Date().toISOString(),
        };

        set((s) => {
          const nextConversations = withFlaggedQuotaConsumed(
            s.conversations.map((item) =>
              item.id === conv.id
                ? { ...item, lastMessage: preview, lastMessageAt: newMsg.createdAt }
                : item,
            ),
            conv.id,
          );
          const nextActive =
            s.activeConversation?.id === conv.id
              ? (nextConversations.find((item) => item.id === conv.id) ??
                s.activeConversation)
              : s.activeConversation;

          return {
            messages: [...s.messages, newMsg],
            conversations: nextConversations,
            activeConversation: nextActive,
          };
        });

        await delay(500);
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === newMsg.id ? { ...m, status: "sent" } : m,
          ),
        }));
      },

      sendAttachmentMessage: async ({
        file,
        fileUrl,
        fileName,
        mimeType,
        attachmentKind,
      }) => {
        const conv = get().activeConversation;
        if (!conv || !file || !fileUrl) return;
        if (!canSendWhileFlagged(conv)) return false;

        const preview = attachmentKind === "image" ? "Photo" : fileName;
        const newMsg = {
          id: `msg_${Date.now()}`,
          conversationId: conv.id,
          senderId: "current_user",
          content: fileName,
          type: attachmentKind === "image" ? "image" : "file",
          attachmentUrl: fileUrl,
          fileName,
          mimeType,
          fileSize: file.size,
          status: "sending",
          createdAt: new Date().toISOString(),
        };

        set((s) => {
          const nextConversations = withFlaggedQuotaConsumed(
            s.conversations.map((item) =>
              item.id === conv.id
                ? { ...item, lastMessage: preview, lastMessageAt: newMsg.createdAt }
                : item,
            ),
            conv.id,
          );
          const nextActive =
            s.activeConversation?.id === conv.id
              ? (nextConversations.find((item) => item.id === conv.id) ??
                s.activeConversation)
              : s.activeConversation;

          return {
            messages: [...s.messages, newMsg],
            conversations: nextConversations,
            activeConversation: nextActive,
          };
        });

        await delay(500);
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === newMsg.id ? { ...m, status: "sent" } : m,
          ),
        }));
      },

      upsertConversation: (conversation) => {
        if (!conversation) return;
        set((state) => {
          const exists = state.conversations.some(
            (item) => item.id === conversation.id,
          );
          if (exists) {
            return {
              conversations: state.conversations.map((item) =>
                item.id === conversation.id ? { ...item, ...conversation } : item,
              ),
            };
          }
          return { conversations: [conversation, ...state.conversations] };
        });
      },

      toggleMessageReaction: (messageId, emoji) => {
        set((state) => ({
          messages: state.messages.map((message) => {
            if (message.id !== messageId) return message;

            const reactions = Array.isArray(message.reactions)
              ? [...message.reactions]
              : [];
            const existingIndex = reactions.findIndex(
              (reaction) =>
                reaction.userId === "current_user" && reaction.emoji === emoji,
            );

            if (existingIndex >= 0) {
              reactions.splice(existingIndex, 1);
            } else {
              reactions.push({ emoji, userId: "current_user" });
            }

            return { ...message, reactions };
          }),
        }));
      },

      deleteMessage: (messageId, options = {}) => {
        if (!messageId) return false;

        const scope = options.scope === "everyone" ? "everyone" : "me";

        set((state) => {
          const updatedMessages = state.messages.map((message) => {
            if (message.id !== messageId) return message;
            return {
              ...message,
              type: "text",
              content: "",
              isDeleted: true,
              deletedScope: scope,
              deletedAt: new Date().toISOString(),
              isPinned: false,
              pinnedAt: null,
              reactions: [],
              attachmentUrl: null,
              audioUrl: null,
              fileName: null,
              replyToId: null,
              isEdited: false,
            };
          });

          const convId = state.activeConversation?.id;
          if (convId) messageMap[convId] = updatedMessages;

          const preview =
            scope === "everyone"
              ? "This message was deleted"
              : "You deleted this message";

          return {
            messages: updatedMessages,
            conversations: convId
              ? state.conversations.map((item) =>
                  item.id === convId
                    ? {
                        ...item,
                        lastMessage: preview,
                        lastMessageAt: new Date().toISOString(),
                      }
                    : item,
                )
              : state.conversations,
          };
        });

        return true;
      },

      editMessage: (messageId, content) => {
        const text = typeof content === "string" ? content.trim() : "";
        if (!messageId || !text) return false;

        set((state) => {
          const updatedMessages = state.messages.map((message) => {
            if (message.id !== messageId) return message;
            return {
              ...message,
              content: text,
              isEdited: true,
              editedAt: new Date().toISOString(),
            };
          });

          const convId = state.activeConversation?.id;
          if (convId) messageMap[convId] = updatedMessages;

          const lastMessage = updatedMessages[updatedMessages.length - 1];
          return {
            messages: updatedMessages,
            conversations:
              lastMessage?.id === messageId && convId
                ? state.conversations.map((item) =>
                    item.id === convId ? { ...item, lastMessage: text } : item,
                  )
                : state.conversations,
          };
        });

        return true;
      },

      pinMessage: (messageId) => {
        set((state) => {
          const updatedMessages = state.messages.map((message) => {
            if (message.id !== messageId) return message;

            const isPinned = !message.isPinned;
            return {
              ...message,
              isPinned,
              pinnedAt: isPinned ? new Date().toISOString() : null,
            };
          });
          const convId = state.activeConversation?.id;
          if (convId) messageMap[convId] = updatedMessages;
          return { messages: updatedMessages };
        });
      },

      blockedParticipantIds: [],

      clearChat: (conversationId) => {
        if (!conversationId) return false;

        messageMap[conversationId] = [];

        set((state) => ({
          messages:
            state.activeConversation?.id === conversationId ? [] : state.messages,
          conversations: state.conversations.map((item) =>
            item.id === conversationId
              ? {
                  ...item,
                  lastMessage: "",
                  lastMessageAt: new Date().toISOString(),
                  unreadCount: 0,
                }
              : item,
          ),
          activeConversation:
            state.activeConversation?.id === conversationId
              ? {
                  ...state.activeConversation,
                  lastMessage: "",
                  lastMessageAt: new Date().toISOString(),
                  unreadCount: 0,
                }
              : state.activeConversation,
        }));

        return true;
      },

      blockParticipant: (participantId) => {
        if (!participantId) return false;

        set((state) => {
          const blockedIds = state.blockedParticipantIds.includes(participantId)
            ? state.blockedParticipantIds
            : [...state.blockedParticipantIds, participantId];

          const removedConversation = state.conversations.find(
            (item) => item.participantId === participantId,
          );

          if (removedConversation) {
            messageMap[removedConversation.id] = [];
          }

          const isActiveBlocked =
            state.activeConversation?.participantId === participantId;

          return {
            blockedParticipantIds: blockedIds,
            conversations: state.conversations.filter(
              (item) => item.participantId !== participantId,
            ),
            messages: isActiveBlocked ? [] : state.messages,
            activeConversation: isActiveBlocked ? null : state.activeConversation,
            isTyping: isActiveBlocked ? false : state.isTyping,
          };
        });

        return true;
      },

      flagConversation: (conversationId, payload = {}) => {
        if (!conversationId) return false;

        const current = get().conversations.find((item) => item.id === conversationId);
        if (!current) return false;
        if (current.isFlagged) return "already";

        const flaggedPatch = {
          isFlagged: true,
          flaggedAt: new Date().toISOString(),
          flaggedMessageLimit: FLAGGED_MESSAGE_LIMIT,
          flaggedMessagesRemaining: FLAGGED_MESSAGE_LIMIT,
          flagReason: payload.reason ?? null,
          flagReasonLabel: payload.reasonLabel ?? null,
          flagDescription: payload.description ?? "",
        };

        set((state) => ({
          conversations: state.conversations.map((item) =>
            item.id === conversationId ? { ...item, ...flaggedPatch } : item,
          ),
          activeConversation:
            state.activeConversation?.id === conversationId
              ? { ...state.activeConversation, ...flaggedPatch }
              : state.activeConversation,
        }));

        return true;
      },

      reportParticipant: (_participantId, _payload) => true,

      forwardMessage: async (message, targetConversationIds) => {
        const conv = get().activeConversation;
        const targets = Array.isArray(targetConversationIds)
          ? targetConversationIds
          : [targetConversationIds];

        if (!message || !targets.length) return false;

        const preview =
          message.type === "image"
            ? "Photo"
            : message.type === "file"
              ? message.fileName || "Document"
              : message.type === "audio"
                ? "Voice message"
                : message.content;

        let nextMessages = get().messages;
        let nextConversations = get().conversations;

        targets.forEach((targetConversationId, index) => {
          const forwardedMsg = {
            id: `msg_${Date.now()}_${index}`,
            conversationId: targetConversationId,
            senderId: "current_user",
            content: message.content,
            type: message.type,
            attachmentUrl: message.attachmentUrl,
            fileName: message.fileName,
            mimeType: message.mimeType,
            audioUrl: message.audioUrl,
            durationMs: message.durationMs,
            forwardedFrom: conv?.participantName ?? "Chat",
            status: "sent",
            createdAt: new Date().toISOString(),
          };

          const targetMessages = messageMap[targetConversationId] ?? [];
          messageMap[targetConversationId] = [...targetMessages, forwardedMsg];

          nextConversations = nextConversations.map((item) =>
            item.id === targetConversationId
              ? {
                  ...item,
                  lastMessage: `Forwarded: ${preview}`,
                  lastMessageAt: forwardedMsg.createdAt,
                }
              : item,
          );

          if (conv?.id === targetConversationId) {
            nextMessages = [...nextMessages, forwardedMsg];
          }
        });

        set({
          conversations: nextConversations,
          messages: nextMessages,
        });

        await delay(300);
        return true;
      },
    }),
    { name: "ChatStore" },
  ),
);
