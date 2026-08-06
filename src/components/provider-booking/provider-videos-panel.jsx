"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProviderReelsViewer } from "@/components/provider-booking/provider-reels-viewer";
import { TabPanelHeader } from "@/components/provider-booking/shared";
import { getCategoryBookingData } from "@/constants/category-booking.constants";
import { getReelsByProvider } from "@/mock/reels";
import { formatCompactNumber } from "@/utils/format.utils";

function mapReelToVideoItem(reel) {
  return {
    ...reel,
    title: reel.title || reel.caption.split("!")[0],
    handle: reel.handle || reel.providerName,
    packageId: reel.packageId || reel.linkedPackageId,
  };
}

function getProviderVideoItems(categorySlug, provider) {
  if (!categorySlug) {
    return [];
  }

  const categoryBookingData = getCategoryBookingData(categorySlug, provider.businessName);
  if (categoryBookingData?.reels?.length) {
    return categoryBookingData.reels;
  }

  return getReelsByProvider(provider.id)
    .slice(0, 5)
    .map(mapReelToVideoItem);
}

function mapProviderReels(reels, provider) {
  return reels.map((reel) => ({
    ...reel,
    providerId: provider.id,
    providerName: provider.businessName,
    providerAvatar: provider.avatar,
  }));
}

function VideoReelTile({ video, onClick }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return undefined;

    const startPreview = async () => {
      element.muted = true;
      try {
        await element.play();
      } catch {
        element.currentTime = 1;
      }
    };

    if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
      startPreview();
    } else {
      element.addEventListener("loadedmetadata", startPreview, { once: true });
    }

    return () => {
      element.pause();
    };
  }, [video.videoUrl]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-900 text-left"
      aria-label={`Play video with ${formatCompactNumber(video.views)} views`}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="size-full object-cover"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
      <div className="pointer-events-none absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-white">
        <img src="/images/icons/play.svg" alt="" className="size-3.5 shrink-0" aria-hidden />
        <span className="text-xs font-bold tracking-wide">{formatCompactNumber(video.views)}</span>
      </div>
    </button>
  );
}

export function ProviderVideosPanel({ provider, categorySlug }) {
  const searchParams = useSearchParams();
  const [viewerIndex, setViewerIndex] = useState(null);

  const videos = useMemo(() => {
    const items = getProviderVideoItems(categorySlug, provider);
    return mapProviderReels(items, provider);
  }, [categorySlug, provider]);

  useEffect(() => {
    const reelId = searchParams.get("reel");
    if (!reelId || videos.length === 0) return;

    const index = videos.findIndex((video) => video.id === reelId);
    if (index >= 0) setViewerIndex(index);
  }, [searchParams, videos]);

  const handleCloseViewer = () => {
    setViewerIndex(null);

    if (typeof window !== "undefined" && searchParams.get("reel")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("reel");
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div>
      <TabPanelHeader
        title="Videos"
        description="Explore clinic, facilities & moments"
      />

      {videos.length === 0 ? (
        <p className="text-muted-foreground text-sm">No videos available.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {videos.map((video, index) => (
            <VideoReelTile
              key={video.id}
              video={video}
              onClick={() => setViewerIndex(index)}
            />
          ))}
        </div>
      )}

      {viewerIndex !== null && (
        <ProviderReelsViewer
          key={viewerIndex}
          reels={videos}
          provider={provider}
          initialIndex={viewerIndex}
          categorySlug={categorySlug}
          showAllReels
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
}
