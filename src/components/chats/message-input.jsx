"use client";

import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

function VoiceIcon({ className }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-[30px]", className)}
      aria-hidden
    >
      <path
        d="M13.4166 12.0418C13.4166 10.8263 13.8995 9.66047 14.759 8.80092C15.6185 7.94138 16.7843 7.4585 17.9999 7.4585C19.2155 7.4585 20.3813 7.94138 21.2408 8.80092C22.1003 9.66047 22.5832 10.8263 22.5832 12.0418V17.0835C22.5832 18.2991 22.1003 19.4649 21.2408 20.3244C20.3813 21.1839 19.2155 21.6668 17.9999 21.6668C16.7843 21.6668 15.6185 21.1839 14.759 20.3244C13.8995 19.4649 13.4166 18.2991 13.4166 17.0835V12.0418Z"
        fill="#4D5972"
      />
      <path
        d="M18.0054 23.4999H17.9944C16.717 23.4988 15.4689 23.1166 14.41 22.4021C13.351 21.6877 12.5292 20.6736 12.0499 19.4895C11.9576 19.2658 11.7805 19.0876 11.5574 18.9939C11.3342 18.9002 11.083 18.8985 10.8587 18.9893C10.6343 19.08 10.4549 19.2558 10.3597 19.4784C10.2645 19.7009 10.2611 19.952 10.3504 20.177C10.9087 21.5556 11.8291 22.7577 13.0142 23.6564C14.1993 24.5551 15.6052 25.1171 17.0833 25.2828V28.0833C17.0833 28.3264 17.1798 28.5595 17.3518 28.7314C17.5237 28.9034 17.7568 28.9999 17.9999 28.9999C18.2431 28.9999 18.4762 28.9034 18.6481 28.7314C18.82 28.5595 18.9166 28.3264 18.9166 28.0833V25.2828C20.3948 25.1172 21.8009 24.5554 22.9862 23.6566C24.1715 22.7579 25.092 21.5557 25.6504 20.177C25.7397 19.952 25.7363 19.7009 25.6411 19.4784C25.5459 19.2558 25.3665 19.08 25.1421 18.9893C24.9177 18.8985 24.6666 18.9002 24.4434 18.9939C24.2203 19.0876 24.0432 19.2658 23.9509 19.4895C23.4716 20.6738 22.6497 21.6881 21.5905 22.4026C20.5314 23.117 19.2831 23.4991 18.0054 23.4999Z"
        fill="#4D5972"
      />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <img
      src="/icons/send.svg"
      alt=""
      width={20}
      height={20}
      className={cn("size-5", className)}
      draggable={false}
    />
  );
}

export function MessageInput({ onSend, disabled = false, className }) {
  const [value, setValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    setValue("");
    await onSend?.(text);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "border-t border-[#EEF2F7] bg-background p-4 md:p-5",
        "pb-[max(1rem,env(safe-area-inset-bottom,0px))] md:pb-5",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
        <button
          type="button"
          aria-label="Add attachment"
          onClick={() => toast.message("Attachments coming soon")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)] transition-opacity hover:opacity-95 md:size-11"
        >
          <span className="relative top-[2px] text-[28px] leading-none font-light" aria-hidden>
            +
          </span>
        </button>

        <div className="relative min-w-0 flex-1 -mx-[5px]">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a message..."
            disabled={disabled}
            className="border-border/70 bg-[#F8FAFC] placeholder:text-muted-foreground h-11 w-full rounded-full border py-0 pr-11 pl-4 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/20 md:h-12 md:text-[15px]"
          />
          <button
            type="button"
            aria-label="Voice message"
            onClick={() => toast.message("Voice messages coming soon")}
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-[#E2E8F0]"
          >
            <VoiceIcon />
          </button>
        </div>

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 md:size-11"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}
