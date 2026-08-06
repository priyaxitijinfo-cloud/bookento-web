export const PlacesErrorCode = {
  API_KEY_MISSING: "API_KEY_MISSING",
  LOAD_FAILED: "LOAD_FAILED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  NETWORK: "NETWORK",
  NO_RESULTS: "NO_RESULTS",
  DETAILS_FAILED: "DETAILS_FAILED",
  EMPTY_INPUT: "EMPTY_INPUT",
};

const ERROR_MESSAGES = {
  [PlacesErrorCode.API_KEY_MISSING]:
    "Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local and restart the dev server.",
  [PlacesErrorCode.LOAD_FAILED]:
    "Unable to load Google Maps. Please refresh and try again.",
  [PlacesErrorCode.QUOTA_EXCEEDED]:
    "Search limit reached. Please try again later.",
  [PlacesErrorCode.NETWORK]:
    "Network error. Check your connection and try again.",
  [PlacesErrorCode.NO_RESULTS]:
    "No places found. Try a different search.",
  [PlacesErrorCode.DETAILS_FAILED]:
    "Unable to load place details. Please select another result.",
  [PlacesErrorCode.EMPTY_INPUT]: "",
};

export class PlacesError extends Error {
  constructor(code, message, cause) {
    super(message || ERROR_MESSAGES[code] || "Something went wrong.");
    this.name = "PlacesError";
    this.code = code;
    this.cause = cause;
  }
}

export function mapGoogleError(error) {
  const message = `${error?.message ?? ""} ${error?.cause?.message ?? ""}`.toLowerCase();

  if (
    message.includes("quota") ||
    message.includes("resource_exhausted") ||
    message.includes("over_query_limit")
  ) {
    return new PlacesError(PlacesErrorCode.QUOTA_EXCEEDED);
  }

  if (message.includes("network") || message.includes("fetch")) {
    return new PlacesError(PlacesErrorCode.NETWORK);
  }

  return new PlacesError(PlacesErrorCode.LOAD_FAILED, error?.message, error);
}
