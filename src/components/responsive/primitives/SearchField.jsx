"use client";

import { ResponsiveSearchIcon } from "@/components/icons/search-icon";
import { cn } from "@/lib/utils";

export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  className,
  onFocus,
  onClear,
  ...props
}) {
  return (
    <label
      className={cn(
        "border-border bg-background focus-within:border-primary/40 focus-within:ring-primary/15 flex h-12 w-full items-center gap-3 rounded-full border px-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus-within:ring-2",
        className,
      )}
    >
      <ResponsiveSearchIcon className="size-5 shrink-0 text-[#9CA3AF]" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        className="text-foreground min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
        {...props}
      />
      {value && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground text-xs font-medium"
        >
          Clear
        </button>
      ) : null}
    </label>
  );
}
