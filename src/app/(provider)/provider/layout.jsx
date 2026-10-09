"use client";

import { usePathname } from "next/navigation";

import { ProviderBottomNav, ProviderSidebar } from "@/components/layout/provider-nav";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

function isProviderChatThread(pathname) {
  return /^\/provider\/chats\/[^/]+/.test(pathname);
}

function isProviderAppointmentDetail(pathname) {
  return /^\/provider\/appointments\/[^/]+/.test(pathname);
}

function isProviderEarningsSubpage(pathname) {
  return (
    pathname === ROUTES.PROVIDER_EARNINGS_TRANSACTIONS ||
    pathname === ROUTES.PROVIDER_EARNINGS_WALLET ||
    (pathname.startsWith(`${ROUTES.PROVIDER_EARNINGS}/`) &&
      pathname !== ROUTES.PROVIDER_EARNINGS)
  );
}

function isProviderProfileEdit(pathname) {
  return (
    pathname === ROUTES.PROVIDER_SETTINGS_PROFILE ||
    pathname === ROUTES.PROVIDER_PROFILE_EDIT ||
    pathname.startsWith(`${ROUTES.PROVIDER_SETTINGS}/profile`)
  );
}

function isProviderServiceForm(pathname) {
  return (
    pathname === ROUTES.PROVIDER_SERVICES_NEW ||
    /^\/provider\/services\/[^/]+\/edit$/.test(pathname)
  );
}

function isProviderPackageForm(pathname) {
  return (
    pathname === ROUTES.PROVIDER_PACKAGES_NEW ||
    /^\/provider\/packages\/[^/]+\/edit$/.test(pathname)
  );
}

function isProviderSlotForm(pathname) {
  return (
    pathname === ROUTES.PROVIDER_SLOTS_NEW ||
    (/^\/provider\/slots\/[^/]+$/.test(pathname) && pathname !== ROUTES.PROVIDER_SLOTS)
  );
}

function isProviderMediaVideoForm(pathname) {
  return (
    pathname === ROUTES.PROVIDER_MEDIA_VIDEO_NEW ||
    /^\/provider\/media\/videos\/[^/]+\/edit$/.test(pathname)
  );
}

function isProviderRatingsReviews(pathname) {
  return pathname === ROUTES.PROVIDER_RATINGS_REVIEWS;
}

export default function ProviderLayout({ children }) {
  const pathname = usePathname();
  const hideBottomNav =
    isProviderChatThread(pathname) ||
    isProviderAppointmentDetail(pathname) ||
    isProviderEarningsSubpage(pathname) ||
    isProviderProfileEdit(pathname) ||
    isProviderServiceForm(pathname) ||
    isProviderPackageForm(pathname) ||
    isProviderSlotForm(pathname) ||
    isProviderMediaVideoForm(pathname) ||
    isProviderRatingsReviews(pathname);

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <ProviderSidebar />
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:ml-64 lg:pb-0",
          hideBottomNav ? "pb-0" : "pb-20",
        )}
      >
        {children}
        {!hideBottomNav ? <ProviderBottomNav /> : null}
      </div>
    </div>
  );
}
