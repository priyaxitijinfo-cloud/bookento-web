"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { UserBottomNav } from "@/components/layout/user-nav";
import { ProviderCard } from "@/components/shared/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { useDebounce } from "@/hooks/use-debounce";
import { getCategoryListingProviders } from "@/mock/category-listing-providers";
import { mockProviders } from "@/mock/providers";
import { cn } from "@/lib/utils";
import {
  DESKTOP_STICKY_HEADER_CLASS,
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageFallback() {
  return (
    <div className="bg-background min-h-dvh pb-20">
      <div className="border-border h-14 border-b md:hidden" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="bg-muted h-11 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

function SearchInput({
  inputRef,
  query,
  onChange,
  placeholder,
  className,
}) {
  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "border-border/80 bg-surface-subtle text-foreground placeholder:text-muted-foreground",
          "h-11 w-full rounded-lg border pr-4 pl-10 text-sm",
          "focus-visible:ring-primary/30 focus-visible:bg-white focus-visible:ring-2 focus-visible:outline-none",
        )}
      />
    </div>
  );
}

function SearchPageContent() {
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

  return (
    <div className={PAGE_SHELL_CLASS}>
      <header className="border-border bg-card safe-top sticky top-0 z-30 border-b md:hidden">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="text-foreground hover:text-primary flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </Link>

            <SearchInput
              inputRef={inputRef}
              query={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
          </div>
        </div>
      </header>

      <div className={DESKTOP_STICKY_HEADER_CLASS}>
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={backHref}
          backLabel={backLabel}
          currentLabel={title}
        />
      </div>

      <main className={cn(PAGE_CONTAINER_VARIANTS.wide, "space-y-4")}>
        <SearchInput
          className="hidden md:block"
          query={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-foreground text-lg font-bold md:text-xl">{title}</h1>
          <p className="text-muted-foreground text-sm">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No results found"
            description={
              debouncedQuery.trim()
                ? `No matches for "${debouncedQuery.trim()}". Try a different name or specialty.`
                : "Start typing to search providers."
            }
          />
        ) : category ? (
          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
            {results.map((provider) => (
              <CategoryProviderGridCard
                key={provider.listingKey || provider.id}
                provider={provider}
                fromCategory={categorySlug}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </main>

      <UserBottomNav />
    </div>
  );
}
