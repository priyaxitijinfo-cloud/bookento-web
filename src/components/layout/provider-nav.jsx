"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LogoutConfirmResponsive } from "@/components/responsive/Dialogs";
import {
  PROVIDER_BOTTOM_NAV_ICONS,
  PROVIDER_ICONS,
} from "@/features/provider/provider-icons";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { useProviderAuthStore, useUIStore } from "@/store";

const sidebarItems = [
  { href: ROUTES.PROVIDER_HOME, label: "Dashboard", icon: PROVIDER_ICONS.home },
  {
    href: ROUTES.PROVIDER_APPOINTMENTS,
    label: "Appointments",
    icon: PROVIDER_ICONS.schedule,
  },
  {
    href: ROUTES.PROVIDER_EARNINGS,
    label: "Earnings",
    icon: PROVIDER_ICONS.earnings,
  },
  {
    href: ROUTES.PROVIDER_SERVICES,
    label: "My Services",
    icon: PROVIDER_ICONS.serviceDetails,
  },
  {
    href: ROUTES.PROVIDER_PACKAGES,
    label: "Packages",
    icon: PROVIDER_ICONS.packages,
  },
  {
    href: ROUTES.PROVIDER_BRANCHES,
    label: "Branches",
    icon: PROVIDER_ICONS.building,
  },
  {
    href: ROUTES.PROVIDER_CATEGORIES,
    label: "Categories",
    icon: PROVIDER_ICONS.category,
  },
  {
    href: ROUTES.PROVIDER_POSTS,
    label: "Posts",
    icon: PROVIDER_ICONS.gallery,
  },
  {
    href: ROUTES.PROVIDER_REELS,
    label: "Reels",
    icon: PROVIDER_ICONS.video,
  },
  {
    href: ROUTES.PROVIDER_RATINGS,
    label: "Ratings",
    icon: PROVIDER_ICONS.ratings,
  },
  { href: ROUTES.PROVIDER_CHATS, label: "Chats", icon: PROVIDER_ICONS.chats },
  {
    href: ROUTES.PROVIDER_ANALYTICS,
    label: "Analytics",
    icon: PROVIDER_ICONS.analytics,
  },
  {
    href: ROUTES.PROVIDER_SETTINGS,
    label: "Settings",
    icon: PROVIDER_ICONS.settings,
  },
];

const bottomNavItems = [
  {
    href: ROUTES.PROVIDER_HOME,
    label: "Home",
    icon: PROVIDER_BOTTOM_NAV_ICONS.home,
  },
  {
    href: ROUTES.PROVIDER_CHATS,
    label: "Chats",
    icon: PROVIDER_BOTTOM_NAV_ICONS.chats,
  },
  {
    href: ROUTES.PROVIDER_APPOINTMENTS,
    label: "Schedule",
    icon: PROVIDER_BOTTOM_NAV_ICONS.schedule,
    isFab: true,
  },
  {
    href: ROUTES.PROVIDER_EARNINGS,
    label: "Earnings",
    icon: PROVIDER_BOTTOM_NAV_ICONS.earnings,
  },
  {
    href: ROUTES.PROVIDER_SETTINGS,
    label: "Setting",
    icon: PROVIDER_BOTTOM_NAV_ICONS.settings,
  },
];

