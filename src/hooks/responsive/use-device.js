"use client";

import { useBreakpoint } from "./use-breakpoint";

export function useDevice() {
  const { device, isMobile, isTablet, isDesktop, width } = useBreakpoint();
  return { device, isMobile, isTablet, isDesktop, width };
}
