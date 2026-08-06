import {
  fetchPlaceDetailsById,
  parseGooglePlaceFromRest,
} from "@/lib/google-maps/places-api-server";
import { PlacesError, PlacesErrorCode } from "@/lib/google-maps/places-errors";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId")?.trim();
    const sessionToken = searchParams.get("sessionToken")?.trim();

    if (!placeId) {
      return Response.json(
        { error: "INVALID_REQUEST", message: "placeId is required." },
        { status: 400 },
      );
    }

    const place = await fetchPlaceDetailsById(placeId, sessionToken);
    const parsed = parseGooglePlaceFromRest(place);

    return Response.json({ place: parsed });
  } catch (error) {
    if (error instanceof PlacesError) {
      return Response.json(
        { error: error.code, message: error.message },
        { status: error.code === PlacesErrorCode.API_KEY_MISSING ? 503 : 502 },
      );
    }

    return Response.json(
      { error: PlacesErrorCode.NETWORK, message: "Place details failed." },
      { status: 500 },
    );
  }
}
