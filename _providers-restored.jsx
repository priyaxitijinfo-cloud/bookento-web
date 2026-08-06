"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import { UserBottomNav, UserHeader } from "@/components/layout/user-nav";
import { SearchInput } from "@/components/forms/search-input";
import { ProviderCard } from "@/components/shared/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SkeletonCard } from "@/components/ui/skeleton";
import { categories, getCategoryById } from "@/mock/categories";
import { mockProviders } from "@/mock/providers";
import { useFilterStore } from "@/store";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

const PAGE_SIZE = 12;
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "distance", label: "Nearest First" },
];

const VISIT_OPTIONS = [
  { value: "all", label: "All Visit Types" },
  { value: "in_clinic", label: "In Clinic" },
  { value: "home_visit", label: "Home Visit" },
  { value: "online", label: "Online" },
];

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

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  const lastRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore, isLoading: false });

  const activeCategory = categoryFilter ? getCategoryById(categoryFilter) : null;
  const hasActiveFilters = providerSearch || categoryFilter || (visitTypeFilter && visitTypeFilter !== "all");

  return (
    <div className="bg-background min-h-dvh pb-20 md:pb-6">
      <UserHeader title="Explore Providers" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="space-y-4">
          <SearchInput
            placeholder="Search providers, specialties, cities..."
            value={providerSearch}
            onChange={(e) => setProviderSearch(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              placeholder="Sort by"
              options={SORT_OPTIONS}
              className="w-auto min-w-[160px]"
            />
            <Select
              value={visitTypeFilter || "all"}
              onValueChange={(v) => setVisitTypeFilter(v === "all" ? null : v)}
              placeholder="Visit type"
              options={VISIT_OPTIONS}
              className="w-auto min-w-[150px]"
            />
            <Select
              value={categoryFilter || "all"}
              onValueChange={(v) => setCategoryFilter(v === "all" ? null : v)}
              placeholder="Category"
              options={[
                { value: "all", label: "All Categories" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              className="w-auto min-w-[160px]"
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="size-4" /> Clear
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
            </p>
            {activeCategory && (
              <Badge variant="secondary">{activeCategory.name}</Badge>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            title="No providers found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Clear filters"
            onAction={resetFilters}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((provider, i) => (
                <div
                  key={provider.id}
                  ref={i === visible.length - 1 ? lastRef : undefined}
                >
                  <ProviderCard provider={provider} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={loadMore}>
                  Load more ({filtered.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <UserBottomNav />
    </div>
  );
}
