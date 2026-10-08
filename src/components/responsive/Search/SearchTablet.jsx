"use client";

import { Search } from "lucide-react";

import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { ProviderCard } from "@/components/shared/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

import { SearchInput } from "./SearchMobile";

export function SearchTablet({
  inputRef,
  query,
  onQueryChange,
  placeholder,
  title,
  backHref,
  backLabel = "Back to Home",
  results,
  category,
  categorySlug,
  debouncedQuery,
}) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "pb-8")}>
      <div className="z-30 shrink-0 bg-white/95 backdrop-blur-md">
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={backHref}
          backLabel={backLabel}
          currentLabel={title}
        />
      </div>
      <header className="border-border bg-card sticky top-0 z-20 border-b">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <SearchInput
            inputRef={inputRef}
            query={query}
            onChange={onQueryChange}
            placeholder={placeholder}
          />
        </div>
      </header>

      <main className={cn(PAGE_CONTAINER_VARIANTS.wide, "space-y-4 pt-2")}>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-foreground text-xl font-bold">{title}</h1>
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
          <div className="grid grid-cols-3 items-stretch gap-4">
            {results.map((provider) => (
              <CategoryProviderGridCard
                key={provider.listingKey || provider.id}
                provider={provider}
                fromCategory={categorySlug}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {results.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </main>
      <HomeFooter className="mt-8 md:mt-10" />
    </div>
  );
}
