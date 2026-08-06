"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes.constants";
import { getConversationById } from "@/mock/chat";
import { currentProvider } from "@/mock/providers";
import { useChatStore } from "@/store";
import { formatRelativeTime } from "@/utils/format.utils";

export default function ProviderChatDetailPage() {
  const { id } = useParams();
  const conversation = getConversationById(id);
  const { messages, setActiveConversation, sendMessage, isTyping, isLoading } = useChatStore();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (conversation) setActiveConversation(conversation);
  }, [conversation, setActiveConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!conversation) {
    return (
      <>
        <ProviderHeader title="Chat" />
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Conversation not found.</p>
        </main>
      </>
    );
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = text.trim();
    setText("");
    await sendMessage(msg);
  };

  return (
    <>
      <ProviderHeader title={conversation.participantName} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.PROVIDER_CHATS}>
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <Avatar src={conversation.participantAvatar} name={conversation.participantName} size="md" />
          <div>
            <p className="font-semibold">{conversation.participantName}</p>
            <p className="text-muted-foreground text-xs">
              {conversation.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 lg:p-6">
          {isLoading ? (
            <p className="text-muted-foreground text-center text-sm">Loading messages...</p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentProvider.id || msg.senderId === "current_user";
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? "gradient-brand text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${isMine ? "text-white/70" : "text-muted-foreground"}`}>
                      {formatRelativeTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="bg-muted-foreground size-1.5 animate-bounce rounded-full" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="border-border flex gap-2 border-t p-4">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="size-4" />
          </Button>
        </form>
      </main>
    </>
  );
}
