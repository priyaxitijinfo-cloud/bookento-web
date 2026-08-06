import { BREAKPOINTS, DEVICE } from "./breakpoints";

export function getDeviceFromWidth(width) {
  if (width == null || Number.isNaN(width)) return DEVICE.MOBILE;
  if (width <= BREAKPOINTS.mobileMax) return DEVICE.MOBILE;
  if (width <= BREAKPOINTS.tabletMax) return DEVICE.TABLET;
  return DEVICE.DESKTOP;
}

export function isMobileWidth(width) {
  return getDeviceFromWidth(width) === DEVICE.MOBILE;
}

export function isTabletWidth(width) {
  return getDeviceFromWidth(width) === DEVICE.TABLET;
}

export function isDesktopWidth(width) {
  return getDeviceFromWidth(width) === DEVICE.DESKTOP;
}

export const responsiveClass = {
  mobileOnly: "max-[767px]:block min-[768px]:hidden",
  tabletOnly: "hidden min-[768px]:max-[1199px]:block",
  desktopOnly: "hidden min-[1200px]:block",
  tabletUp: "hidden min-[768px]:block",
  desktopUp: "hidden min-[1200px]:block",
  untilDesktop: "min-[1200px]:hidden",
};
