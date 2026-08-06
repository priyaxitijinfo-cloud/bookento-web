import { BREAKPOINTS } from "./breakpoints";

/** Layout dimensions for responsive shells */

export const layout = {
  sidebarWidth: 260,
  sidebarCollapsedWidth: 80,
  desktopMaxWidth: 1440,
  contentMaxWidth: 1280,
  mobileMaxWidth: 512,
  headerHeight: 68,
  breadcrumbHeight: 48,
  bottomNavHeight: 80,
  desktopMin: BREAKPOINTS.desktopMin,
  tabletMin: BREAKPOINTS.tabletMin,
};

export const gridCols = {
  mobile: 1,
  tablet: 2,
  desktop: {
    categories: 8,
    providers: 4,
    services: 3,
    packages: 2,
  },
};
