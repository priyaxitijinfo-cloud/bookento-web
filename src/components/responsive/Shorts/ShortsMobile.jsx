"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

import { ReelsPlayerShell, SavedReelsGrid } from "./ShortsContent";
import {
  ShortsMobileShell,
  ShortsPlayerSection,
  ShortsSavedGridSection,
} from "./ShortsShared";

export function ShortsMobile({
  showSavedGrid,
  pageTitle,
  back,
  hasHydrated,
  savedReels,
  savedIds,
  onSelectReel,
  onToggleSave,
  isSavedView,
  savedPlayerOpen,
  hasHydrated: hydrated,
  visibleReels,
  mobilePlayerEnabled,
  mobilePlayerRef,
  savedPlayerProps,
  feedPlayerProps,
  activeIndex,
  setActiveIndex,
  playerEnabled,
  playerRef,
}) {
  if (showSavedGrid) {
    return (
      <ShortsMobileShell showSavedGrid>
        <ShortsSavedGridSection
          pageTitle={pageTitle}
          backHref={back.href}
          backLabel={back.label}
          hasHydrated={hasHydrated}
          savedReels={savedReels}
          savedIds={savedIds}
          onSelectReel={onSelectReel}
          onToggleSave={onToggleSave}
          gridClassName="-mt-[15px] grid grid-cols-3 gap-1"
        />
      </ShortsMobileShell>
    );
  }

  return (
    <ShortsMobileShell showSavedGrid={false}>
      {!isSavedView || !savedPlayerOpen ? (
        <ShortsPlayerSection
          hasHydrated={hydrated}
          visibleReels={visibleReels}
          playerEnabled={playerEnabled}
          playerProps={isSavedView ? savedPlayerProps : feedPlayerProps}
          playerRef={playerRef}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          playerHeightClass="h-dvh md:h-[calc(100dvh-5rem)]"
          playerContainerClass="w-full px-0"
          playerFrameClass="max-w-none md:max-w-md"
        />
      ) : null}

      {mobilePlayerEnabled ? (
        <div className="fixed inset-0 z-50 min-h-0 bg-black">
          <ReelsPlayerShell
            enabled={mobilePlayerEnabled}
            {...savedPlayerProps}
            scrollRef={mobilePlayerRef}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            flushBottom
          />
        </div>
      ) : null}
    </ShortsMobileShell>
  );
}

