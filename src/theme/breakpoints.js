/** Responsive breakpoints — Mobile 0–767, Tablet 768–1199, Desktop 1200+ */

export const BREAKPOINTS = {
  mobileMax: 767,
  tabletMin: 768,
  tabletMax: 1199,
  desktopMin: 1200,
};

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobileMax}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktopMin}px)`,
  tabletUp: `(min-width: ${BREAKPOINTS.tabletMin}px)`,
  desktopUp: `(min-width: ${BREAKPOINTS.desktopMin}px)`,
  mobileOrTablet: `(max-width: ${BREAKPOINTS.tabletMax}px)`,
};

export const DEVICE = {
  MOBILE: "mobile",
  TABLET: "tablet",
  DESKTOP: "desktop",
};
