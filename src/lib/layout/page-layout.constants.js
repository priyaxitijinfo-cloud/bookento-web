/**
 * Shared layout tokens — single source of truth for page shells and containers.
 * Spacing scale: xs 4 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 3xl 32
 */

/** Default page wrapper with bottom-nav clearance (80px + safe area) */
export const PAGE_SHELL_CLASS = "bg-background min-h-dvh pb-nav md:pb-6";

/** Pages with an extra bottom booking/action bar */
export const PAGE_SHELL_CLASS_TALL = "bg-background min-h-dvh pb-nav-tall md:pb-32";

/** Tinted surface pages (profile-adjacent flows) */
export const PAGE_SHELL_CLASS_SURFACE =
  "bg-surface-page min-h-dvh pb-nav-tall md:pb-32 lg:pb-0";

/** Provider panel main content area */
export const PROVIDER_MAIN_CLASS =
  "mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6 overflow-y-auto p-4 lg:p-6";

/** Sticky desktop header stack (logo + optional breadcrumb) */
export const DESKTOP_STICKY_HEADER_CLASS = "sticky top-0 z-30 hidden shrink-0 md:block";

/** Gap between logo header and breadcrumb row */
export const DESKTOP_HEADER_OFFSET_CLASS = "pt-1.5";

export const BREADCRUMB_WRAP_CLASS =
  "bg-surface-page/95 backdrop-blur supports-[backdrop-filter]:bg-surface-page/90";

export const BREADCRUMB_INNER_CLASS =
  "mx-auto flex h-12 max-w-7xl items-center gap-3 px-4 md:px-6";

export const BREADCRUMB_LINK_CLASS =
  "text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors";

export const BREADCRUMB_CURRENT_CLASS = "truncate text-sm font-semibold";

export const BREADCRUMB_BOTTOM_OFFSET_CLASS = "";

export const DESKTOP_HEADER_HEIGHT = "4.25rem";
export const DESKTOP_BREADCRUMB_HEIGHT = "3rem";

/** Canonical horizontal padding: mobile 16px, desktop 24px */
export const PAGE_X_PADDING = "px-4 md:px-6";

/** Canonical vertical section spacing */
export const SECTION_SPACING = "space-y-4 md:space-y-6";

export const PAGE_CONTAINER_VARIANTS = {
  browse: `page-container mx-auto pt-3 pb-4 md:pt-6 md:pb-6`,
  browseWithBreadcrumb: `page-container mx-auto pt-3 pb-4 md:pb-6`,
  wide: `page-container-wide mx-auto pt-3 pb-4 md:pt-6 md:pb-6`,
  narrow: `page-container-narrow mx-auto py-6`,
  profile: `page-container-wide mx-auto py-6 md:py-8`,
  providerDetail:
    "page-container-wide mx-auto py-4 md:py-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:pb-6",
  provider: PROVIDER_MAIN_CLASS,
  auth: "mx-auto w-full max-w-md px-4 py-6 sm:px-6",
  flush: "w-full",
};

/** @deprecated Use PAGE_CONTAINER_VARIANTS.browse */
export const PAGE_MAIN_CLASS = PAGE_CONTAINER_VARIANTS.browse;

/** Standard gap between icon and label in buttons/nav */
export const ICON_TEXT_GAP = "gap-2";

/** Standard icon sizes (Tailwind classes) */
export const ICON_SIZE = {
  xs: "size-4",
  sm: "size-[1.125rem]",
  md: "size-5",
  lg: "size-6",
};
