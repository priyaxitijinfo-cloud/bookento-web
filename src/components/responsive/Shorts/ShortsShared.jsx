"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";

import { UserBottomNav } from "@/components/layout/user-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { ROUTES } from "@/constants/routes.constants";
import {
  MOBILE_HEADER_BACK_CLASS,
  MOBILE_HEADER_BACK_TITLE_GROUP_CLASS,
  MOBILE_HEADER_CLASS,
  MOBILE_HEADER_INNER_CLASS,
  MOBILE_HEADER_TITLE_CLASS,
} from "@/lib/layout/mobile-header.constants";
import { cn } from "@/lib/utils";

import { ReelsPlayerShell, SavedReelsGrid } from "./ShortsContent";

function ReelsEmptyStateMobile() {
  return (
    <IllustrationEmptyState
      src="/icons/reels.png"
      title="No Reels Yet"
      description={
        <>
          <span className="block">You haven&apos;t saved anything yet.</span>
          <span className="block">Save your favorite Reels to access them.</span>
        </>
      }
      className="md:hidden"
      imageClassName="size-[188px]"
    />
  );
}

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
        <header className={cn(MOBILE_HEADER_CLASS, "md:hidden")}>
          <div className={cn(MOBILE_HEADER_INNER_CLASS, "justify-between")}>
            <div className={MOBILE_HEADER_BACK_TITLE_GROUP_CLASS}>
              <Link
                href={backHref}
                className={MOBILE_HEADER_BACK_CLASS}
                aria-label={backLabel}
              >
                <ArrowLeft className="size-5" strokeWidth={2.25} />
              </Link>
              <h1 className={MOBILE_HEADER_TITLE_CLASS}>
                {hasHydrated && savedReels.length === 0 ? "Reels" : pageTitle}
              </h1>
            </div>
          </div>
        </header>
      ) : null}

      <main className={cn("mx-auto max-w-7xl px-2 py-4", mainClassName)}>
        {!hasHydrated ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : savedReels.length === 0 ? (
          <>
            <ReelsEmptyStateMobile />
            <div className="hidden md:block">
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
          </>
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
  playerFrameClass,
  showEmptySaved = true,
}) {
  return (
    <main className={cn("mx-auto max-w-7xl", playerContainerClass)}>
      <div
        className={cn(
          "relative mx-auto min-h-0 w-full overflow-hidden bg-black",
          playerFrameClass ?? "max-w-md",
          playerHeightClass,
        )}
      >
        {!hasHydrated ? (
          <div className="flex h-full items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        ) : visibleReels.length === 0 && showEmptySaved ? (
          <div className="bg-surface-page flex h-full items-center justify-center p-6">
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
        "relative min-h-dvh",
        showSavedGrid
          ? "bg-surface-page overflow-visible pb-20"
          : "overflow-hidden bg-black pb-0",
      )}
    >
      {children}
      <UserBottomNav />
    </div>
  );
}
