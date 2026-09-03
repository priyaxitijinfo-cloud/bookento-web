"use client";

import { useRef } from "react";

import { GooglePlacesAutocomplete } from "@/components/places/google-places-autocomplete";
import { SearchIcon } from "@/components/icons/search-icon";
import { getClientGoogleMapsApiKey } from "@/lib/google-maps/constants";
import { buildLocationFromGooglePlace } from "@/lib/google-maps/parse-place-details";

const MOBILE_SEARCH_INPUT_CLASS =
  "h-12 rounded-full border border-[#F2F2F2] bg-white pl-11 pr-10 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:ring-0";

export function AddressMobileSearchPanel({
  value,
  onChange,
  onPlaceSelect,
  autoFocus = false,
  children,
}) {
  const pacAnchorRef = useRef(null);
  const hasGoogleKey = Boolean(getClientGoogleMapsApiKey());

  if (!hasGoogleKey) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground rounded-full border border-[#F2F2F2] bg-white px-4 py-3 text-sm">
          Google Maps key not loaded in the browser. Restart{" "}
          <code className="bg-background rounded px-1">npm run dev</code> after setting{" "}
          <code className="bg-background rounded px-1">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          in <code className="bg-background rounded px-1">.env.local</code>.
        </p>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div ref={pacAnchorRef} className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 z-10 size-[18px] -translate-y-1/2 text-[#94A3B8]" />

        <GooglePlacesAutocomplete
          value={value}
          autoFocus={autoFocus}
          placeholder="Search an area or address"
          aria-label="Search an area or address"
          regionCode="in"
          pacAnchorRef={pacAnchorRef}
          showSearchIcon={false}
          onChange={onChange}
          onPlaceSelect={(place) => {
            onPlaceSelect?.(buildLocationFromGooglePlace(place));
          }}
          inputClassName={MOBILE_SEARCH_INPUT_CLASS}
        />
      </div>

      {children}
    </div>
  );
}
