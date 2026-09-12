"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

import {
  ROUTES,
  buildCategoryProviderDetailUrl,
  categoryListingRoute,
} from "@/constants/routes.constants";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { getGlobalSearchProviders } from "@/lib/search/search-providers";
import { useDebounce } from "@/hooks/use-debounce";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const QUICK_SEARCHES = [
  { labelKey: "chipHaircut", href: categoryListingRoute("salon") },
  { labelKey: "chipMassage", href: categoryListingRoute("salon") },
  { labelKey: "chipHomeCleaning", href: categoryListingRoute("homecare") },
  { labelKey: "chipPersonalTraining", href: categoryListingRoute("fitness") },
  { labelKey: "chipTeethCleaning", href: categoryListingRoute("doctor") },
];

const HERO_SLIDES = [
  {
    id: "spa",
    image: "/images/desktop-hero-spa.png",
    focus: "object-[center_40%]",
    eyebrowKey: "heroEyebrow",
    titleKey: "heroTitle",
    subtitleKey: "heroSubtitle",
  },
  {
    id: "salon",
    image: "/images/desktop-hero-salon-hd.jpg",
    focus: "object-[72%_38%]",
    eyebrowKey: "heroSlide2Eyebrow",
    titleKey: "heroSlide2Title",
    subtitleKey: "heroSlide2Subtitle",
  },
  {
    id: "health",
    image: "/images/desktop-hero-health-hd.jpg",
    focus: "object-[74%_36%]",
    eyebrowKey: "heroSlide3Eyebrow",
    titleKey: "heroSlide3Title",
    subtitleKey: "heroSlide3Subtitle",
  },
  {
    id: "home",
    image: "/images/desktop-hero-home-hd.jpg",
    focus: "object-[70%_40%]",
    eyebrowKey: "heroSlide4Eyebrow",
    titleKey: "heroSlide4Title",
    subtitleKey: "heroSlide4Subtitle",
  },
];

const AUTO_MS = 5500;
const SUGGESTION_LIMIT = 8;

function filterSuggestions(providers, term) {
  const query = term.trim().toLowerCase();
  if (query.length < 1) return [];

  return providers
    .filter((provider) => {
      const name = provider.businessName?.toLowerCase() || "";
      const specialty = provider.specialty?.toLowerCase() || "";
      const city = provider.city?.toLowerCase() || "";
      const categoryName = provider.categoryName?.toLowerCase() || "";
      return (
        name.includes(query) ||
        specialty.includes(query) ||
        city.includes(query) ||
        categoryName.includes(query)
      );
    })
    .slice(0, SUGGESTION_LIMIT);
}

/**
 * Desktop discovery hero — 4-slide lifestyle carousel.
 * Mobile uses UpcomingAppointmentCard instead.
 */
