"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Compact stacked promo card (Doctor / Salon).
 */
export function ServicePromoCard({
  href,
  title,
  description,
  eyebrow,
  tone = "doctor",
  illustration,
  /** Full-bleed background image (website). */
  backgroundImage,
  backgroundPosition = "object-center",
  className,
}) {
  const tones = {
    doctor: {
      bg: "bg-[linear-gradient(135deg,#E8F8EC_0%,#D5F2DC_55%,#F4FBF6_100%)]",
      ring: "ring-[#CDEBD6]",
      eyebrow: "text-[#5B6472]",
      title: "text-[#0F1B2D]",
      body: "text-[#5B6472]",
    },
    salon: {
      bg: "bg-[linear-gradient(135deg,#FFF0F3_0%,#FFE0E7_55%,#FFF7F9_100%)]",
      ring: "ring-[#F7D0D8]",
      eyebrow: "text-[#5B6472]",
      title: "text-[#0F1B2D]",
      body: "text-[#5B6472]",
    },
  };

  const style = tones[tone] ?? tones.doctor;
  const hasPhotoBg = Boolean(backgroundImage);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex min-h-[9.75rem] flex-1 overflow-hidden rounded-[1.35rem] md:min-h-[11.5rem] md:rounded-[1.65rem]",
        "ring-1",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:ring-offset-2 focus-visible:outline-none",
        style.bg,
        style.ring,
        className,
      )}
    >
      {hasPhotoBg ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={backgroundImage}
            alt=""
            fill
            unoptimized
            className={cn("object-cover", backgroundPosition)}
            sizes="(min-width: 768px) 28vw, 100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/35 to-transparent md:from-transparent md:via-transparent md:to-transparent" />
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col justify-center py-4 pr-2 pl-4 sm:pl-6 md:py-5 md:pl-5",
          hasPhotoBg && "max-w-[72%] md:max-w-[58%] md:pr-3",
        )}
      >
        {eyebrow ? (
          <p
            className={cn(
              "mb-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase md:mb-2",
              style.eyebrow,
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h3
          className={cn(
            "text-[1.05rem] leading-[1.18] font-bold tracking-tight whitespace-pre-line sm:text-[1.15rem] md:text-[1.28rem]",
            style.title,
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1.5 max-w-[12.5rem] text-[12px] leading-relaxed whitespace-pre-line sm:text-[13px] md:mt-2",
            style.body,
          )}
        >
          {description}
        </p>
        <span
          className={cn(
            "mt-3 inline-flex size-9 items-center justify-center rounded-full bg-white md:mt-4 md:size-10",
            "shadow-[0_8px_18px_-10px_rgba(15,27,45,0.4)]",
          )}
          aria-hidden
        >
          <ArrowRight className="size-4 text-[#0F1B2D]" strokeWidth={2.5} />
        </span>
      </div>

      {/* Fallback illustration only when no photo background */}
      {illustration && !hasPhotoBg ? (
        <div className="relative w-[46%] shrink-0 self-stretch sm:w-[48%]">
          <div className="absolute inset-0 flex items-end justify-end overflow-hidden">
            {illustration}
          </div>
        </div>
      ) : null}
    </Link>
  );
}
