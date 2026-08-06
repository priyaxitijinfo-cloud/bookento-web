"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bookmark, Heart, MessageCircle, MoreHorizontal, Share2, Volume2, VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { UserBottomNav } from "@/components/layout/user-nav";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { reels } from "@/mock/reels";
import { providerDetailRoute } from "@/constants/routes.constants";

export default function ReelsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(() =>
    Object.fromEntries(reels.map((r) => [r.id, r.isLiked])),
  );

  const activeReel = reels[activeIndex];

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScroll = (e) => {
    const container = e.target;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex && index >= 0 && index < reels.length) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="bg-black relative h-dvh overflow-hidden">
      <div
        className="h-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
        onScroll={handleScroll}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="relative h-dvh w-full snap-start snap-always">
            {/* Video placeholder */}
            <div className="absolute inset-0">
              <Image
                src={reel.thumbnailUrl}
                alt={reel.caption}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {index === activeIndex && (
                <video
                  src={reel.videoUrl}
                  className="absolute inset-0 size-full object-cover"
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>

            {/* Top bar */}
            <div className="safe-top absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
              <h1 className="text-lg font-bold text-white">Reels</h1>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setMuted(!muted)}
              >
                {muted ? <VolumeX /> : <Volume2 />}
              </Button>
            </div>

            {/* Side actions */}
            <div className="absolute bottom-28 right-4 z-10 flex flex-col items-center gap-5">
              <Link href={providerDetailRoute(reel.providerId)}>
                <Avatar src={reel.providerAvatar} name={reel.providerName} size="md" className="border-2 border-white" />
              </Link>
              <button
                type="button"
                className="flex flex-col items-center gap-1 text-white"
                onClick={() => toggleLike(reel.id)}
              >
                <Heart className={`size-7 ${liked[reel.id] ? "fill-red-500 text-red-500" : ""}`} />
                <span className="text-xs">{(reel.likes + (liked[reel.id] && !reel.isLiked ? 1 : 0)).toLocaleString()}</span>
              </button>
              <button type="button" className="flex flex-col items-center gap-1 text-white">
                <MessageCircle className="size-7" />
                <span className="text-xs">{reel.comments}</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-1 text-white"
                onClick={() => toast.success("Link copied!")}
              >
                <Share2 className="size-7" />
                <span className="text-xs">{reel.shares}</span>
              </button>
              <button type="button" className="text-white">
                <Bookmark className="size-7" />
              </button>
              <button type="button" className="text-white">
                <MoreHorizontal className="size-7" />
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute inset-x-0 bottom-20 z-10 p-4 pb-2">
              <Link href={providerDetailRoute(reel.providerId)} className="font-semibold text-white hover:underline">
                {reel.providerName}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-white/90">{reel.caption}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {reel.hashtags.map((tag) => (
                  <span key={tag} className="text-xs text-white/70">{tag}</span>
                ))}
              </div>
              <p className="mt-2 text-xs text-white/60">{reel.views.toLocaleString()} views</p>
            </div>
          </div>
        ))}
      </div>
      <UserBottomNav />
    </div>
  );
}