export function HeroSection({ className }) {
  const router = useRouter();
  const wrapRef = useRef(null);
  const { t } = useWebLocale();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const debouncedQuery = useDebounce(query, 150);

  const providers = useMemo(() => getGlobalSearchProviders(), []);
  const suggestions = useMemo(
    () => filterSuggestions(providers, debouncedQuery),
    [providers, debouncedQuery],
  );

  const showSuggestions = open && query.trim().length > 0 && suggestions.length > 0;
  const slide = HERO_SLIDES[active] ?? HERO_SLIDES[0];

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (paused || showSuggestions) return undefined;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % HERO_SLIDES.length);
    }, AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, showSuggestions]);

  const goTo = (index) => {
    setActive((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setOpen(false);
    const term = query.trim();
    if (term) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(term)}`);
    } else {
      router.push(ROUTES.SEARCH);
    }
  };

  const suggestionHref = (provider) =>
    buildCategoryProviderDetailUrl(provider.id, provider.categorySlug, provider);

  return (
    <section
      className={cn(
        "relative isolate z-20 w-full",
        // Desktop hero height (web only)
        "min-h-[630px] lg:min-h-[662px] xl:min-h-[694px]",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured services"
    >
      {/* Crossfading lifestyle backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        {HERO_SLIDES.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              index === active ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={index !== active}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={index === 0}
              unoptimized
              quality={100}
              className={cn(
                "object-cover will-change-transform",
                item.focus || "object-center",
                index === active && "hero-bg-zoom",
              )}
              sizes="100vw"
              draggable={false}
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 28%, transparent 52%)",
          }}
        />
      </div>

      <div
        className={cn(
          HOME_PAGE_CONTAINER,
          "relative z-10 flex h-full min-h-[inherit] flex-col justify-center py-10 md:py-12",
        )}
      >
        <div className="max-w-xl pt-2 lg:pt-4">
          <div className="min-h-[10.5rem] lg:min-h-[11.5rem]">
            <p
              key={`${slide.id}-eyebrow`}
              className="text-primary animate-[fade-in_0.45s_ease-out] text-[11px] font-semibold tracking-[0.18em] uppercase"
            >
              {t(slide.eyebrowKey)}
            </p>
            <h1
              key={`${slide.id}-title`}
              className="text-foreground mt-3 animate-[fade-in_0.5s_ease-out] text-[2.35rem] leading-[1.12] font-bold tracking-tight lg:text-[2.85rem] xl:text-[3.15rem]"
            >
              {t(slide.titleKey)}
            </h1>
            <p
              key={`${slide.id}-subtitle`}
              className="mt-4 max-w-md animate-[fade-in_0.55s_ease-out] text-[15px] leading-relaxed text-[#667085] lg:text-base"
            >
              {t(slide.subtitleKey)}
            </p>
          </div>

          <div ref={wrapRef} className="relative z-50 mt-8 w-full max-w-xl">
            <form
              onSubmit={handleSearch}
              className={cn(
                "flex w-full items-stretch overflow-hidden rounded-full bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.22)]",
                "ring-1 ring-[#E8ECF2] transition-[box-shadow,ring-color]",
                (showSuggestions || open) && "ring-[#D0D5DD]",
              )}
            >
              <label className="flex min-w-0 flex-1 items-center gap-2.5 px-4 py-2.5 sm:px-5">
                <Search className="size-4 shrink-0 text-[#98A2B3]" aria-hidden />
                <input
                  type="search"
                  name="q"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  placeholder={t("heroSearchPlaceholder")}
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#0F1B2D] outline-none placeholder:text-[#98A2B3]"
                  aria-label={t("heroSearchPlaceholder")}
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions}
                  autoComplete="off"
                />
              </label>
              <button
                type="submit"
                className="gradient-brand m-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(24,101,234,0.45)] transition-opacity hover:opacity-95"
              >
                {t("heroSearch")}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </form>

            {showSuggestions ? (
              <div
                role="listbox"
                className="scrollbar-hide absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 max-h-72 overflow-y-auto rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_16px_40px_-12px_rgba(15,23,42,0.28)]"
              >
                {suggestions.map((provider) => (
                  <Link
                    key={`${provider.categorySlug}-${provider.id}`}
                    href={suggestionHref(provider)}
                    role="option"
                    onClick={() => setOpen(false)}
                    className="hover:bg-accent flex items-center gap-3 border-b border-[#F0F2F5] px-4 py-3 transition-colors last:border-b-0"
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-[#F4F7FB]">
                      <Image
                        src={
                          provider.avatar ||
                          provider.coverImage ||
                          "/images/app-icon.jpg"
                        }
                        alt=""
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-foreground block truncate text-sm font-semibold">
                        {provider.businessName}
                      </span>
                      <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                        {[provider.specialty, provider.categoryName]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#98A2B3]">
              {t("popularLabel")}
            </span>
            {QUICK_SEARCHES.map((item) => (
              <Link
                key={item.labelKey}
                href={item.href}
                className="hover:border-primary/40 hover:text-primary rounded-full border border-[#E4E7EC] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#475467] backdrop-blur-sm transition-all"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center md:bottom-4">
        <div
          className="pointer-events-auto flex items-center gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === active
                  ? "w-7 bg-[#1865EA]"
                  : "w-2 bg-white/70 hover:bg-white",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
