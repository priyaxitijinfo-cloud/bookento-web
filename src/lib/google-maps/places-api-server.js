import { getGoogleMapsApiKey } from "@/lib/google-maps/get-api-key";
import { PlacesError, PlacesErrorCode } from "@/lib/google-maps/places-errors";

const PLACE_DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "shortFormattedAddress",
  "location",
  "addressComponents",
  "types",
].join(",");

function mapHttpError(status, body) {
  const message = body?.error?.message ?? body?.message ?? "";

  if (status === 403) {
    return new PlacesError(
      PlacesErrorCode.LOAD_FAILED,
      message.includes("API key")
        ? "Invalid Google Maps API key or API not enabled. Enable Maps JavaScript API and Places API (New), and check key restrictions."
        : "Google Places access denied. Enable billing and Places API (New) in Google Cloud Console.",
    );
  }

  if (status === 429 || message.toLowerCase().includes("quota")) {
    return new PlacesError(PlacesErrorCode.QUOTA_EXCEEDED);
  }

  if (status === 400) {
    return new PlacesError(PlacesErrorCode.LOAD_FAILED, message || "Invalid Places API request.");
  }

  return new PlacesError(
    PlacesErrorCode.NETWORK,
    message || `Google Places request failed (${status}).`,
  );
}

/**
 * Places API (New) — autocomplete via REST.
 * @see https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
 */
export async function fetchPlacesAutocomplete({
  input,
  sessionToken,
  languageCode = "en",
  regionCode = "in",
  includedRegionCodes,
}) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new PlacesError(PlacesErrorCode.API_KEY_MISSING);
  }

  const body = {
    input,
    sessionToken,
    languageCode,
    regionCode,
  };

  if (includedRegionCodes?.length) {
    body.includedRegionCodes = includedRegionCodes;
  }

  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw mapHttpError(response.status, data);
  }

  return data;
}

/**
 * Places API (New) — place details via REST.
 * @see https://developers.google.com/maps/documentation/places/web-service/place-details
 */
export async function fetchPlaceDetailsById(placeId, sessionToken) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new PlacesError(PlacesErrorCode.API_KEY_MISSING);
  }

  const resourceId = placeId.startsWith("places/") ? placeId : `places/${placeId}`;
  const url = new URL(`https://places.googleapis.com/v1/${resourceId}`);

  if (sessionToken) {
    url.searchParams.set("sessionToken", sessionToken);
  }

  const response = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACE_DETAILS_FIELD_MASK,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw mapHttpError(response.status, data);
  }

  return data;
}

export function parseRestAutocompleteSuggestion(suggestion, index) {
  const prediction = suggestion?.placePrediction;
  if (!prediction) return null;

  const mainText =
    prediction.structuredFormat?.mainText?.text ??
    prediction.text?.text ??
    "";
  const secondaryText = prediction.structuredFormat?.secondaryText?.text ?? "";
  const fullText = prediction.text?.text ?? mainText;

  return {
    id: prediction.placeId || `prediction-${index}`,
    placeId: prediction.placeId || "",
    mainText,
    secondaryText,
    fullText,
  };
}

function getRestText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.text ?? "";
}

function getRestAddressComponent(components, type) {
  const match = components.find((component) => component.types?.includes(type));
  return match?.longText ?? match?.long_name ?? "";
}

/** Parses Places API (New) REST place resource into app-friendly fields. */
export function parseGooglePlaceFromRest(place) {
  const components = place.addressComponents ?? [];
  const streetNumber = getRestAddressComponent(components, "street_number");
  const route = getRestAddressComponent(components, "route");
  const sublocality =
    getRestAddressComponent(components, "sublocality_level_1") ||
    getRestAddressComponent(components, "sublocality") ||
    getRestAddressComponent(components, "sublocality_level_2") ||
    getRestAddressComponent(components, "neighborhood");

  const city =
    getRestAddressComponent(components, "locality") ||
    getRestAddressComponent(components, "administrative_area_level_2") ||
    getRestAddressComponent(components, "postal_town");

  const state = getRestAddressComponent(components, "administrative_area_level_1");
  const country = getRestAddressComponent(components, "country");
  const postalCode = getRestAddressComponent(components, "postal_code");

  const premise = getRestAddressComponent(components, "premise");
  const subpremise = getRestAddressComponent(components, "subpremise");
  const establishment = getRestAddressComponent(components, "establishment");
  const pointOfInterest = getRestAddressComponent(components, "point_of_interest");

  const displayName = getRestText(place.displayName);
  const types = place.types ?? [];

  const buildingName =
    premise ||
    subpremise ||
    establishment ||
    pointOfInterest ||
    (types.some((type) =>
      [
        "establishment",
        "point_of_interest",
        "shopping_mall",
        "store",
        "hospital",
        "school",
        "place_of_worship",
      ].includes(type),
    )
      ? displayName
      : "");

  const street = [streetNumber, route].filter(Boolean).join(" ").trim();
  const formattedAddress =
    place.formattedAddress ??
    place.shortFormattedAddress ??
    [displayName, street, sublocality, city, state, postalCode, country]
      .filter(Boolean)
      .join(", ");

  const rawId = place.id ?? "";
  const placeId = rawId.replace(/^places\//, "");

  return {
    placeId,
    formattedAddress,
    displayName,
    latitude: place.location?.latitude ?? null,
    longitude: place.location?.longitude ?? null,
    country,
    state,
    city,
    area: sublocality || city || displayName,
    postalCode,
    street,
    buildingName,
    types,
  };
}
