"use client";

import { useEffect, useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { ResponsiveSearchIcon } from "@/components/icons/search-icon";

import { cn } from "@/lib/utils";

export function ListingHeaderActions({
  searchOpen,
  onSearchToggle,
  onFilterClick,
  showFilterActive,
  searchQuery = "",
  onSearchQueryChange,
  searchPlaceholder = "Search...",
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  return (
    <div className="flex items-center gap-1.5">
      {searchOpen ? (
        <div className="relative w-[min(22rem,42vw)]">
          <ResponsiveSearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "border-border/80 text-foreground placeholder:text-muted-foreground bg-[#FAFBFD]",
              "h-10 w-full rounded-lg border pr-3 pl-10 text-sm",
              "focus-visible:ring-primary/30 focus-visible:bg-white focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </div>
      ) : null}
      <button
        type="button"
        onClick={onSearchToggle}
        className="text-foreground hover:text-primary flex size-10 shrink-0 items-center justify-center rounded-full transition-colors"
        aria-label={searchOpen ? "Close search" : "Search"}
      >
        {searchOpen ? (
          <X className="size-5" />
        ) : (
          <ResponsiveSearchIcon className="size-5" />
        )}
      </button>
      <button
        type="button"
        onClick={onFilterClick}
        className="text-foreground hover:text-primary relative flex size-10 shrink-0 items-center justify-center rounded-full transition-colors"
        aria-label="Filter"
      >
        <SlidersHorizontal className="size-5" />
        {showFilterActive ? (
          <span
            className="bg-primary absolute top-1.5 right-1.5 size-2 rounded-full"
            aria-hidden
          />
        ) : null}
      </button>
    </div>
  );
}
