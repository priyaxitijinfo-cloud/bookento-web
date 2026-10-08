"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

import { ROUTES, categoryListingRoute } from "@/constants/routes.constants";
import { getHomeCategoryGradient, HOME_CATEGORIES } from "@/constants/home-categories";
import { useWebLocale } from "@/hooks/use-web-locale";
import { getLoginRedirectUrl, isRegisteredBookableUser } from "@/lib/auth/booking-auth";
import { cn } from "@/lib/utils";
import { useRecentSearchesStore, useUserAuthStore } from "@/store";

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

function HeroImagePanel({ panelIndex, shortTop, frame, mobile = false }) {
  const { t } = useWebLocale();
  const activeSlide = HERO_SLIDES[frame]?.[panelIndex];
  if (!activeSlide) return null;

  // Preload all frames for this column so fades stay smooth
  const columnSlides = HERO_SLIDES.map((row) => row[panelIndex]);

  return (
    <div
      className={cn(
        "relative flex min-h-0 min-w-0 flex-col",
        mobile ? "w-[78%] max-w-[17.5rem] shrink-0 snap-center" : "flex-1",
      )}
    >
      {shortTop && !mobile ? (
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
        className={cn(
          "relative overflow-hidden",
          mobile
            ? "aspect-[3/4] w-full shadow-[0_14px_32px_-16px_rgba(15,27,45,0.35)]"
            : "min-h-0 w-full flex-1",
        )}
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
            sizes={
              mobile
                ? "(max-width: 768px) 78vw, 280px"
                : "(min-width: 1280px) 320px, 32vw"
            }
            draggable={false}
            aria-hidden={index !== frame}
          />
        ))}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/55 to-transparent",
            mobile ? "h-24" : "h-28",
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 z-10 flex justify-end",
            mobile ? "bottom-3.5 pr-3" : "bottom-5 pr-4",
          )}
        >
          <span
            key={activeSlide.labelKey}
            className={cn(
              "rounded-full bg-white font-semibold whitespace-nowrap text-[#0F1B2D] shadow-sm transition-opacity duration-500",
              mobile ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-1.5 text-[12px]",
            )}
          >
            {t(activeSlide.labelKey)}
          </span>
        </span>
      </div>
    </div>
  );
}

/**
 * Discovery hero — left copy + search; right 3 image panels (desktop)
 * or portrait snap cards (mobile).
 */
