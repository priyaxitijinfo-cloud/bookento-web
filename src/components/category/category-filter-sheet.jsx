"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { CurrentLocationIcon, LocationIcon } from "@/components/icons/location-icon";

import { cn } from "@/lib/utils";

const PRICE_RANGE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "0-499", label: "₹ - ₹499" },
  { value: "500-999", label: "₹500 - ₹999" },
  { value: "1000-4999", label: "₹1000 - ₹4999" },
];

const DISTANCE_MIN = 0.5;
const DISTANCE_MAX = 20;

export const DEFAULT_CATEGORY_FILTERS = {
  specialty: "All",
  location: "",
  maxDistance: 20,
  priceRange: "any",
};

const PRICE_RANGE_DISPLAY = {
  any: "Any",
  "0-499": "₹0 - ₹499",
  "500-999": "₹500 - ₹499",
  "1000-4999": "₹1000 - ₹4999",
};

function FilterSection({ title, children, className }) {
  return (
    <section className={cn("space-y-3", className)}>
      <p className="text-foreground text-[15px] leading-none font-semibold">{title}</p>
      {children}
    </section>
  );
}

function PriceRangeChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center rounded-xl border px-4 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "border-primary bg-primary/[0.06] text-primary"
          : "border-border bg-background text-foreground hover:border-primary/25",
      )}
    >
      {children}
    </button>
  );
}

function DistanceSlider({ value, onChange }) {
  const percent = useMemo(() => {
    return ((value - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)) * 100;
  }, [value]);

  const displayValue = value % 1 === 0 ? value : value.toFixed(1);

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-sm">Within</span>
        <span className="text-primary text-sm font-semibold tabular-nums">
          {displayValue} km
        </span>
      </div>

      <input
        type="range"
        min={DISTANCE_MIN}
        max={DISTANCE_MAX}
        step={0.5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="filter-distance-slider w-full"
        style={{
          background: `linear-gradient(to right, #1865EA 0%, #1865EA ${percent}%, #E5E7EB ${percent}%, #E5E7EB 100%)`,
        }}
        aria-label="Maximum distance"
        aria-valuetext={`${displayValue} kilometers`}
      />

      <div className="text-muted-foreground flex justify-between text-xs leading-none">
        <span>0.5 km</span>
        <span>20 km+</span>
      </div>
    </div>
  );
}

