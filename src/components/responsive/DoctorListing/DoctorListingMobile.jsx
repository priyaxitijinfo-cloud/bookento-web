"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryListingHeader } from "@/components/category/category-listing-header";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { ProvidersFilterSheet } from "@/components/providers/providers-filter-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

const VISIT_LABELS = {
  in_clinic: "In Clinic",
  home_visit: "Home Visit",
  online: "Online",
};

export function DoctorListingMobile({
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
  onSearchOpenChange,
  visitTypeFilterValue,
  categoryFilterValue,
}) {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <CategoryListingHeader
        title="Explore Providers"
        backHref={ROUTES.HOME}
        showFilterActive={hasSheetFilters}
        onFilterClick={onFilterOpen}
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchQuery={providerSearch}
        onSearchQueryChange={onProviderSearchChange}
        searchPlaceholder="Search providers, specialties, cities..."
      />

      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "space-y-4")}>
        <CategoryFilterChips
          filters={sortChips}
          activeFilter={activeSortChip}
          onChange={onSortChange}
        />

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

        <p className="text-muted-foreground text-sm">
          {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
        </p>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted h-28 animate-pulse rounded-2xl" />
            ))}
          </div>
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
          <div className="flex flex-col gap-3">
            {visible.map((provider) => (
              <CategoryProviderListCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </main>

      <ProvidersFilterSheet
        open={filterOpen}
        onClose={onFilterClose}
        visitType={visitTypeFilterValue}
        categoryId={categoryFilterValue}
        onApply={onApplyFilters}
      />
    </div>
  );
}

export function DoctorListingTablet({
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
  onSearchOpenChange,
  visitTypeFilterValue,
  categoryFilterValue,
  lastRef,
  hasMore,
  onLoadMore,
}) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "pb-8")}>
      <CategoryListingHeader
        title="Explore Providers"
        backHref={ROUTES.HOME}
        showFilterActive={hasSheetFilters}
        onFilterClick={onFilterOpen}
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchQuery={providerSearch}
        onSearchQueryChange={onProviderSearchChange}
        searchPlaceholder="Search providers, specialties, cities..."
      />

      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "space-y-4")}>
        <CategoryFilterChips
          filters={sortChips}
          activeFilter={activeSortChip}
          onChange={onSortChange}
        />

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

        <p className="text-muted-foreground text-sm">
          {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
        </p>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
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
            <div className="grid grid-cols-3 items-stretch gap-4">
              {visible.map((provider, i) => (
                <div
                  key={provider.id}
                  ref={i === visible.length - 1 ? lastRef : undefined}
                >
                  <CategoryProviderGridCard provider={provider} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Load more ({filtered.length - visible.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <ProvidersFilterSheet
        open={filterOpen}
        onClose={onFilterClose}
        visitType={visitTypeFilterValue}
        categoryId={categoryFilterValue}
        onApply={onApplyFilters}
      />
    </div>
  );
}
