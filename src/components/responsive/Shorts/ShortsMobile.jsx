"use client";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { cn } from "@/lib/utils";

import { ReelsPlayerShell } from "./ShortsContent";
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
          playerHeightClass="h-[calc(100dvh-5rem)]"
          playerContainerClass="px-0"
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
      <div className="relative min-h-dvh overflow-visible bg-surface-page pb-8">
        <div className={cn("sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md")}>
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
    <div className="relative min-h-dvh overflow-hidden bg-surface-page pb-8">
      <div className={cn("sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md")}>
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
        playerContainerClass={cn("px-6 py-6", isSavedView && savedPlayerOpen && "hidden")}
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
      <DesktopLayout
        maxWidth="wide"
        header={<DesktopBreadcrumbBar {...breadcrumbProps} />}
        contentClassName="pb-6"
      >
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
          mainClassName="px-0 py-0"
          gridClassName="grid grid-cols-5 gap-3"
        />
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout
      maxWidth="wide"
      header={<DesktopBreadcrumbBar {...breadcrumbProps} />}
      contentClassName="min-h-[calc(100dvh-4.25rem-3rem)]"
    >
      <ShortsPlayerSection
        hasHydrated={hasHydrated}
        visibleReels={visibleReels}
        playerEnabled={playerEnabled}
        playerProps={isSavedView ? savedPlayerProps : feedPlayerProps}
        playerRef={playerRef}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        playerHeightClass="h-[calc(100dvh-4.25rem-3rem-3rem)] rounded-2xl shadow-card-hover"
        playerContainerClass="px-0 py-0"
      />
    </DesktopLayout>
  );
}
