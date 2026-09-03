"use client";

import { useResponsive } from "@/hooks/responsive";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";

/**
 * Top-level app shell that picks Mobile vs Desktop chrome.
 * Tablet uses MobileLayout with wider max-width via CSS.
 */
export function AppLayout({
  children,
  showBottomNav = true,
  showSidebar = false,
  header,
  className,
  desktopHeader,
  maxWidth = "wide",
}) {
  const { isDesktop } = useResponsive();

  if (isDesktop) {
    return (
      <DesktopLayout
        showSidebar={showSidebar}
        header={desktopHeader || header}
        maxWidth={maxWidth}
        className={className}
      >
        {children}
      </DesktopLayout>
    );
  }

  return (
    <MobileLayout
      showBottomNav={showBottomNav}
      className={className}
      maxWidth={!isDesktop}
    >
      {children}
    </MobileLayout>
  );
}
