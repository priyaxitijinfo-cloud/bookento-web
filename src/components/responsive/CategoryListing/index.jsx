"use client";

import { notFound } from "next/navigation";
import { useMemo, useState } from "react";

import {
  DEFAULT_CATEGORY_FILTERS,
  clearAllSheetFilters,
  clearSheetFilter,
  filterProvidersByCategoryFilters,
  hasActiveCategoryFilters,
  hasAppliedSearchFilters,
} from "@/components/category/category-filter-sheet";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { UserBottomNav } from "@/components/layout/user-nav";
import { CATEGORY_LISTING_CONFIG } from "@/constants/category-listing.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { useDebounce } from "@/hooks/use-debounce";
import { getCategoryListingProviders } from "@/mock/category-listing-providers";

import { CategoryListingDesktop } from "./CategoryListingDesktop";
import { CategoryListingMobile, CategoryListingTablet } from "./CategoryListingMobile";

function filterProvidersBySearch(list, query) {
  const term = query.trim().toLowerCase();
  if (!term) return list;

  return list.filter((provider) => {
    const name = provider.businessName?.toLowerCase() || "";
    const specialty = provider.specialty?.toLowerCase() || "";
    return name.includes(term) || specialty.includes(term);
  });
}

export function CategoryListingResponsive({ slug }) {
  const category = getHomeCategoryBySlug(slug);
  const config = CATEGORY_LISTING_CONFIG[slug];

  if (!category || !config) notFound();

  const [filters, setFilters] = useState(DEFAULT_CATEGORY_FILTERS);
  const [sheetFiltersApplied, setSheetFiltersApplied] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 250);

  const providers = useMemo(() => {
    const list = getCategoryListingProviders(slug, category.categoryId, filters.specialty);
    const filtered = filterProvidersByCategoryFilters(list, filters, sheetFiltersApplied);
    return filterProvidersBySearch(filtered, debouncedSearch);
  }, [slug, category.categoryId, filters, sheetFiltersApplied, debouncedSearch]);

  const hasSearchQuery = debouncedSearch.trim().length > 0;
  const filtersActive = hasActiveCategoryFilters(filters, sheetFiltersApplied);

  const handleApplySheetFilters = (nextFilters) => {
    setFilters(nextFilters);
    setSheetFiltersApplied(hasAppliedSearchFilters(nextFilters));
    setFilterOpen(false);
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

  const handleResetFilters = () => {
    setFilters(DEFAULT_CATEGORY_FILTERS);
    setSheetFiltersApplied(false);
  };

  const viewProps = {
    category,
    slug,
    config,
    filters,
    onSpecialtyChange: (specialty) => setFilters((current) => ({ ...current, specialty })),
    sheetFiltersApplied,
    onRemoveSheetFilter: handleRemoveSheetFilter,
    onClearSheetFilters: handleClearSheetFilters,
    filterOpen,
    onFilterClose: () => setFilterOpen(false),
    onFilterOpen: () => setFilterOpen(true),
    onApplySheetFilters: handleApplySheetFilters,
    searchOpen,
    onSearchOpenChange: setSearchOpen,
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    filtersActive,
    providers,
    hasSearchQuery,
    debouncedSearch,
    onResetFilters: handleResetFilters,
    onSearchToggle: handleSearchToggle,
  };

  return (
    <>
      <ResponsiveView
        mobile={<CategoryListingMobile {...viewProps} />}
        tablet={<CategoryListingTablet {...viewProps} />}
        desktop={<CategoryListingDesktop {...viewProps} />}
      />
      <UserBottomNav />
    </>
  );
}

export default CategoryListingResponsive;
