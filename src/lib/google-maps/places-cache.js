import {
  PLACES_CACHE_KEY,
  PLACES_CACHE_MAX_ENTRIES,
  PLACES_CACHE_TTL_MS,
} from "@/lib/google-maps/constants";

function normalizeQuery(query) {
  return query.trim().toLowerCase();
}

function readCacheStore() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(PLACES_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCacheStore(store) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PLACES_CACHE_KEY, JSON.stringify(store));
  } catch {
    // Ignore quota / private mode errors.
  }
}

/**
 * Returns cached suggestion payloads for a query if still fresh.
 * @param {string} query
 * @returns {Array|null}
 */
export function getCachedSuggestions(query) {
  const key = normalizeQuery(query);
  if (!key) return null;

  const store = readCacheStore();
  const entry = store[key];
  if (!entry) return null;

  if (Date.now() - entry.fetchedAt > PLACES_CACHE_TTL_MS) {
    delete store[key];
    writeCacheStore(store);
    return null;
  }

  return entry.suggestions;
}

/**
 * Persists serializable suggestion payloads for a query.
 * @param {string} query
 * @param {Array} suggestions
 */
export function setCachedSuggestions(query, suggestions) {
  const key = normalizeQuery(query);
  if (!key || !Array.isArray(suggestions)) return;

  const store = readCacheStore();
  store[key] = {
    suggestions,
    fetchedAt: Date.now(),
  };

  const entries = Object.entries(store).sort(
    (a, b) => (b[1].fetchedAt ?? 0) - (a[1].fetchedAt ?? 0),
  );

  const trimmed = Object.fromEntries(entries.slice(0, PLACES_CACHE_MAX_ENTRIES));
  writeCacheStore(trimmed);
}

/** Clears all cached autocomplete queries. */
export function clearPlacesCache() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PLACES_CACHE_KEY);
}
