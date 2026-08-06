import {
  fetchPlacesAutocomplete,
  parseRestAutocompleteSuggestion,
} from "@/lib/google-maps/places-api-server";
import { PlacesError, PlacesErrorCode } from "@/lib/google-maps/places-errors";

export async function POST(request) {
  try {
    const body = await request.json();
    const input = body.input?.trim() ?? "";

    if (input.length < 1) {
      return Response.json({ suggestions: [] });
    }

    const data = await fetchPlacesAutocomplete({
      input,
      sessionToken: body.sessionToken,
      languageCode: body.languageCode ?? "en",
      regionCode: body.regionCode ?? "in",
      includedRegionCodes: body.includedRegionCodes,
    });

    const suggestions = (data.suggestions ?? [])
      .map((item, index) => parseRestAutocompleteSuggestion(item, index))
      .filter(Boolean);

    return Response.json({ suggestions });
  } catch (error) {
    if (error instanceof PlacesError) {
      return Response.json(
        { error: error.code, message: error.message, suggestions: [] },
        { status: error.code === PlacesErrorCode.API_KEY_MISSING ? 503 : 502 },
      );
    }

    return Response.json(
      { error: PlacesErrorCode.NETWORK, message: "Autocomplete failed.", suggestions: [] },
      { status: 500 },
    );
  }
}
