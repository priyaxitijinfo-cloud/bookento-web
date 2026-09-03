"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "confirm", label: "Confirm" },
  { id: "cancelled", label: "Cancelled" },
  { id: "completed", label: "Completed" },
];

const TAB_ACTIVE_STYLES = {
  pending: "border-[#FFAF2A] bg-[#FFFCF0] text-[#FFAF2A]",
  confirm: "border-[#2563EB] bg-[#EEF3FE] text-[#2563EB]",
  cancelled: "border-[#F13339] bg-[#FEF3F3] text-[#F13339]",
  completed: "border-[#05B21F] bg-[#EBF9ED] text-[#05B21F]",
};

const DEFAULT_MOBILE_INACTIVE =
  "border-[#E6E8EF] bg-white text-[#5B6B8C] hover:border-[#D8DBE5] hover:bg-[#F4F4F8] hover:text-foreground";

function isMobileViewport() {
  return (
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
}

function scrollTabFullyIntoView(container, tab) {
  if (!container || !tab) return;

  const containerRect = container.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  const edgePad = 16;

  if (tabRect.right > containerRect.right - edgePad) {
    container.scrollBy({
      left: tabRect.right - containerRect.right + edgePad,
      behavior: "smooth",
    });
    return;
  }

  if (tabRect.left < containerRect.left + edgePad) {
    container.scrollBy({
      left: tabRect.left - containerRect.left - edgePad,
      behavior: "smooth",
    });
  }
}

export function BookingTabBar({ value, onChange }) {
  const scrollRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    if (!isMobileViewport()) return;

    const container = scrollRef.current;
    if (!container) return;

    // Cancelled → bring Completed fully into view; otherwise scroll active tab in
    const targetId = value === "cancelled" ? "completed" : value;
    const target = tabRefs.current[targetId];

    requestAnimationFrame(() => {
      scrollTabFullyIntoView(container, target);
    });
  }, [value]);

  const handleSelect = (tabId) => {
    if (!isMobileViewport()) {
      const scrollLeft = scrollRef.current?.scrollLeft ?? 0;
      onChange(tabId);
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollLeft;
        }
      });
      return;
    }

    onChange(tabId);
  };

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide -mx-4 -mt-[5px] flex gap-2.5 overflow-x-auto px-4 py-2.5 md:-mx-6 md:mt-0 md:gap-3 md:px-6 md:py-3"
      role="tablist"
    >
      {TABS.map((tab) => {
        const isActive = value === tab.id;

        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              "inline-flex h-9 min-h-9 shrink-0 appearance-none items-center justify-center rounded-md border px-[19px] text-sm font-semibold outline-none md:h-10 md:min-h-10 md:rounded-lg",
              "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out select-none",
              "focus-visible:ring-primary/25 focus-visible:ring-2",
              isActive
                ? TAB_ACTIVE_STYLES[tab.id]
                : cn(
                    "md:hover:text-foreground md:border-[#E6E8EF] md:bg-white md:text-[#5B6B8C] md:hover:border-[#D8DBE5] md:hover:bg-[#F4F4F8]",
                    DEFAULT_MOBILE_INACTIVE,
                  ),
            )}
          >
            {tab.label}
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
