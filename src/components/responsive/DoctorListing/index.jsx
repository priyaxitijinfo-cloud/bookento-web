"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { hasActiveProviderFilters } from "@/components/providers/providers-filter-sheet";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { UserBottomNav } from "@/components/layout/user-nav";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { getCategoryById } from "@/mock/categories";
import { mockProviders } from "@/mock/providers";
import { useFilterStore } from "@/store";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

import { DoctorListingDesktop } from "./DoctorListingDesktop";
import { DoctorListingMobile, DoctorListingTablet } from "./DoctorListingMobile";

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

export function DoctorListingPageSkeleton() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="border-border h-14 border-b" />
      <div className="mx-auto max-w-lg space-y-4 px-4 py-4 md:max-w-7xl md:px-6 md:py-6">
        <div className="flex gap-2.5 overflow-hidden py-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted h-10 w-24 shrink-0 animate-pulse rounded-lg"
            />
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

function DoctorListingContent() {
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

  const lastRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: false,
  });

  const activeCategory = categoryFilter ? getCategoryById(categoryFilter) : null;
  const activeSortChip = SORT_VALUE_TO_CHIP[sortBy] || "All";
  const hasSheetFilters = hasActiveProviderFilters({ visitTypeFilter, categoryFilter });

  const handleSortChange = (chip) => {
    setSortBy(SORT_CHIP_TO_VALUE[chip] || "relevance");
  };

  const handleApplyFilters = ({ visitType, categoryId }) => {
    setVisitTypeFilter(visitType);
    setCategoryFilter(categoryId);
    setFilterOpen(false);
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

  const viewProps = {
    providerSearch,
    onProviderSearchChange: setProviderSearch,
    sortChips: SORT_CHIPS,
    activeSortChip,
    onSortChange: handleSortChange,
    hasSheetFilters,
    hasSearchQuery,
    debouncedSearch,
    visitTypeFilter,
    onVisitTypeClear: () => setVisitTypeFilter(null),
    activeCategory,
    onCategoryClear: () => setCategoryFilter(null),
    onClearFilters: handleClearFilters,
    filtered,
    visible,
    isLoading,
    filterOpen,
    onFilterClose: () => setFilterOpen(false),
    onFilterOpen: () => setFilterOpen(true),
    onApplyFilters: handleApplyFilters,
    searchOpen,
    onSearchOpenChange: setSearchOpen,
    onSearchToggle: handleSearchToggle,
    visitTypeFilterValue: visitTypeFilter,
    categoryFilterValue: categoryFilter,
    lastRef,
    hasMore,
    onLoadMore: loadMore,
  };

  return (
    <>
      <ResponsiveView
        fallback={<DoctorListingPageSkeleton />}
        mobile={<DoctorListingMobile {...viewProps} />}
        tablet={<DoctorListingTablet {...viewProps} />}
        desktop={<DoctorListingDesktop {...viewProps} />}
      />
      <UserBottomNav />
    </>
  );
}

export function DoctorListingResponsive() {
  return (
    <Suspense fallback={<DoctorListingPageSkeleton />}>
      <DoctorListingContent />
    </Suspense>
  );
}

export default DoctorListingResponsive;
