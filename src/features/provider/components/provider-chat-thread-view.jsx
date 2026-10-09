"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format, isValid, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { MessageBubble } from "@/components/chats/message-bubble";
import { MessageInput } from "@/components/chats/message-input";
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { getConversationById } from "@/mock/chat";
import { currentProvider } from "@/mock/providers";
import { useChatStore } from "@/store";
import { cn } from "@/lib/utils";

function formatMessageTime(date) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";
  return format(parsed, "h:mm a");
}

function CallIcon({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5", className)}
      aria-hidden
    >
      <path
        d="M16.2401 23.5136C9.00445 23.7491 -4.00214 10.7422 2.03886 3.68139L3.06214 2.78635C4.14256 1.73952 5.8515 1.75523 6.90594 2.82823C6.93192 2.8544 8.57852 5.01086 8.57852 5.01086C9.59661 6.08386 9.59141 7.77449 8.57332 8.84749L7.64873 9.95713C7.33707 10.3288 7.27474 10.8574 7.48771 11.2971C8.58371 13.5216 10.3706 15.3221 12.573 16.4318C13.0093 16.6516 13.5287 16.5888 13.9027 16.2695L15.0091 15.3326C16.0739 14.3067 17.7465 14.3067 18.8165 15.3274C18.8165 15.3274 20.9566 16.9866 20.9826 17.0128C22.0526 18.0962 22.0526 19.8497 20.9826 20.9331L20.1723 21.87C19.1334 22.9273 17.7205 23.5188 16.2401 23.5136Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ReadTicks() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-3.5"
      aria-label="Seen"
      role="img"
    >
      <path
        d="M1.60384 11.9627C1.42051 11.7794 1.33266 11.5655 1.3403 11.3211C1.34794 11.0766 1.44343 10.8627 1.62676 10.6794C1.81009 10.5114 2.02398 10.4235 2.26843 10.4159C2.51287 10.4082 2.72677 10.4961 2.9101 10.6794L6.16427 13.9336L6.4851 14.2544L6.80593 14.5752C6.98927 14.7586 7.0771 14.9725 7.06947 15.2169C7.06183 15.4614 6.96635 15.6752 6.78302 15.8586C6.59968 16.0266 6.38579 16.1145 6.14135 16.1221C5.89689 16.1297 5.68302 16.0419 5.49968 15.8586L1.60384 11.9627ZM11.3205 13.9106L19.1123 6.11898C19.2956 5.93565 19.5094 5.84781 19.7539 5.85544C19.9983 5.86308 20.2123 5.95856 20.3956 6.1419C20.5635 6.32523 20.6513 6.53912 20.659 6.78356C20.6667 7.02802 20.5789 7.2419 20.3956 7.42523L11.9622 15.8586C11.7788 16.0419 11.565 16.1336 11.3205 16.1336C11.0761 16.1336 10.8622 16.0419 10.6789 15.8586L6.78302 11.9627C6.61495 11.7947 6.53093 11.5846 6.53093 11.3325C6.53093 11.0804 6.61495 10.8627 6.78302 10.6794C6.96635 10.4961 7.18406 10.4044 7.43614 10.4044C7.68822 10.4044 7.90593 10.4961 8.08927 10.6794L11.3205 13.9106ZM15.1934 7.44815L11.9622 10.6794C11.7941 10.8475 11.5841 10.9315 11.332 10.9315C11.0799 10.9315 10.8622 10.8475 10.6789 10.6794C10.4955 10.4961 10.4038 10.2784 10.4038 10.0263C10.4038 9.77419 10.4955 9.55648 10.6789 9.37315L13.9101 6.1419C14.0781 5.97385 14.2882 5.88981 14.5403 5.88981C14.7924 5.88981 15.0101 5.97385 15.1934 6.1419C15.3768 6.32523 15.4684 6.54294 15.4684 6.79502C15.4684 7.0471 15.3768 7.26481 15.1934 7.44815Z"
        fill="#1865EA"
      />
    </svg>
  );
}

function ProviderVoiceCallCard({ message }) {
  const duration = message.durationLabel || message.content || "00:00 min";

  return (
    <div className="flex justify-end">
      <div className="flex max-w-[85%] flex-col items-end gap-1 md:max-w-[70%]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#EEF2F7] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
            <img src="/icons/call.svg" alt="" className="size-5" draggable={false} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111827]">Voice Call</p>
            <p className="mt-0.5 text-xs text-[#64748B]">{duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-[#94A3B8]">
          <span>{formatMessageTime(message.createdAt)}</span>
          <ReadTicks />
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-[0_2px_12px_rgba(77,89,114,0.12)]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-[#94A3B8]/70"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function isOwnMessage(msg) {
  return msg.senderId === "current_user" || msg.senderId === currentProvider.id;
}

export function ProviderChatThreadView() {
  const { id } = useParams();
  const conversationId = Array.isArray(id) ? id[0] : id;
  const conversation = getConversationById(conversationId);

  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const isLoading = useChatStore((s) => s.isLoading);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const sendVoiceMessage = useChatStore((s) => s.sendVoiceMessage);
  const sendAttachmentMessage = useChatStore((s) => s.sendAttachmentMessage);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    const conv = getConversationById(conversationId);
    if (conv) setActiveConversation(conv);
  }, [conversationId, setActiveConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-[#F4F7FF]">
        <header className="sticky top-0 z-30 border-b border-[#E8EEF8] bg-white">
          <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 lg:px-6">
            <Link
              href={ROUTES.PROVIDER_CHATS}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F3F4F6]"
              aria-label="Back"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-lg font-bold text-[#111827]">Chat</h1>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground text-sm">Conversation not found.</p>
        </main>
      </div>
    );
  }

  const handleSend = async (text) => {
    if (!text?.trim()) return;
    await sendMessage(text.trim());
  };

  const handleCall = () => {
    toast.message("Voice call", {
      description: "Calling will be available soon.",
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#EEF2F7] bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 lg:px-6">
          <Link
            href={ROUTES.PROVIDER_CHATS}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F3F4F6]"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <Avatar
            src={conversation.participantAvatar}
            name={conversation.participantName}
            size="md"
            className="size-10 shrink-0 sm:size-11"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-[#111827] sm:text-base">
              {conversation.participantName}
            </p>
            {conversation.isOnline ? (
              <p className="flex items-center gap-1.5 text-xs text-[#22C55E]">
                <span
                  className="size-1.5 shrink-0 rounded-full bg-[#22C55E]"
                  aria-hidden
                />
                Online
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">Offline</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleCall}
            aria-label="Voice call"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F3F4F6]"
          >
            <CallIcon />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "scrollbar-hide relative min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6",
          "bg-[url('/icons/chat-bg.jpg')] bg-cover bg-center bg-no-repeat",
        )}
      >
        {isLoading ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            Loading messages...
          </p>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {messages.map((msg) => {
              if (msg.type === "call") {
                return <ProviderVoiceCallCard key={msg.id} message={msg} />;
              }

              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={isOwnMessage(msg)}
                  participantAvatar={conversation.participantAvatar}
                  participantName={conversation.participantName}
                />
              );
            })}
            {isTyping ? <TypingIndicator /> : null}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-3xl shrink-0">
        <MessageInput
          onSend={handleSend}
          onSendVoice={sendVoiceMessage}
          onSendAttachment={sendAttachmentMessage}
        />
      </div>
    </div>
  );
}
