"use client";

import { useResponsive } from "@/hooks/responsive";

function DefaultBreakpointFallback() {
  return (
    <div className="bg-background min-h-dvh" aria-hidden>
      <div className="border-border h-14 border-b" />
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-6">
        <div className="bg-muted h-10 w-64 max-w-full animate-pulse rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted h-56 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the correct presentation for the current breakpoint.
 * Business logic stays in the parent; only UI variants are switched.
 *
 * Until the real viewport is known, only a skeleton fallback is shown —
 * never a guessed mobile/old layout, so there is no flash of the wrong design.
 */
export function ResponsiveView({ mobile, tablet, desktop, children, fallback }) {
  const { isMobile, isTablet, isDesktop, isReady } = useResponsive();

  if (!isReady) {
    return fallback !== undefined ? fallback : <DefaultBreakpointFallback />;
  }

  if (isDesktop && desktop) return desktop;
  if (isTablet && tablet) return tablet;
  if (isMobile && mobile) return mobile;

  // Fallbacks: tablet → desktop → mobile → children
  if (isDesktop) return desktop || tablet || mobile || children || null;
  if (isTablet) return tablet || mobile || desktop || children || null;
  return mobile || tablet || desktop || children || null;
}
