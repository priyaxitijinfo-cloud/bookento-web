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
  /** Desktop-only full-bleed background image (web). */
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
  const hasDesktopBg = Boolean(backgroundImage);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex min-h-[11.5rem] flex-1 overflow-hidden rounded-[1.65rem]",
        "shadow-[0_14px_30px_-20px_rgba(15,27,45,0.3)] ring-1",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:ring-offset-2 focus-visible:outline-none",
        style.bg,
        style.ring,
        className,
      )}
    >
      {/* Web-only photo background */}
      {hasDesktopBg ? (
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          aria-hidden
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            className={cn("object-cover", backgroundPosition)}
            sizes="(min-width: 768px) 28vw, 0px"
            priority={false}
          />
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col justify-center py-5 pr-2 pl-5 sm:pl-6",
          hasDesktopBg && "md:max-w-[58%] md:pr-3",
        )}
      >
        {eyebrow ? (
          <p
            className={cn(
              "mb-2 hidden text-[10px] font-semibold tracking-[0.16em] uppercase md:block",
              style.eyebrow,
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h3
          className={cn(
            "text-[1.15rem] leading-[1.18] font-bold tracking-tight whitespace-pre-line sm:text-[1.28rem]",
            style.title,
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-2 max-w-[12.5rem] text-[12px] leading-relaxed whitespace-pre-line sm:text-[13px]",
            style.body,
          )}
        >
          {description}
        </p>
        <span
          className={cn(
            "mt-4 inline-flex size-10 items-center justify-center rounded-full bg-white",
            "shadow-[0_8px_18px_-10px_rgba(15,27,45,0.4)]",
          )}
          aria-hidden
        >
          <ArrowRight className="size-4 text-[#0F1B2D]" strokeWidth={2.5} />
        </span>
      </div>

      {/* Mobile / fallback illustration (hidden on web when photo bg is set) */}
      {illustration ? (
        <div
          className={cn(
            "relative w-[46%] shrink-0 self-stretch sm:w-[48%]",
            hasDesktopBg && "md:hidden",
          )}
        >
          <div className="absolute inset-0 flex items-end justify-end overflow-hidden">
            {illustration}
          </div>
        </div>
      ) : null}
    </Link>
  );
}
