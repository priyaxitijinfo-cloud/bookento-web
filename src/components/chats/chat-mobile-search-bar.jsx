"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function ChatMobileSearchBar({ value, onChange, onClose, className }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={cn(
        "safe-top sticky top-0 z-30 shrink-0 border-b border-[#F0F0F0] bg-white md:hidden",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-3 px-4">
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search..."
          className={cn(
            "min-w-0 flex-1 bg-transparent text-base leading-tight text-[#111827]",
            "outline-none placeholder:text-[#9CA3AF]",
          )}
        />
        <button
          type="button"
          aria-label="Close search"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F3F4F6]"
        >
          <X className="size-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
