const AUTH_PATH_PREFIXES = [
  "/login",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

const PROVIDER_AUTH_PATH_PREFIXES = [
  "/provider/login",
  "/provider/register",
  "/provider/forgot-password",
  "/provider/reset-password",
  "/provider/verify-otp",
  "/provider/registration-status",
];

export function shouldUseMobileUserPageBg(pathname) {
  if (!pathname) return false;

  if (
    AUTH_PATH_PREFIXES.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    return false;
  }

  if (
    PROVIDER_AUTH_PATH_PREFIXES.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    return false;
  }

  if (pathname === "/provider" || pathname.startsWith("/provider/")) {
    return false;
  }

  if (/^\/providers\/[^/]+(\/.*)?$/.test(pathname)) {
    return false;
  }

  if (pathname === "/booking" || pathname.startsWith("/booking/")) {
    return false;
  }

  return true;
}
