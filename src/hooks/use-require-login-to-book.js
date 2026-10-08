"use client";

import { useRouter } from "next/navigation";

import { getLoginRedirectUrl, isRegisteredBookableUser } from "@/lib/auth/booking-auth";
import { useBreakpoint } from "@/hooks/responsive/use-breakpoint";
import { useUserAuthStore } from "@/store";

/**
 * Force login before booking CTAs when the user is not a registered bookable user.
 */
export function useRequireLoginToBook() {
  const router = useRouter();
  const { isTabletUp } = useBreakpoint();
  const isAuthenticated = useUserAuthStore((s) => s.isAuthenticated);
  const isGuest = useUserAuthStore((s) => s.isGuest);
  const canBook = isRegisteredBookableUser({ isAuthenticated, isGuest });
  // Fail closed: unauthenticated / guest always go to login.
  const shouldGate = !canBook;

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
