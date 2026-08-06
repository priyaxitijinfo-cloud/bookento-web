"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "confirm", label: "Confirm" },
  { id: "cancelled", label: "Cancelled" },
  { id: "completed", label: "Completed" },
];

const MOBILE_ACTIVE_STYLES = {
  pending: "max-md:border-[#F5C518] max-md:bg-[#FFF9E8] max-md:text-[#D4A017]",
  confirm: "max-md:border-primary max-md:bg-[#EAF3FF] max-md:text-primary",
  cancelled: "max-md:border-[#F13339] max-md:bg-[#FEF3F3] max-md:text-[#F13339]",
  completed: "max-md:border-[#05B21F] max-md:bg-[#EBF9ED] max-md:text-[#05B21F]",
};

export function BookingTabBar({ value, onChange, counts = {} }) {
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
      className="scrollbar-hide -mx-4 -mt-[15px] flex gap-2.5 overflow-x-auto px-4 py-2.5 md:-mx-6 md:mt-0 md:gap-3 md:px-6 md:py-3"
    >
      {TABS.map((tab) => {
        const isActive = value === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              "inline-flex h-9 min-h-9 shrink-0 appearance-none items-center justify-center rounded-full px-4 text-sm font-medium outline-none md:h-10 md:min-h-10 md:rounded-lg",
              "select-none transition-[box-shadow,colors,background] duration-200 ease-out",
              isActive
                ? cn(
                    "max-md:border",
                    MOBILE_ACTIVE_STYLES[tab.id],
                    "md:gradient-brand md:border-0 md:text-white md:shadow-[0_2px_8px_rgba(24,101,234,0.22)] md:hover:opacity-95",
                  )
                : "max-md:border max-md:border-border max-md:bg-background max-md:text-foreground md:bg-card md:text-muted-foreground md:ring-1 md:ring-border md:ring-inset md:hover:bg-background md:hover:text-foreground md:hover:ring-primary/30",
            )}
          >
            <span className="md:hidden">{tab.label}</span>
            <span className="hidden md:inline">
              {tab.label}
              {count > 0 ? ` (${count})` : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export const BOOKING_TAB_IDS = TABS.map((tab) => tab.id);

export function getBookingTabLabel(tabId) {
  return TABS.find((tab) => tab.id === tabId)?.label ?? tabId;
}
