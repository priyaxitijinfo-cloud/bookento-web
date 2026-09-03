"use client";

import { useSyncExternalStore } from "react";
import { BREAKPOINTS, DEVICE } from "@/theme/breakpoints";
import { getDeviceFromWidth } from "@/theme/responsive";

/** Sentinel used on the server / before the real viewport is known. */
const UNKNOWN_WIDTH = -1;

function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getWidth() {
  return window.innerWidth;
}

function getServerWidth() {
  // Avoid assuming mobile during SSR — that caused a flash of the mobile
  // layout before the real desktop/tablet breakpoint applied after hydration.
  return UNKNOWN_WIDTH;
}

export function useBreakpoint() {
  const width = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const isReady = width >= 0;
  const device = isReady ? getDeviceFromWidth(width) : null;

  return {
    width: isReady ? width : 0,
    device: device ?? DEVICE.MOBILE,
    isReady,
    isMobile: isReady && device === DEVICE.MOBILE,
    isTablet: isReady && device === DEVICE.TABLET,
    isDesktop: isReady && device === DEVICE.DESKTOP,
    isTabletUp: isReady && width >= BREAKPOINTS.tabletMin,
    isDesktopUp: isReady && width >= BREAKPOINTS.desktopMin,
  };
}
