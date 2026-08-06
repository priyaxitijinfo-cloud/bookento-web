"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { CategoryFilterChips } from "@/components/category/category-filter-chips";
import { CategoryListingHeader } from "@/components/category/category-listing-header";
import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { UserBottomNav } from "@/components/layout/user-nav";
import {
  hasActiveProviderFilters,
  ProvidersFilterSheet,
} from "@/components/providers/providers-filter-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";
import {
  DESKTOP_STICKY_HEADER_CLASS,
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { getCategoryById } from "@/mock/categories";
import { mockProviders } from "@/mock/providers";
import { useFilterStore } from "@/store";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

const PAGE_SIZE = 12;

const SORT_CHIPS = ["All", "Top Rated", "Nearest", "Price: Low", "Price: High"];

const SORT_CHIP_TO_VALUE = {
  All: "relevance",
  "Top Rated": "rating",
  Nearest: "distance",
  "Price: Low": "price_low",
  "Price: High": "price_high",
};

const SORT_VALUE_TO_CHIP = Object.fromEntries(
  Object.entries(SORT_CHIP_TO_VALUE).map(([label, value]) => [value, label]),
);

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

function filterProviders(list, { search, categoryId, visitType, sortBy }) {
  let filtered = [...list];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.businessName.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q),
    );
  }

  if (categoryId) {
    filtered = filtered.filter((p) => p.categoryId === categoryId);
  }

  if (visitType && visitType !== "all") {
    filtered = filtered.filter((p) => p.serviceModes.includes(visitType));
  }

  switch (sortBy) {
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "price_low":
      filtered.sort((a, b) => a.startingPrice - b.startingPrice);
      break;
    case "price_high":
      filtered.sort((a, b) => b.startingPrice - a.startingPrice);
      break;
    case "distance":
      filtered.sort((a, b) => a.distance - b.distance);
      break;
    default:
      break;
  }

  return filtered;
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={<ProvidersPageSkeleton />}>
      <ProvidersPageContent />
    </Suspense>
  );
}

function ProvidersPageSkeleton() {
  return (
    <div className="bg-background min-h-dvh pb-20 md:pb-6">
      <div className="border-border h-14 border-b" />
      <div className="mx-auto max-w-lg space-y-4 px-4 py-4 md:max-w-7xl md:px-6 md:py-6">
        <div className="flex gap-2.5 overflow-hidden py-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted h-10 w-24 shrink-0 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="hidden gap-4 md:grid md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProvidersPageContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const {
    providerSearch,
    categoryFilter,
    visitTypeFilter,
    sortBy,
    setProviderSearch,
    setCategoryFilter,
    setVisitTypeFilter,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(providerSearch, 300);

  useEffect(() => {
    if (categoryFromUrl) setCategoryFilter(categoryFromUrl);
  }, [categoryFromUrl, setCategoryFilter]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [debouncedSearch, categoryFilter, visitTypeFilter, sortBy]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch, categoryFilter, visitTypeFilter, sortBy]);

  const filtered = useMemo(
    () =>
      filterProviders(mockProviders, {
        search: debouncedSearch,
        categoryId: categoryFilter,
        visitType: visitTypeFilter,
        sortBy,
      }),
    [debouncedSearch, categoryFilter, visitTypeFilter, sortBy],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const hasSearchQuery = debouncedSearch.trim().length > 0;

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  const lastRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore, isLoading: false });

  const activeCategory = categoryFilter ? getCategoryById(categoryFilter) : null;
  const activeSortChip = SORT_VALUE_TO_CHIP[sortBy] || "All";
  const hasSheetFilters = hasActiveProviderFilters({ visitTypeFilter, categoryFilter });

  const handleSortChange = (chip) => {
    setSortBy(SORT_CHIP_TO_VALUE[chip] || "relevance");
  };

  const handleApplyFilters = ({ visitType, categoryId }) => {
    setVisitTypeFilter(visitType);
    setCategoryFilter(categoryId);
  };

  const handleClearFilters = () => {
    resetFilters();
    setSearchOpen(false);
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setProviderSearch("");
      return;
    }
    setSearchOpen(true);
  };

  return (
    <div className={PAGE_SHELL_CLASS}>
      <CategoryListingHeader
        className="md:hidden"
        title="Explore Providers"
        backHref={ROUTES.HOME}
        showFilterActive={hasSheetFilters}
        onFilterClick={() => setFilterOpen(true)}
        searchOpen={searchOpen}
        onSearchOpenChange={setSearchOpen}
        searchQuery={providerSearch}
        onSearchQueryChange={setProviderSearch}
        searchPlaceholder="Search providers, specialties, cities..."
      />

      <div className={DESKTOP_STICKY_HEADER_CLASS}>
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel="Explore Providers"
          rightAction={(
            <ListingHeaderActions
              searchOpen={searchOpen}
              onSearchToggle={handleSearchToggle}
              onFilterClick={() => setFilterOpen(true)}
              showFilterActive={hasSheetFilters}
            />
          )}
        />
      </div>

      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "md:space-y-6")}>
        {searchOpen ? (
          <div className="relative hidden md:block">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              type="text"
              value={providerSearch}
              onChange={(event) => setProviderSearch(event.target.value)}
              placeholder="Search providers, specialties, cities..."
              className={cn(
                "border-border/80 bg-[#FAFBFD] text-foreground placeholder:text-muted-foreground",
                "h-11 w-full rounded-lg border px-10 text-sm",
                "focus-visible:ring-primary/30 focus-visible:bg-white focus-visible:ring-2 focus-visible:outline-none",
              )}
            />
          </div>
        ) : null}

        <CategoryFilterChips
          filters={SORT_CHIPS}
          activeFilter={activeSortChip}
          onChange={handleSortChange}
        />

        {(hasSheetFilters || hasSearchQuery) && (
          <div className="flex flex-wrap items-center gap-2">
            {hasSearchQuery && (
              <Badge variant="secondary" className="gap-1 pr-1.5">
                Search: {debouncedSearch.trim()}
                <button
                  type="button"
                  onClick={() => setProviderSearch("")}
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
                  onClick={() => setVisitTypeFilter(null)}
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
                  onClick={() => setCategoryFilter(null)}
                  className="hover:bg-muted rounded-full p-0.5"
                  aria-label="Clear category filter"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-primary text-sm font-medium hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {isLoading ? (
          <>
            <div className="flex flex-col gap-3 md:hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-muted h-28 animate-pulse rounded-2xl" />
              ))}
            </div>
            <div className="hidden gap-4 md:grid md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
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
            onAction={handleClearFilters}
          />
        ) : (
          <>
            <div className="flex flex-col gap-3 md:hidden">
              {visible.map((provider, i) => (
                <div
                  key={provider.id}
                  ref={i === visible.length - 1 ? lastRef : undefined}
                >
                  <CategoryProviderListCard provider={provider} />
                </div>
              ))}
            </div>

            <div className="hidden grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid md:grid-cols-4 md:gap-5">
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
              <div className="flex justify-center pt-2 md:pt-4">
                <Button variant="outline" onClick={loadMore}>
                  Load more ({filtered.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <ProvidersFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        visitType={visitTypeFilter}
        categoryId={categoryFilter}
        onApply={handleApplyFilters}
      />

      <UserBottomNav />
    </div>
  );
}
