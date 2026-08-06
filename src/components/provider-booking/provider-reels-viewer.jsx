"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LayoutGrid, Volume2, VolumeX, X } from "lucide-react";
import { toast } from "sonner";

import { ReelSlide } from "@/components/provider-booking/reels/reel-slide";
import { ReelsFeedToggle } from "@/components/provider-booking/reels/reels-feed-toggle";
import {
  REELS_ACTION_ICONS,
  ReelsActionButton,
  ReelsCategorySheet,
  ReelsCommentsSheet,
  ReelsReportSheet,
  ReelsShareSheet,
} from "@/components/provider-booking/reels/reels-sheets";
import { categoryListingRoute, providerPackageRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store";
import { formatCompactNumber } from "@/utils/format.utils";

export function ProviderReelsViewer({
  reels,
  provider,
  initialIndex = 0,
  categorySlug = null,
  isDoctorFlow = false,
  showAllReels = false,
  onClose,
}) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const wheelLockRef = useRef(false);
  const muteHideTimerRef = useRef(null);
  const { setProviderId, setPackageId } = useBookingStore();
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showMuteControl, setShowMuteControl] = useState(false);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [feedFilter, setFeedFilter] = useState("popular");
  const [activeSheet, setActiveSheet] = useState(null);
  const [slideHeight, setSlideHeight] = useState(0);

  const filteredReels = useMemo(() => {
    if (showAllReels) return reels;

    if (feedFilter === "nearby") {
      return reels.filter((reel) => reel.isNearby !== false);
    }
    return reels.filter((reel) => reel.isPopular !== false);
  }, [feedFilter, reels, showAllReels]);

  const getFilteredIndex = useCallback(
    (sourceIndex, filter = feedFilter) => {
      if (showAllReels) return sourceIndex;

      const targetReel = reels[sourceIndex];
      if (!targetReel) return 0;
      const list =
        filter === "nearby"
          ? reels.filter((reel) => reel.isNearby !== false)
          : reels.filter((reel) => reel.isPopular !== false);
      const index = list.findIndex((reel) => reel.id === targetReel.id);
      return index >= 0 ? index : 0;
    },
    [feedFilter, reels, showAllReels],
  );

  const [activeIndex, setActiveIndex] = useState(() =>
    showAllReels ? initialIndex : getFilteredIndex(initialIndex),
  );

  const scrollToIndex = useCallback((index, behavior = "auto") => {
    const container = scrollRef.current;
    if (!container || slideHeight <= 0) return;
    container.scrollTo({ top: index * slideHeight, behavior });
  }, [slideHeight]);

  const activeReel = filteredReels[activeIndex] || filteredReels[0];

  const revealMuteControl = useCallback(() => {
    setShowMuteControl(true);
    if (muteHideTimerRef.current) clearTimeout(muteHideTimerRef.current);
    muteHideTimerRef.current = window.setTimeout(() => {
      setShowMuteControl(false);
    }, 2500);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setMuted((value) => !value);
    revealMuteControl();
  }, [revealMuteControl]);

  const handleReelTap = useCallback(
    (event) => {
      if (event.target.closest("button, a, [data-no-reel-tap]")) return;
      revealMuteControl();
    },
    [revealMuteControl],
  );

  useEffect(() => {
    setShowMuteControl(false);
    if (muteHideTimerRef.current) clearTimeout(muteHideTimerRef.current);
  }, [activeIndex]);

  useEffect(
    () => () => {
      if (muteHideTimerRef.current) clearTimeout(muteHideTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const updateSlideHeight = () => {
      const height = container.clientHeight;
      if (height > 0) setSlideHeight(height);
    };

    updateSlideHeight();
    const observer = new ResizeObserver(updateSlideHeight);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nextIndex = showAllReels ? initialIndex : getFilteredIndex(initialIndex, feedFilter);
    setActiveIndex(nextIndex);
    if (slideHeight > 0) scrollToIndex(nextIndex);
  }, [feedFilter, getFilteredIndex, initialIndex, scrollToIndex, showAllReels, slideHeight]);

  useEffect(() => {
    if (slideHeight <= 0 || activeSheet) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, filteredReels.length - 1);
        if (nextIndex !== activeIndex) {
          setActiveIndex(nextIndex);
          scrollToIndex(nextIndex, "smooth");
        }
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = Math.max(activeIndex - 1, 0);
        if (nextIndex !== activeIndex) {
          setActiveIndex(nextIndex);
          scrollToIndex(nextIndex, "smooth");
        }
      }
      if (event.key === "Escape" && !activeSheet) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, activeSheet, filteredReels.length, onClose, scrollToIndex, slideHeight]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || slideHeight <= 0) return;
    const index = Math.round(container.scrollTop / slideHeight);
    if (index >= 0 && index < filteredReels.length) setActiveIndex(index);
  }, [filteredReels.length, slideHeight]);

  const handleWheel = useCallback((event) => {
    if (activeSheet || slideHeight <= 0 || wheelLockRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), filteredReels.length - 1);
    if (nextIndex === activeIndex) return;
    wheelLockRef.current = true;
    setActiveIndex(nextIndex);
    scrollToIndex(nextIndex, "smooth");
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 450);
  }, [activeIndex, activeSheet, filteredReels.length, scrollToIndex, slideHeight]);

  const handleBookNow = (packageId) => {
    setProviderId(provider.id);
    setPackageId(packageId);
    const url = `${providerPackageRoute(provider.id, packageId)}${categorySlug ? `?from=${categorySlug}` : ""}`;
    onClose();
    router.push(url);
  };

  const handleToggleSave = useCallback((reelId) => {
    setSaved((prev) => {
      const next = !prev[reelId];
      toast.success(next ? "Saved to collection" : "Removed from saved");
      return { ...prev, [reelId]: next };
    });
  }, []);

  const handleCategoryApply = (slug) => {
    router.push(categoryListingRoute(slug));
  };

  const handleFeedFilterChange = (filter) => {
    if (filter === feedFilter) return;

    const currentReelId = filteredReels[activeIndex]?.id;
    const nextList =
      filter === "nearby"
        ? reels.filter((reel) => reel.isNearby !== false)
        : reels.filter((reel) => reel.isPopular !== false);

    let nextIndex = 0;
    if (currentReelId) {
      const found = nextList.findIndex((reel) => reel.id === currentReelId);
      nextIndex = found >= 0 ? found : 0;
    }

    setFeedFilter(filter);
    setActiveIndex(nextIndex);
    requestAnimationFrame(() => scrollToIndex(nextIndex));
  };

  if (!mounted) return null;

  if (filteredReels.length === 0) {
    return createPortal(
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4">
        <div className="max-w-sm rounded-2xl bg-background p-6 text-center">
          <p className="font-semibold">No reels found</p>
          <p className="text-muted-foreground mt-2 text-sm">Try switching between Popular and Nearby.</p>
          <button type="button" onClick={onClose} className="gradient-brand mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-white hover:opacity-95">
            Close
          </button>
        </div>
      </div>,
      document.body,
    );
  }

  const viewerContent = (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-0 md:p-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-[120] flex size-10 items-center justify-center rounded-full bg-background/15 text-white backdrop-blur md:hidden"
          aria-label="Close reels"
        >
          <X className="size-5" />
        </button>

        <div className="relative h-dvh w-full max-w-[420px] md:h-[min(90vh,820px)]">
          <div className="relative h-full overflow-hidden bg-black md:rounded-2xl md:shadow-2xl">
            <div className="absolute right-3 top-3 z-20 hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => setActiveSheet("category")}
                className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
                aria-label="Open categories"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
                aria-label="Close reels"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onWheel={handleWheel}
              onClick={handleReelTap}
              className="h-full w-full touch-pan-y snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth scrollbar-hide"
            >
              {filteredReels.map((reel, index) => (
                <ReelSlide
                  key={reel.id}
                  reel={reel}
                  provider={provider}
                  isActive={index === activeIndex}
                  muted={muted}
                  slideHeight={slideHeight}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          </div>

          {activeReel && !activeSheet && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-4">
                <ReelsFeedToggle value={feedFilter} onChange={handleFeedFilterChange} />
                {!showAllReels && (
                  <button
                    type="button"
                    onClick={() => setActiveSheet("category")}
                    className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md md:hidden"
                    aria-label="Open categories"
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                )}
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-300",
                  showMuteControl ? "opacity-100" : "opacity-0",
                )}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleMuteToggle();
                  }}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-transform duration-300",
                    showMuteControl ? "pointer-events-auto scale-100" : "pointer-events-none scale-95",
                  )}
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-hidden={!showMuteControl}
                  tabIndex={showMuteControl ? 0 : -1}
                >
                  {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </button>
              </div>

              <div
                className={cn(
                  "pointer-events-auto absolute right-3 z-50 flex w-11 flex-col items-center gap-3 md:right-4",
                  showAllReels ? "bottom-[198px] md:bottom-[182px]" : "bottom-[200px]",
                )}
              >
              <ReelsActionButton
                icon={REELS_ACTION_ICONS.like}
                activeIcon={REELS_ACTION_ICONS.likeActive}
                label={formatCompactNumber(activeReel.likes + (liked[activeReel.id] ? 1 : 0))}
                onClick={() => {
                  setLiked((prev) => {
                    const next = !prev[activeReel.id];
                    toast.success(next ? "Added to liked" : "Removed from liked");
                    return { ...prev, [activeReel.id]: next };
                  });
                }}
                active={Boolean(liked[activeReel.id])}
              />
              <ReelsActionButton
                icon={REELS_ACTION_ICONS.comment}
                label={String(activeReel.comments)}
                onClick={() => setActiveSheet("comments")}
              />
              <ReelsActionButton
                icon={REELS_ACTION_ICONS.share}
                onClick={() => setActiveSheet("share")}
              />
              <ReelsActionButton
                icon={REELS_ACTION_ICONS.save}
                activeIcon={REELS_ACTION_ICONS.saveActive}
                onClick={() => handleToggleSave(activeReel.id)}
                active={Boolean(saved[activeReel.id])}
              />
              <ReelsActionButton
                icon={REELS_ACTION_ICONS.report}
                onClick={() => setActiveSheet("report")}
              />
              </div>
            </>
          )}

          <ReelsCommentsSheet
            open={activeSheet === "comments"}
            onClose={() => setActiveSheet(null)}
            reel={activeReel}
            provider={provider}
            contained
          />
          <ReelsShareSheet
            open={activeSheet === "share"}
            onClose={() => setActiveSheet(null)}
            reel={activeReel}
            provider={provider}
            saved={saved}
            onToggleSave={handleToggleSave}
            contained
          />
          <ReelsReportSheet open={activeSheet === "report"} onClose={() => setActiveSheet(null)} contained />
          <ReelsCategorySheet
            open={activeSheet === "category"}
            onClose={() => setActiveSheet(null)}
            selectedCategory="doctor"
            onApply={handleCategoryApply}
            contained
          />
        </div>
      </div>
    </>
  );

  return createPortal(viewerContent, document.body);
}
