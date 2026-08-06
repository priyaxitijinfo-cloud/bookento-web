"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { CategoryActiveFilters } from "@/components/category/category-active-filters";
import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryFilterSheet } from "@/components/category/category-filter-sheet";
import { CategoryListingHeader } from "@/components/category/category-listing-header";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function CategoryListingMobile({
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
  onSearchOpenChange,
  searchQuery,
  onSearchQueryChange,
  filtersActive,
  providers,
  hasSearchQuery,
  debouncedSearch,
  onResetFilters,
}) {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <CategoryListingHeader
        title={category.name}
        backHref={ROUTES.HOME}
        showFilterActive={filtersActive}
        onFilterClick={onFilterOpen}
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        searchPlaceholder={`Search ${category.name.toLowerCase()}...`}
      />

      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "mt-[14px] space-y-4")}>
        <CategoryFilterChips
          filters={config.subFilters}
          activeFilter={filters.specialty}
          onChange={onSpecialtyChange}
        />

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
          <div className="flex flex-col gap-3">
            {providers.map((provider) => (
              <CategoryProviderListCard
                key={provider.listingKey}
                provider={provider}
                fromCategory={slug}
              />
            ))}
          </div>
        )}
      </main>

      <CategoryFilterSheet
        open={filterOpen}
        onClose={onFilterClose}
        filters={filters}
        onApply={onApplySheetFilters}
      />
    </div>
  );
}

export function CategoryListingTablet({
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
  onSearchOpenChange,
  searchQuery,
  onSearchQueryChange,
  filtersActive,
  providers,
  hasSearchQuery,
  debouncedSearch,
  onResetFilters,
}) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "pb-8")}>
      <CategoryListingHeader
        title={category.name}
        backHref={ROUTES.HOME}
        showFilterActive={filtersActive}
        onFilterClick={onFilterOpen}
        searchOpen={searchOpen}
        onSearchOpenChange={onSearchOpenChange}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        searchPlaceholder={`Search ${category.name.toLowerCase()}...`}
      />

      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "mt-[14px] space-y-4")}>
        <CategoryFilterChips
          filters={config.subFilters}
          activeFilter={filters.specialty}
          onChange={onSpecialtyChange}
        />

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
          <div className="grid grid-cols-3 items-stretch gap-4">
            {providers.map((provider) => (
              <CategoryProviderGridCard
                key={provider.listingKey}
                provider={provider}
                fromCategory={slug}
              />
            ))}
          </div>
        )}
      </main>

      <CategoryFilterSheet
        open={filterOpen}
        onClose={onFilterClose}
        filters={filters}
        onApply={onApplySheetFilters}
      />
    </div>
  );
}
