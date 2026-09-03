"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { id: "clear", label: "Clear Chat", tone: "default" },
  { id: "report", label: "Report", tone: "default" },
  { id: "flag", label: "Flag", tone: "default" },
];

export function ChatHeaderMenu({ onClear, onReport, onFlag, className }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (id) => {
    setOpen(false);

    if (id === "clear") {
      onClear?.();
      return;
    }

    if (id === "report") {
      onReport?.();
      return;
    }

    if (id === "flag") {
      onFlag?.();
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Chat options"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className="hover:border-border flex size-10 items-center justify-center rounded-full border border-transparent text-[#4D5972] transition-colors md:size-11"
      >
        <MoreVertical className="size-5" strokeWidth={2} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+0.375rem)] right-0 z-50 min-w-[148px] overflow-hidden rounded-xl border border-[#EEF2F7] bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
        >
          {MENU_ITEMS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(item.id)}
              className={cn(
                "flex w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#F8FAFC]",
                item.tone === "danger" ? "text-[#EF4444]" : "text-[#111827]",
                index > 0 && "border-t border-[#F1F5F9]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