export function HeroSection({ className }) {
  const { t } = useWebLocale();
  const router = useRouter();
  const addRecentSearch = useRecentSearchesStore((state) => state.addSearch);
  const isAuthenticated = useUserAuthStore((state) => state.isAuthenticated);
  const isGuest = useUserAuthStore((state) => state.isGuest);
  const canBrowseBooked = isRegisteredBookableUser({ isAuthenticated, isGuest });
  const searchWrapRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [panelFrames, setPanelFrames] = useState(() =>
    Array.from({ length: HERO_PANEL_COUNT }, () => 0),
  );

  const advanceWord = useCallback(() => {
    setWordIndex((current) => (current + 1) % HERO_WORDS.length);
  }, []);

  const needle = query.trim().toLowerCase();

  const categorySuggestions = useMemo(() => {
    if (!needle) return HOME_CATEGORIES;

    return HOME_CATEGORIES.filter((category) => {
      const name = category.name.toLowerCase();
      const slug = category.slug.toLowerCase();
      const labelKey = CATEGORY_NAME_KEYS[category.slug];
      const localized = labelKey ? t(labelKey).toLowerCase() : "";
      return (
        slug.includes(needle) ||
        name.includes(needle) ||
        needle.includes(name) ||
        (localized &&
          localized !== labelKey.toLowerCase() &&
          (localized.includes(needle) || needle.includes(localized)))
      );
    });
  }, [needle, t]);

  const showSuggestions = searchOpen && categorySuggestions.length > 0;

  function gateHref(destination) {
    if (!canBrowseBooked) return getLoginRedirectUrl(destination);
    return destination;
  }

  function resolveCategoryHref(slug) {
    return gateHref(categoryListingRoute(slug));
  }

  useEffect(() => {
    if (!searchOpen) return undefined;

    function handlePointerDown(event) {
      if (!searchWrapRef.current?.contains(event.target)) {
        setSearchOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setSearchOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

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
    setSearchOpen(false);

    if (!q) {
      router.push(ROUTES.SEARCH);
      return;
    }

    addRecentSearch(q);

    const needle = q.toLowerCase();
    const matchedCategory = categorySuggestions.find((category) => {
      const name = category.name.toLowerCase();
      const slug = category.slug.toLowerCase();
      const labelKey = CATEGORY_NAME_KEYS[category.slug];
      const localized = labelKey ? t(labelKey).toLowerCase() : "";
      return (
        slug === needle ||
        name === needle ||
        localized === needle ||
        (needle.length >= 3 && (name.includes(needle) || slug.includes(needle)))
      );
    });

    if (matchedCategory) {
      router.push(resolveCategoryHref(matchedCategory.slug));
      return;
    }

    const searchHref = `${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`;
    router.push(canBrowseBooked ? searchHref : getLoginRedirectUrl(searchHref));
  }

  function goCategory(slug) {
    setSearchOpen(false);
    router.push(resolveCategoryHref(slug));
  }

  return (
    <section
      className={cn(
        "relative isolate z-20 w-full",
        // Allow category dropdown to extend past the hero; clip panels when closed
        searchOpen ? "overflow-visible" : "overflow-hidden",
        "min-h-0 bg-white md:min-h-[640px] lg:min-h-[680px] xl:min-h-[720px]",
        className,
      )}
      aria-label={t("heroAria")}
    >
      <div
        className={cn(
          "relative z-10 grid h-full min-h-[inherit] w-full items-stretch gap-4",
          "px-4 md:pr-0 md:pl-[max(4.875rem,calc((100vw-(96rem-60px))/2+4.875rem))]",
          "xl:pl-[max(5.875rem,calc((100vw-(96rem-60px))/2+5.875rem))]",
          "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6",
        )}
      >
        {/* Left — denser copy block; centered on mobile, left on desktop */}
        <div className="relative z-30 mx-auto flex w-full max-w-xl flex-col justify-center py-8 pr-0 text-center md:mx-0 md:py-10 md:pr-2 md:text-left lg:py-12 lg:pr-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#1865EA] uppercase md:text-[12px] md:tracking-[0.2em]">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-4 text-[2.05rem] leading-[1.05] font-bold tracking-tight text-[#0F1B2D] md:mt-5 md:text-[2.75rem] md:leading-[1.02] lg:text-[3.35rem] xl:text-[3.65rem]">
            <span className="relative block md:-top-[6px]">{t("heroTitleLead")}</span>
            <span className="mt-1 block min-h-[1.35em] overflow-hidden pb-2 md:pb-3">
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
            <span className="relative mt-0.5 block md:-top-[14px] md:mt-1">
              {t("heroTitleEnd")}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#5B6B82] md:mx-0 md:mt-5 md:text-[16px] lg:text-[17px]">
            {t("heroSubtitle")}
          </p>

          <div
            ref={searchWrapRef}
            className="pointer-events-auto relative z-50 mx-auto mt-6 w-full max-w-md md:mx-0 md:mt-9"
          >
            <form
              className="relative flex w-full items-center gap-2 rounded-full bg-white py-1.5 pr-1.5 pl-4 shadow-[0_4px_14px_rgba(15,27,45,0.06)] ring-1 ring-[#E8EDF5] md:py-2 md:pr-2 md:pl-5"
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
                type="text"
                name="q"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder={t("heroSearchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0F1B2D] outline-none placeholder:text-[#98A2B3] md:text-[15px]"
                aria-label={t("heroSearchPlaceholder")}
                aria-expanded={showSuggestions}
                aria-controls="hero-search-suggestions"
                autoComplete="off"
                enterKeyHint="search"
              />
              <button
                type="submit"
                className="gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-95 md:px-5 md:py-3 md:text-[14px]"
              >
                {t("heroSearch")}
                <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
              </button>
            </form>

            {showSuggestions ? (
              <div
                id="hero-search-suggestions"
                className="absolute inset-x-0 top-[calc(100%+0.45rem)] z-50 max-h-[min(60vh,22rem)] overflow-y-auto rounded-[1.25rem] border border-[#E8EDF5] bg-white py-1.5 shadow-[0_18px_44px_rgba(15,27,45,0.12)]"
                role="listbox"
              >
                {needle ? (
                  <p className="hidden px-5 pt-1.5 pb-1 text-[11px] font-semibold tracking-[0.12em] text-[#98A2B3] uppercase md:block">
                    Categories
                  </p>
                ) : null}
                {categorySuggestions.map((category) => {
                  const labelKey = CATEGORY_NAME_KEYS[category.slug];
                  const label = labelKey ? t(labelKey) : category.name;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      role="option"
                      className="flex w-full items-center px-5 py-2.5 text-left text-[14.5px] font-medium text-[#1A2740] transition-colors hover:bg-[#F4F7FC] hover:text-[#1865EA]"
                      onClick={() => goCategory(category.slug)}
                    >
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        {/* Desktop — flush to viewport right */}
        <div className="pointer-events-none relative z-0 hidden h-full min-h-[inherit] items-stretch gap-3.5 py-5 md:-ml-[180px] md:flex md:w-[calc(100%+180px)] lg:py-6">
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
