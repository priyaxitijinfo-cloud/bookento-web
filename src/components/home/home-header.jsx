"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";
import { SearchIcon } from "@/components/icons/search-icon";
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { useNotificationStore, useProfileStore } from "@/store";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

const DESKTOP_NAV = [
  { href: "/#categories", label: "Categories" },
  { href: "/#professionals", label: "Professionals" },
  { href: "/#packages", label: "Packages" },
  { href: "/#popular", label: "Popular" },
];

export function HomeHeader({ embedded = false }) {
  const { profile, addresses } = useProfileStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount("user"));
  const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
  const addressLabel = defaultAddress
    ? [defaultAddress.addressLine1, defaultAddress.city].filter(Boolean).join(", ")
    : "Add delivery address";
  const cityLabel = defaultAddress?.city || "Ahmedabad";
  const firstName = profile?.name?.split(" ")[0] || "User";

  return (
    <header
      className={cn(
        "safe-top bg-background/95 backdrop-blur-md",
        !embedded && "sticky top-0 z-40",
        "md:border-b md:border-[#EEF0F4] md:bg-white/95 md:shadow-[0_1px_0_rgba(15,23,42,0.04)] md:backdrop-blur-xl",
      )}
    >
      <div className={cn(HOME_PAGE_CONTAINER)}>
        {/* Mobile header — unchanged */}
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

        {/* Desktop header — marketplace nav */}
        <div className="hidden h-[4.5rem] items-center gap-5 md:flex lg:gap-8">
          <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/app-icon.jpg"
              alt="Bookento"
              width={42}
              height={42}
              className="size-[42px] rounded-lg shadow-sm"
              priority
            />
            <span className="text-foreground text-[1.15rem] font-bold tracking-tight">
              Bookento
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:bg-accent hover:text-primary rounded-full px-3.5 py-2 text-sm font-medium text-[#667085] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-2.5">
            <Link
              href={ROUTES.ADDRESSES}
              className="hover:border-primary/30 hover:text-primary hidden items-center gap-1.5 rounded-full border border-[#E8ECF2] bg-[#FAFBFC] px-3 py-1.5 text-sm font-medium text-[#475467] transition-colors xl:inline-flex"
            >
              <MapPin className="text-primary size-3.5" aria-hidden />
              {cityLabel}
              <ChevronDown className="size-3.5 opacity-50" aria-hidden />
            </Link>

            <Link
              href={ROUTES.SAVED}
              aria-label="Saved providers"
              className="hover:bg-accent hover:text-primary flex size-10 items-center justify-center rounded-full text-[#667085] transition-colors"
            >
              <HeroHeartIcon tone="dark" className="size-5" />
            </Link>

            <Link
              href={ROUTES.PROFILE}
              className="ml-1 flex items-center gap-2 rounded-full py-1 pr-1 pl-1 transition-colors hover:bg-[#F5F7FA]"
            >
              <Avatar
                src={profile.avatar}
                name={profile.name}
                size="sm"
                className="ring-1 ring-[#E8ECF2]"
              />
              <span className="hidden text-sm font-medium text-[#0F1B2D] xl:inline">
                Hi, {firstName}
              </span>
              <ChevronDown
                className="hidden size-3.5 text-[#98A2B3] xl:inline"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
