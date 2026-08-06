import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

import { getClientGoogleMapsApiKey, GOOGLE_MAPS_LIBRARIES } from "@/lib/google-maps/constants";
import { PlacesError, PlacesErrorCode } from "@/lib/google-maps/places-errors";

let optionsSet = false;
let placesLibraryPromise = null;

function mapLoadError(error) {
  return new PlacesError(PlacesErrorCode.LOAD_FAILED, error?.message, error);
}

function ensureGoogleMapsOptions() {
  const apiKey = getClientGoogleMapsApiKey();
  if (!apiKey) {
    throw new PlacesError(PlacesErrorCode.API_KEY_MISSING);
  }

  if (!optionsSet) {
    setOptions({
      key: apiKey,
      v: "weekly",
      libraries: GOOGLE_MAPS_LIBRARIES,
    });
    optionsSet = true;
  }

  return apiKey;
}

/**
 * Loads the Google Maps JavaScript API using @googlemaps/js-api-loader v2 functional API.
 */
export function loadGoogleMaps() {
  try {
    ensureGoogleMapsOptions();
    return Promise.resolve(window.google?.maps ?? {});
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Loads the Places library (classic Autocomplete + optional New API types).
 */
export async function loadPlacesLibrary() {
  if (!placesLibraryPromise) {
    placesLibraryPromise = (async () => {
      ensureGoogleMapsOptions();
      return importLibrary("places");
    })().catch((error) => {
      placesLibraryPromise = null;
      throw mapLoadError(error);
    });
  }

  return placesLibraryPromise;
}

/** Resets cached loaders — useful in tests. */
export function resetGoogleMapsLoaderForTests() {
  optionsSet = false;
  placesLibraryPromise = null;
}
