"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const AUTO_MS = 4200;

/** icons/Rectangle 3464116.svg — slant ≈ atan(90/770) */
const HERO_SKEW_DEG = 6.67;
const HERO_PANEL_RADIUS = "1.35rem";

/** Four panels — rightmost is the newly added home-care column */
const HERO_PANELS = [
  {
    id: "healthcare",
    labelKey: "heroPanelHealthcare",
    images: [
      "/images/desktop-hero-health-wellness.jpg",
      "/images/hero-panel-doctor.png",
      "/images/desktop-hero-health-hd.jpg",
    ],
    focuses: ["object-[60%_35%]", "object-[72%_28%]", "object-[62%_28%]"],
  },
  {
    id: "beauty",
    labelKey: "heroPanelBeauty",
    images: [
      "/images/hero-panel-beauty.png",
      "/images/desktop-hero-salon-hd.jpg",
      "/images/hero-panel-spa.png",
    ],
    focuses: ["object-[70%_30%]", "object-[68%_32%]", "object-[72%_35%]"],
  },
  {
    id: "expert",
    labelKey: "heroPanelExpert",
    images: [
      "/images/hero-panel-consult.png",
      "/images/hero-panel-fitness.png",
      "/images/desktop-hero-spa-hd.jpg",
    ],
    focuses: ["object-[72%_28%]", "object-[70%_32%]", "object-[65%_30%]"],
  },
  {
    id: "home",
    labelKey: "heroPanelHome",
    images: [
      "/images/desktop-hero-home-hd.jpg",
      "/images/desktop-hero-spa.png",
      "/images/desktop-hero-spa.jpg",
    ],
    focuses: ["object-[65%_30%]", "object-[70%_35%]", "object-[68%_32%]"],
  },
];

function HeroImagePanel({ panel, activeIndex, wide }) {
  const { t } = useWebLocale();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => {
        setFrame((current) => (current + 1) % panel.images.length);
      },
      AUTO_MS + activeIndex * 450,
    );
    return () => window.clearInterval(timer);
  }, [panel.images.length, activeIndex]);

  return (
    <div
      className={cn("relative h-full min-h-0 min-w-0", wide ? "flex-[1.75]" : "flex-1")}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: HERO_PANEL_RADIUS,
          transform: `skewX(-${HERO_SKEW_DEG}deg)`,
        }}
      >
        <div
          className="relative h-full w-[128%]"
          style={{ transform: `skewX(${HERO_SKEW_DEG}deg) translateX(-11%)` }}
        >
          {panel.images.map((src, index) => (
            <div
              key={`${panel.id}-${src}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                index === frame ? "z-[1] opacity-100" : "z-0 opacity-0",
              )}
              aria-hidden={index !== frame}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={activeIndex === 0 && index === 0}
                unoptimized
                className={cn("object-cover", panel.focuses[index] || "object-center")}
                sizes={
                  wide
                    ? "(min-width: 1280px) 400px, 36vw"
                    : "(min-width: 1280px) 240px, 22vw"
                }
                draggable={false}
              />
            </div>
          ))}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent"
          />
        </div>
      </div>

      <span className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center">
        <span className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-[#0F1B2D] shadow-sm">
          {t(panel.labelKey)}
        </span>
      </span>
    </div>
  );
}

/**
 * Desktop discovery hero — left copy + search, right equal panels with names.
 * Mobile uses UpcomingAppointmentCard instead.
 */
export function HeroSection({ className }) {
  const { t } = useWebLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % HERO_PANELS.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, []);

  const activeWord = HERO_PANELS[wordIndex] ?? HERO_PANELS[0];

  function goSearch(value = query) {
    const q = value.trim();
    router.push(q ? `${ROUTES.SEARCH}?q=${encodeURIComponent(q)}` : ROUTES.SEARCH);
  }

  return (
    <section
      className={cn(
        "relative isolate z-20 hidden w-full overflow-hidden md:block",
        "min-h-[680px] bg-white lg:min-h-[720px] xl:min-h-[760px]",
        className,
      )}
      aria-label={t("heroAria")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(24,101,234,0.06),transparent_55%)]"
      />

      {/* All panels — same top/bottom inset + same gap */}
      <div
        className="absolute top-[15px] right-0 bottom-[15px] left-[4%] z-[1] flex items-stretch gap-5 lg:left-[3%] xl:left-[2%]"
        aria-hidden
      >
        {HERO_PANELS.map((panel, index) => (
          <HeroImagePanel
            key={panel.id}
            panel={panel}
            activeIndex={index}
            wide={index === 0}
          />
        ))}
      </div>

      <div
        className={cn(
          HOME_PAGE_CONTAINER,
          "relative z-10 grid h-full min-h-[inherit] items-center lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.4fr)]",
        )}
      >
        <div className="relative z-20 flex max-w-xl flex-col justify-center py-10 lg:py-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#1865EA] uppercase">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-3 max-w-[16ch] text-[2.45rem] leading-[1.08] font-bold tracking-tight text-[#0F1B2D] lg:text-[3rem] xl:text-[3.35rem]">
            <span className="block">
              {t("heroTitleLead") || "Your home, handled by"}
            </span>
            <span className="mt-1 block text-[#1865EA] transition-opacity duration-500">
              {t(activeWord.labelKey)}.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#667085] lg:text-base">
            {t("heroSubtitle")}
          </p>

          <form
            className="mt-8 flex w-full max-w-lg items-center gap-2 rounded-full bg-white/95 py-1.5 pr-1.5 pl-4 shadow-[0_10px_30px_rgba(15,27,45,0.10)] ring-1 ring-[#E8EDF5] backdrop-blur-sm"
            onSubmit={(event) => {
              event.preventDefault();
              goSearch();
            }}
          >
            <Search
              className="size-4 shrink-0 text-[#98A2B3]"
              strokeWidth={2.2}
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("heroSearchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0F1B2D] outline-none placeholder:text-[#98A2B3]"
              aria-label={t("heroSearchPlaceholder")}
            />
            <button
              type="submit"
              className="gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-95"
            >
              {t("heroSearch")}
              <ArrowRight className="size-3.5" strokeWidth={2.4} aria-hidden />
            </button>
          </form>
        </div>

        <div className="hidden lg:block" aria-hidden />
      </div>
    </section>
  );
}
