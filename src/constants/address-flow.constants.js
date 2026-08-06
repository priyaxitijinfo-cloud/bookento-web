export const ADDRESS_FLOW_DRAFT_KEY = "bookento-address-flow-draft";

export const ADDRESS_FLOW_STEPS = {
  LIST: "list",
  SEARCH: "search",
  MAP: "map",
  FORM: "form",
};

export function readAddressFlowDraft() {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(ADDRESS_FLOW_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeAddressFlowDraft(draft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADDRESS_FLOW_DRAFT_KEY, JSON.stringify(draft));
}

export function clearAddressFlowDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADDRESS_FLOW_DRAFT_KEY);
}

export const DEFAULT_MAP_LOCATION = {
  label: "Adajan",
  searchLine: "123, ABC Complex",
  addressLine1: "123, ABC Complex",
  addressLine2: "Near XYZ Mall",
  area: "Adajan",
  city: "Surat",
  state: "Gujarat",
  country: "India",
  pincode: "395009",
  latitude: 21.1959,
  longitude: 72.7863,
};

export function buildLocationFromSuggestion(suggestion) {
  const title = suggestion.title || "Selected location";
  const searchLine = [title, suggestion.subtitle].filter(Boolean).join(", ");

  return {
    label: suggestion.area || title,
    searchLine,
    addressLine1: title,
    addressLine2: "",
    area: suggestion.area || title,
    city: suggestion.city || "",
    state: suggestion.state || "",
    country: suggestion.country || "India",
    pincode: suggestion.pincode || "",
    latitude: suggestion.latitude,
    longitude: suggestion.longitude,
  };
}

export function formatAddressLine(address) {
  const lineOne = [address.addressLine1, address.addressLine2].filter(Boolean).join(", ");
  const lineTwo = [address.area || address.city, address.city, address.state]
    .filter(Boolean)
    .join(", ");
  const pincode = address.pincode ? ` - ${address.pincode}` : "";

  return `${lineOne}, ${lineTwo}${pincode}, ${address.country || "India"}`;
}

export function formatAddressPreview(address) {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    [address.area, address.city].filter(Boolean).join(" "),
    [address.state, address.pincode].filter(Boolean).join(" - "),
    address.country || "India",
  ].filter(Boolean);

  return parts.join(", ");
}

export const ADDRESS_LABEL_CHIPS = [
  { id: "house", label: "House", storeLabel: "Home" },
  { id: "work", label: "Work", storeLabel: "Office" },
  { id: "other", label: "Other", storeLabel: "Other" },
];

export function getLabelChipId(storeLabel) {
  if (storeLabel === "Home") return "house";
  if (storeLabel === "Office") return "work";
  return "other";
}

export function resolveStoreLabel(chipId, editingLabel) {
  if (chipId === "other" && editingLabel === "Parents Home") return "Parents Home";

  return ADDRESS_LABEL_CHIPS.find((chip) => chip.id === chipId)?.storeLabel ?? "Other";
}
