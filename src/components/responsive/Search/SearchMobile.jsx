"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { RecentSearchesList } from "@/components/search/recent-searches-list";
import { FilterIcon } from "@/components/icons/filter-icon";
import { SearchIcon } from "@/components/icons/search-icon";

import { CategoryProviderListCard } from "@/components/category/category-provider-list-card";
import { EmptyState } from "@/components/shared/empty-state";
import { UserBottomNav } from "@/components/layout/user-nav";
import { HOME_CATEGORIES } from "@/constants/home-categories";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

function getProviderCategorySlug(provider, activeCategorySlug) {
  return (
    provider.categorySlug ||
    activeCategorySlug ||
    HOME_CATEGORIES.find((item) => item.categoryId === provider.categoryId)?.slug
  );
}

export function SearchInput({
  inputRef,
  query,
  onChange,
  placeholder,
  className,
  pill = false,
}) {
  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "bg-background text-foreground placeholder:text-muted-foreground",
          "h-11 w-full border pr-4 pl-10 text-sm",
          "focus-visible:ring-primary/30 focus-visible:ring-2 focus-visible:outline-none",
          pill
            ? "rounded-full border-[#F2F2F2]"
            : "border-border/70 shadow-card rounded-lg focus-visible:bg-white",
        )}
      />
    </div>
  );
}

function HeaderIconButton({ href, onClick, label, children, className }) {
  const classes = cn(
    "border-[#F2F2F2] bg-background text-foreground",
    "flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors",
    "hover:text-primary",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label}>
      {children}
    </button>
  );
}

export function SearchMobile({
  inputRef,
  query,
  onQueryChange,
  placeholder,
  title,
  backHref,
  results,
  category,
  categorySlug,
  debouncedQuery,
  recentSearches,
  onRecentSelect,
  onRecentRemove,
  onRecentClear,
  onFilterClick,
  showFilterActive,
}) {
  const hasActiveQuery = Boolean(debouncedQuery.trim());

  return (
    <div className={PAGE_SHELL_CLASS}>
      <header className="safe-top md:bg-background sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-2.5">
            <HeaderIconButton href={backHref} label="Go back">
              <ArrowLeft className="size-5" />
            </HeaderIconButton>

            <SearchInput
              inputRef={inputRef}
              query={query}
              onChange={onQueryChange}
              placeholder={placeholder}
              pill
            />

            <HeaderIconButton
              onClick={onFilterClick}
              label="Filter"
              className="relative"
            >
              <FilterIcon className="size-5" />
              {showFilterActive ? (
                <span
                  className="bg-primary absolute top-2 right-2 size-1.5 rounded-full"
                  aria-hidden
                />
              ) : null}
            </HeaderIconButton>
          </div>
        </div>
      </header>

      <main
        className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "mt-1 space-y-4")}
      >
        {!hasActiveQuery ? (
          <RecentSearchesList
            searches={recentSearches}
            onSelect={onRecentSelect}
            onRemove={onRecentRemove}
            onClear={onRecentClear}
          />
        ) : (
          <>
            {results.length > 0 ? (
              <p className="text-muted-foreground px-1 text-sm">
                {results.length} result{results.length !== 1 ? "s" : ""} for &quot;
                {debouncedQuery.trim()}&quot;
              </p>
            ) : null}

            {results.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No results found"
                description={`No matches for "${debouncedQuery.trim()}". Try a different name or specialty.`}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((provider) => (
                  <CategoryProviderListCard
                    key={provider.listingKey || provider.id}
                    provider={provider}
                    fromCategory={getProviderCategorySlug(provider, categorySlug)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <UserBottomNav />
    </div>
  );
}
