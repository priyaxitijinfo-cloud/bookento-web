/** Client-side key from NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (inlined at dev/build time). */
export function getClientGoogleMapsApiKey() {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
}

export const GOOGLE_MAPS_API_KEY = getClientGoogleMapsApiKey();

export const GOOGLE_MAPS_LIBRARIES = ["places"];

export const PLACES_AUTOCOMPLETE_DEBOUNCE_MS = 300;

export const PLACES_CACHE_KEY = "bookento-places-autocomplete-cache";

export const PLACES_CACHE_MAX_ENTRIES = 30;

export const PLACES_CACHE_TTL_MS = 5 * 60 * 1000;

/** Fields fetched when a user selects a suggestion (Places API New). */
export const PLACE_DETAILS_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "addressComponents",
  "types",
  "shortFormattedAddress",
];

/** Fields for classic google.maps.places.Autocomplete place_changed results. */
export const LEGACY_PLACE_FIELDS = [
  "place_id",
  "formatted_address",
  "geometry",
  "address_components",
  "name",
  "types",
];
