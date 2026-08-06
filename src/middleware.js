import { NextResponse } from "next/server";

import { AUTH_CONFIG } from "@/config/app.config";
import {
  ROUTES,
  isProviderGuestRoute,
  isProviderPanelRoute,
  isPublicUserBrowseRoute,
  isUserGuestRoute,
} from "@/constants/routes.constants";

const PROVIDER_PUBLIC_ROUTES = [
  ROUTES.PROVIDER_LOGIN,
  ROUTES.PROVIDER_REGISTER,
  ROUTES.PROVIDER_FORGOT_PASSWORD,
  ROUTES.PROVIDER_VERIFY_OTP,
  ROUTES.PROVIDER_RESET_PASSWORD,
  ROUTES.PROVIDER_REGISTRATION_STATUS,
];

const PROTECTED_USER_PREFIXES = [
  "/appointments",
  "/chats",
  "/profile",
  "/saved",
  "/addresses",
  "/wallet",
  "/reviews",
  "/referrals",
  "/booking",
];

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 < Date.now();
}

function getAuthFromCookie(request, cookieName) {
  const accessToken = request.cookies.get(cookieName)?.value;
  if (!accessToken || isTokenExpired(accessToken)) return null;
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;
  return {
    role: payload.role,
    status: payload.status,
    userId: payload.sub,
  };
}

function getUserAuth(request) {
  return getAuthFromCookie(request, AUTH_CONFIG.userAccessTokenCookie);
}

function getProviderAuth(request) {
  return getAuthFromCookie(request, AUTH_CONFIG.providerAccessTokenCookie);
}

function isProtectedUserRoute(pathname) {
  if (isPublicUserBrowseRoute(pathname)) {
    return false;
  }

  return PROTECTED_USER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isProviderPublicRoute(pathname) {
  return PROVIDER_PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userAuth = getUserAuth(request);
  const providerAuth = getProviderAuth(request);

  const isProviderRoute = isProviderPanelRoute(pathname);
  const isProviderPublic = isProviderPublicRoute(pathname);

  // User guest routes: redirect authenticated users to home
  if (userAuth && isUserGuestRoute(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  // Provider guest routes: redirect authenticated providers to dashboard
  if (providerAuth && isProviderGuestRoute(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.PROVIDER_HOME, request.url));
  }

  // Protect provider panel routes (/provider, /provider/* — NOT /providers)
  if (isProviderRoute && !isProviderPublic) {
    if (!providerAuth) {
      const loginUrl = new URL(ROUTES.PROVIDER_LOGIN, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (providerAuth.status === "rejected") {
      return NextResponse.redirect(new URL(ROUTES.PROVIDER_REGISTRATION_STATUS, request.url));
    }

    if (
      providerAuth.status === "pending" &&
      pathname !== ROUTES.PROVIDER_REGISTRATION_STATUS
    ) {
      return NextResponse.redirect(new URL(ROUTES.PROVIDER_REGISTRATION_STATUS, request.url));
    }
  }

  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  // Protect user routes — never redirect to provider dashboard
  if (
    !isProviderRoute &&
    !isUserGuestRoute(pathname) &&
    !isProviderGuestRoute(pathname) &&
    !isPublicAsset &&
    isProtectedUserRoute(pathname)
  ) {
    if (!userAuth) {
      const loginUrl = new URL(ROUTES.USER_LOGIN, request.url);
      loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
