import { avatarUrl, generateId, isoDate, MOCK_REFERENCE_MS } from "./helpers";
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
    const base = MOCK_REFERENCE_MS - 2 * 60 * 60 * 1000;
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
        content:
          "That's good to hear. We'll review your progress in the upcoming appointment.",
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
        ? [
            "Hi, I'd like to book an appointment.",
            "What are your available slots?",
            "That works for me!",
            "Thank you!",
          ][i % 4]
        : [
            "Hello! How can I help you today?",
            "We have slots at 2 PM and 4 PM.",
            "Great! I've confirmed your booking.",
            "You're welcome! See you soon.",
          ][i % 4],
      type: "text",
      status: ["sent", "delivered", "seen"][Math.min(i % 3, 2)],
      createdAt: isoDate(ci + i),
      replyToId: i === 2 ? generateId("msg", ci * 100 + 1) : null,
      reactions: i % 5 === 0 ? [{ emoji: "👍", userId: conv.participantId }] : [],
    };
  });
});

/** Demo-day timestamps (IST) so list labels match Figma on the current demo date. */
function providerChatTime(daysAgo = 0, hour = 12, minute = 0) {
  const day = String(9 - daysAgo).padStart(2, "0");
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `2026-10-${day}T${hh}:${mm}:00+05:30`;
}

const PROVIDER_CHAT_SEED = [
  {
    name: "Jully Williams",
    lastMessage: "Looking forward to our next session.",
    lastMessageAt: providerChatTime(0, 10, 30),
    unreadCount: 3,
    isOnline: true,
  },
  {
    name: "Ravi Sharma",
    lastMessage: "Thank you for your guidance!",
    lastMessageAt: providerChatTime(0, 9, 20),
    unreadCount: 1,
    isOnline: true,
  },
  {
    name: "Amit Verma",
    lastMessage: "Can you share the diet plan?",
    lastMessageAt: providerChatTime(1, 18, 40),
    unreadCount: 0,
    isOnline: false,
  },
  {
    name: "Zara Lucknow",
    lastMessage: "Please Call Me At Evening",
    lastMessageAt: providerChatTime(1, 16, 15),
    unreadCount: 0,
    isOnline: true,
  },
  {
    name: "Priya Mehta",
    lastMessage: "I'll be 5 minutes late.",
    lastMessageAt: providerChatTime(2, 14, 0),
    unreadCount: 0,
    isOnline: false,
  },
  {
    name: "Karan Malhotra",
    lastMessage: "I'll be 5 minutes late.",
    lastMessageAt: providerChatTime(3, 11, 30),
    unreadCount: 0,
    isOnline: true,
  },
  {
    name: "Johan Dou",
    lastMessage: "I'll be 5 minutes late.",
    lastMessageAt: providerChatTime(4, 15, 45),
    unreadCount: 0,
    isOnline: false,
  },
  {
    name: "Vikram Singh",
    lastMessage: "I'll be 5 minutes late.",
    lastMessageAt: providerChatTime(5, 10, 10),
    unreadCount: 0,
    isOnline: true,
  },
];

export const providerConversations = PROVIDER_CHAT_SEED.map((seed, i) => ({
  id: generateId("pconv", i + 1),
  participantId: generateId("user", i + 1),
  participantName: seed.name,
  participantAvatar: avatarUrl(`pconv-${i}`),
  participantRole: "user",
  lastMessage: seed.lastMessage,
  lastMessageAt: seed.lastMessageAt,
  unreadCount: seed.unreadCount,
  isOnline: seed.isOnline,
  isPinned: i < 2,
}));

providerConversations.forEach((conv, ci) => {
  // Zara Lucknow — rich thread matching Figma (voice call + ticks)
  if (ci === 3) {
    const base = Date.parse(providerChatTime(1, 10, 0));
    messages[conv.id] = [
      {
        id: generateId("pmsg", 301),
        conversationId: conv.id,
        senderId: conv.participantId,
        content: "Hello! I wanted to check about my appointment tomorrow.",
        type: "text",
        status: "seen",
        createdAt: new Date(base).toISOString(),
      },
      {
        id: generateId("pmsg", 302),
        conversationId: conv.id,
        senderId: mockProviders[0].id,
        content: "Hi Zara! Yes, you're scheduled for 4 PM. Does that still work?",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 8 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("pmsg", 303),
        conversationId: conv.id,
        senderId: conv.participantId,
        content: "Perfect, thank you. Also, can we do a quick call later?",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 15 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("pmsg", 304),
        conversationId: conv.id,
        senderId: mockProviders[0].id,
        content: "00:56 min",
        durationLabel: "00:56 min",
        type: "call",
        status: "seen",
        createdAt: new Date(base + 35 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("pmsg", 305),
        conversationId: conv.id,
        senderId: conv.participantId,
        content: "Please Call Me At Evening",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId("pmsg", 306),
        conversationId: conv.id,
        senderId: mockProviders[0].id,
        content: "Sure, I'll call you around 7 PM.",
        type: "text",
        status: "seen",
        createdAt: new Date(base + 6 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      },
    ];
    return;
  }

  messages[conv.id] = Array.from({ length: 8 }, (_, i) => {
    const isClient = i % 2 === 0;
    return {
      id: generateId("pmsg", ci * 100 + i + 1),
      conversationId: conv.id,
      senderId: isClient ? conv.participantId : mockProviders[0].id,
      content: isClient
        ? [
            "Hi, I have a question about my booking.",
            conv.lastMessage,
            "That sounds great, thank you!",
            "See you soon.",
          ][i % 4]
        : [
            "Sure, how can I assist you?",
            "Happy to help with that.",
            "You're welcome!",
            "Looking forward to our session.",
          ][i % 4],
      type: "text",
      status: "seen",
      createdAt: providerChatTime(ci, 9 + i, (i * 7) % 60),
    };
  });
});

export function getConversationById(id) {
  return (
    conversations.find((c) => c.id === id) ||
    providerConversations.find((c) => c.id === id)
  );
}

export function getMessages(conversationId) {
  return messages[conversationId] || [];
}

export function getConversationByProviderId(providerId) {
  return conversations.find((conv) => conv.participantId === providerId);
}

export function getOrCreateConversationForProvider(providerId, appointment) {
  const existing = getConversationByProviderId(providerId);
  if (existing) return existing;

  const provider = mockProviders.find((item) => item.id === providerId);
  if (!provider) return null;

  const conversation = {
    id: generateId("conv", conversations.length + 1),
    participantId: providerId,
    participantName: appointment?.providerName || provider.businessName,
    participantAvatar: appointment?.providerAvatar || provider.avatar,
    participantRole: "provider",
    lastMessage: appointment
      ? `Your ${appointment.serviceName} appointment is confirmed for ${appointment.scheduledTime}.`
      : "Start a conversation",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
  };

  conversations.unshift(conversation);
  messages[conversation.id] = appointment
    ? [
        {
          id: generateId("msg", Date.now()),
          conversationId: conversation.id,
          senderId: providerId,
          content: `Hello! Your ${appointment.serviceName} booking on ${appointment.scheduledDate} at ${appointment.scheduledTime} is confirmed.`,
          type: "text",
          status: "seen",
          createdAt: new Date().toISOString(),
        },
      ]
    : [];

  return conversation;
}
