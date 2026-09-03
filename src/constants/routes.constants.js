export const ROUTES = {
  HOME: "/",
  USER_LOGIN: "/login",
  REELS: "/reels",
  APPOINTMENTS: "/appointments",
  CHATS: "/chats",
  PROFILE: "/profile",
  LANGUAGE: "/profile/language",
  PROFILE_EDIT: "/profile/edit",
  HELP: "/profile/help",
  PRIVACY: "/profile/privacy",
  TERMS: "/profile/terms",
  SAVED: "/saved",
  ADDRESSES: "/addresses",
  WALLET: "/wallet",
  WALLET_ADD_MONEY: "/wallet/add-money",
  WALLET_ADD_MONEY_OFFERS: "/wallet/add-money/offers",
  WALLET_TRANSACTIONS: "/wallet/transactions",
  REVIEWS: "/reviews",
  REFERRALS: "/referrals",
  PROVIDERS: "/providers",
  SERVICES: "/services",
  BOOKING: "/booking",
  SEARCH: "/search",
  CATEGORIES: "/categories",
  NOTIFICATIONS: "/notifications",
  CALL_AUDIO: "/call/audio",
  CALL_VIDEO: "/call/video",

  PROVIDER_HOME: "/provider",
  PROVIDER_LOGIN: "/provider/login",
  PROVIDER_REGISTER: "/provider/register",
  PROVIDER_APPOINTMENTS: "/provider/appointments",
  PROVIDER_CHATS: "/provider/chats",
  PROVIDER_EARNINGS: "/provider/earnings",
  PROVIDER_SETTINGS: "/provider/settings",
  PROVIDER_SERVICES: "/provider/services",
  PROVIDER_BRANCHES: "/provider/branches",
  PROVIDER_PACKAGES: "/provider/packages",
  PROVIDER_POSTS: "/provider/posts",
  PROVIDER_REELS: "/provider/reels",
  PROVIDER_CATEGORIES: "/provider/categories",
  PROVIDER_RATINGS: "/provider/ratings",
  PROVIDER_PROFILE: "/provider/profile",
  PROVIDER_ANALYTICS: "/provider/analytics",
  PROVIDER_GALLERY: "/provider/gallery",
  PROVIDER_NOTIFICATIONS: "/provider/notifications",

  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  RESET_PASSWORD: "/reset-password",
  PROVIDER_FORGOT_PASSWORD: "/provider/forgot-password",
  PROVIDER_VERIFY_OTP: "/provider/verify-otp",
  PROVIDER_RESET_PASSWORD: "/provider/reset-password",
  PROVIDER_REGISTRATION_STATUS: "/provider/registration-status",
};

export const GUEST_ROUTES = [
  ROUTES.USER_LOGIN,
  ROUTES.PROVIDER_LOGIN,
  ROUTES.PROVIDER_REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.VERIFY_OTP,
  ROUTES.RESET_PASSWORD,
  ROUTES.PROVIDER_FORGOT_PASSWORD,
  ROUTES.PROVIDER_VERIFY_OTP,
  ROUTES.PROVIDER_RESET_PASSWORD,
];

export const USER_GUEST_ROUTES = [
  ROUTES.USER_LOGIN,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.VERIFY_OTP,
  ROUTES.RESET_PASSWORD,
];

export const PROVIDER_GUEST_ROUTES = [
  ROUTES.PROVIDER_LOGIN,
  ROUTES.PROVIDER_REGISTER,
  ROUTES.PROVIDER_FORGOT_PASSWORD,
  ROUTES.PROVIDER_VERIFY_OTP,
  ROUTES.PROVIDER_RESET_PASSWORD,
  ROUTES.PROVIDER_REGISTRATION_STATUS,
];

export const PROVIDER_PUBLIC_ROUTES = [...PROVIDER_GUEST_ROUTES];

/** Matches /provider and /provider/* but NOT /providers */
export function isProviderPanelRoute(pathname) {
  return pathname === "/provider" || pathname.startsWith("/provider/");
}

export function isUserGuestRoute(pathname) {
  return USER_GUEST_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isProviderGuestRoute(pathname) {
  return PROVIDER_GUEST_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/** User routes reachable from the home header without login (demo browse). */
export const PUBLIC_USER_BROWSE_ROUTES = [
  ROUTES.SAVED,
  ROUTES.PROFILE,
  ROUTES.APPOINTMENTS,
  ROUTES.CHATS,
  ROUTES.NOTIFICATIONS,
  ROUTES.SEARCH,
  ROUTES.ADDRESSES,
  ROUTES.WALLET,
  ROUTES.LANGUAGE,
  ROUTES.PROFILE_EDIT,
  ROUTES.HELP,
  ROUTES.PRIVACY,
  ROUTES.TERMS,
  ROUTES.REVIEWS,
  ROUTES.REFERRALS,
];

export function isPublicUserBrowseRoute(pathname) {
  if (/^\/appointments\/[^/]+$/.test(pathname)) {
    return true;
  }

  return PUBLIC_USER_BROWSE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function categoryListingRoute(slug) {
  return `/categories/${slug}`;
}

export function providerPackageRoute(providerId, packageId) {
  return `/providers/${providerId}/packages/${packageId}`;
}

export function providerPackagePaymentRoute(providerId, packageId) {
  return `/providers/${providerId}/packages/${packageId}/payment`;
}

export function providerPaymentRoute(providerId) {
  return `/providers/${providerId}/payment`;
}

export function providerDetailRoute(id) {
  return `/providers/${id}`;
}

export function providerDetailFromSavedRoute(id) {
  return `${providerDetailRoute(id)}?from=saved`;
}

export function buildCategoryProviderDetailUrl(providerId, categorySlug, provider) {
  const params = new URLSearchParams();

  if (categorySlug) {
    params.set("from", categorySlug);
    params.set("name", provider.businessName);
    params.set("specialty", provider.specialty);
    params.set("avatar", provider.avatar);
  }

  const query = params.toString();
  return query
    ? `${providerDetailRoute(providerId)}?${query}`
    : providerDetailRoute(providerId);
}

export function appendCategoryFlowQuery(baseUrl, categorySlug, provider) {
  if (!categorySlug || !provider) return baseUrl;

  const params = new URLSearchParams();
  params.set("from", categorySlug);
  params.set("name", provider.businessName);
  params.set("specialty", provider.specialty);
  params.set("avatar", provider.avatar);

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${params.toString()}`;
}

export function providerBookingRoute(id) {
  return `/booking?provider=${id}`;
}

export function chatDetailRoute(id) {
  return `/chats/${id}`;
}

export function appointmentDetailRoute(id) {
  return `/appointments/${id}`;
}
