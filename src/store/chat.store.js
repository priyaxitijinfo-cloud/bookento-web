import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { conversations, getMessages, providerConversations } from "@/mock/chat";
import { delay } from "@/mock/helpers";

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

      setActiveConversation: async (conversation) => {
        set({ activeConversation: conversation, isLoading: true });
        await delay(300);
        const msgs = getMessages(conversation.id);
        set({ messages: msgs, isLoading: false });
      },

      sendMessage: async (content) => {
        const conv = get().activeConversation;
        if (!conv) return;
        const newMsg = {
          id: `msg_${Date.now()}`,
          conversationId: conv.id,
          senderId: "current_user",
          content,
          type: "text",
          status: "sending",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, newMsg] }));
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
        }));
      },
    }),
    { name: "ChatStore" },
  ),
);
