"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  PLACE_DETAILS_FIELDS,
  getClientGoogleMapsApiKey,
} from "@/lib/google-maps/constants";
import { loadPlacesLibrary } from "@/lib/google-maps/load-google-maps";
import { parseGooglePlaceDetails } from "@/lib/google-maps/parse-place-details";
import { mapGoogleError } from "@/lib/google-maps/places-errors";
import { cn } from "@/lib/utils";

/**
 * Google's built-in Place Autocomplete widget (Places API New).
 * Uses Maps JavaScript API directly in the browser — no server proxy.
 */
export function GooglePlaceAutocompleteWidget({
  onPlaceSelect,
  onInputChange,
  className,
  regionCode = "in",
  languageCode = "en",
  placeholder,
}) {
  const hostRef = useRef(null);
  const widgetRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!getClientGoogleMapsApiKey()) {
      setLoading(false);
      setError("Google Maps API key not loaded. Restart dev server after updating .env.local.");
      return;
    }

    let cancelled = false;

    loadPlacesLibrary()
      .then(async ({ PlaceAutocompleteElement }) => {
        if (cancelled || !hostRef.current) return;

        await customElements.whenDefined("gmp-place-autocomplete");

        hostRef.current.replaceChildren();

        const widget = new PlaceAutocompleteElement({});

        widget.style.width = "100%";
        widget.style.colorScheme = "light";

        if (placeholder) {
          widget.setAttribute("placeholder", placeholder);
        }

        widget.addEventListener("gmp-select", async (event) => {
          try {
            const place = event.placePrediction.toPlace();
            await place.fetchFields({ fields: PLACE_DETAILS_FIELDS });
            onPlaceSelect?.(parseGooglePlaceDetails(place));
          } catch (selectError) {
            setError(mapGoogleError(selectError).message);
          }
        });

        widget.addEventListener("input", (event) => {
          onInputChange?.(event.target?.value ?? "");
        });

        hostRef.current.appendChild(widget);
        widgetRef.current = widget;
        setLoading(false);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setLoading(false);
          setError(mapGoogleError(loadError).message);
        }
      });

    return () => {
      cancelled = true;
      widgetRef.current = null;
      hostRef.current?.replaceChildren();
    };
  }, [languageCode, onInputChange, onPlaceSelect, placeholder, regionCode]);

  return (
    <div className={cn("relative w-full", className)}>
      {loading ? (
        <div className="border-border/70 flex h-11 items-center gap-2 rounded-xl border bg-[#FAFBFD] px-4 text-sm text-[#64748B]">
          <Loader2 className="size-4 animate-spin" />
          Loading Google Maps...
        </div>
      ) : null}

      <div
        ref={hostRef}
        className={cn(
          "google-place-autocomplete-host w-full [&_gmp-place-autocomplete]:w-full [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#EEF2F7] [&_input]:bg-[#FAFBFD] [&_input]:px-4 [&_input]:text-base [&_input]:outline-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-[#2563EB]/20 md:[&_input]:text-sm",
          loading && "hidden",
        )}
      />

      {error ? <p className="mt-2 text-xs text-[#DC2626]">{error}</p> : null}
    </div>
  );
}
