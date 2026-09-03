"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { ResponsiveSearchIcon, SearchIcon } from "@/components/icons/search-icon";

import { loadPlacesLibrary } from "@/lib/google-maps/load-google-maps";
import { LEGACY_PLACE_FIELDS } from "@/lib/google-maps/constants";
import { parseGooglePlaceDetails } from "@/lib/google-maps/parse-place-details";
import { cn } from "@/lib/utils";

/**
 * Google Maps-style address search using the classic Places Autocomplete
 * (google.maps.places.Autocomplete). Renders Google's native suggestion dropdown.
 */
export function GooglePlacesAutocomplete({
  value,
  defaultValue = "",
  onChange,
  onPlaceSelect,
  placeholder = "Search address, area, shop, landmark...",
  disabled = false,
  regionCode = "in",
  className,
  inputClassName,
  showSearchIcon = true,
  useDesignSearchIcon = false,
  clearable = true,
  id,
  name,
  autoFocus = false,
  pacAnchorRef,
  "aria-label": ariaLabel = "Search address",
}) {
  const inputRef = useRef(null);
  const listenerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);

  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectRef.current = onPlaceSelect;
  });

  useEffect(() => {
    if (disabled) return undefined;

    let cancelled = false;

    loadPlacesLibrary()
      .then(() => {
        if (cancelled || !inputRef.current) return;

        const options = { fields: LEGACY_PLACE_FIELDS };
        if (regionCode) {
          options.componentRestrictions = { country: regionCode };
        }

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          options,
        );

        listenerRef.current = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place?.geometry?.location) return;

          const parsed = parseGooglePlaceDetails(place);
          const display = parsed.formattedAddress || parsed.displayName || "";

          if (inputRef.current) {
            inputRef.current.value = display;
          }

          onChangeRef.current?.(display);
          onPlaceSelectRef.current?.(parsed);
        });
      })
      .catch(() => {
        // Key/load errors surface via empty suggestions; avoid breaking the page.
      });

    return () => {
      cancelled = true;
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [disabled, regionCode]);

  useEffect(() => {
    if (value !== undefined && inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    if (disabled) return undefined;

    const input = inputRef.current;
    if (!input) return undefined;

    const repositionPacDropdown = () => {
      document.querySelectorAll(".pac-container").forEach((pac) => {
        if (pac.style.display === "none" || pac.childElementCount === 0) return;

        const anchor = pacAnchorRef?.current ?? input;
        const rect = anchor.getBoundingClientRect();
        pac.style.position = "fixed";
        pac.style.width = `${rect.width}px`;
        pac.style.left = `${rect.left}px`;
        pac.style.top = `${rect.bottom + 8}px`;
      });
    };

    const handlePacUpdate = () => {
      window.requestAnimationFrame(repositionPacDropdown);
    };

    window.addEventListener("scroll", handlePacUpdate, true);
    window.addEventListener("resize", handlePacUpdate);
    input.addEventListener("focus", handlePacUpdate);
    input.addEventListener("input", handlePacUpdate);

    return () => {
      window.removeEventListener("scroll", handlePacUpdate, true);
      window.removeEventListener("resize", handlePacUpdate);
      input.removeEventListener("focus", handlePacUpdate);
      input.removeEventListener("input", handlePacUpdate);
    };
  }, [disabled, pacAnchorRef]);

  const showClear = clearable && Boolean(value) && !disabled;

  return (
    <div className={cn("relative w-full", className)}>
      {showSearchIcon ? (
        useDesignSearchIcon ? (
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2" />
        ) : (
          <ResponsiveSearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2" />
        )
      ) : null}

      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        defaultValue={value ?? defaultValue}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onInput={(event) => onChange?.(event.target.value)}
        className={cn(
          "border-border/70 h-11 w-full rounded-xl border bg-[#FAFBFD] text-base outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 md:text-sm",
          showSearchIcon ? "pl-10" : "pl-4",
          showClear ? "pr-10" : "pr-4",
          inputClassName,
        )}
      />

      {showClear ? (
        <button
          type="button"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
            }
            onChange?.("");
          }}
          className="text-muted-foreground hover:bg-muted absolute top-1/2 right-3 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-full"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
