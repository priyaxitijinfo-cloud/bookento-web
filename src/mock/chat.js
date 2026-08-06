import { avatarUrl, generateId, isoDate, personName } from "./helpers";
import { appointments } from "./appointments";
import { mockProviders } from "./providers";
import { currentUser } from "./users";

const SAMPLE_LAST_MESSAGES = [
  "Looking forward to our next session.",
  "Thank you for your guidance!",
  "Can we reschedule to next week?",
  "Your appointment is confirmed for tomorrow!",
  "Is there anything else I can help with?",
];

export const conversations = Array.from({ length: 12 }, (_, i) => {
  const provider = mockProviders[i % mockProviders.length];
  const linkedAppointment = appointments.find((apt) => apt.providerId === provider.id);

  return {
    id: generateId("conv", i + 1),
    participantId: provider.id,
    participantName: provider.businessName,
    participantAvatar: provider.avatar,
    participantRole: "provider",
    lastMessage: linkedAppointment
      ? `Your ${linkedAppointment.serviceName} appointment is confirmed for ${linkedAppointment.scheduledTime}.`
      : SAMPLE_LAST_MESSAGES[i % SAMPLE_LAST_MESSAGES.length],
    lastMessageAt: isoDate(i === 0 ? 0 : i),
    unreadCount: i === 0 ? 3 : i === 1 ? 1 : i % 5 === 0 ? 2 : 0,
    isOnline: i % 3 !== 0,
    isPinned: i < 2,
  };
});

export const messages = {};

conversations.forEach((conv, ci) => {
  if (ci === 0) {
    const base = Date.now() - 2 * 60 * 60 * 1000;
    messages[conv.id] = [
      {
        id: generateId("msg", 1),
        conversationId: conv.id,
        senderId: conv.participantId,
        content: `Hello! This is ${conv.participantName}. How are you feeling today?`,
        type: "text",
        status: "seen",
        createdAt: new Date(base).toISOString(),
      },
      {
        id: generateId("msg", 2),
        conversationId: conv.id,
        senderId: currentUser.id,
        content: "Hi! Feeling a bit better, thank you for asking.",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 5 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("msg", 3),
        conversationId: conv.id,
        senderId: conv.participantId,
        content: "That's good to hear. We'll review your progress in the upcoming appointment.",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 12 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("msg", 4),
        conversationId: conv.id,
        senderId: currentUser.id,
        content: "Perfect. Should I prepare anything before we meet?",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 18 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("msg", 5),
        conversationId: conv.id,
        senderId: "system",
        content: "00:56 min",
        durationLabel: "00:56 min",
        type: "call",
        status: "seen",
        createdAt: new Date(base + 30 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("msg", 6),
        conversationId: conv.id,
        senderId: conv.participantId,
        content: "Just bring your previous reports if you have them handy.",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 40 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("msg", 7),
        conversationId: conv.id,
        senderId: currentUser.id,
        content: "Got it, thank you!",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 45 * 60 * 1000).toISOString(),
      },
    ];
    return;
  }

  messages[conv.id] = Array.from({ length: 10 + (ci % 6) }, (_, i) => {
    const isUser = i % 2 === 0;
    return {
      id: generateId("msg", ci * 100 + i + 1),
      conversationId: conv.id,
      senderId: isUser ? currentUser.id : conv.participantId,
      content: isUser
        ? ["Hi, I'd like to book an appointment.", "What are your available slots?", "That works for me!", "Thank you!"][i % 4]
        : ["Hello! How can I help you today?", "We have slots at 2 PM and 4 PM.", "Great! I've confirmed your booking.", "You're welcome! See you soon."][i % 4],
      type: "text",
      status: ["sent", "delivered", "seen"][Math.min(i % 3, 2)],
      createdAt: isoDate(ci + i),
      replyToId: i === 2 ? generateId("msg", ci * 100 + 1) : null,
      reactions: i % 5 === 0 ? [{ emoji: "👍", userId: conv.participantId }] : [],
    };
  });
});

export const providerConversations = Array.from({ length: 12 }, (_, i) => ({
  id: generateId("pconv", i + 1),
  participantId: generateId("user", i + 1),
  participantName: personName(i),
  participantAvatar: avatarUrl(`pconv-${i}`),
  participantRole: "user",
  lastMessage: "When is my next appointment?",
  lastMessageAt: isoDate(i),
  unreadCount: i % 3,
  isOnline: i % 2 === 0,
}));

providerConversations.forEach((conv, ci) => {
  messages[conv.id] = Array.from({ length: 10 }, (_, i) => ({
    id: generateId("pmsg", ci * 100 + i + 1),
    conversationId: conv.id,
    senderId: i % 2 === 0 ? conv.participantId : mockProviders[0].id,
    content: i % 2 === 0 ? "Hi, I have a question about my booking." : "Sure, how can I assist you?",
    type: "text",
    status: "seen",
    createdAt: isoDate(ci + i),
  }));
});

export function getConversationById(id) {
  return conversations.find((c) => c.id === id) || providerConversations.find((c) => c.id === id);
}

export function getMessages(conversationId) {
  return messages[conversationId] || [];
}

export function getConversationByProviderId(providerId) {
  return conversations.find((conv) => conv.participantId === providerId);
}
