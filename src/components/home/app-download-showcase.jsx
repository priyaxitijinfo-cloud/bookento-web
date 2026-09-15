"use client";

import Image from "next/image";

import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

function AppleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M16.7 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zm-2.3-6.8c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

function PlayColorIcon({ className }) {
  return (
    <img
      src="/icons/store/google-play-icon.png"
      alt=""
      width={26}
      height={26}
      className={cn("object-contain", className)}
      aria-hidden
    />
  );
}

function StoreBadge({ href, ariaLabel, eyebrow, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-[3.15rem] items-center gap-2.5 rounded-[10px] bg-[#0F1B2D] px-3.5",
        "shadow-[0_10px_24px_-14px_rgba(15,27,45,0.55)]",
        "transition-transform duration-200 hover:-translate-y-0.5",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:outline-none",
      )}
    >
      {icon}
      <span className="pr-1 text-left leading-none text-white">
        <span className="block text-[9px] font-medium tracking-wide text-white/75">
          {eyebrow}
        </span>
        <span className="mt-0.5 block text-[15px] font-semibold tracking-tight">
          {label}
        </span>
      </span>
    </a>
  );
}

/** Desktop-only app download — light reference-style banner */
export function AppDownloadShowcase({ className }) {
  const { t } = useWebLocale();

  return (
    <section aria-label={t("appAria")} className={cn("hidden md:block", className)}>
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-[1.75rem]",
          "bg-[#F0F7FF] ring-1 ring-[#D7E8FA]",
        )}
      >
        {/* Soft wave atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 120% 60% at 20% 0%, rgba(88,161,255,0.16), transparent 55%), radial-gradient(ellipse 90% 50% at 90% 100%, rgba(122,90,248,0.1), transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[18%] h-24 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg, transparent 0 18px, rgba(255,255,255,0.55) 18px 19px, transparent 19px 40px)",
          }}
        />

        <p
          className={cn(
            "font-script absolute top-6 right-8 z-20 hidden max-w-[9rem] text-right text-[1.55rem] leading-tight font-semibold text-[#1B3A5F] lg:block",
          )}
        >
          {t("appScript1")}
          <span className="relative mt-0.5 block">
            {t("appScript2")}
            <span
              aria-hidden
              className="absolute right-0 -bottom-1 left-[10%] h-[0.32rem] rounded-full bg-[#C6F405]"
            />
          </span>
        </p>

        <div className="relative z-10 grid min-h-[20rem] grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-6 px-9 pt-10 pb-0 lg:min-h-[22rem] lg:gap-8 lg:px-12 lg:pt-11">
          <div className="max-w-lg pb-10 lg:pb-11">
            <h2 className="text-[2.35rem] leading-[1.08] font-bold tracking-tight text-[#0F1B2D] lg:text-[2.75rem]">
              <span className="block">{t("appTitle1")}</span>
              <span className="mt-1 block text-[#1865EA]">{t("appTitle2")}</span>
            </h2>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#5B6B82]">
              {t("appBody")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <StoreBadge
                href="#"
                ariaLabel={`${t("appStoreEyebrow")} ${t("appStoreName")}`}
                eyebrow={t("appStoreEyebrow")}
                label={t("appStoreName")}
                icon={<AppleIcon className="size-[28px] text-white" />}
              />
              <StoreBadge
                href="#"
                ariaLabel={`${t("playEyebrow")} ${t("playName")}`}
                eyebrow={t("playEyebrow")}
                label={t("playName")}
                icon={<PlayColorIcon className="size-[24px]" />}
              />
            </div>
          </div>

          <div
            className="relative flex h-full min-h-[18rem] items-end justify-center lg:min-h-[20rem]"
            aria-hidden
          >
            <div className="relative mb-[-180px] w-full max-w-[26rem] drop-shadow-[0_22px_40px_rgba(24,101,234,0.18)] lg:max-w-[28rem]">
              <Image
                src="/images/app-mockups/app-phones.png"
                alt=""
                width={796}
                height={926}
                className="h-auto w-full object-contain object-bottom"
                sizes="(min-width: 1280px) 448px, 40vw"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
