"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { CategoryProviderGridCard } from "@/components/category/category-provider-grid-card";
import { ProviderCard } from "@/components/shared/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { UserBottomNav } from "@/components/layout/user-nav";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

export function SearchInput({
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
          "focus-visible:ring-primary/30 focus-visible:bg-background focus-visible:ring-2 focus-visible:outline-none",
        )}
      />
    </div>
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
}) {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <header className="border-border bg-card safe-top sticky top-0 z-30 border-b">
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
              onChange={onQueryChange}
              placeholder={placeholder}
            />
          </div>
        </div>
      </header>

      <main className={cn(PAGE_CONTAINER_VARIANTS.wide, "space-y-4")}>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-foreground text-lg font-bold">{title}</h1>
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
          <div className="grid grid-cols-2 items-stretch gap-3">
            {results.map((provider) => (
              <CategoryProviderGridCard
                key={provider.listingKey || provider.id}
                provider={provider}
                fromCategory={categorySlug}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
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
