import { getGoogleMapsApiKey, isGoogleMapsConfigured } from "@/lib/google-maps/get-api-key";

export async function GET() {
  const serverConfigured = isGoogleMapsConfigured();
  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim());
  const hasServerKey = Boolean(process.env.GOOGLE_MAPS_API_KEY?.trim());

  return Response.json({
    configured: serverConfigured,
    hasPublicKey,
    hasServerKey,
    provider: serverConfigured
      ? hasPublicKey
        ? "client-js-api"
        : "server-rest-api"
      : null,
  });
}
