"use client";

import { useRouter } from "next/navigation";

import { getLoginRedirectUrl, isRegisteredBookableUser } from "@/lib/auth/booking-auth";
import { useBreakpoint } from "@/hooks/responsive/use-breakpoint";
import { useUserAuthStore } from "@/store";

/**
 * Web (md / tabletUp+) only: force login before booking CTAs.
 * Mobile keeps the existing browse → book flow.
 */
export function useRequireLoginToBook() {
  const router = useRouter();
  const { isReady, isTabletUp } = useBreakpoint();
  const isAuthenticated = useUserAuthStore((s) => s.isAuthenticated);
  const isGuest = useUserAuthStore((s) => s.isGuest);
  const canBook = isRegisteredBookableUser({ isAuthenticated, isGuest });
  const shouldGate = isReady && isTabletUp && !canBook;

  function getBookHref(targetHref) {
    if (!shouldGate) return targetHref;
    return getLoginRedirectUrl(targetHref);
  }

  function requireLoginOrContinue(targetHref) {
    if (!shouldGate) return true;
    router.push(getLoginRedirectUrl(targetHref));
    return false;
  }

  return {
    canBook,
    isWeb: isTabletUp,
    shouldGate,
    getBookHref,
    requireLoginOrContinue,
  };
}
