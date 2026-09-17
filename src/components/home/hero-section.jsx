"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

import { ROUTES, categoryListingRoute } from "@/constants/routes.constants";
import { getHomeCategoryGradient, HOME_CATEGORIES } from "@/constants/home-categories";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";
import { useRecentSearchesStore } from "@/store";

const HOLD_AFTER_TYPE_MS = 2200;
const TYPE_STEP_MS = 85;
const HERO_PANEL_RADIUS = "1.35rem";

const MARK_TYPES = [
  "line",
  "curve",
  "brush",
  "wave",
  "dots",
  "zigzag",
  "double",
  "arc",
];

const CATEGORY_NAME_KEYS = {
  doctor: "catDoctor",
  salon: "catSalon",
  fitness: "catFitness",
  tutoring: "catTutoring",
  "pet-care": "catPetCare",
  homecare: "catHomecare",
  "kids-care": "catKidsCare",
  plumbing: "catPlumbing",
  automotive: "catAutomotive",
  gardening: "catGardening",
  cooking: "catCooking",
  events: "catEvents",
  carpenter: "catCarpenter",
  renovation: "catRenovation",
  shooting: "catShooting",
};

/** All landing categories — Doctor → Shooting */
const HERO_WORDS = HOME_CATEGORIES.map((category, index) => {
  const palette = getHomeCategoryGradient(category.slug);
  return {
    id: category.slug,
    name: category.name,
    labelKey: CATEGORY_NAME_KEYS[category.slug],
    mark: MARK_TYPES[index % MARK_TYPES.length],
    color: palette.color,
    gradient: palette.css,
    stops: palette.stops,
  };
});

/**
 * Synced slides from icons/hero img — adjacent panels never both women.
 * Even frames: Boy | Girl | Boy
 * Odd frames:  Girl | Boy | Girl
 */
const HERO_SLIDES = [
  // frame 0 — B | G | B
  [
    {
      src: "/images/hero/plumbing.png",
      labelKey: "catPlumbing",
      focus: "object-[48%_30%]",
    },
    {
      src: "/images/hero/doctor.png",
      labelKey: "catDoctor",
      focus: "object-[55%_20%]",
    },
    {
      src: "/images/hero/automotive.png",
      labelKey: "catAutomotive",
      focus: "object-[52%_28%]",
    },
  ],
  // frame 1 — G | B | G
  [
    { src: "/images/hero/salon.png", labelKey: "catSalon", focus: "object-[50%_28%]" },
    {
      src: "/images/hero/gardening.png",
      labelKey: "catGardening",
      focus: "object-[50%_32%]",
    },
    {
      src: "/images/hero/fitness.png",
      labelKey: "catFitness",
      focus: "object-[52%_22%]",
    },
  ],
  // frame 2 — B | G | B
  [
    {
      src: "/images/hero/events.png",
      labelKey: "catEvents",
      focus: "object-[48%_30%]",
    },
    {
      src: "/images/hero/cooking.png",
      labelKey: "catCooking",
      focus: "object-[55%_25%]",
    },
    {
      src: "/images/hero/renovation.png",
      labelKey: "catRenovation",
      focus: "object-[52%_28%]",
    },
  ],
  // frame 3 — G | B | G
  [
    {
      src: "/images/hero/homecare.png",
      labelKey: "catHomecare",
      focus: "object-[50%_25%]",
    },
    {
      src: "/images/hero/plumbing.png",
      labelKey: "catPlumbing",
      focus: "object-[48%_30%]",
    },
    {
      src: "/images/hero/pet-care.png",
      labelKey: "catPetCare",
      focus: "object-[50%_25%]",
    },
  ],
  // frame 4 — B | G | B
  [
    {
      src: "/images/hero/automotive.png",
      labelKey: "catAutomotive",
      focus: "object-[52%_28%]",
    },
    {
      src: "/images/hero/kids-care.png",
      labelKey: "catKidsCare",
      focus: "object-[50%_30%]",
    },
    {
      src: "/images/hero/gardening.png",
      labelKey: "catGardening",
      focus: "object-[50%_30%]",
    },
  ],
  // frame 5 — G | B | G
  [
    {
      src: "/images/hero/tutoring.png",
      labelKey: "catTutoring",
      focus: "object-[48%_28%]",
    },
    {
      src: "/images/hero/events.png",
      labelKey: "catEvents",
      focus: "object-[48%_30%]",
    },
    {
      src: "/images/hero/cooking.png",
      labelKey: "catCooking",
      focus: "object-[55%_25%]",
    },
  ],
];

