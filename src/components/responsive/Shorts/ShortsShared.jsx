"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";

import { UserBottomNav } from "@/components/layout/user-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

import { ReelsPlayerShell, SavedReelsGrid } from "./ShortsContent";

export function ShortsSavedGridSection({
  pageTitle,
  backHref,
  backLabel,
  hasHydrated,
  savedReels,
  savedIds,
  onSelectReel,
  onToggleSave,
  gridClassName,
  mainClassName,
  showMobileHeader = true,
}) {
  return (
    <>
      {showMobileHeader ? (
        <header className="safe-top flex items-center gap-3 border-b border-border bg-surface-page px-4 py-3">
          <Link
            href={backHref}
            className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            aria-label={backLabel}
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-foreground text-lg font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground text-xs">
              {hasHydrated
                ? `${savedReels.length} reel${savedReels.length !== 1 ? "s" : ""}`
                : "\u00a0"}
            </p>
          </div>
        </header>
      ) : null}

      <main className={cn("mx-auto max-w-7xl px-2 py-4", mainClassName)}>
        {!hasHydrated ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : savedReels.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved reels yet"
            description="Tap the bookmark icon on any reel to save it here."
            actionLabel="Browse all reels"
            onAction={() => {
              window.location.href = `${ROUTES.REELS}?view=all`;
            }}
          />
        ) : (
          <SavedReelsGrid
            className={gridClassName}
            savedReels={savedReels}
            savedIds={savedIds}
            onSelectReel={onSelectReel}
            onToggleSave={onToggleSave}
          />
        )}
      </main>
    </>
  );
}

export function ShortsPlayerSection({
  hasHydrated,
  visibleReels,
  playerEnabled,
  playerProps,
  playerRef,
  activeIndex,
  setActiveIndex,
  playerHeightClass,
  playerContainerClass,
  showEmptySaved = true,
}) {
  return (
    <main className={cn("mx-auto max-w-7xl", playerContainerClass)}>
      <div
        className={cn(
          "relative mx-auto min-h-0 w-full max-w-md overflow-hidden bg-black",
          playerHeightClass,
        )}
      >
        {!hasHydrated ? (
          <div className="flex h-full items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        ) : visibleReels.length === 0 && showEmptySaved ? (
          <div className="flex h-full items-center justify-center bg-surface-page p-6">
            <EmptyState
              icon={Bookmark}
              title="No saved reels yet"
              description="Tap the bookmark icon on any reel to save it here."
              actionLabel="Browse all reels"
              onAction={() => {
                window.location.href = `${ROUTES.REELS}?view=all`;
              }}
            />
          </div>
        ) : (
          <ReelsPlayerShell
            enabled={playerEnabled}
            {...playerProps}
            scrollRef={playerRef}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        )}
      </div>
    </main>
  );
}

export function ShortsMobileShell({ showSavedGrid, children }) {
  return (
    <div
      className={cn(
        "relative min-h-dvh pb-20",
        showSavedGrid ? "overflow-visible bg-surface-page" : "overflow-hidden bg-black",
      )}
    >
      {children}
      <UserBottomNav />
    </div>
  );
}
