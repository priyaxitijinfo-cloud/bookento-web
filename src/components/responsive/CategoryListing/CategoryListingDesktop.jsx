"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { CategoryActiveFilters } from "@/components/category/category-active-filters";
import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryFilterSheet } from "@/components/category/category-filter-sheet";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

function ListingHeaderActions({
  searchOpen,
  onSearchToggle,
  onFilterClick,
  showFilterActive,
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onSearchToggle}
        className="text-foreground hover:text-primary flex size-10 items-center justify-center rounded-full transition-colors"
        aria-label={searchOpen ? "Close search" : "Search"}
      >
        {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
      </button>
      <button
        type="button"
        onClick={onFilterClick}
        className="text-foreground hover:text-primary relative flex size-10 items-center justify-center rounded-full transition-colors"
        aria-label="Filter"
      >
        <SlidersHorizontal className="size-5" />
        {showFilterActive ? (
          <span className="bg-primary absolute top-1.5 right-1.5 size-2 rounded-full" aria-hidden />
        ) : null}
      </button>
    </div>
  );
}

export function CategoryListingDesktop({
  category,
  slug,
  config,
  filters,
  onSpecialtyChange,
  sheetFiltersApplied,
  onRemoveSheetFilter,
  onClearSheetFilters,
  filterOpen,
  onFilterClose,
  onFilterOpen,
  onApplySheetFilters,
  searchOpen,
  onSearchToggle,
  searchQuery,
  onSearchQueryChange,
  filtersActive,
  providers,
  hasSearchQuery,
  debouncedSearch,
  onResetFilters,
}) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel={category.name}
          rightAction={(
            <ListingHeaderActions
              searchOpen={searchOpen}
              onSearchToggle={onSearchToggle}
              onFilterClick={onFilterOpen}
              showFilterActive={filtersActive}
            />
          )}
        />
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ResponsiveCard className="sticky top-24 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
            <CategoryFilterChips
              filters={config.subFilters}
              activeFilter={filters.specialty}
              onChange={onSpecialtyChange}
            />
            <button
              type="button"
              onClick={onFilterOpen}
              className="text-primary flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-surface-page"
            >
              <SlidersHorizontal className="size-4" />
              More filters
            </button>
          </ResponsiveCard>
        </aside>

        <div className="min-w-0 space-y-6">
          {searchOpen ? (
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder={`Search ${category.name.toLowerCase()}...`}
                className={cn(
                  "border-border/80 bg-[#FAFBFD] text-foreground placeholder:text-muted-foreground",
                  "h-11 w-full rounded-lg border px-10 text-sm",
                  "focus-visible:ring-primary/30 focus-visible:bg-background focus-visible:ring-2 focus-visible:outline-none",
                )}
              />
            </div>
          ) : null}

          <div className="lg:hidden">
            <CategoryFilterChips
              filters={config.subFilters}
              activeFilter={filters.specialty}
              onChange={onSpecialtyChange}
            />
          </div>

          {sheetFiltersApplied ? (
            <CategoryActiveFilters
              filters={filters}
              onRemove={onRemoveSheetFilter}
              onClearAll={onClearSheetFilters}
            />
          ) : null}

          {providers.length === 0 ? (
            <EmptyState
              icon={hasSearchQuery ? Search : SlidersHorizontal}
              title={hasSearchQuery ? "No results found" : "No providers found"}
              description={
                hasSearchQuery
                  ? `No matches for "${debouncedSearch.trim()}". Try a different name or specialty.`
                  : "Try another filter to see more providers in this category."
              }
              actionLabel={hasSearchQuery ? undefined : "Show all"}
              onAction={hasSearchQuery ? undefined : onResetFilters}
            />
          ) : (
            <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-5">
              {providers.map((provider) => (
                <CategoryProviderGridCard
                  key={provider.listingKey}
                  provider={provider}
                  fromCategory={slug}
                />
              ))}
            </ResponsiveGrid>
          )}
        </div>
      </div>

      <CategoryFilterSheet
        open={filterOpen}
        onClose={onFilterClose}
        filters={filters}
        onApply={onApplySheetFilters}
      />
    </DesktopLayout>
  );
}
