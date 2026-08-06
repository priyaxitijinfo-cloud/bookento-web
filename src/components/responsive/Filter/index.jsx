"use client";

import { useMemo, useState } from "react";

import {
  DEFAULT_CATEGORY_FILTERS,
  clearAllSheetFilters,
  clearSheetFilter,
  filterProvidersByCategoryFilters,
  hasAppliedSearchFilters,
} from "@/components/category/category-filter-sheet";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { CATEGORY_LISTING_CONFIG } from "@/constants/category-listing.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { ROUTES } from "@/constants/routes.constants";
import { getCategoryListingProviders } from "@/mock/category-listing-providers";

import { FilterDesktop } from "./FilterDesktop";
import { FilterMobile } from "./FilterMobile";
import { FilterTablet } from "./FilterTablet";

const DEFAULT_SLUG = "doctor";

function toListingProvider(provider) {
  return {
    id: provider.id,
    listingKey: provider.id,
    businessName: provider.businessName,
    specialty: provider.specialty,
    avatar: provider.avatar,
    rating: provider.rating,
    distance: provider.distance,
    startingPrice: provider.startingPrice,
    serviceModes: provider.serviceModes?.length ? provider.serviceModes : ["in_clinic", "online"],
  };
}

export function FilterResponsive({
  slug = DEFAULT_SLUG,
  title = "Filters",
  backHref = ROUTES.PROVIDERS,
  backLabel = "Back to Providers",
  specialtyFilters: specialtyFiltersProp,
  initialFilters,
  onMoreFilters,
}) {
  const config = CATEGORY_LISTING_CONFIG[slug] ?? CATEGORY_LISTING_CONFIG[DEFAULT_SLUG];
  const category = getHomeCategoryBySlug(slug) ?? getHomeCategoryBySlug(DEFAULT_SLUG);
  const specialtyFilters = specialtyFiltersProp ?? config.subFilters;

  const [filters, setFilters] = useState(initialFilters ?? DEFAULT_CATEGORY_FILTERS);
  const [sheetFiltersApplied, setSheetFiltersApplied] = useState(false);

  const providers = useMemo(() => {
    const list = getCategoryListingProviders(slug, category.categoryId, filters.specialty);
    const filtered = filterProvidersByCategoryFilters(list, filters, sheetFiltersApplied);
    return filtered.map(toListingProvider);
  }, [slug, category.categoryId, filters, sheetFiltersApplied]);

  const handleRemoveSheetFilter = (key) => {
    const nextFilters = clearSheetFilter(filters, key);
    setFilters(nextFilters);
    setSheetFiltersApplied(hasAppliedSearchFilters(nextFilters));
  };

  const handleClearSheetFilters = () => {
    setFilters(clearAllSheetFilters(filters));
    setSheetFiltersApplied(false);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_CATEGORY_FILTERS);
    setSheetFiltersApplied(false);
  };

  const sharedProps = {
    title,
    backHref,
    backLabel,
    specialtyFilters,
    activeSpecialty: filters.specialty,
    onSpecialtyChange: (specialty) => setFilters((current) => ({ ...current, specialty })),
    sheetFilters: sheetFiltersApplied ? filters : null,
    onRemoveSheetFilter: handleRemoveSheetFilter,
    onClearSheetFilters: handleClearSheetFilters,
    providers,
    onResetFilters: handleResetFilters,
    onMoreFilters,
  };

  return (
    <ResponsiveView
      mobile={<FilterMobile {...sharedProps} />}
      tablet={<FilterTablet {...sharedProps} />}
      desktop={<FilterDesktop {...sharedProps} />}
    />
  );
}

export default FilterResponsive;