export function ShortsTablet({
  showSavedGrid,
  pageTitle,
  back,
  hasHydrated,
  savedReels,
  savedIds,
  onSelectReel,
  onToggleSave,
  isSavedView,
  savedPlayerOpen,
  visibleReels,
  savedPlayerProps,
  feedPlayerProps,
  activeIndex,
  setActiveIndex,
  playerEnabled,
  playerRef,
  breadcrumbProps,
}) {
  if (showSavedGrid) {
    return (
      <div className="bg-surface-page relative min-h-dvh overflow-visible pb-8">
        <div
          className={cn(
            "border-border bg-background/90 sticky top-0 z-30 border-b backdrop-blur-md",
          )}
        >
          <HomeHeader embedded />
          <DesktopBreadcrumbBar {...breadcrumbProps} />
        </div>
        <ShortsSavedGridSection
          pageTitle={pageTitle}
          backHref={back.href}
          backLabel={back.label}
          hasHydrated={hasHydrated}
          savedReels={savedReels}
          savedIds={savedIds}
          onSelectReel={onSelectReel}
          onToggleSave={onToggleSave}
          showMobileHeader={false}
          mainClassName="px-6 py-6"
          gridClassName="grid grid-cols-4 gap-3"
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-page relative min-h-dvh overflow-hidden pb-8">
      <div
        className={cn(
          "border-border bg-background/90 sticky top-0 z-30 border-b backdrop-blur-md",
        )}
      >
        <HomeHeader embedded />
        <DesktopBreadcrumbBar {...breadcrumbProps} />
      </div>
      <ShortsPlayerSection
        hasHydrated={hasHydrated}
        visibleReels={visibleReels}
        playerEnabled={playerEnabled}
        playerProps={isSavedView ? savedPlayerProps : feedPlayerProps}
        playerRef={playerRef}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        playerHeightClass="h-[calc(100dvh-8rem)] rounded-2xl shadow-card-hover"
        playerContainerClass={cn(
          "px-6 py-6",
          isSavedView && savedPlayerOpen && "hidden",
        )}
      />
    </div>
  );
}

export function ShortsDesktop({
  showSavedGrid,
  pageTitle,
  back,
  hasHydrated,
  savedReels,
  savedIds,
  onSelectReel,
  onToggleSave,
  isSavedView,
  savedPlayerOpen,
  visibleReels,
  savedPlayerProps,
  feedPlayerProps,
  activeIndex,
  setActiveIndex,
  playerEnabled,
  playerRef,
  breadcrumbProps,
}) {
  /** Desktop all-reels: show full gallery grid first, then open player on click */
  const [allPlayerOpen, setAllPlayerOpen] = useState(false);
  const showAllReelsGrid = !isSavedView && !allPlayerOpen;

  const openAllReel = (index) => {
    setActiveIndex(index);
    setAllPlayerOpen(true);
  };

  const closeAllPlayer = () => {
    setAllPlayerOpen(false);
  };

  if (showSavedGrid) {
    return (
      <DesktopLayout
        maxWidth="wide"
        showHeaderBorder={false}
        contentClassName="md:!pt-0 lg:!pt-0"
        containerClassName="md:!pt-0"
        header={
          <>
            <HomeHeader embedded />
            <DesktopBreadcrumbBar
              backHref={back.href}
              backLabel={back.label}
              currentLabel="Saved Reels"
            />
          </>
        }
      >
        {!hasHydrated ? (
          <ResponsiveGrid mobile={2} tablet={3} desktop={5} gap="gap-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} className="aspect-[3/4] rounded-2xl" />
            ))}
          </ResponsiveGrid>
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
            className="grid grid-cols-5 gap-3"
            variant="desktop"
            savedReels={savedReels}
            savedIds={savedIds}
            onSelectReel={onSelectReel}
            onToggleSave={onToggleSave}
          />
        )}
      </DesktopLayout>
    );
  }

  if (showAllReelsGrid) {
    return (
      <DesktopLayout
        maxWidth="wide"
        showHeaderBorder={false}
        contentClassName="md:!pt-0 lg:!pt-0"
        containerClassName="md:!pt-0"
        header={
          <>
            <HomeHeader embedded />
            <DesktopBreadcrumbBar
              backHref={back.href}
              backLabel={back.label}
              currentLabel={pageTitle}
            />
          </>
        }
      >
        {!hasHydrated ? (
          <ResponsiveGrid mobile={2} tablet={3} desktop={5} gap="gap-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} className="aspect-[3/4] rounded-2xl" />
            ))}
          </ResponsiveGrid>
        ) : visibleReels.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No reels yet"
            description="New provider reels will show up here."
          />
        ) : (
          <SavedReelsGrid
            className="grid grid-cols-5 gap-3"
            variant="desktop"
            savedReels={visibleReels}
            savedIds={savedIds}
            onSelectReel={openAllReel}
            onToggleSave={onToggleSave}
          />
        )}
      </DesktopLayout>
    );
  }

  const desktopFeedPlayerProps = !isSavedView
    ? {
        ...feedPlayerProps,
        onBack: closeAllPlayer,
        backLabel: "Back to all reels",
        backHref: undefined,
      }
    : feedPlayerProps;

  return (
    <DesktopLayout
      maxWidth="wide"
      showHeaderBorder={
        (isSavedView && savedPlayerOpen) || allPlayerOpen ? false : undefined
      }
      header={
        <>
          {(isSavedView && savedPlayerOpen) || allPlayerOpen ? (
            <HomeHeader embedded />
          ) : null}
          <DesktopBreadcrumbBar
            {...(allPlayerOpen
              ? {
                  currentLabel: pageTitle,
                  onBack: closeAllPlayer,
                  backLabel: "Back to all reels",
                }
              : breadcrumbProps)}
          />
        </>
      }
      contentClassName={
        (isSavedView && savedPlayerOpen) || allPlayerOpen
          ? "min-h-[calc(100dvh-4.25rem-3rem)] md:!pt-0 lg:!pt-0"
          : "min-h-[calc(100dvh-4.25rem-3rem)]"
      }
      containerClassName={
        (isSavedView && savedPlayerOpen) || allPlayerOpen ? "md:!pt-0" : undefined
      }
    >
      <ShortsPlayerSection
        hasHydrated={hasHydrated}
        visibleReels={visibleReels}
        playerEnabled={playerEnabled}
        playerProps={isSavedView ? savedPlayerProps : desktopFeedPlayerProps}
        playerRef={playerRef}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        playerHeightClass="h-[calc(100dvh-4.25rem-3rem-3rem)] rounded-2xl shadow-card-hover"
        playerContainerClass="px-0 py-0"
      />
    </DesktopLayout>
  );
}
