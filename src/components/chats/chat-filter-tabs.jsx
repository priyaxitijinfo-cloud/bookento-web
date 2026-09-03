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
      className="scrollbar-hide flex gap-2 overflow-x-auto max-md:gap-2 md:-mx-1.5 md:gap-2.5 md:px-1.5 md:py-1.5"
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
              "inline-flex shrink-0 appearance-none items-center justify-center border font-semibold outline-none",
              "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out select-none",
              "max-md:h-[34px] max-md:min-w-[56px] max-md:rounded-lg max-md:px-4 max-md:text-[13px]",
              "md:h-9 md:min-h-9 md:rounded-xl md:px-4 md:text-sm",
              isActive
                ? "profile-tab-active border-transparent text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)]"
                : "hover:text-foreground border-[#E6E8EF] bg-white text-[#5B6B8C] hover:border-[#D8DBE5] hover:bg-[#F4F4F8] max-md:border-[#E5E7EB] max-md:bg-white max-md:text-[#374151]",
            )}
          >
            {tab.label}
            {typeof count === "number" && count > 0 && tab.id !== "all" ? (
              <span
                className={cn(
                  "ml-1.5 tabular-nums max-md:hidden",
                  isActive ? "text-white/90" : "text-muted-foreground",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
