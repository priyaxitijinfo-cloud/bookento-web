"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

export function CategoryFilterChips({ filters, activeFilter, onChange, contained = false }) {
  const scrollRef = useRef(null);

  const handleSelect = (filter) => {
    const scrollLeft = scrollRef.current?.scrollLeft ?? 0;
    onChange(filter);

    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft;
      }
    });
  };

  return (
    <div className={cn(contained ? "border-b border-border/60" : "-mt-[18px] mb-3 md:mt-0 md:mb-4")}>
      <div
        ref={scrollRef}
        className={cn(
          "scrollbar-hide flex gap-2.5 overflow-x-auto py-2.5 md:gap-3 md:py-3",
          contained ? "px-4 md:px-6" : "-mx-4 px-4 md:-mx-6 md:px-6",
        )}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(filter)}
              className={cn(
                "inline-flex h-10 min-h-10 shrink-0 appearance-none items-center justify-center rounded-lg px-4 text-sm font-medium outline-none",
                "select-none transition-[box-shadow] duration-200 ease-out",
                isActive
                  ? "profile-tab-active !text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)] hover:!text-white hover:shadow-[0_4px_12px_rgba(24,101,234,0.3)] active:!text-white focus-visible:!text-white"
                  : "bg-card text-muted-foreground ring-1 ring-border ring-inset hover:bg-background hover:text-foreground hover:ring-primary/30",
              )}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
