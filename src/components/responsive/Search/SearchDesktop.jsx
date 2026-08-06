"use client";

import { Search } from "lucide-react";

import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { ProviderCard } from "@/components/shared/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";

import { SearchInput } from "./SearchMobile";

export function SearchDesktop({
  inputRef,
  query,
  onQueryChange,
  placeholder,
  title,
  backHref,
  backLabel,
  results,
  category,
  categorySlug,
  debouncedQuery,
}) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={backHref}
          backLabel={backLabel}
          currentLabel={title}
        />
      )}
    >
      <div className="space-y-6">
        <SearchInput
          inputRef={inputRef}
          query={query}
          onChange={onQueryChange}
          placeholder={placeholder}
          className="max-w-2xl"
        />

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
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
          <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-5">
            {results.map((provider) => (
              <CategoryProviderGridCard
                key={provider.listingKey || provider.id}
                provider={provider}
                fromCategory={categorySlug}
              />
            ))}
          </ResponsiveGrid>
        ) : (
          <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-5">
            {results.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </ResponsiveGrid>
        )}
      </div>
    </DesktopLayout>
  );
}
