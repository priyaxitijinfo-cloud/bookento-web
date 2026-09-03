"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";

import { SearchIcon } from "@/components/icons/search-icon";

import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { useNotificationStore, useProfileStore } from "@/store";
import { cn } from "@/lib/utils";

export function HomeHeader({ embedded = false }) {
  const { profile, addresses } = useProfileStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount("user"));
  const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
  const addressLabel = defaultAddress
    ? [defaultAddress.addressLine1, defaultAddress.city].filter(Boolean).join(", ")
    : "Add delivery address";
  return (
    <header
      className={cn(
        "safe-top bg-background/95 backdrop-blur-md",
        !embedded && "sticky top-0 z-30",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Mobile header */}
        <div className="pt-3 pb-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Link href={ROUTES.PROFILE} className="shrink-0">
                <Avatar
                  src={profile.avatar}
                  name={profile.name}
                  size="md"
                  className="ring-border ring-2"
                />
              </Link>
              <div className="min-w-0">
                <Link href={ROUTES.PROFILE} className="block">
                  <p className="text-foreground truncate text-base font-semibold">
                    {profile.name}
                  </p>
                </Link>
                <Link
                  href={ROUTES.ADDRESSES}
                  className="text-muted-foreground mt-0.5 inline-flex max-w-full min-w-0 items-center gap-0.5 text-xs"
                >
                  <span className="truncate">{addressLabel}</span>
                  <ChevronDown className="size-3.5 shrink-0" aria-hidden />
                </Link>
              </div>
            </div>
            <Link
              href={ROUTES.NOTIFICATIONS}
              className="text-foreground hover:bg-muted relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] transition-colors"
              aria-label="Notifications"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="size-5 shrink-0"
              >
                <path
                  d="M14.5769 18.5C14.8104 18.5001 14.9995 18.6893 14.9998 18.9229C14.9998 18.9735 14.9914 19.0244 14.9724 19.0713C14.515 20.199 13.3563 21 11.9998 21C10.6433 20.9999 9.48541 20.1989 9.02807 19.0713C9.00904 19.0243 8.99975 18.9735 8.99975 18.9229C8.99999 18.6893 9.18995 18.5 9.42358 18.5H14.5769ZM11.9998 3C15.2288 3 17.9458 5.49083 18.3201 8.79395L18.6648 11.8389C18.7505 12.5952 19.0578 13.3068 19.5447 13.8799C20.5781 15.0962 19.739 17 18.1697 17H5.82983C4.2607 16.9998 3.42247 15.0961 4.45581 13.8799C4.94257 13.3068 5.24897 12.5951 5.33471 11.8389L5.67944 8.79395C6.05364 5.49088 8.77083 3.00013 11.9998 3Z"
                  fill="currentColor"
                />
              </svg>
              {unreadCount > 0 ? (
                <span
                  className="bg-destructive absolute top-2 right-2 size-2 rounded-full ring-2 ring-[#FFFFFF]"
                  aria-hidden
                />
              ) : null}
            </Link>
          </div>

          <Link
            href={ROUTES.SEARCH}
            aria-label="Search providers"
            className="relative mt-4 block w-full"
          >
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2" />
            <div
              className={cn(
                "bg-background text-muted-foreground border-[#F0F0F0]",
                "flex h-11 w-full items-center rounded-full border pl-10 text-sm",
              )}
            >
              Search...
            </div>
          </Link>
        </div>

        {/* Desktop header */}
        <div className="hidden h-[4.25rem] items-center gap-4 md:flex md:gap-6">
          <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/app-icon.jpg"
              alt="Bookento"
              width={36}
              height={36}
              className="size-9 rounded-xl shadow-sm"
              priority
            />
            <span className="text-foreground text-lg font-bold tracking-tight">
              Bookento
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href={ROUTES.SAVED}
              aria-label="Saved providers"
              className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-10 items-center justify-center rounded-full transition-colors"
            >
              <HeroHeartIcon tone="dark" className="size-5" />
            </Link>
            <Link
              href={ROUTES.APPOINTMENTS}
              aria-label="My bookings"
              className="hover:bg-muted relative flex size-10 items-center justify-center rounded-full text-[#4D5972] transition-colors hover:text-[#000000]"
            >
              <svg
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="size-6 shrink-0"
              >
                <path
                  d="M17.75 3.28571H16.4C16.4 2.57686 15.7943 2 15.05 2C14.3057 2 13.7 2.57686 13.7 3.28571H8.3C8.3 2.57686 7.6943 2 6.95 2C6.2057 2 5.6 2.57686 5.6 3.28571H4.25C3.00935 3.28571 2 4.247 2 5.42857V17.8571C2 19.0387 3.00935 20 4.25 20H17.75C18.9906 20 20 19.0387 20 17.8571V5.42857C20 4.247 18.9906 3.28571 17.75 3.28571ZM14.6 3.28571C14.6052 3.17537 14.6549 3.07117 14.7387 2.99483C14.8225 2.91849 14.934 2.87589 15.05 2.87589C15.166 2.87589 15.2775 2.91849 15.3613 2.99483C15.4451 3.07117 15.4948 3.17537 15.5 3.28571V4.14286C15.4948 4.25321 15.4451 4.3574 15.3613 4.43374C15.2775 4.51008 15.166 4.55269 15.05 4.55269C14.934 4.55269 14.8225 4.51008 14.7387 4.43374C14.6549 4.3574 14.6052 4.25321 14.6 4.14286V3.28571ZM6.5 3.28571C6.50518 3.17537 6.55486 3.07117 6.63868 2.99483C6.72251 2.91849 6.83402 2.87589 6.95 2.87589C7.06598 2.87589 7.17749 2.91849 7.26132 2.99483C7.34514 3.07117 7.39482 3.17537 7.4 3.28571V4.14286C7.39482 4.25321 7.34514 4.3574 7.26132 4.43374C7.17749 4.51008 7.06598 4.55269 6.95 4.55269C6.83402 4.55269 6.72251 4.51008 6.63868 4.43374C6.55486 4.3574 6.50518 4.25321 6.5 4.14286V3.28571ZM2.9 5.42857C2.9 4.71971 3.5057 4.14286 4.25 4.14286H5.6C5.6 4.85171 6.2057 5.42857 6.95 5.42857C7.6943 5.42857 8.3 4.85171 8.3 4.14286H13.7C13.7 4.85171 14.3057 5.42857 15.05 5.42857C15.7943 5.42857 16.4 4.85171 16.4 4.14286H17.75C18.4943 4.14286 19.1 4.71971 19.1 5.42857V7.14286H2.9V5.42857ZM19.1 17.8571C19.1 18.566 18.4943 19.1429 17.75 19.1429H4.25C3.5057 19.1429 2.9 18.566 2.9 17.8571V8H19.1V17.8571Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.2"
                />
                <path
                  d="M5.59922 12.7148H6.94922C7.44557 12.7148 7.84922 12.3304 7.84922 11.8577V10.572C7.84922 10.0993 7.44557 9.71484 6.94922 9.71484H5.59922C5.10287 9.71484 4.69922 10.0993 4.69922 10.572V11.8577C4.69922 12.3304 5.10287 12.7148 5.59922 12.7148ZM5.59922 10.572H6.94922L6.95012 11.8577H5.59922V10.572ZM10.3242 12.7148H11.6742C12.1706 12.7148 12.5742 12.3304 12.5742 11.8577V10.572C12.5742 10.0993 12.1706 9.71484 11.6742 9.71484H10.3242C9.82787 9.71484 9.42422 10.0993 9.42422 10.572V11.8577C9.42422 12.3304 9.82787 12.7148 10.3242 12.7148ZM10.3242 10.572H11.6742L11.6751 11.8577H10.3242V10.572ZM15.0492 12.7148H16.3992C16.8956 12.7148 17.2992 12.3304 17.2992 11.8577V10.572C17.2992 10.0993 16.8956 9.71484 16.3992 9.71484H15.0492C14.5529 9.71484 14.1492 10.0993 14.1492 10.572V11.8577C14.1492 12.3304 14.5529 12.7148 15.0492 12.7148ZM15.0492 10.572H16.3992L16.4001 11.8577H15.0492V10.572ZM5.59922 17.4291H6.94922C7.44557 17.4291 7.84922 17.0447 7.84922 16.572V15.2863C7.84922 14.8136 7.44557 14.4291 6.94922 14.4291H5.59922C5.10287 14.4291 4.69922 14.8136 4.69922 15.2863V16.572C4.69922 17.0447 5.10287 17.4291 5.59922 17.4291ZM5.59922 15.2863H6.94922L6.95012 16.572H5.59922V15.2863ZM10.3242 17.4291H11.6742C12.1706 17.4291 12.5742 17.0447 12.5742 16.572V15.2863C12.5742 14.8136 12.1706 14.4291 11.6742 14.4291H10.3242C9.82787 14.4291 9.42422 14.8136 9.42422 15.2863V16.572C9.42422 17.0447 9.82787 17.4291 10.3242 17.4291ZM10.3242 15.2863H11.6742L11.6751 16.572H10.3242V15.2863ZM15.0492 17.4291H16.3992C16.8956 17.4291 17.2992 17.0447 17.2992 16.572V15.2863C17.2992 14.8136 16.8956 14.4291 16.3992 14.4291H15.0492C14.5529 14.4291 14.1492 14.8136 14.1492 15.2863V16.572C14.1492 17.0447 14.5529 17.4291 15.0492 17.4291ZM15.0492 15.2863H16.3992L16.4001 16.572H15.0492V15.2863Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.2"
                />
              </svg>
              <span className="bg-primary absolute top-1 right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
                2
              </span>
            </Link>
            <Link
              href={ROUTES.PROFILE}
              aria-label="Profile"
              className="hover:ring-primary/30 flex shrink-0 rounded-full transition-shadow hover:ring-2"
            >
              <Avatar
                src={profile.avatar}
                name={profile.name}
                size="sm"
                className="ring-border ring-2"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
