"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { ProvidersFilterSheet } from "@/components/providers/providers-filter-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const VISIT_LABELS = {
  in_clinic: "In Clinic",
  home_visit: "Home Visit",
  online: "Online",
};

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

export function DoctorListingDesktop({
  providerSearch,
  onProviderSearchChange,
  sortChips,
  activeSortChip,
  onSortChange,
  hasSheetFilters,
  hasSearchQuery,
  debouncedSearch,
  visitTypeFilter,
  onVisitTypeClear,
  activeCategory,
  onCategoryClear,
  onClearFilters,
  filtered,
  visible,
  isLoading,
  filterOpen,
  onFilterClose,
  onFilterOpen,
  onApplyFilters,
  searchOpen,
  onSearchToggle,
  visitTypeFilterValue,
  categoryFilterValue,
  lastRef,
  hasMore,
  onLoadMore,
}) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel="Explore Providers"
          rightAction={(
            <ListingHeaderActions
              searchOpen={searchOpen}
              onSearchToggle={onSearchToggle}
              onFilterClick={onFilterOpen}
              showFilterActive={hasSheetFilters}
            />
          )}
        />
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ResponsiveCard className="sticky top-24 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Sort &amp; filter</h2>
            <CategoryFilterChips
              filters={sortChips}
              activeFilter={activeSortChip}
              onChange={onSortChange}
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
                value={providerSearch}
                onChange={(event) => onProviderSearchChange(event.target.value)}
                placeholder="Search providers, specialties, cities..."
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
              filters={sortChips}
              activeFilter={activeSortChip}
              onChange={onSortChange}
            />
          </div>

          {(hasSheetFilters || hasSearchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              {hasSearchQuery && (
                <Badge variant="secondary" className="gap-1 pr-1.5">
                  Search: {debouncedSearch.trim()}
                  <button
                    type="button"
                    onClick={() => onProviderSearchChange("")}
                    className="hover:bg-muted rounded-full p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {visitTypeFilter && (
                <Badge variant="secondary" className="gap-1 pr-1.5">
                  {VISIT_LABELS[visitTypeFilter] || visitTypeFilter}
                  <button
                    type="button"
                    onClick={onVisitTypeClear}
                    className="hover:bg-muted rounded-full p-0.5"
                    aria-label="Clear visit type filter"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {activeCategory && (
                <Badge variant="secondary" className="gap-1 pr-1.5">
                  {activeCategory.name}
                  <button
                    type="button"
                    onClick={onCategoryClear}
                    className="hover:bg-muted rounded-full p-0.5"
                    aria-label="Clear category filter"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              <button
                type="button"
                onClick={onClearFilters}
                className="text-primary text-sm font-medium hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
          </p>

          {isLoading ? (
            <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </ResponsiveGrid>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={hasSearchQuery ? Search : SlidersHorizontal}
              title={hasSearchQuery ? "No results found" : "No providers found"}
              description={
                hasSearchQuery
                  ? `No matches for "${debouncedSearch.trim()}". Try a different search or filter.`
                  : "Try adjusting your filters to find providers near you."
              }
              actionLabel="Clear filters"
              onAction={onClearFilters}
            />
          ) : (
            <>
              <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-5">
                {visible.map((provider, i) => (
                  <div
                    key={provider.id}
                    ref={i === visible.length - 1 ? lastRef : undefined}
                  >
                    <CategoryProviderGridCard provider={provider} />
                  </div>
                ))}
              </ResponsiveGrid>
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={onLoadMore}>
                    Load more ({filtered.length - visible.length} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProvidersFilterSheet
        open={filterOpen}
        onClose={onFilterClose}
        visitType={visitTypeFilterValue}
        categoryId={categoryFilterValue}
        onApply={onApplyFilters}
      />
    </DesktopLayout>
  );
}
