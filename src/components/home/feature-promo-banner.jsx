"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

/**
 * Desktop-only seasonal offer banner — dark theme, structured layout.
 */
export function FeaturePromoBanner({ className }) {
  const { t } = useWebLocale();

  return (
    <section
      aria-label="Limited time offer"
      className={cn("hidden md:block", className)}
    >
      <div className="relative isolate overflow-hidden rounded-[1.85rem] bg-[#08101C]">
        {/* Seamless atmosphere — no hard center seam */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(24,101,234,0.28)_0%,transparent_52%),radial-gradient(ellipse_at_78%_45%,rgba(88,161,255,0.16)_0%,transparent_55%),radial-gradient(ellipse_at_50%_100%,rgba(24,101,234,0.1)_0%,transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(8,16,28,0.15)_0%,transparent_42%,rgba(24,101,234,0.1)_78%,rgba(24,101,234,0.18)_100%)]"
        />

        <div className="relative z-10 grid min-h-[20.5rem] grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] items-center gap-4 px-10 py-10 lg:min-h-[22rem] lg:px-12 lg:py-11">
          {/* Left copy */}
          <div className="relative z-20 max-w-xl">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-9 bg-[#58A1FF]/70" />
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#9EC5FF] uppercase">
                {t("promoEyebrow")}
              </span>
            </div>

            <h2 className="mt-5 text-[2.45rem] leading-[1.05] font-bold tracking-tight text-white lg:text-[2.85rem]">
              {t("promoTitle1")}
              <span className="mt-1 block text-[#7EB6FF]">{t("promoTitle2")}</span>
            </h2>

            <p className="mt-4 max-w-[28rem] text-[15px] leading-relaxed text-white/60">
              {t("promoBody")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={ROUTES.PROVIDERS}
                className={cn(
                  "group gradient-brand inline-flex items-center gap-2.5 rounded-full px-6 py-3",
                  "text-sm font-semibold text-white",
                  "shadow-[0_12px_28px_-12px_rgba(24,101,234,0.85)]",
                  "transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-105",
                  "focus-visible:ring-2 focus-visible:ring-[#58A1FF]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101C] focus-visible:outline-none",
                )}
              >
                {t("promoCta")}
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </Link>

              <span aria-hidden className="hidden h-8 w-px bg-white/15 sm:block" />

              <p className="inline-flex items-center gap-2 text-[13px] font-medium text-white/55">
                <Clock3
                  className="size-4 text-[#58A1FF]"
                  strokeWidth={2.2}
                  aria-hidden
                />
                {t("promoMeta")}
              </p>
            </div>
          </div>

          {/* Right visual composition */}
          <div className="relative h-full min-h-[17.5rem] lg:min-h-[19rem]" aria-hidden>
            {/* Soft glow blobs — blurred so they don’t read as a cut */}
            <span className="absolute top-[4%] right-[12%] size-[13rem] rounded-full bg-[#1865EA]/20 blur-2xl lg:size-[14.5rem]" />
            <span className="absolute top-[24%] right-[-4%] size-[11rem] rounded-full bg-[#58A1FF]/14 blur-2xl lg:size-[12rem]" />
            <span className="absolute right-[22%] bottom-[2%] size-[9rem] rounded-full bg-white/[0.06] blur-xl" />

            {/* Diagonal hatch circle */}
            <span
              className="absolute bottom-[8%] left-[2%] size-[4.25rem] rounded-full opacity-70 lg:size-[4.75rem]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-42deg, transparent 0 5px, rgba(88,161,255,0.28) 5px 7px)",
              }}
            />

            {/* Dot grid */}
            <span
              className="absolute top-[10%] right-[4%] h-14 w-14 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(158,197,255,0.55) 1.35px, transparent 1.45px)",
                backgroundSize: "11px 11px",
              }}
            />

            {/* Two photo cards — staggered, tilted like reference */}
            <div className="absolute inset-[2%_-2%_0%_0%]">
              {/* Back / lower-left — lifted, opposite tilt */}
              <div className="absolute bottom-[calc(22%-60px)] left-[calc(2%-20px)] z-10 h-[78%] w-[58%] rotate-[11deg] overflow-hidden rounded-[1.25rem] bg-white shadow-[0_18px_36px_-16px_rgba(0,0,0,0.75)] ring-2 ring-white/90">
                <Image
                  src="/images/promo-pet-grooming.jpg"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 24vw, 0px"
                  priority={false}
                />
              </div>

              {/* Front / upper-right — sits on top */}
              <div className="absolute top-0 right-[4%] z-20 h-[78%] w-[58%] -rotate-[11deg] overflow-hidden rounded-[1.25rem] bg-white shadow-[0_20px_40px_-16px_rgba(0,0,0,0.8)] ring-2 ring-white/90">
                <Image
                  src="/images/promo-selfcare-spa.jpg"
                  alt=""
                  fill
                  className="object-cover object-[center_40%]"
                  sizes="(min-width: 768px) 24vw, 0px"
                  priority={false}
                />
              </div>
            </div>

            {/* Script accent — bottom-right of photo stage */}
            <p className="font-script absolute right-[4%] -bottom-3 z-20 text-[1.55rem] leading-tight text-[#B8D4FF] lg:text-[1.75rem]">
              {t("promoScriptLine1")}
              <br />
              {t("promoScriptLine2")}
              <span aria-hidden className="mt-1 block h-px w-16 bg-[#B8D4FF]/45" />
            </p>

            {/* 40% offer badge — nestled between the two photo cards */}
            <div className="absolute bottom-[calc(10%-40px)] left-[calc(18%-160px)] z-30 flex size-[6.75rem] flex-col items-center justify-center rounded-full border-2 border-white bg-[#1865EA] text-center text-white shadow-[0_14px_32px_-12px_rgba(24,101,234,0.9)] lg:size-[7.25rem]">
              <span className="text-[9px] font-semibold tracking-[0.16em] uppercase opacity-90">
                {t("promoUpTo")}
              </span>
              <span className="mt-0.5 text-[2rem] leading-none font-bold tracking-tight lg:text-[2.15rem]">
                40%
              </span>
              <span className="mt-1 h-px w-7 bg-white/75" />
              <span className="mt-1 text-[8px] font-semibold tracking-[0.1em] uppercase opacity-90">
                {t("promoOffBookings")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
