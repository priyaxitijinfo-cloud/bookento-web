"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { useDebounce } from "@/hooks/use-debounce";
import { getCategoryListingProviders } from "@/mock/category-listing-providers";
import { mockProviders } from "@/mock/providers";

import { SearchDesktop } from "./SearchDesktop";
import { SearchMobile } from "./SearchMobile";
import { SearchTablet } from "./SearchTablet";

export function SearchPageFallback() {
  return (
    <div className="bg-background min-h-dvh pb-20">
      <div className="border-border h-14 border-b" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="bg-muted h-11 animate-pulse rounded-lg" />
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
  const debouncedQuery = useDebounce(query, 250);

  const allProviders = useMemo(() => {
    if (category) {
      return getCategoryListingProviders(categorySlug, category.categoryId, "All");
    }
    return mockProviders;
  }, [category, categorySlug]);

  const results = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return allProviders;

    return allProviders.filter((provider) => {
      const name = provider.businessName?.toLowerCase() || "";
      const specialty = provider.specialty?.toLowerCase() || "";
      const city = provider.city?.toLowerCase() || "";
      return name.includes(term) || specialty.includes(term) || city.includes(term);
    });
  }, [allProviders, debouncedQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());

    const next = params.toString();
    router.replace(next ? `${ROUTES.SEARCH}?${next}` : ROUTES.SEARCH, { scroll: false });
  }, [categorySlug, debouncedQuery, router]);

  const backHref = categorySlug ? categoryListingRoute(categorySlug) : ROUTES.HOME;
  const backLabel = category ? `Back to ${category.name}` : "Back to Home";
  const title = category ? `Search ${category.name}` : "Search";
  const placeholder = category
    ? `Search ${category.name.toLowerCase()}...`
    : "Search providers, specialties...";

  const viewProps = {
    inputRef,
    query,
    onQueryChange: (event) => setQuery(event.target.value),
    placeholder,
    title,
    backHref,
    backLabel,
    results,
    category,
    categorySlug,
    debouncedQuery,
  };

  return (
    <ResponsiveView
      mobile={<SearchMobile {...viewProps} />}
      tablet={<SearchTablet {...viewProps} />}
      desktop={<SearchDesktop {...viewProps} />}
    />
  );
}

export default SearchResponsive;
