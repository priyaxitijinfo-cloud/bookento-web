"use client";

import { notFound } from "next/navigation";
import { use, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { CategoryActiveFilters } from "@/components/category/category-active-filters";
import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import {
  CategoryFilterSheet,
  DEFAULT_CATEGORY_FILTERS,
  clearAllSheetFilters,
  clearSheetFilter,
  filterProvidersByCategoryFilters,
  hasActiveCategoryFilters,
  hasAppliedSearchFilters,
} from "@/components/category/category-filter-sheet";
import { CategoryListingHeader } from "@/components/category/category-listing-header";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { UserBottomNav } from "@/components/layout/user-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { CATEGORY_LISTING_CONFIG } from "@/constants/category-listing.constants";
import { ROUTES } from "@/constants/routes.constants";
import {
  DESKTOP_STICKY_HEADER_CLASS,
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { useDebounce } from "@/hooks/use-debounce";
import { getCategoryListingProviders } from "@/mock/category-listing-providers";

function applyListingFilters(list, filters, sheetFiltersApplied) {
  return filterProvidersByCategoryFilters(list, filters, sheetFiltersApplied);
}

function filterProvidersBySearch(list, query) {
  const term = query.trim().toLowerCase();
  if (!term) return list;

  return list.filter((provider) => {
    const name = provider.businessName?.toLowerCase() || "";
    const specialty = provider.specialty?.toLowerCase() || "";
    return name.includes(term) || specialty.includes(term);
  });
}

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

export default function CategoryListingPage({ params }) {
  const { slug } = use(params);
  const category = getHomeCategoryBySlug(slug);
  const config = CATEGORY_LISTING_CONFIG[slug];

  if (!category || !config) notFound();

  return (
    <CategoryListingContent category={category} config={config} slug={slug} />
  );
}

function CategoryListingContent({ category, config, slug }) {
  const [filters, setFilters] = useState(DEFAULT_CATEGORY_FILTERS);
  const [sheetFiltersApplied, setSheetFiltersApplied] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 250);

  const providers = useMemo(() => {
    const list = getCategoryListingProviders(slug, category.categoryId, filters.specialty);
    const filtered = applyListingFilters(list, filters, sheetFiltersApplied);
    return filterProvidersBySearch(filtered, debouncedSearch);
  }, [slug, category.categoryId, filters, sheetFiltersApplied, debouncedSearch]);

  const hasSearchQuery = debouncedSearch.trim().length > 0;
  const filtersActive = hasActiveCategoryFilters(filters, sheetFiltersApplied);

  const handleApplySheetFilters = (nextFilters) => {
    setFilters(nextFilters);
    setSheetFiltersApplied(hasAppliedSearchFilters(nextFilters));
  };

  const handleRemoveSheetFilter = (key) => {
    const nextFilters = clearSheetFilter(filters, key);
    setFilters(nextFilters);
    setSheetFiltersApplied(hasAppliedSearchFilters(nextFilters));
  };

  const handleClearSheetFilters = () => {
    setFilters(clearAllSheetFilters(filters));
    setSheetFiltersApplied(false);
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery("");
      return;
    }
    setSearchOpen(true);
  };

  return (
    <div className={PAGE_SHELL_CLASS}>
      <CategoryListingHeader
        className="md:hidden"
        title={category.name}
        backHref={ROUTES.HOME}
        showFilterActive={filtersActive}
        onFilterClick={() => setFilterOpen(true)}
        searchOpen={searchOpen}
        onSearchOpenChange={setSearchOpen}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder={`Search ${category.name.toLowerCase()}...`}
      />

      <div className={DESKTOP_STICKY_HEADER_CLASS}>
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel={category.name}
          rightAction={(
            <ListingHeaderActions
              searchOpen={searchOpen}
              onSearchToggle={handleSearchToggle}
              onFilterClick={() => setFilterOpen(true)}
              showFilterActive={filtersActive}
            />
          )}
        />
      </div>

      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "mt-[14px] md:mt-0 md:space-y-6")}>
        {searchOpen ? (
          <div className="relative hidden md:block">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search ${category.name.toLowerCase()}...`}
              className={cn(
                "border-border/80 bg-[#FAFBFD] text-foreground placeholder:text-muted-foreground",
                "h-11 w-full rounded-lg border px-10 text-sm",
                "focus-visible:ring-primary/30 focus-visible:bg-white focus-visible:ring-2 focus-visible:outline-none",
              )}
            />
          </div>
        ) : null}

        <CategoryFilterChips
          filters={config.subFilters}
          activeFilter={filters.specialty}
          onChange={(specialty) => setFilters((current) => ({ ...current, specialty }))}
        />

        {sheetFiltersApplied ? (
          <CategoryActiveFilters
            filters={filters}
            onRemove={handleRemoveSheetFilter}
            onClearAll={handleClearSheetFilters}
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
            onAction={
              hasSearchQuery
                ? undefined
                : () => {
                    setFilters(DEFAULT_CATEGORY_FILTERS);
                    setSheetFiltersApplied(false);
                  }
            }
          />
        ) : (
          <>
            <div className="flex flex-col gap-3 md:hidden">
              {providers.map((provider) => (
                <CategoryProviderListCard
                  key={provider.listingKey}
                  provider={provider}
                  fromCategory={slug}
                />
              ))}
            </div>

            <div className="hidden grid-cols-2 items-stretch gap-3 sm:gap-4 md:-mt-2.5 md:grid md:grid-cols-4 md:gap-5">
              {providers.map((provider) => (
                <CategoryProviderGridCard
                  key={provider.listingKey}
                  provider={provider}
                  fromCategory={slug}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <CategoryFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={handleApplySheetFilters}
      />

      <UserBottomNav />
    </div>
  );
}
