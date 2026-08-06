"use client";

import { getClientGoogleMapsApiKey } from "@/lib/google-maps/constants";
import { loadPlacesLibrary } from "@/lib/google-maps/load-google-maps";
import { mapGoogleError } from "@/lib/google-maps/places-errors";

/**
 * Checks if Google Maps JS API can load with NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 */
export function usePlacesConfig() {
  const clientConfigured = Boolean(getClientGoogleMapsApiKey());

  return {
    configured: clientConfigured,
    loading: false,
    clientConfigured,
    provider: clientConfigured ? "google-maps-js" : null,
  };
}

/** Preloads Google Maps Places library when a client key is present. */
export function useGoogleMapsLoader() {
  const hasKey = Boolean(getClientGoogleMapsApiKey());

  if (typeof window !== "undefined" && hasKey) {
    loadPlacesLibrary().catch(() => {});
  }

  return { ready: hasKey, hasKey };
}

export async function verifyGoogleMapsLoaded() {
  if (!getClientGoogleMapsApiKey()) {
    return { ok: false, error: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in the client bundle." };
  }

  try {
    await loadPlacesLibrary();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: mapGoogleError(error).message };
  }
}
