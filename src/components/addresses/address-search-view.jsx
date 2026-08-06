"use client";

import { useEffect, useState } from "react";

import { AddressPageShell } from "@/components/addresses/address-page-shell";
import { GooglePlacesAutocomplete } from "@/components/places/google-places-autocomplete";
import { getClientGoogleMapsApiKey } from "@/lib/google-maps/constants";
import { buildLocationFromGooglePlace } from "@/lib/google-maps/parse-place-details";

import "@/components/addresses/address-search-locality-pac.css";

export function AddressSearchFlow({
  initialQuery = "",
  title = "Select Location",
  backLabel = "Back to Addresses",
  onBack,
  onContinue,
  onQueryChange,
}) {
  const hasGoogleKey = Boolean(getClientGoogleMapsApiKey());
  const [query, setQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    document.body.classList.add("address-places-pac");
    return () => document.body.classList.remove("address-places-pac");
  }, []);

  const handlePlaceSelect = (place) => {
    const location = buildLocationFromGooglePlace(place);
    setSelectedLocation(location);
    setQuery(location.searchLine);
    onQueryChange?.(location.searchLine);
  };

  const handleContinue = () => {
    if (!selectedLocation) return;
    onContinue(selectedLocation);
  };

  return (
    <AddressPageShell
      title={title}
      backLabel={backLabel}
      onBack={onBack}
      showBottomNav={false}
      mainClassName="mx-auto max-w-lg overflow-x-hidden px-4 py-4 pb-28 md:max-w-7xl md:px-6 md:py-6 md:pb-28"
      footer={(
        <div className="safe-bottom fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2 md:px-6">
          <div className="mx-auto w-full max-w-lg md:max-w-7xl">
            <div className="rounded-2xl border border-[#EEF2F7] bg-background p-4 shadow-card md:p-5">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  disabled={!selectedLocation}
                  onClick={handleContinue}
                  className="flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:min-w-[10rem]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="mb-4">
        {hasGoogleKey ? (
          <GooglePlacesAutocomplete
            value={query}
            placeholder="Search an area or address"
            regionCode="in"
            onChange={(value) => {
              setQuery(value);
              setSelectedLocation(null);
              onQueryChange?.(value);
            }}
            onPlaceSelect={handlePlaceSelect}
          />
        ) : (
          <p className="text-muted-foreground rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-4 py-3 text-sm">
            Google Maps key not loaded in the browser. Restart{" "}
            <code className="rounded bg-background px-1">npm run dev</code> after setting{" "}
            <code className="rounded bg-background px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in{" "}
            <code className="rounded bg-background px-1">.env.local</code>.
          </p>
        )}
      </div>

      {selectedLocation ? (
        <div className="rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-4 py-3">
          <p className="text-foreground text-sm font-semibold">{selectedLocation.label}</p>
          <p className="text-muted-foreground mt-1 text-sm">{selectedLocation.searchLine}</p>
        </div>
      ) : null}
    </AddressPageShell>
  );
}
