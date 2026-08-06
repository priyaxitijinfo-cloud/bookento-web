"use client";

import { useEffect, useRef } from "react";

import { MessageBubble } from "@/components/chats/message-bubble";
import { currentUser } from "@/mock/users";
import { cn } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
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

export function Conversation({
  messages,
  isTyping = false,
  isLoading = false,
  className,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (isLoading) {
    return (
      <div className={cn("flex flex-1 items-center justify-center", className)}>
        <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={cn("scrollbar-hide min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5", className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((msg) => {
          const isOwn = msg.senderId === "current_user" || msg.senderId === currentUser.id;
          return <MessageBubble key={msg.id} message={msg} isOwn={isOwn} />;
        })}
        {isTyping ? <TypingIndicator /> : null}
        <div ref={endRef} />
      </div>
    </div>
  );
}
