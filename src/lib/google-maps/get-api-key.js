/**
 * Returns the Google Maps API key for server-side Places API calls.
 * Prefer GOOGLE_MAPS_API_KEY (server-only). Falls back to NEXT_PUBLIC value.
 */
export function getGoogleMapsApiKey() {
  return (
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
    ""
  );
}

export function isGoogleMapsConfigured() {
  return Boolean(getGoogleMapsApiKey());
}
