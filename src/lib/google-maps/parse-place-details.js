/**
 * @typedef {Object} ParsedGooglePlace
 * @property {string} placeId
 * @property {string} formattedAddress
 * @property {string} displayName
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {string} country
 * @property {string} state
 * @property {string} city
 * @property {string} area
 * @property {string} postalCode
 * @property {string} street
 * @property {string} buildingName
 * @property {string[]} types
 */

function getAddressComponent(components, type) {
  const match = components.find((component) => component.types?.includes(type));
  return match?.longText ?? match?.long_name ?? "";
}

function getShortAddressComponent(components, type) {
  const match = components.find((component) => component.types?.includes(type));
  return match?.shortText ?? match?.short_name ?? "";
}

function readLatLng(location) {
  if (!location) return { latitude: null, longitude: null };

  const latitude = typeof location.lat === "function" ? location.lat() : location.lat;
  const longitude = typeof location.lng === "function" ? location.lng() : location.lng;

  return {
    latitude: typeof latitude === "number" ? latitude : null,
    longitude: typeof longitude === "number" ? longitude : null,
  };
}

/**
 * Converts a Places result (legacy Autocomplete or Places API New) into app fields.
 * @param {google.maps.places.Place|google.maps.places.PlaceResult} place
 * @returns {ParsedGooglePlace}
 */
export function parseGooglePlaceDetails(place) {
  const components = place.addressComponents ?? place.address_components ?? [];
  const streetNumber = getAddressComponent(components, "street_number");
  const route = getAddressComponent(components, "route");
  const sublocality =
    getAddressComponent(components, "sublocality_level_1") ||
    getAddressComponent(components, "sublocality") ||
    getAddressComponent(components, "sublocality_level_2") ||
    getAddressComponent(components, "neighborhood");

  const city =
    getAddressComponent(components, "locality") ||
    getAddressComponent(components, "administrative_area_level_2") ||
    getAddressComponent(components, "postal_town");

  const state = getAddressComponent(components, "administrative_area_level_1");
  const country = getAddressComponent(components, "country");
  const postalCode = getAddressComponent(components, "postal_code");

  const premise = getAddressComponent(components, "premise");
  const subpremise = getAddressComponent(components, "subpremise");
  const establishment = getAddressComponent(components, "establishment");
  const pointOfInterest = getAddressComponent(components, "point_of_interest");

  const displayName =
    place.displayName?.toString?.() ?? place.displayName ?? place.name ?? "";
  const types = place.types ?? [];

  const buildingName =
    premise ||
    subpremise ||
    establishment ||
    pointOfInterest ||
    (types.some((type) =>
      ["establishment", "point_of_interest", "shopping_mall", "store"].includes(type),
    )
      ? displayName
      : "");

  const street = [streetNumber, route].filter(Boolean).join(" ").trim();
  const formattedAddress =
    place.formattedAddress ??
    place.formatted_address ??
    place.shortFormattedAddress ??
    [displayName, street, sublocality, city, state, postalCode, country]
      .filter(Boolean)
      .join(", ");

  const geometryCoords = readLatLng(place.geometry?.location);
  const locationCoords = readLatLng(place.location);
  const latitude = geometryCoords.latitude ?? locationCoords.latitude;
  const longitude = geometryCoords.longitude ?? locationCoords.longitude;

  return {
    placeId: place.id ?? place.place_id ?? "",
    formattedAddress,
    displayName,
    latitude: typeof latitude === "number" ? latitude : null,
    longitude: typeof longitude === "number" ? longitude : null,
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

/**
 * Maps parsed Google place data into the address flow draft location shape.
 * @param {ParsedGooglePlace} place
 */
export function buildLocationFromGooglePlace(place) {
  const label = place.area || place.displayName || place.city || "Selected location";

  return {
    label,
    searchLine: place.formattedAddress || place.displayName,
    addressLine1: place.buildingName || place.street || place.displayName || label,
    addressLine2: place.street && place.buildingName ? place.street : "",
    area: place.area || label,
    city: place.city,
    state: place.state,
    country: place.country || "India",
    pincode: place.postalCode,
    latitude: place.latitude,
    longitude: place.longitude,
    placeId: place.placeId,
    street: place.street,
    buildingName: place.buildingName,
    formattedAddress: place.formattedAddress,
  };
}
