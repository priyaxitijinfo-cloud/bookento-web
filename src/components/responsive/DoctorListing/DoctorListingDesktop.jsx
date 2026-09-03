"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { ListingHeaderActions } from "@/components/category/listing-header-actions";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { ProvidersFilterSheet } from "@/components/providers/providers-filter-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";

const VISIT_LABELS = {
  in_clinic: "In Clinic",
  home_visit: "Home Visit",
  online: "Online",
};

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
      showHeaderBorder={false}
      contentClassName="md:!pt-0 lg:!pt-0"
      containerClassName="md:!pt-0"
      header={
        <>
          <HomeHeader embedded />
          <DesktopBreadcrumbBar
            backHref={ROUTES.HOME}
            backLabel="Back to Home"
            currentLabel="Explore Providers"
            rightAction={
              <ListingHeaderActions
                searchOpen={searchOpen}
                onSearchToggle={onSearchToggle}
                onFilterClick={onFilterOpen}
                showFilterActive={hasSheetFilters}
                searchQuery={providerSearch}
                onSearchQueryChange={onProviderSearchChange}
                searchPlaceholder="Search providers, specialties, cities..."
              />
            }
          />
        </>
      }
    >
      <div className="space-y-6">
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
