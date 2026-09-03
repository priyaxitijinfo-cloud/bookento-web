"use client";

import { Clock, X } from "lucide-react";

export function RecentSearchesList({ searches, onSelect, onRemove, onClear }) {
  if (searches.length === 0) return null;

  return (
    <section className="pt-2">
      <div className="mb-1 flex items-center justify-between px-1">
        <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Recent
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          Clear
        </button>
      </div>

      <ul className="divide-border/70 divide-y">
        {searches.map((term) => (
          <li key={term}>
            <div className="flex items-center gap-3 py-2 md:py-3.5">
              <button
                type="button"
                onClick={() => onSelect(term)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left md:gap-3"
              >
                <Clock
                  className="text-muted-foreground size-[18px] shrink-0"
                  strokeWidth={1.75}
                />
                <span className="text-foreground truncate text-[15px]">{term}</span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(term)}
                className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-colors"
                aria-label={`Remove ${term}`}
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
