"use client";

import { useEffect, useRef } from "react";

import { DOCTOR_WELLNESS_PACKAGES } from "@/constants/doctor-booking.constants";

function resolveLinkedPackage(reel) {
  const packageId = reel.packageId || reel.linkedPackageId;
  if (packageId) {
    return DOCTOR_WELLNESS_PACKAGES.find((pkg) => pkg.id === packageId) ?? DOCTOR_WELLNESS_PACKAGES[0];
  }
  return DOCTOR_WELLNESS_PACKAGES[0];
}

export function ReelSlide({
  reel,
  provider,
  isActive,
  muted,
  slideHeight,
  onBookNow,
}) {
  const videoRef = useRef(null);
  const linkedPackage = resolveLinkedPackage(reel);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!isActive) {
      video.pause();
      return undefined;
    }

    video.muted = muted;

    const playVideo = () => {
      const attempt = video.play();
      if (attempt) {
        attempt.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
    }

    return () => video.removeEventListener("canplay", playVideo);
  }, [isActive, muted, reel.videoUrl]);

  return (
    <div
      className="relative w-full shrink-0 snap-start snap-always snap-stop-always"
      style={{ height: slideHeight > 0 ? slideHeight : "100%" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-zinc-950">
        {reel.thumbnailUrl && !reel.thumbnailUrl.endsWith(".mp4") && (
          <img
            src={reel.thumbnailUrl}
            alt={reel.title || reel.caption}
            className="size-full object-cover"
          />
        )}
        {reel.videoUrl && (
          <video
            key={reel.videoUrl}
            ref={videoRef}
            src={reel.videoUrl}
            className="absolute inset-0 size-full object-cover"
            loop
            muted={muted}
            playsInline
            preload={isActive ? "auto" : "metadata"}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/25" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4">
        <div className="mb-2.5 flex items-center gap-2">
          <div className="size-8 shrink-0 overflow-hidden rounded-full border-2 border-white">
            <img src={provider.avatar} alt={provider.businessName} className="size-full object-cover" />
          </div>
          <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-0.5 backdrop-blur-md">
            <span className="text-xs font-normal text-white/95">
              @{reel.handle || provider.businessName}
            </span>
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug text-white">{reel.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm font-normal leading-relaxed text-white/85">{reel.caption}</p>

        {linkedPackage && (
          <div className="pointer-events-auto mt-3 overflow-hidden rounded-xl bg-background p-4 shadow-[0_8px_32px_rgba(15,23,42,0.12)]">
            <div className="flex items-start gap-3">
              <div className="size-16 shrink-0 overflow-hidden rounded-xl">
                <img src={linkedPackage.image} alt={linkedPackage.name} className="size-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-base font-semibold leading-snug text-[#1E293B]">
                  {linkedPackage.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span className="text-base font-semibold text-[#2563EB]">₹{linkedPackage.price}</span>
                  <span className="text-sm font-normal text-[#94A3B8] line-through">₹{linkedPackage.originalPrice}</span>
                  <span className="rounded-full bg-[#FDF2F8] px-2 py-0.5 text-xs font-medium text-[#E11D48]">
                    {linkedPackage.discountPercent}% OFF
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onBookNow(linkedPackage.id)}
              className="mt-3 flex w-full items-center justify-center gap-0.5 rounded-xl bg-[#F43F5E] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E11D48]"
            >
              Book Now
              <span className="text-white/75">&gt;&gt;&gt;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