const HERO_SLIDE_COUNT = HERO_SLIDES.length;
const HERO_PANEL_COUNT = 3;
/** Pause after the 3rd panel finishes before starting the next round */
const HERO_HOLD_MS = 2600;
/** Wait after one panel changes before the next panel changes */
const HERO_STAGGER_MS = 1800;
/** Change order: first → last → center (not left-to-right) */
const HERO_PANEL_ORDER = [0, 2, 1];

function HeroMarkGradient({ id, stops }) {
  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={stops[0]} />
        <stop offset="0.5" stopColor={stops[1]} />
        <stop offset="1" stopColor={stops[2]} />
      </linearGradient>
    </defs>
  );
}

function HeroWordMark({ type, color, gradient, stops }) {
  const stroke = gradient || color;
  const s = stops || [color, color, color];
  const gid = `hero-mark-${type}-${String(s[1] || color).replace("#", "")}`;

  if (type === "curve") {
    return (
      <svg
        className="hero-word-mark hero-word-mark--curve"
        viewBox="0 0 96 10"
        fill="none"
        aria-hidden
      >
        <HeroMarkGradient id={gid} stops={s} />
        <path
          d="M2 6.5 C24 10.5, 56 10.5, 94 4.5"
          stroke={`url(#${gid})`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "brush") {
    return (
      <svg
        className="hero-word-mark hero-word-mark--brush"
        viewBox="0 0 88 10"
        fill="none"
        aria-hidden
      >
        <HeroMarkGradient id={gid} stops={s} />
        <path
          d="M3 5.5 H85"
          stroke={`url(#${gid})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10 7.8 H52"
          stroke={`url(#${gid})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    );
  }

  if (type === "wave") {
    return (
      <svg
        className="hero-word-mark hero-word-mark--wave"
        viewBox="0 0 100 12"
        fill="none"
        aria-hidden
      >
        <HeroMarkGradient id={gid} stops={s} />
        <path
          d="M2 7 C12 2, 20 11, 32 6 C44 1, 52 11, 64 5.5 C76 0.5, 86 10, 98 5"
          stroke={`url(#${gid})`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "dots") {
    return (
      <svg
        className="hero-word-mark hero-word-mark--dots"
        viewBox="0 0 72 10"
        fill="none"
        aria-hidden
      >
        <HeroMarkGradient id={gid} stops={s} />
        {[8, 22, 36, 50, 64].map((x) => (
          <circle key={x} cx={x} cy="5" r="2.6" fill={`url(#${gid})`} />
        ))}
      </svg>
    );
  }

  if (type === "zigzag") {
    return (
      <svg
        className="hero-word-mark hero-word-mark--zigzag"
        viewBox="0 0 96 12"
        fill="none"
        aria-hidden
      >
        <HeroMarkGradient id={gid} stops={s} />
        <path
          d="M2 8 L14 3 L26 9 L38 3 L50 9 L62 3 L74 9 L86 4 L94 7"
          stroke={`url(#${gid})`}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "double") {
    return (
      <svg
        className="hero-word-mark hero-word-mark--double"
        viewBox="0 0 88 12"
        fill="none"
        aria-hidden
      >
        <HeroMarkGradient id={gid} stops={s} />
        <path
          d="M3 4 H85"
          stroke={`url(#${gid})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M10 8.5 H78"
          stroke={`url(#${gid})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    );
  }

  if (type === "arc") {
    return (
      <svg
        className="hero-word-mark hero-word-mark--arc"
        viewBox="0 0 100 12"
        fill="none"
        aria-hidden
      >
        <HeroMarkGradient id={gid} stops={s} />
        <path
          d="M4 4.5 C30 12, 70 12, 96 4"
          stroke={`url(#${gid})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <span
      aria-hidden
      className="hero-word-mark hero-word-mark--line"
      style={{ background: stroke }}
    />
  );
}

function HeroTypedWord({ text, mark, color, gradient, stops, onComplete }) {
  const [count, setCount] = useState(0);
  const safeText = text || "";
  const done = count >= safeText.length && safeText.length > 0;

  useEffect(() => {
    setCount(0);
    if (!safeText.length) {
      onComplete?.();
      return undefined;
    }

    let index = 0;
    let holdTimer = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index >= safeText.length) {
        window.clearInterval(timer);
        holdTimer = window.setTimeout(() => onComplete?.(), HOLD_AFTER_TYPE_MS);
      }
    }, TYPE_STEP_MS);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(holdTimer);
    };
  }, [safeText, onComplete]);

  return (
    <span className="hero-word-in" aria-label={safeText}>
      <span className="hero-word-typed" aria-hidden>
        <span className="hero-word-gradient" style={{ backgroundImage: gradient }}>
          {safeText.slice(0, count) || "\u00A0"}
        </span>
        <span
          className={cn("hero-word-caret", done && "hero-word-caret--hide")}
          style={{ backgroundColor: color }}
        />
      </span>
      <span className={cn("hero-word-mark-wrap", done && "hero-word-mark-wrap--show")}>
        <HeroWordMark type={mark} color={color} gradient={gradient} stops={stops} />
      </span>
    </span>
  );
}

function HeroImagePanel({ panelIndex, shortTop, frame }) {
  const { t } = useWebLocale();
  const activeSlide = HERO_SLIDES[frame]?.[panelIndex];
  if (!activeSlide) return null;

  // Preload all frames for this column so fades stay smooth
  const columnSlides = HERO_SLIDES.map((row) => row[panelIndex]);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      {shortTop ? (
        <div className="mb-2.5 flex shrink-0 justify-center lg:mb-3">
          <p
            className="font-script inline-block origin-center px-1 text-center text-[1.7rem] leading-[1.12] font-semibold tracking-[-0.01em] text-[#1B3A5F] lg:text-[1.9rem]"
            style={{ transform: "rotate(-8deg)" }}
          >
            <span className="block">{t("heroScript1")}</span>
            <span className="relative mt-0.5 inline-block">
              {t("heroScript2")}
              <span
                aria-hidden
                className="absolute right-0 -bottom-1 left-0 mx-auto h-[3.5px] w-[90%] rounded-full bg-[#C6F405]"
              />
            </span>
          </p>
        </div>
      ) : null}

      <div
        className="relative min-h-0 w-full flex-1 overflow-hidden"
        style={{ borderRadius: HERO_PANEL_RADIUS }}
      >
        {columnSlides.map((slide, index) => (
          <Image
            key={`col-${panelIndex}-${slide.src}-${index}`}
            src={slide.src}
            alt=""
            fill
            priority={panelIndex === 0 && index === 0}
            unoptimized
            className={cn(
              "object-cover transition-opacity duration-700 ease-in-out",
              slide.focus || "object-center",
              index === frame ? "opacity-100" : "opacity-0",
            )}
            sizes="(min-width: 1280px) 320px, 32vw"
            draggable={false}
            aria-hidden={index !== frame}
          />
        ))}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-black/50 to-transparent"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-end pr-4">
          <span
            key={activeSlide.labelKey}
            className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-[#0F1B2D] shadow-sm transition-opacity duration-500"
          >
            {t(activeSlide.labelKey)}
          </span>
        </span>
      </div>
    </div>
  );
}

/**
 * Desktop discovery hero — left copy, right 3 straight image panels.
 * Last panel is shorter from top for script text.
 * Mobile uses UpcomingAppointmentCard instead.
 */
export function HeroSection({ className }) {
  const { t } = useWebLocale();
  const router = useRouter();
  const addRecentSearch = useRecentSearchesStore((state) => state.addSearch);
  const [query, setQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [panelFrames, setPanelFrames] = useState(() =>
    Array.from({ length: HERO_PANEL_COUNT }, () => 0),
  );

  const advanceWord = useCallback(() => {
    setWordIndex((current) => (current + 1) % HERO_WORDS.length);
  }, []);

  // One panel at a time: 1st → wait → 2nd → wait → 3rd → hold → repeat
  useEffect(() => {
    let cancelled = false;
    let timeoutId = 0;

    const wait = (ms) =>
      new Promise((resolve) => {
        timeoutId = window.setTimeout(resolve, ms);
      });

    const run = async () => {
      let frame = 0;
      await wait(HERO_HOLD_MS);
      if (cancelled) return;

      while (!cancelled) {
        const nextFrame = (frame + 1) % HERO_SLIDE_COUNT;

        for (let step = 0; step < HERO_PANEL_ORDER.length; step += 1) {
          if (cancelled) return;
          const panel = HERO_PANEL_ORDER[step];

          setPanelFrames((prev) => {
            const next = [...prev];
            next[panel] = nextFrame;
            return next;
          });

          // Wait before changing the next panel (not all at once)
          if (step < HERO_PANEL_ORDER.length - 1) {
            await wait(HERO_STAGGER_MS);
          }
        }

        frame = nextFrame;
        await wait(HERO_HOLD_MS);
      }
    };

    run();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const activeWord = HERO_WORDS[wordIndex] ?? HERO_WORDS[0];
  const translated = activeWord.labelKey ? t(activeWord.labelKey) : "";
  const activeWordLabel =
    translated && translated !== activeWord.labelKey ? translated : activeWord.name;

  function goSearch(value = query) {
    const q = value.trim();
    if (!q) {
      router.push(ROUTES.SEARCH);
      return;
    }

    addRecentSearch(q);

    const needle = q.toLowerCase();
    const matchedCategory = HOME_CATEGORIES.find(
      (category) =>
        category.slug === needle ||
        category.name.toLowerCase() === needle ||
        category.name.toLowerCase().includes(needle) ||
        needle.includes(category.name.toLowerCase()),
    );

    if (matchedCategory && needle.length >= 3) {
      router.push(categoryListingRoute(matchedCategory.slug));
      return;
    }

    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`);
  }

  return (
    <section
      className={cn(
        "relative isolate z-20 hidden w-full overflow-hidden md:block",
        "min-h-[640px] bg-white lg:min-h-[680px] xl:min-h-[720px]",
        className,
      )}
      aria-label={t("heroAria")}
    >
      <div
        className={cn(
          "relative z-10 grid h-full min-h-[inherit] w-full items-stretch gap-6",
          "pl-4 md:pr-0 md:pl-[max(4.875rem,calc((100vw-(96rem-60px))/2+4.875rem))]",
          "xl:pl-[max(5.875rem,calc((100vw-(96rem-60px))/2+5.875rem))]",
          "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6",
        )}
      >
        {/* Left — denser copy block, fills the column */}
        <div className="relative z-30 flex w-full max-w-xl flex-col justify-center py-10 pr-2 lg:py-12 lg:pr-4">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#1865EA] uppercase">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-5 text-[2.75rem] leading-[1.02] font-bold tracking-tight text-[#0F1B2D] lg:text-[3.35rem] xl:text-[3.65rem]">
            <span className="relative -top-[6px] block">{t("heroTitleLead")}</span>
            <span className="mt-1 block min-h-[1.35em] overflow-hidden pb-3">
              <HeroTypedWord
                key={activeWord.id}
                text={activeWordLabel}
                mark={activeWord.mark}
                color={activeWord.color}
                gradient={activeWord.gradient}
                stops={activeWord.stops}
                onComplete={advanceWord}
              />
            </span>
            <span className="relative -top-[14px] mt-1 block">{t("heroTitleEnd")}</span>
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#5B6B82] lg:text-[17px]">
            {t("heroSubtitle")}
          </p>

          <form
            className="relative z-30 mt-9 flex w-full max-w-md items-center gap-2 rounded-full bg-white py-2 pr-2 pl-5 shadow-[0_12px_32px_rgba(15,27,45,0.12)] ring-1 ring-[#E8EDF5]"
            onSubmit={(event) => {
              event.preventDefault();
              goSearch();
            }}
            role="search"
          >
            <Search
              className="size-[18px] shrink-0 text-[#98A2B3]"
              strokeWidth={2.2}
              aria-hidden
            />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("heroSearchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#0F1B2D] outline-none placeholder:text-[#98A2B3]"
              aria-label={t("heroSearchPlaceholder")}
              autoComplete="off"
              enterKeyHint="search"
            />
            <button
              type="submit"
              className="gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-95"
            >
              {t("heroSearch")}
              <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
            </button>
          </form>
        </div>

        {/* Right — flush to viewport right (no pointer capture over left copy) */}
        <div className="pointer-events-none relative -ml-[260px] flex h-full min-h-[inherit] w-[calc(100%+260px)] items-stretch gap-4 py-5 lg:py-6">
          {Array.from({ length: HERO_PANEL_COUNT }, (_, index) => (
            <HeroImagePanel
              key={`hero-panel-${index}`}
              panelIndex={index}
              frame={panelFrames[index] ?? 0}
              shortTop={index === HERO_PANEL_COUNT - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
