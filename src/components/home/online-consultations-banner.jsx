"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, ShieldCheck, Video } from "lucide-react";

import { categoryListingRoute } from "@/constants/routes.constants";
import { useRequireLoginToBook } from "@/hooks/use-require-login-to-book";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

/** icons/Rectangle 3464120.svg — soft diagonal media frame */
const MEDIA_CLIP = "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)";

const POINTS = [
  { icon: ShieldCheck, key: "onlineConsultTrust1Title" },
  { icon: ShieldCheck, key: "onlineConsultTrust2Title" },
  { icon: Clock3, key: "onlineConsultTrust3Title" },
];

/**
 * Online Consultations — website banner, stacked on mobile.
 */
export function OnlineConsultationsBanner({ className }) {
  const { t } = useWebLocale();
  const { getBookHref } = useRequireLoginToBook();
  const href = getBookHref(categoryListingRoute("doctor"));

  return (
    <section
      id="online-consultations"
      aria-label={t("onlineConsultAria")}
      className={cn(
        "scroll-mt-28",
        "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        className,
      )}
    >
      <div className="relative overflow-hidden bg-[#0B1B32]">
        <div className="relative grid min-h-0 lg:min-h-[28rem] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.28fr)] xl:min-h-[32rem]">
          {/* Copy — navy panel */}
          <div
            className={cn(
              "relative z-10 flex flex-col justify-center",
              "px-4 py-10 md:px-[4.875rem] md:py-12 xl:px-[5.875rem] xl:py-16",
            )}
          >
            {/* Same as web — centered on mobile only */}
            <div className="mx-auto max-w-xl text-center md:mx-0 md:translate-x-6 md:text-left lg:translate-x-10">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#7EB6FF] uppercase">
                {t("onlineConsultEyebrow")}
              </p>

              <h2 className="mt-4 text-[2rem] leading-[1.12] font-bold tracking-tight text-white md:text-[2.35rem] xl:text-[2.75rem]">
                <span className="block md:whitespace-nowrap">
                  {t("onlineConsultTitle1")}
                </span>
                <span className="mt-1 block md:whitespace-nowrap">
                  {t("onlineConsultTitle2")}
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-md text-[0.98rem] leading-relaxed text-white/85 md:mx-0">
                {t("onlineConsultBody1")}
              </p>

              <div className="mt-8 flex justify-center md:justify-start">
                <Link
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[0.92rem] font-semibold text-[#0B1B32]",
                    "focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B32] focus-visible:outline-none",
                    "transition-transform duration-300 hover:-translate-y-0.5",
                  )}
                >
                  {t("onlineConsultCta")}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>

              <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2.5 md:justify-start">
                {POINTS.map(({ icon: Icon, key }) => (
                  <li
                    key={key}
                    className="inline-flex items-center gap-2 text-[0.8rem] font-medium text-white/90"
                  >
                    <Icon className="size-3.5 text-white" strokeWidth={2} aria-hidden />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Media — full width under copy on mobile, diagonal on desktop */}
          <div className="relative min-h-[14rem] md:min-h-[18rem] lg:min-h-full">
            <div className="absolute inset-0 lg:hidden">
              <Image
                src="/images/online-consultations-photo.png"
                alt={t("onlineConsultAlt")}
                fill
                className="object-cover object-[58%_42%]"
                sizes="100vw"
                unoptimized
              />
            </div>
            <div
              className="absolute inset-0 hidden lg:block"
              style={{ clipPath: MEDIA_CLIP }}
            >
              <Image
                src="/images/online-consultations-photo.png"
                alt={t("onlineConsultAlt")}
                fill
                className="object-cover object-[58%_42%]"
                sizes="(min-width: 1280px) 55vw, 50vw"
                unoptimized
              />
            </div>

            <div
              className={cn(
                "online-consult-float absolute top-[16%] left-[12%] z-20 hidden md:left-[18%] lg:left-[20%] lg:flex",
                "items-center gap-2 rounded-full bg-white px-3.5 py-2",
                "shadow-[0_14px_32px_-14px_rgba(15,27,45,0.45)]",
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-[#1865EA]/10 text-[#1865EA]">
                <Video className="size-3.5" strokeWidth={2.25} aria-hidden />
              </span>
              <span className="pr-1 text-[0.78rem] font-semibold text-[#0F1B2D]">
                {t("onlineConsultChipTitle")}
                <span className="font-medium text-[#5B6472]">
                  {" "}
                  • {t("onlineConsultChipMeta")}
                </span>
              </span>
              <span
                aria-hidden
                className="absolute top-full left-8 -mt-px border-x-[7px] border-t-[8px] border-x-transparent border-t-white"
              />
            </div>

            <Link
              href={href}
              className="absolute inset-0 z-10 focus-visible:outline-none"
              aria-label={t("onlineConsultCta")}
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
