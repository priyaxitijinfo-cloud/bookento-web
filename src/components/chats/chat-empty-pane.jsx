"use client";

import { cn } from "@/lib/utils";

export function ChatEmptyPane({ className }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col items-center justify-center bg-[#F8FAFC] px-6 text-center",
        className,
      )}
    >
      <div className="mb-2 size-[194px] opacity-90 md:size-48">
        <img
          src="/icons/chat-not-yet.png"
          alt=""
          className="size-full object-contain"
          draggable={false}
        />
      </div>
      <div className="space-y-1.5 md:space-y-0">
        <h2 className="md:text-foreground text-[18px] leading-7 font-semibold text-[#111827] md:mt-2 md:text-xl">
          Not Chats Yet
        </h2>
        <p className="md:text-muted-foreground max-w-[18.5rem] text-[13px] leading-relaxed text-[#64748B] md:mt-2 md:max-w-sm md:text-sm">
          Start a conversation about all your Service appointment.
        </p>
      </div>
    </div>
  );
}
