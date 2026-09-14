"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles, Video } from "lucide-react";

import { categoryListingRoute } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

/** icons/Rectangle 3464120.svg — soft diagonal media frame */
const MEDIA_CLIP = "polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%)";

const POINTS = [
  { icon: ShieldCheck, key: "onlineConsultTrust1Title" },
  { icon: Video, key: "onlineConsultTrust2Title" },
  { icon: Sparkles, key: "onlineConsultTrust3Title" },
];

/**
 * Desktop-only Online Consultations — editorial split with shaped photo.
 */
export function OnlineConsultationsBanner({ className }) {
  const { t } = useWebLocale();
  const href = categoryListingRoute("doctor");

  return (
    <section
      id="online-consultations"
      aria-label={t("onlineConsultAria")}
      className={cn("hidden scroll-mt-28 md:block", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.85rem]",
          "bg-[#FBFCFD] ring-1 ring-[#E7EEF6]",
          "shadow-[0_20px_50px_-34px_rgba(15,27,45,0.28)]",
        )}
      >
        {/* Quiet atmosphere — mint + soft sky, not heavy blue wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_0%_0%,rgba(16,185,129,0.07)_0%,transparent_42%),radial-gradient(70%_60%_at_100%_100%,rgba(24,101,234,0.06)_0%,transparent_46%)]"
        />

        <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
          {/* Copy */}
          <div className="relative z-10 flex flex-col justify-center px-9 py-10 lg:px-11 lg:py-12 xl:px-14 xl:py-14">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#3D4F66] uppercase ring-1 ring-[#E3EAF3]">
              <span className="size-1.5 rounded-full bg-[#10B981]" aria-hidden />
              {t("onlineConsultEyebrow")}
            </p>

            <h2 className="mt-5 text-[2.15rem] leading-[1.12] font-bold tracking-tight text-[#0F1B2D] xl:text-[2.55rem]">
              <span className="block whitespace-nowrap">
                {t("onlineConsultTitle1")}
              </span>
              <span className="mt-1 block whitespace-nowrap text-[#1865EA]">
                {t("onlineConsultTitle2")}
              </span>
            </h2>

            <p className="mt-4 text-[0.95rem] leading-relaxed text-[#5B6472]">
              <span className="block">{t("onlineConsultBody1")}</span>
              <span className="block">{t("onlineConsultBody2")}</span>
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl bg-[#0F1B2D] px-5 py-3 text-[0.92rem] font-semibold text-white",
                  "shadow-[0_14px_28px_-16px_rgba(15,27,45,0.55)]",
                  "focus-visible:ring-2 focus-visible:ring-[#1865EA] focus-visible:ring-offset-2 focus-visible:outline-none",
                  "transition-transform duration-300 hover:-translate-y-0.5",
                )}
              >
                {t("onlineConsultCta")}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#E8EEF5] pt-5">
              {POINTS.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-2 text-[0.8rem] font-medium text-[#3D4F66]"
                >
                  <Icon
                    className="size-3.5 text-[#1865EA]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          {/* Media — shape + photo only */}
          <div className="relative min-h-[19.5rem] lg:min-h-[24rem]">
            <div className="absolute inset-0" style={{ clipPath: MEDIA_CLIP }}>
              <Image
                src="/images/online-consultations-photo.png"
                alt={t("onlineConsultAlt")}
                fill
                className="object-cover object-[58%_42%]"
                sizes="(min-width: 1280px) 620px, (min-width: 768px) 48vw, 0px"
                priority={false}
              />
            </div>

            {/* Soft teal edge glow along the diagonal */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M16 0 L0 100"
                fill="none"
                stroke="rgba(16,185,129,0.28)"
                strokeWidth="0.6"
              />
            </svg>

            <div
              className={cn(
                "online-consult-float absolute top-[14%] left-[20%] z-20",
                "flex items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-2.5",
                "shadow-[0_16px_34px_-18px_rgba(15,27,45,0.5)] ring-1 ring-white",
              )}
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#0F1B2D] text-white">
                <Video className="size-4" strokeWidth={2} aria-hidden />
              </span>
              <span>
                <span className="block text-[0.78rem] leading-tight font-semibold text-[#0F1B2D]">
                  {t("onlineConsultChipTitle")}
                </span>
                <span className="mt-0.5 block text-[0.68rem] text-[#6B7280]">
                  {t("onlineConsultChipMeta")}
                </span>
              </span>
            </div>

            <Link
              href={href}
              className="absolute inset-0 z-10 focus-visible:outline-none"
              aria-label={t("onlineConsultCta")}
              tabIndex={-1}
              style={{ clipPath: MEDIA_CLIP }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