function ProviderNavIcon({ src, active, className }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block",
        active ? "gradient-brand" : "bg-current text-[var(--nav-inactive)]",
        className,
      )}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function isBottomNavActive(pathname, href) {
  if (href === ROUTES.PROVIDER_HOME) return pathname === href;
  if (href === ROUTES.PROVIDER_CHATS) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href === ROUTES.PROVIDER_SETTINGS) {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      pathname === ROUTES.PROVIDER_PROFILE ||
      pathname.startsWith(`${ROUTES.PROVIDER_PROFILE}/`)
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProviderSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const logout = useProviderAuthStore((s) => s.logout);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out");
      setLogoutOpen(false);
      router.push(ROUTES.PROVIDER_LOGIN);
    } catch {
      toast.error("Could not sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "border-border bg-card fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="border-border border-b p-6">
          <Link
            href={ROUTES.PROVIDER_HOME}
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <NextImage
              src="/icons/bookento-expert-appicon.png"
              alt="Bookento"
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-[0.65rem] object-cover"
              unoptimized
              priority
            />
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">
              Bookento
            </span>
          </Link>
        </div>
        <nav className="scrollbar-hover flex-1 space-y-1 overflow-y-auto p-4">
          {sidebarItems.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <ProviderNavIcon
                  src={icon}
                  active={active}
                  className="size-5 shrink-0"
                />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-border border-t p-4">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="text-muted-foreground hover:bg-muted hover:text-destructive flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          >
            <ProviderNavIcon
              src={PROVIDER_ICONS.logout}
              active={false}
              className="size-5 shrink-0"
            />
            Logout
          </button>
        </div>
      </aside>

      <LogoutConfirmResponsive
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
        loading={loggingOut}
        description="You will need to sign in again to access your provider dashboard."
      />
    </>
  );
}

export function ProviderBottomNav() {
  const pathname = usePathname();

  // Full-screen thread / booking detail / earnings / profile edit / forms: hide bottom nav so it doesn't overlap actions
  if (
    /^\/provider\/chats\/[^/]+/.test(pathname) ||
    /^\/provider\/appointments\/[^/]+/.test(pathname) ||
    pathname === ROUTES.PROVIDER_EARNINGS_TRANSACTIONS ||
    pathname === ROUTES.PROVIDER_EARNINGS_WALLET ||
    pathname.startsWith(`${ROUTES.PROVIDER_EARNINGS}/`) ||
    pathname === ROUTES.PROVIDER_SETTINGS_PROFILE ||
    pathname === ROUTES.PROVIDER_PROFILE_EDIT ||
    pathname.startsWith(`${ROUTES.PROVIDER_SETTINGS}/profile`) ||
    pathname === ROUTES.PROVIDER_SERVICES_NEW ||
    /^\/provider\/services\/[^/]+\/edit$/.test(pathname) ||
    pathname === ROUTES.PROVIDER_PACKAGES_NEW ||
    /^\/provider\/packages\/[^/]+\/edit$/.test(pathname) ||
    pathname === ROUTES.PROVIDER_SLOTS_NEW ||
    (/^\/provider\/slots\/[^/]+$/.test(pathname) && pathname !== ROUTES.PROVIDER_SLOTS)
  ) {
    return null;
  }

  const sideItems = bottomNavItems.filter((item) => !item.isFab);
  const fabItem = bottomNavItems.find((item) => item.isFab);

  return (
    <nav className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="pointer-events-auto relative mx-auto w-full max-w-lg">
        <div className="bg-background relative rounded-t-[1.75rem] px-1 pt-2.5 pb-1.5 shadow-[0_-4px_24px_rgba(15,23,42,0.07)]">
          <div className="grid grid-cols-5 items-end">
            {sideItems.slice(0, 2).map(({ href, label, icon }) => {
              const active = isBottomNavActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex min-h-[3.25rem] -translate-y-2.5 flex-col items-center justify-end gap-1 px-1 pb-0.5 text-xs font-normal transition-colors",
                    active ? "text-primary" : "text-[var(--nav-inactive)]",
                  )}
                >
                  <ProviderNavIcon
                    src={icon}
                    active={active}
                    className="size-6 shrink-0"
                  />
                  <span className="leading-none">{label}</span>
                </Link>
              );
            })}

            <div className="flex justify-center pb-0.5">
              <Link
                href={fabItem.href}
                aria-label={fabItem.label}
                className="relative -top-[calc(1rem+2.5px)] flex flex-col items-center"
              >
                <span className="gradient-brand flex size-[3.75rem] items-center justify-center rounded-full text-white ring-4 ring-white">
                  <img
                    src={fabItem.icon}
                    alt=""
                    className="size-7 brightness-0 invert"
                    draggable={false}
                  />
                </span>
              </Link>
            </div>

            {sideItems.slice(2).map(({ href, label, icon }) => {
              const active = isBottomNavActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex min-h-[3.25rem] -translate-y-2.5 flex-col items-center justify-end gap-1 px-1 pb-0.5 text-xs font-normal transition-colors",
                    active ? "text-primary" : "text-[var(--nav-inactive)]",
                  )}
                >
                  <ProviderNavIcon
                    src={icon}
                    active={active}
                    className="size-6 shrink-0"
                  />
                  <span className="leading-none">{label}</span>
                </Link>
              );
            })}
          </div>

          <div
            aria-hidden
            className="mx-auto mt-1.5 h-1 w-[8.5rem] rounded-full bg-black/85"
          />
        </div>
      </div>
    </nav>
  );
}

export function ProviderHeader({ title }) {
  const { setSidebarOpen } = useUIStore();
  return (
    <header className="border-border bg-card sticky top-0 z-30 border-b">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="hover:bg-muted rounded-lg p-2 lg:hidden"
          aria-label="Open menu"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-foreground truncate text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}
