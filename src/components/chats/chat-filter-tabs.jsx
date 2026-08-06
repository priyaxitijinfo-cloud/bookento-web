"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "new", label: "New" },
];

export function ChatFilterTabs({ value, onChange, counts = {} }) {
  const scrollRef = useRef(null);

  const handleSelect = (tabId) => {
    const scrollLeft = scrollRef.current?.scrollLeft ?? 0;
    onChange(tabId);

    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft;
      }
    });
  };

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide -mx-1.5 flex gap-2 overflow-x-auto px-1.5 py-1.5 md:gap-2.5"
    >
      {TABS.map((tab) => {
        const isActive = value === tab.id;
        const count = counts[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              "inline-flex h-9 min-h-9 shrink-0 appearance-none items-center justify-center rounded-full px-4 text-sm font-medium outline-none",
              "select-none transition-colors duration-150",
              isActive
                ? "bg-primary text-white shadow-[0_2px_8px_rgba(24,101,234,0.28)]"
                : "bg-background text-foreground ring-1 ring-[#E5E7EB] ring-inset hover:bg-[#F8FAFC]",
            )}
          >
            {tab.label}
            {typeof count === "number" && count > 0 && tab.id !== "all" ? (
              <span className={cn("ml-1.5 tabular-nums", isActive ? "text-white/90" : "text-muted-foreground")}>
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
