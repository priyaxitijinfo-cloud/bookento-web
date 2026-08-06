import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import {
  getClientGoogleMapsApiKey,
  PLACES_AUTOCOMPLETE_DEBOUNCE_MS,
  PLACE_DETAILS_FIELDS,
} from "@/lib/google-maps/constants";
import { loadPlacesLibrary } from "@/lib/google-maps/load-google-maps";
import {
  getCachedSuggestions,
  setCachedSuggestions,
} from "@/lib/google-maps/places-cache";
import { parseGooglePlaceDetails } from "@/lib/google-maps/parse-place-details";
import {
  mapGoogleError,
  PlacesError,
  PlacesErrorCode,
} from "@/lib/google-maps/places-errors";

function formatPredictionText(value) {
  if (!value) return "";
  return value.toString?.() ?? String(value);
}

function serializeClientPrediction(placePrediction, index) {
  return {
    id: placePrediction.placeId || `prediction-${index}`,
    placeId: placePrediction.placeId || "",
    mainText: formatPredictionText(placePrediction.mainText ?? placePrediction.text),
    secondaryText: formatPredictionText(placePrediction.secondaryText),
    fullText: formatPredictionText(placePrediction.text),
    placePrediction,
  };
}

async function ensureClientSessionToken(sessionTokenRef) {
  const { AutocompleteSessionToken } = await loadPlacesLibrary();
  if (!sessionTokenRef.current) {
    sessionTokenRef.current = new AutocompleteSessionToken();
  }
  return sessionTokenRef.current;
}

async function fetchAutocompleteFromGoogle(trimmed, sessionTokenRef, options) {
  const { AutocompleteSuggestion } = await loadPlacesLibrary();
  await ensureClientSessionToken(sessionTokenRef);

  const request = {
    input: trimmed,
    sessionToken: sessionTokenRef.current,
    languageCode: options.languageCode,
    regionCode: options.regionCode,
  };

  if (options.includedRegionCodes?.length) {
    request.includedRegionCodes = options.includedRegionCodes;
  }

  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

  return (suggestions ?? [])
    .map((item, index) => {
      const prediction = item.placePrediction;
      if (!prediction) return null;
      return serializeClientPrediction(prediction, index);
    })
    .filter(Boolean);
}

async function fetchPlaceDetailsFromGoogle(suggestion, sessionTokenRef) {
  const places = await loadPlacesLibrary();
  let place;

  if (suggestion.placePrediction) {
    place = suggestion.placePrediction.toPlace();
  } else if (suggestion.placeId) {
    place = new places.Place({ id: suggestion.placeId });
  } else {
    throw new PlacesError(PlacesErrorCode.DETAILS_FAILED);
  }

  await place.fetchFields({ fields: PLACE_DETAILS_FIELDS });
  return parseGooglePlaceDetails(place);
}

/**
 * Google Places Autocomplete (New) via Maps JavaScript API in the browser.
 * Calls Google directly — no app server proxy. Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 */
