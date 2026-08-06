"use client";

import { useSyncExternalStore } from "react";
import { BREAKPOINTS, DEVICE } from "@/theme/breakpoints";
import { getDeviceFromWidth } from "@/theme/responsive";

function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getWidth() {
  return window.innerWidth;
}

function getServerWidth() {
  return BREAKPOINTS.mobileMax;
}

export function useBreakpoint() {
  const width = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const device = getDeviceFromWidth(width);

  return {
    width,
    device,
    isMobile: device === DEVICE.MOBILE,
    isTablet: device === DEVICE.TABLET,
    isDesktop: device === DEVICE.DESKTOP,
    isTabletUp: width >= BREAKPOINTS.tabletMin,
    isDesktopUp: width >= BREAKPOINTS.desktopMin,
  };
}
