"use client";

import { useSyncExternalStore } from "react";
import { MEDIA_QUERIES } from "@/theme/breakpoints";

function subscribe(query, callback) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(query) {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (cb) => subscribe(query, cb),
    () => getSnapshot(query),
    getServerSnapshot
  );
}

export function useIsMobile() {
  return useMediaQuery(MEDIA_QUERIES.mobile);
}

export function useIsTablet() {
  return useMediaQuery(MEDIA_QUERIES.tablet);
}

export function useIsDesktop() {
  return useMediaQuery(MEDIA_QUERIES.desktop);
}
