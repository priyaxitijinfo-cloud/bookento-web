"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { CategoryActiveFilters } from "@/components/category/category-active-filters";
import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryFilterSheet } from "@/components/category/category-filter-sheet";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { ListingHeaderActions } from "@/components/category/listing-header-actions";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";

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
      showHeaderBorder={false}
      contentClassName="md:!pt-0 lg:!pt-0"
      containerClassName="md:!pt-0"
      header={
        <>
          <HomeHeader embedded />
          <DesktopBreadcrumbBar
            backHref={ROUTES.HOME}
            backLabel="Back to Home"
            currentLabel={category.name}
            rightAction={
              <ListingHeaderActions
                searchOpen={searchOpen}
                onSearchToggle={onSearchToggle}
                onFilterClick={onFilterOpen}
                showFilterActive={filtersActive}
                searchQuery={searchQuery}
                onSearchQueryChange={onSearchQueryChange}
                searchPlaceholder={`Search ${category.name.toLowerCase()}...`}
              />
            }
          />
        </>
      }
    >
      <div className="space-y-6">
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

      <CategoryFilterSheet
        open={filterOpen}
        onClose={onFilterClose}
        filters={filters}
        onApply={onApplySheetFilters}
      />
    </DesktopLayout>
  );
}
