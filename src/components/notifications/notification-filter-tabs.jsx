"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

export const NOTIFICATION_FILTERS = [
  { id: "all", label: "All" },
  { id: "booking", label: "Bookings" },
  { id: "chat", label: "Messages" },
  { id: "promo", label: "Offers" },
];

export function NotificationFilterTabs({ value, onChange }) {
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
      className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-1 md:gap-2.5 md:px-5 md:py-1.5"
    >
      {NOTIFICATION_FILTERS.map((tab) => {
        const isActive = value === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              "inline-flex h-9 min-h-9 shrink-0 appearance-none items-center justify-center rounded-lg px-4 text-sm font-medium outline-none",
              "select-none transition-colors duration-150",
              isActive
                ? "gradient-brand text-white"
                : "bg-background text-foreground ring-1 ring-[#E5E7EB] ring-inset",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
