"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { CategoryActiveFilters } from "@/components/category/category-active-filters";
import {
  SearchFilterFields,
  hasAppliedSearchFilters,
  normalizeAppliedFilters,
} from "@/components/category/category-filter-sheet";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { ResponsiveSearchIcon } from "@/components/icons/search-icon";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

function SpecialtySidebarList({ filters, activeFilter, onChange }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[13px] font-semibold tracking-wide text-[#667085] uppercase">
        Specialty
      </p>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onChange(filter)}
              className={cn(
                "inline-flex h-8 items-center rounded-lg px-3.5 text-[14px] font-medium transition-colors",
                isActive
                  ? "gradient-brand text-white"
                  : "bg-[#F3F5F8] text-[#475467] hover:bg-[#E8EDF5] hover:text-[#1A2332]",
              )}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ListingFiltersSidebar({
  categoryName,
  searchQuery,
  onSearchQueryChange,
  specialtyFilters,
  activeSpecialty,
  onSpecialtyChange,
  filters,
  onApplySheetFilters,
}) {
  const [draft, setDraft] = useState(() => ({
    location: filters.location ?? "",
    maxDistance: filters.maxDistance,
    priceRange: filters.priceRange ?? "any",
    specialty: filters.specialty,
  }));

  // Only re-sync when applied sheet filters change — not on specialty chip clicks
  useEffect(() => {
    setDraft((current) => ({
      ...current,
      location: filters.location ?? "",
      maxDistance: filters.maxDistance,
      priceRange: filters.priceRange ?? "any",
    }));
  }, [filters.location, filters.maxDistance, filters.priceRange]);

  const handleApply = () => {
    const normalized = normalizeAppliedFilters({
      ...draft,
      specialty: activeSpecialty,
    });
    onApplySheetFilters(normalized);
    if (hasAppliedSearchFilters(normalized)) {
      toast.success("Filters applied");
    }
  };

  return (
    <aside
      className={cn(
        "flex h-full w-[280px] shrink-0 flex-col overflow-hidden xl:w-[300px]",
        "rounded-2xl border border-[#E8EDF5] bg-white",
        "shadow-[0_8px_24px_-16px_rgba(15,23,42,0.18)]",
      )}
    >
      <div className="scrollbar-hide min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-5">
        <div>
          <p className="text-[13px] font-semibold tracking-wide text-[#667085] uppercase">
            Search
          </p>
          <div className="relative mt-2">
            <ResponsiveSearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange?.(event.target.value)}
              placeholder={`Search ${categoryName.toLowerCase()}...`}
              className={cn(
                "h-11 w-full rounded-xl border border-[#E6EAF0] bg-[#FAFBFD] pr-3 pl-10 text-sm text-[#1A2332]",
                "placeholder:text-[#98A2B3]",
                "focus-visible:border-[#1865EA]/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1865EA]/20 focus-visible:outline-none",
              )}
            />
          </div>
        </div>

        <SpecialtySidebarList
          filters={specialtyFilters}
          activeFilter={activeSpecialty}
          onChange={onSpecialtyChange}
        />

        <div className="border-t border-[#EEF2F7] pt-5">
          <SearchFilterFields
            draft={draft}
            setDraft={setDraft}
            priceRangeWrap
            showLocation={false}
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-[#EEF2F7] bg-white p-4">
        <button
          type="button"
          onClick={handleApply}
          className="gradient-brand h-11 w-full rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
        >
          Apply filters
        </button>
      </div>
    </aside>
  );
}

/** Desktop-only category listing — fixed filter sidebar, scrolling results */
export function CategoryListingDesktop({
  category,
  slug,
  config,
  filters,
  onSpecialtyChange,
  sheetFiltersApplied,
  onRemoveSheetFilter,
  onClearSheetFilters,
  onApplySheetFilters,
  searchQuery,
  onSearchQueryChange,
  providers,
  hasSearchQuery,
  debouncedSearch,
  onResetFilters,
}) {
  return (
    <div className="bg-surface-page flex h-dvh flex-col overflow-hidden">
      <div className="z-30 shrink-0 bg-white/95 backdrop-blur-md">
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel={category.name}
        />
      </div>

      <div className={cn(HOME_PAGE_CONTAINER, "flex min-h-0 flex-1 gap-6 pt-0 pb-5")}>
        <ListingFiltersSidebar
          categoryName={category.name}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          specialtyFilters={[
            "All",
            ...(config.specialties ?? config.subFilters.slice(1)),
          ]}
          activeSpecialty={filters.specialty}
          onSpecialtyChange={onSpecialtyChange}
          filters={filters}
          onApplySheetFilters={onApplySheetFilters}
        />

        <div className="scrollbar-hide min-h-0 min-w-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-1">
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
            <ResponsiveGrid mobile={2} tablet={3} desktop={3} gap="gap-5">
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
    </div>
  );
}
