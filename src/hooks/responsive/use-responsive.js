"use client";

import { useBreakpoint } from "./use-breakpoint";

/**
 * Returns the active presentation variant and helpers for responsive UI.
 */
export function useResponsive() {
  const bp = useBreakpoint();

  return {
    ...bp,
    variant: bp.device,
    showSidebar: bp.isDesktop,
    showBottomNav: bp.isMobile || bp.isTablet,
    columns: bp.isDesktop ? 3 : bp.isTablet ? 2 : 1,
  };
}
