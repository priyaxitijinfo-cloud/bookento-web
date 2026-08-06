"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { resolveBackNavigation } from "@/lib/navigation/back-navigation";
import { reels } from "@/mock/reels";
import { useSavedReelsStore } from "@/store";
import { usePersistStoreHydration } from "@/hooks/use-persist-store-hydration";

import { ShortsDesktop, ShortsMobile, ShortsTablet } from "./ShortsMobile";

function ShortsContent() {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("from");
  const viewParam = searchParams.get("view");
  const back = resolveBackNavigation(fromQuery);
  const isSavedView =
    viewParam === "saved"
    || (viewParam !== "all" && fromQuery === "profile");
  const pageTitle = isSavedView ? "Saved Reels" : "Reels";

  const savedIds = useSavedReelsStore((state) => state.savedIds);
  const toggleSaved = useSavedReelsStore((state) => state.toggleSaved);
  const hasHydrated = usePersistStoreHydration(useSavedReelsStore);

  const [activeIndex, setActiveIndex] = useState(0);
  const [savedPlayerOpen, setSavedPlayerOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(() =>
    Object.fromEntries(reels.map((reel) => [reel.id, reel.isLiked])),
  );

  const desktopPlayerRef = useRef(null);
  const mobilePlayerRef = useRef(null);

  const savedReels = useMemo(
    () =>
      savedIds
        .map((reelId) => reels.find((reel) => reel.id === reelId))
        .filter(Boolean),
    [savedIds],
  );

  const visibleReels = isSavedView ? savedReels : reels;
  const showSavedGrid = isSavedView && !savedPlayerOpen;
  const showPlayer = !showSavedGrid && hasHydrated && visibleReels.length > 0;
  const desktopPlayerEnabled = showPlayer && (!isSavedView || savedPlayerOpen);
  const mobilePlayerEnabled = isSavedView && savedPlayerOpen && showPlayer;

  useEffect(() => {
    if (!isSavedView) {
      setActiveIndex(0);
      setSavedPlayerOpen(false);
    }
  }, [isSavedView]);

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleSave = (reelId) => {
    const isNowSaved = toggleSaved(reelId);
    toast.success(isNowSaved ? "Saved" : "Removed from Saved");

    if (isSavedView && savedPlayerOpen && !isNowSaved) {
      const nextLength = useSavedReelsStore.getState().savedIds.length;

      if (nextLength === 0) {
        setSavedPlayerOpen(false);
      } else if (activeIndex >= nextLength) {
        setActiveIndex(Math.max(0, nextLength - 1));
      }
    }
  };

  const openSavedReel = (index) => {
    setActiveIndex(index);
    setSavedPlayerOpen(true);
  };

  const closeSavedPlayer = () => {
    setSavedPlayerOpen(false);
  };

  const playerProps = {
    visibleReels,
    activeIndex,
    setActiveIndex,
    pageTitle,
    muted,
    setMuted,
    liked,
    toggleLike,
    savedIds,
    onToggleSave: handleToggleSave,
  };

  const savedPlayerProps = {
    ...playerProps,
    onBack: closeSavedPlayer,
    backLabel: "Back to collection",
  };

  const feedPlayerProps = {
    ...playerProps,
    backHref: back.href,
    backLabel: back.label,
    enableFeedFilter: true,
  };

  const breadcrumbProps = {
    backHref: isSavedView && savedPlayerOpen ? undefined : back.href,
    backLabel: isSavedView && savedPlayerOpen ? "Back to collection" : back.label,
    onBack: isSavedView && savedPlayerOpen ? closeSavedPlayer : undefined,
    currentLabel: pageTitle,
  };

  const viewProps = {
    showSavedGrid,
    pageTitle,
    back,
    hasHydrated,
    savedReels,
    savedIds,
    onSelectReel: openSavedReel,
    onToggleSave: handleToggleSave,
    isSavedView,
    savedPlayerOpen,
    visibleReels,
    mobilePlayerEnabled,
    mobilePlayerRef,
    savedPlayerProps,
    feedPlayerProps,
    activeIndex,
    setActiveIndex,
    playerEnabled: desktopPlayerEnabled,
    playerRef: desktopPlayerRef,
    breadcrumbProps,
  };

  return (
    <ResponsiveView
      mobile={<ShortsMobile {...viewProps} />}
      tablet={<ShortsTablet {...viewProps} />}
      desktop={<ShortsDesktop {...viewProps} />}
    />
  );
}

export function ShortsResponsive() {
  return (
    <Suspense fallback={null}>
      <ShortsContent />
    </Suspense>
  );
}

export default ShortsResponsive;
