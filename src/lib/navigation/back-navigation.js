import { ROUTES } from "@/constants/routes.constants";

const STORAGE_KEY = "bookento-back-from";

export const BACK_FROM_SOURCES = {
  home: { href: ROUTES.HOME, label: "Home" },
  profile: { href: ROUTES.PROFILE, label: "Profile" },
  settings: { href: `${ROUTES.PROFILE}?tab=settings`, label: "Settings" },
  billings: { href: `${ROUTES.PROFILE}?tab=billings`, label: "Billings" },
  saved: { href: ROUTES.SAVED, label: "Saved Providers" },
  addresses: { href: ROUTES.ADDRESSES, label: "Addresses" },
  wallet: { href: ROUTES.WALLET, label: "My Wallet" },
  reviews: { href: ROUTES.REVIEWS, label: "Reviews" },
  referrals: { href: ROUTES.REFERRALS, label: "Credits & referrals" },
  appointments: { href: ROUTES.APPOINTMENTS, label: "Bookings" },
  chats: { href: ROUTES.CHATS, label: "Chats" },
  search: { href: ROUTES.SEARCH, label: "Search" },
};

export function setBackFromSource(from) {
  if (typeof window === "undefined" || !from || !BACK_FROM_SOURCES[from]) return;
  sessionStorage.setItem(STORAGE_KEY, from);
}

export function getStoredBackFrom() {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored && BACK_FROM_SOURCES[stored] ? stored : null;
}

export function appendFromParam(path, from) {
  if (!from) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}from=${encodeURIComponent(from)}`;
}

export function buildReelsRoute({ from, view } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (view) params.set("view", view);

  const query = params.toString();
  return query ? `${ROUTES.REELS}?${query}` : ROUTES.REELS;
}

export function resolveBackNavigation(fromQuery, fallback = "home") {
  const from = fromQuery || fallback;
  const source = BACK_FROM_SOURCES[from] ?? BACK_FROM_SOURCES[fallback] ?? BACK_FROM_SOURCES.home;

  return {
    href: source.href,
    label: `Back to ${source.label}`,
  };
}