export function SearchFilterFields({
  draft,
  setDraft,
  priceRangeWrap = false,
  showLocation = true,
}) {
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = useCallback(() => {
    // Optimistic fill so the field always responds on click
    setDraft((current) => ({
      ...current,
      location: "Current Location",
    }));

    if (!navigator.geolocation) {
      toast.message("Location set to current area");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDraft((current) => ({
          ...current,
          location: "Current Location",
          userLat: position.coords.latitude,
          userLng: position.coords.longitude,
        }));
        setIsLocating(false);
        toast.success("Current location applied");
      },
      () => {
        setIsLocating(false);
        toast.message("Using current area");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [setDraft]);

  return (
    <div className="space-y-7">
      {showLocation ? (
        <FilterSection title="Location">
          <div className="relative z-10">
            <LocationIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 z-10 size-[1.125rem] -translate-y-1/2" />
            <input
              type="text"
              name="listing-location"
              autoComplete="street-address"
              value={draft.location ?? ""}
              onChange={(event) => {
                const next = event.target.value;
                setDraft((current) => ({ ...current, location: next }));
              }}
              placeholder="Enter area or city"
              className={cn(
                "text-foreground placeholder:text-muted-foreground border-border bg-background relative z-0 h-[3.25rem] w-full rounded-xl border",
                "focus-visible:border-primary/40 focus-visible:ring-primary/20 pr-12 pl-11 text-sm focus-visible:ring-2 focus-visible:outline-none",
              )}
            />
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="text-primary absolute top-1/2 right-3 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg transition-opacity hover:bg-[#EEF4FF] hover:opacity-100 disabled:opacity-60"
              aria-label="Use current location"
              title="Use current location"
            >
              {isLocating ? (
                <Loader2 className="size-[1.125rem] animate-spin" />
              ) : (
                <CurrentLocationIcon className="size-5" />
              )}
            </button>
          </div>
        </FilterSection>
      ) : null}

      <FilterSection title="Distance">
        <DistanceSlider
          value={draft.maxDistance}
          onChange={(maxDistance) =>
            setDraft((current) => ({ ...current, maxDistance }))
          }
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <div
          className={cn(
            "flex gap-2.5 pb-1",
            priceRangeWrap ? "flex-wrap" : "scrollbar-hide -mx-5 overflow-x-auto px-5",
          )}
        >
          {PRICE_RANGE_OPTIONS.map((option) => (
            <PriceRangeChip
              key={option.value}
              active={draft.priceRange === option.value}
              onClick={() =>
                setDraft((current) => ({ ...current, priceRange: option.value }))
              }
            >
              {option.label}
            </PriceRangeChip>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function matchesPriceRange(price, range) {
  if (range === "any") return true;
  if (range === "0-499") return price <= 499;
  if (range === "500-999") return price >= 500 && price <= 999;
  if (range === "1000-4999") return price >= 1000 && price <= 4999;
  return true;
}

export function normalizeAppliedFilters(draft) {
  return {
    ...draft,
    location: draft.location?.trim() ?? "",
    maxDistance: Number(draft.maxDistance),
    priceRange: draft.priceRange || "any",
  };
}

export function hasAppliedSearchFilters(filters) {
  return (
    Boolean(filters.location?.trim()) ||
    filters.maxDistance < DISTANCE_MAX ||
    filters.priceRange !== "any"
  );
}

export function CategoryFilterSheet({ open, onClose, filters, onApply }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) {
      setDraft({
        ...filters,
        maxDistance: filters.maxDistance >= DISTANCE_MAX ? 5 : filters.maxDistance,
      });
    }
  }, [open, filters]);

  if (!open) return null;

  const handleApply = () => {
    const normalized = normalizeAppliedFilters(draft);
    onApply(normalized);
    onClose();
    if (hasAppliedSearchFilters(normalized)) {
      toast.success("Filters applied");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] md:backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close filters"
      />

      {/* Mobile bottom sheet */}
      <div className="bg-background relative flex w-full max-w-lg flex-col rounded-t-[1.375rem] shadow-[0_-8px_40px_rgba(15,23,42,0.12)] md:hidden">
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <span aria-hidden className="h-1 w-[2.75rem] rounded-full bg-[#D1D5DB]" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2 pb-5">
          <h2 className="text-foreground text-[1.125rem] leading-none font-bold">
            Search Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-muted text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="size-[1.125rem]" strokeWidth={2.25} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-2">
          <SearchFilterFields draft={draft} setDraft={setDraft} />
        </div>

        <div className="shrink-0 px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={handleApply}
            className="gradient-brand h-[3.25rem] w-full rounded-xl text-[15px] font-medium text-white transition-opacity hover:opacity-95 md:font-semibold"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Desktop / webview centered modal — same fields */}
      <div className="bg-background relative hidden w-full max-w-lg flex-col rounded-2xl shadow-2xl md:flex">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-foreground text-lg font-bold">Search Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-muted text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="size-[1.125rem]" strokeWidth={2.25} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <SearchFilterFields draft={draft} setDraft={setDraft} priceRangeWrap />
        </div>

        <div className="border-t px-5 py-5">
          <button
            type="button"
            onClick={handleApply}
            className="gradient-brand h-[3.25rem] w-full rounded-xl text-[15px] font-medium text-white transition-opacity hover:opacity-95 md:font-semibold"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}

export function getSheetFilterTags(filters) {
  const tags = [];

  if (filters.maxDistance < DISTANCE_MAX) {
    const value =
      filters.maxDistance % 1 === 0
        ? filters.maxDistance
        : filters.maxDistance.toFixed(1);
    tags.push({ key: "maxDistance", label: `Within ${value} km`, showMapPin: true });
  }

  if (filters.priceRange !== "any") {
    tags.push({
      key: "priceRange",
      label: PRICE_RANGE_DISPLAY[filters.priceRange] ?? filters.priceRange,
    });
  }

  if (filters.location?.trim()) {
    tags.push({ key: "location", label: filters.location.trim() });
  }

  return tags;
}

export function clearSheetFilter(filters, key) {
  switch (key) {
    case "maxDistance":
      return { ...filters, maxDistance: DISTANCE_MAX };
    case "priceRange":
      return { ...filters, priceRange: "any" };
    case "location":
      return { ...filters, location: "" };
    default:
      return filters;
  }
}

export function clearAllSheetFilters(filters) {
  return {
    ...filters,
    location: "",
    maxDistance: DISTANCE_MAX,
    priceRange: "any",
  };
}

export function hasActiveCategoryFilters(filters, sheetFiltersApplied = false) {
  return (
    filters.specialty !== DEFAULT_CATEGORY_FILTERS.specialty ||
    (sheetFiltersApplied && getSheetFilterTags(filters).length > 0)
  );
}

export function filterProvidersByCategoryFilters(
  list,
  filters,
  sheetFiltersApplied = false,
) {
  let next = [...list];

  if (filters.specialty && filters.specialty !== "All") {
    next = next.filter((provider) => provider.specialty === filters.specialty);
  }

  if (sheetFiltersApplied && filters.maxDistance < DISTANCE_MAX) {
    // listing distances are already stored in km
    next = next.filter((provider) => provider.distance <= filters.maxDistance);
  }

  if (sheetFiltersApplied && filters.priceRange && filters.priceRange !== "any") {
    next = next.filter((provider) =>
      matchesPriceRange(provider.startingPrice, filters.priceRange),
    );
  }

  return next;
}
