"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  CategoryFilterSheet,
  DEFAULT_CATEGORY_FILTERS,
  filterProvidersByCategoryFilters,
  hasActiveCategoryFilters,
} from "@/components/category/category-filter-sheet";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { useDebounce } from "@/hooks/use-debounce";
import { getCategoryListingProviders } from "@/mock/category-listing-providers";
import {
  getGlobalSearchProviders,
  MOBILE_SEARCH_RESULTS_LIMIT,
} from "@/lib/search/search-providers";
import { useRecentSearchesStore } from "@/store/recent-searches.store";

import { SearchDesktop } from "./SearchDesktop";
import { SearchMobile } from "./SearchMobile";
import { SearchTablet } from "./SearchTablet";

function filterProvidersBySearchTerm(list, term) {
  if (!term) return list;

  const query = term.toLowerCase();
  return list.filter((provider) => {
    const name = provider.businessName?.toLowerCase() || "";
    const specialty = provider.specialty?.toLowerCase() || "";
    const city = provider.city?.toLowerCase() || "";
    const categoryName = provider.categoryName?.toLowerCase() || "";
    return (
      name.includes(query) ||
      specialty.includes(query) ||
      city.includes(query) ||
      categoryName.includes(query)
    );
  });
}

export function SearchPageFallback() {
  return (
    <div className="bg-background min-h-dvh pb-20">
      <div className="border-border h-14 border-b" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="bg-muted h-11 animate-pulse rounded-full" />
      </div>
    </div>
  );
}

export function SearchResponsive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);

  const categorySlug = searchParams.get("category");
  const category = categorySlug ? getHomeCategoryBySlug(categorySlug) : null;

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState(DEFAULT_CATEGORY_FILTERS);
  const [categoryFiltersApplied, setCategoryFiltersApplied] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const recentSearches = useRecentSearchesStore((state) => state.searches);
  const addRecentSearch = useRecentSearchesStore((state) => state.addSearch);
  const removeRecentSearch = useRecentSearchesStore((state) => state.removeSearch);
  const clearRecentSearches = useRecentSearchesStore((state) => state.clearSearches);

  const allProviders = useMemo(() => {
    if (category) {
      return getCategoryListingProviders(categorySlug, category.categoryId, "All").map(
        (provider) => ({
          ...provider,
          categorySlug,
          categoryName: category.name,
          categoryId: category.categoryId,
        }),
      );
    }
    return getGlobalSearchProviders();
  }, [category, categorySlug]);

  const results = useMemo(() => {
    const term = debouncedQuery.trim();

    let filtered = filterProvidersByCategoryFilters(
      allProviders,
      categoryFilters,
      categoryFiltersApplied,
    );

    if (term) {
      filtered = filterProvidersBySearchTerm(filtered, term);
    } else {
      return [];
    }

    return filtered.slice(0, MOBILE_SEARCH_RESULTS_LIMIT);
  }, [allProviders, categoryFilters, categoryFiltersApplied, debouncedQuery]);

  const desktopResults = useMemo(() => {
    const term = debouncedQuery.trim();

    let filtered = filterProvidersByCategoryFilters(
      allProviders,
      categoryFilters,
      categoryFiltersApplied,
    );

    if (term) {
      filtered = filterProvidersBySearchTerm(filtered, term);
    }

    return filtered;
  }, [allProviders, categoryFilters, categoryFiltersApplied, debouncedQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const term = debouncedQuery.trim();
    if (term.length < 2) return;

    addRecentSearch(term);
  }, [addRecentSearch, debouncedQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());

    const next = params.toString();
    router.replace(next ? `${ROUTES.SEARCH}?${next}` : ROUTES.SEARCH, {
      scroll: false,
    });
  }, [categorySlug, debouncedQuery, router]);

  const backHref = categorySlug ? categoryListingRoute(categorySlug) : ROUTES.HOME;
  const backLabel = category ? `Back to ${category.name}` : "Back to Home";
  const title = category ? `Search ${category.name}` : "Search";
  const placeholder = category
    ? `Search ${category.name.toLowerCase()}...`
    : "Search...";

  const showFilterActive = hasActiveCategoryFilters(
    categoryFilters,
    categoryFiltersApplied,
  );

  const handleRecentSelect = useCallback((term) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  const handleCategoryFiltersApply = useCallback((nextFilters) => {
    setCategoryFilters(nextFilters);
    setCategoryFiltersApplied(true);
  }, []);

  const viewProps = {
    inputRef,
    query,
    onQueryChange: (event) => setQuery(event.target.value),
    placeholder,
    title,
    backHref,
    backLabel,
    category,
    categorySlug,
    debouncedQuery,
    recentSearches,
    onRecentSelect: handleRecentSelect,
    onRecentRemove: removeRecentSearch,
    onRecentClear: clearRecentSearches,
    onFilterClick: () => setFilterOpen(true),
    showFilterActive,
  };

  return (
    <>
      <ResponsiveView
        mobile={<SearchMobile {...viewProps} results={results} />}
        tablet={<SearchTablet {...viewProps} results={desktopResults} />}
        desktop={<SearchDesktop {...viewProps} results={desktopResults} />}
      />

      <CategoryFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={categoryFilters}
        onApply={handleCategoryFiltersApply}
      />
    </>
  );
}

export default SearchResponsive;
