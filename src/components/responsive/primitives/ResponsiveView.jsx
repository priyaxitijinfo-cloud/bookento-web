"use client";

import { useResponsive } from "@/hooks/responsive";

/**
 * Renders the correct presentation for the current breakpoint.
 * Business logic stays in the parent; only UI variants are switched.
 */
export function ResponsiveView({ mobile, tablet, desktop, children }) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isDesktop && desktop) return desktop;
  if (isTablet && tablet) return tablet;
  if (isMobile && mobile) return mobile;

  // Fallbacks: tablet → desktop → mobile → children
  if (isDesktop) return desktop || tablet || mobile || children || null;
  if (isTablet) return tablet || mobile || desktop || children || null;
  return mobile || tablet || desktop || children || null;
}
