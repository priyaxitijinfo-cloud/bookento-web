import { ROUTES } from "@/constants/routes.constants";

/** Registered (non-guest) users can complete booking on web. */
export function isRegisteredBookableUser({ isAuthenticated, isGuest } = {}) {
  return Boolean(isAuthenticated && !isGuest);
}

/** Login URL that returns the user to `redirectTo` after auth. */
export function getLoginRedirectUrl(redirectTo = ROUTES.HOME) {
  const redirect =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : ROUTES.HOME;
  const params = new URLSearchParams({ redirect });
  return `${ROUTES.USER_LOGIN}?${params.toString()}`;
}

/** Payment steps that must never be reachable without a user session. */
export function isBookingPaymentRoute(pathname) {
  if (!pathname) return false;
  return (
    /^\/providers\/[^/]+\/payment(?:\/|$)/.test(pathname) ||
    /^\/providers\/[^/]+\/packages\/[^/]+\/payment(?:\/|$)/.test(pathname)
  );
}
