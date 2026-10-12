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

/** Sidebar icons — same box size; maskScale tweaks optical weight only */
const SIDEBAR_ICON_SIZE = "size-[1.125rem]";

/** Grouped like reference admin sidebar (MAIN MENU / BUSINESS / …) */
const sidebarSections = [
  {
    title: "Main Menu",
    items: [
      { href: ROUTES.PROVIDER_HOME, label: "Dashboard", icon: PROVIDER_ICONS.home },
      {
        href: ROUTES.PROVIDER_APPOINTMENTS,
        label: "Appointments",
        icon: PROVIDER_ICONS.calendarBlue,
      },
      {
        href: ROUTES.PROVIDER_EARNINGS,
        label: "Earnings",
        icon: PROVIDER_ICONS.earnings,
      },
      { href: ROUTES.PROVIDER_CHATS, label: "Chats", icon: PROVIDER_ICONS.chats },
    ],
  },
  {
    title: "Business",
    items: [
      {
        href: ROUTES.PROVIDER_SERVICES,
        label: "My Services",
        icon: PROVIDER_ICONS.serviceDetails,
      },
      {
        href: ROUTES.PROVIDER_PACKAGES,
        label: "Packages",
        icon: PROVIDER_ICONS.packages,
        maskScale: "80%",
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
    ],
  },
  {
    title: "Content",
    items: [
      {
        href: ROUTES.PROVIDER_POSTS,
        label: "Posts",
        icon: PROVIDER_ICONS.gallery,
        maskScale: "82%",
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
        maskScale: "82%",
      },
      {
        href: ROUTES.PROVIDER_ANALYTICS,
        label: "Analytics",
        icon: PROVIDER_ICONS.analytics,
        maskScale: "92%",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        href: ROUTES.PROVIDER_SETTINGS,
        label: "Settings",
        icon: PROVIDER_ICONS.settings,
      },
    ],
  },
];

function isSidebarItemActive(pathname, href) {
  if (href === ROUTES.PROVIDER_HOME) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

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

/** Fixed square box so every nav SVG renders at the same optical size. */
function ProviderNavIcon({
  src,
  active,
  className,
  maskScale = "88%",
  activeClassName = "gradient-brand",
  inactiveClassName = "bg-current text-[var(--nav-inactive)]",
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        className,
      )}
    >
      <span
        className={cn("block size-full", active ? activeClassName : inactiveClassName)}
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: maskScale,
          maskSize: maskScale,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </span>
  );
}

function SidebarChevron({ active }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-auto inline-flex size-4 shrink-0 items-center justify-center",
        active ? "text-[#1865EA]" : "text-[#CBD5E1]",
      )}
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
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
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-[17rem] flex-col border-r border-[#EEF2F7] bg-white transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand — Rizz-style header */}
        <div className="px-5 pt-7 pb-5">
          <Link
            href={ROUTES.PROVIDER_HOME}
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <NextImage
              src="/icons/bookento-expert-appicon.png"
              alt="Bookento"
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-full object-cover"
              unoptimized
              priority
            />
            <span className="text-[1.6rem] font-bold tracking-tight text-[#0F172A]">
              Bookento
            </span>
          </Link>
        </div>

        {/* Grouped nav */}
        <nav className="scrollbar-hover flex-1 space-y-6 overflow-y-auto px-3.5 pb-3">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <p className="mb-2.5 px-3 text-[11px] font-semibold tracking-[0.1em] text-[#94A3B8] uppercase">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map(({ href, label, icon, maskScale }) => {
                  const active = isSidebarItemActive(pathname, href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg py-2.5 pr-3 pl-3.5 text-[14px] font-medium transition-colors",
                          active
                            ? "bg-[#E8F1FF] text-[#1865EA]"
                            : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                        )}
                      >
                        {active ? (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 -left-3.5 w-1 rounded-r-full bg-[#1865EA]"
                          />
                        ) : null}
                        <ProviderNavIcon
                          src={icon}
                          active={active}
                          maskScale={maskScale}
                          className={SIDEBAR_ICON_SIZE}
                          activeClassName="bg-[#1865EA]"
                          inactiveClassName="bg-[#64748B]"
                        />
                        <span className="min-w-0 flex-1 truncate">{label}</span>
                        <SidebarChevron active={active} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer strip — reference style */}
        <div className="px-3.5 pb-5">
          <div className="flex items-center gap-1 rounded-xl bg-[#E8F1FF] p-1.5">
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[#475569] transition-colors hover:bg-white hover:text-[#EF4444]"
            >
              <ProviderNavIcon
                src={PROVIDER_ICONS.logout}
                active={false}
                className={SIDEBAR_ICON_SIZE}
                inactiveClassName="bg-[#64748B]"
              />
              Logout
            </button>
          </div>
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
