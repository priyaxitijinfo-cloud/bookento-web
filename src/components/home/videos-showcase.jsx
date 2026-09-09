"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { reels } from "@/mock/reels";
import { formatCompactNumber } from "@/utils/format.utils";

const DEVICE_REELS = reels.slice(0, 3);

const DEVICE_POSE = [
  {
    rotate: "-8deg",
    y: "1.75rem",
    scale: 0.9,
    z: 10,
    delay: "0ms",
  },
  {
    rotate: "0deg",
    y: "0",
    scale: 1.05,
    z: 30,
    delay: "80ms",
  },
  {
    rotate: "8deg",
    y: "1.75rem",
    scale: 0.9,
    z: 10,
    delay: "160ms",
  },
];

function PhoneMockup({ reel, pose, play, className }) {
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
    <div
      className={cn(
        "relative w-[10.25rem] shrink-0 transition-transform duration-700 ease-out lg:w-[11.5rem] xl:w-[12.25rem]",
        className,
      )}
      style={{
        transform: `translateY(${pose.y}) rotate(${pose.rotate}) scale(${pose.scale})`,
        zIndex: pose.z,
        transitionDelay: pose.delay,
      }}
    >
      {/* Device shell */}
      <div
        className={cn(
          "relative aspect-[9/19] rounded-[2rem] bg-[#111827] p-[0.42rem]",
          "shadow-[0_32px_60px_-28px_rgba(15,23,42,0.65),inset_0_0_0_1px_rgba(255,255,255,0.08)]",
          "ring-1 ring-black/40",
        )}
      >
        {/* Side buttons */}
        <span
          aria-hidden
          className="absolute top-[18%] -left-[3px] h-10 w-[3px] rounded-l-full bg-[#1F2937]"
        />
        <span
          aria-hidden
          className="absolute top-[28%] -left-[3px] h-14 w-[3px] rounded-l-full bg-[#1F2937]"
        />
        <span
          aria-hidden
          className="absolute top-[24%] -right-[3px] h-16 w-[3px] rounded-r-full bg-[#1F2937]"
        />

        {/* Screen */}
        <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-black">
          {/* Dynamic island */}
          <div
            aria-hidden
            className="absolute top-2.5 left-1/2 z-20 h-5 w-[4.25rem] -translate-x-1/2 rounded-full bg-black"
          />

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
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25"
          />

          {/* Status-style top meta */}
          <div className="absolute top-9 right-0 left-0 z-10 flex items-center justify-between px-3.5">
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-white uppercase backdrop-blur-md">
              Reel
            </span>
            <span className="text-[10px] font-medium text-white/80">
              {formatCompactNumber(reel.views)}
            </span>
          </div>

          {/* Bottom provider chip */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reel.providerAvatar}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full object-cover ring-2 ring-white/35"
              />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">
                  {reel.providerName}
                </p>
                <p className="truncate text-[10px] text-white/65">{reel.title}</p>
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <span
            aria-hidden
            className="absolute bottom-1.5 left-1/2 z-20 h-1 w-16 -translate-x-1/2 rounded-full bg-white/40"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop-only — 3 phone mockups with playing reels.
 */
export function VideosShowcase({ className }) {
  const stageRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
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
      <div className="relative overflow-hidden border-y border-[#E8EDF5] bg-[#F7F8FA]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(24,101,234,0.1)_0%,transparent_52%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-[55%] -translate-x-1/2 rounded-[100%] bg-[#1865EA]/12 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[calc(96rem-60px)] px-[4.875rem] py-14 xl:px-[5.875rem] xl:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-8 xl:gap-12">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-10 bg-[#C9D3E2]" />
                <span className="text-[12px] font-semibold tracking-[0.22em] text-[#1865EA] uppercase">
                  Videos
                </span>
              </div>

              <h2 className="mt-4 text-[calc(2.15rem-4px)] leading-[1.08] font-bold tracking-tight text-[#0F1B2D] lg:text-[2.5rem]">
                Watch on device.
                <span className="mt-1 block bg-[linear-gradient(105deg,#1865EA_0%,#58A1FF_100%)] bg-clip-text text-transparent">
                  Book with confidence.
                </span>
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-[#667085]">
                Real reels from Bookento pros — playing live in phone mockups, just like
                the app.
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
              className="relative flex items-end justify-center gap-3 pb-2 lg:justify-end lg:gap-5 xl:gap-6"
            >
              {DEVICE_REELS.map((reel, index) => (
                <PhoneMockup
                  key={reel.id}
                  reel={reel}
                  pose={DEVICE_POSE[index]}
                  play={inView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