export function useGooglePlacesAutocomplete({
  initialValue = "",
  value,
  debounceMs = PLACES_AUTOCOMPLETE_DEBOUNCE_MS,
  languageCode = "en",
  regionCode = "in",
  includedRegionCodes,
  onPlaceSelect,
  enabled = true,
} = {}) {
  const listboxId = useId();
  const inputRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const requestIdRef = useRef(0);
  const suggestionsRef = useRef([]);
  const hasClientKey = Boolean(getClientGoogleMapsApiKey());

  const [inputValue, setInputValue] = useState(value ?? initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapsReady, setMapsReady] = useState(false);

  const effectiveInput = value !== undefined ? value : inputValue;
  const debouncedInput = useDebounce(effectiveInput, debounceMs);

  suggestionsRef.current = suggestions;

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!enabled || !hasClientKey) return;

    loadPlacesLibrary()
      .then(() => setMapsReady(true))
      .catch((loadError) => {
        setMapsReady(false);
        setError(mapGoogleError(loadError));
      });
  }, [enabled, hasClientKey]);

  const resetSessionToken = useCallback(async () => {
    const { AutocompleteSessionToken } = await loadPlacesLibrary();
    sessionTokenRef.current = new AutocompleteSessionToken();
  }, []);

  const fetchSuggestions = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setSuggestions([]);
        setError(null);
        setLoading(false);
        setActiveIndex(-1);
        return;
      }

      if (!hasClientKey) {
        setError(new PlacesError(PlacesErrorCode.API_KEY_MISSING));
        return;
      }

      const cached = getCachedSuggestions(trimmed);
      if (cached?.length) {
        setSuggestions(cached);
        setError(null);
        setLoading(false);
        setIsOpen(true);
        setActiveIndex(0);
        return;
      }

      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        if (!sessionTokenRef.current) {
          await resetSessionToken();
        }

        const mapped = await fetchAutocompleteFromGoogle(trimmed, sessionTokenRef, {
          languageCode,
          regionCode,
          includedRegionCodes,
        });

        if (requestId !== requestIdRef.current) return;

        setCachedSuggestions(trimmed, mapped);
        setSuggestions(mapped);
        setIsOpen(true);
        setActiveIndex(mapped.length ? 0 : -1);

        if (mapped.length === 0) {
          setError(new PlacesError(PlacesErrorCode.NO_RESULTS));
        }
      } catch (fetchError) {
        if (requestId !== requestIdRef.current) return;
        setSuggestions([]);
        setActiveIndex(-1);
        setError(
          fetchError instanceof PlacesError ? fetchError : mapGoogleError(fetchError),
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [hasClientKey, includedRegionCodes, languageCode, regionCode, resetSessionToken],
  );

  useEffect(() => {
    if (!enabled || !mapsReady) return;

    if (!debouncedInput.trim()) {
      setSuggestions([]);
      setError(null);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    fetchSuggestions(debouncedInput);

    return () => {
      requestIdRef.current += 1;
    };
  }, [debouncedInput, enabled, fetchSuggestions, mapsReady]);

  const selectSuggestion = useCallback(
    async (suggestion) => {
      if (!suggestion?.placeId) return null;

      setResolving(true);
      setError(null);
      setInputValue(suggestion.fullText || suggestion.mainText);
      setIsOpen(false);
      setActiveIndex(-1);

      try {
        const place = await fetchPlaceDetailsFromGoogle(suggestion, sessionTokenRef);
        setSelectedPlace(place);
        onPlaceSelect?.(place);
        await resetSessionToken();
        return place;
      } catch (detailsError) {
        setError(
          detailsError instanceof PlacesError
            ? detailsError
            : new PlacesError(PlacesErrorCode.DETAILS_FAILED),
        );
        return null;
      } finally {
        setResolving(false);
      }
    },
    [onPlaceSelect, resetSessionToken],
  );

  const handleInputChange = useCallback((nextValue) => {
    setInputValue(nextValue);
    setSelectedPlace(null);
    setError(null);

    if (!nextValue.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    setIsOpen(true);
  }, []);

  const clearInput = useCallback(() => {
    setInputValue("");
    setSuggestions([]);
    setSelectedPlace(null);
    setError(null);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  const openSuggestions = useCallback(() => {
    if (suggestionsRef.current.length > 0 || effectiveInput.trim()) {
      setIsOpen(true);
    }
  }, [effectiveInput]);

  const closeSuggestions = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const selectActiveSuggestion = useCallback(() => {
    const target =
      suggestionsRef.current[activeIndex] ?? suggestionsRef.current[0] ?? null;
    return selectSuggestion(target);
  }, [activeIndex, selectSuggestion]);

  const handleKeyDown = useCallback(
    (event) => {
      const count = suggestionsRef.current.length;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!count) return;
          setIsOpen(true);
          setActiveIndex((prev) => (prev + 1 >= count ? 0 : prev + 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!count) return;
          setIsOpen(true);
          setActiveIndex((prev) => (prev <= 0 ? count - 1 : prev - 1));
          break;
        case "Enter":
          if (isOpen && count > 0) {
            event.preventDefault();
            selectActiveSuggestion();
          }
          break;
        case "Escape":
          event.preventDefault();
          closeSuggestions();
          break;
        default:
          break;
      }
    },
    [closeSuggestions, isOpen, selectActiveSuggestion],
  );

  return {
    inputRef,
    listboxId,
    inputValue,
    setInputValue: handleInputChange,
    suggestions,
    loading: loading || (hasClientKey && !mapsReady),
    resolving,
    error,
    isOpen,
    activeIndex,
    selectedPlace,
    mapsReady,
    hasClientKey,
    clearInput,
    openSuggestions,
    closeSuggestions,
    selectSuggestion,
    selectActiveSuggestion,
    handleKeyDown,
    setActiveIndex,
  };
}
