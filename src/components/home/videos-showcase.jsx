"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { reels } from "@/mock/reels";
import { formatCompactNumber } from "@/utils/format.utils";

const SHOWCASE_REELS = reels.slice(0, 8);

function ReelPanel({ reel, play }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (play) {
      video.muted = true;
      const attempt = video.play();
      if (attempt) attempt.catch(() => {});
      return;
    }

    video.pause();
  }, [play]);

  return (
    <Link
      href={`${ROUTES.REELS}?view=all`}
      aria-label={`Watch ${reel.title}`}
      className={cn(
        "relative aspect-[9/16] w-[11rem] shrink-0 overflow-hidden rounded-[1.25rem]",
        "ring-1 ring-[#D0D5DD]/70 lg:w-[12rem] xl:w-[12.75rem]",
        "shadow-[0_14px_28px_-18px_rgba(15,23,42,0.35)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_20px_36px_-18px_rgba(24,101,234,0.28)]",
      )}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 size-full object-cover"
        muted
        playsInline
        loop
        preload="metadata"
        aria-hidden
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20"
      />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={reel.providerAvatar}
            alt=""
            className="size-6 rounded-full object-cover ring-1 ring-white/80"
          />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-white">
              @{reel.handle || reel.providerName}
            </p>
            <p className="truncate text-[10px] text-white/75">{reel.title}</p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2.5 text-[10px] font-medium text-white/85">
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3" aria-hidden />
            {formatCompactNumber(reel.likes || 0)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3" aria-hidden />
            {formatCompactNumber(reel.comments || 0)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Desktop-only — copy left, infinite scroll on the right */
export function VideosShowcase({ className }) {
  const stageRef = useRef(null);
  const [inView, setInView] = useState(false);
  const loop = [...SHOWCASE_REELS, ...SHOWCASE_REELS];

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="videos"
      aria-label="Provider videos"
      className={cn(
        "hidden scroll-mt-28 md:block",
        "md:relative md:left-1/2 md:w-screen md:max-w-[100vw] md:-translate-x-1/2",
        className,
      )}
    >
      <div className="relative overflow-x-clip border-y border-[#E8EDF5] bg-[#F7F8FA]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_35%,rgba(24,101,234,0.1)_0%,transparent_52%)]"
        />

        <div className="relative mx-auto w-full max-w-[calc(96rem-60px)] px-[4.875rem] py-14 xl:px-[5.875rem] xl:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-10 xl:gap-14">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-10 bg-[#C9D3E2]" />
                <span className="text-[12px] font-semibold tracking-[0.22em] text-[#1865EA] uppercase">
                  Videos
                </span>
              </div>

              <h2 className="mt-4 text-[calc(2.15rem-4px)] leading-[1.08] font-bold tracking-tight text-[#0F1B2D] lg:text-[2.5rem]">
                See the work.
                <span className="mt-1 block bg-[linear-gradient(105deg,#1865EA_0%,#58A1FF_100%)] bg-clip-text text-transparent">
                  Then book it.
                </span>
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-[#667085]">
                Real reels from Bookento providers — watch what they do, then book the
                same package in a tap.
              </p>

              <Link
                href={`${ROUTES.REELS}?view=all`}
                className={cn(
                  "gradient-brand mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5",
                  "text-sm font-semibold text-white transition-opacity hover:opacity-95",
                )}
              >
                Watch all reels
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div
              ref={stageRef}
              className={cn(
                "group/videos-marquee relative min-w-0 overflow-hidden py-4",
                "[mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)]",
                "[-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)]",
              )}
            >
              <div className="animate-videos-marquee flex w-max items-center gap-3.5 py-1 lg:gap-4">
                {loop.map((reel, index) => (
                  <ReelPanel
                    key={`${reel.id}-${index < SHOWCASE_REELS.length ? "a" : "b"}`}
                    reel={reel}
                    play={inView && index < SHOWCASE_REELS.length}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
