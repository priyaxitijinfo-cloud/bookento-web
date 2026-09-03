"use client";

import { SlidersHorizontal, X } from "lucide-react";

import { CategoryActiveFilters } from "@/components/category/category-active-filters";
import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { cn } from "@/lib/utils";

export function FilterActiveBar({ filters, onRemove, onClearAll, className }) {
  return (
    <CategoryActiveFilters
      filters={filters}
      onRemove={onRemove}
      onClearAll={onClearAll}
      className={className}
    />
  );
}

export function FilterSpecialtyChips({
  filters,
  activeFilter,
  onChange,
  contained = false,
}) {
  return (
    <CategoryFilterChips
      filters={filters}
      activeFilter={activeFilter}
      onChange={onChange}
      contained={contained}
    />
  );
}

export function FilterProviderResults({
  providers,
  variant = "mobile",
  emptyTitle = "No providers found",
  emptyDescription = "Try adjusting your filters to see more results.",
  onResetFilters,
}) {
  if (providers.length === 0) {
    return (
      <EmptyState
        icon={SlidersHorizontal}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? "Clear filters" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  if (variant === "desktop") {
    return (
      <ResponsiveGrid cols={4} gap="md">
        {providers.map((provider) => (
          <CategoryProviderGridCard
            key={provider.listingKey ?? provider.id}
            provider={provider}
          />
        ))}
      </ResponsiveGrid>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        variant === "tablet" && "md:grid md:grid-cols-2 md:gap-4",
      )}
    >
      {providers.map((provider) => (
        <CategoryProviderListCard
          key={provider.listingKey ?? provider.id}
          provider={provider}
        />
      ))}
    </div>
  );
}

export function FilterPanelHeader({ title = "Filters", onClose }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-foreground text-base font-semibold md:font-bold">{title}</h2>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 items-center justify-center rounded-full transition-colors"
          aria-label="Close filters"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
