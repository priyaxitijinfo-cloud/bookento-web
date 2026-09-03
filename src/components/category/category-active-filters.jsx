"use client";

import { X } from "lucide-react";

import { getSheetFilterTags } from "@/components/category/category-filter-sheet";
import { LocationIcon } from "@/components/icons/location-icon";
import { cn } from "@/lib/utils";

export function CategoryActiveFilters({ filters, onRemove, onClearAll, className }) {
  const tags = getSheetFilterTags(filters);

  if (tags.length === 0) return null;

  return (
    <section className={cn("mb-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-foreground text-base leading-none font-semibold md:font-bold">
          Active Filters
        </h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-primary shrink-0 text-sm font-semibold transition-opacity hover:opacity-80"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.key}
            className="border-primary/25 bg-primary/[0.06] text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium"
          >
            {tag.showMapPin ? <LocationIcon className="size-3.5 shrink-0" /> : null}
            <span>{tag.label}</span>
            <button
              type="button"
              onClick={() => onRemove(tag.key)}
              className="text-primary/80 hover:text-primary -mr-0.5 flex size-4 items-center justify-center transition-colors"
              aria-label={`Remove ${tag.label} filter`}
            >
              <X className="size-3.5" strokeWidth={2.25} />
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}
