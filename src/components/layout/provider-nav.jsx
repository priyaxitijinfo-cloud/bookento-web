"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  Film,
  Home,
  Image,
  Layers,
  LogOut,
  MessageCircle,
  Package,
  Settings,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { LogoutConfirmResponsive } from "@/components/responsive/Dialogs";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { useProviderAuthStore, useUIStore } from "@/store";

const sidebarItems = [
  { href: ROUTES.PROVIDER_HOME, label: "Dashboard", icon: Home },
  { href: ROUTES.PROVIDER_APPOINTMENTS, label: "Appointments", icon: Calendar },
  { href: ROUTES.PROVIDER_EARNINGS, label: "Earnings", icon: Wallet },
  { href: ROUTES.PROVIDER_SERVICES, label: "My Services", icon: Wrench },
  { href: ROUTES.PROVIDER_PACKAGES, label: "Packages", icon: Package },
  { href: ROUTES.PROVIDER_BRANCHES, label: "Branches", icon: Building2 },
  { href: ROUTES.PROVIDER_CATEGORIES, label: "Categories", icon: Layers },
  { href: ROUTES.PROVIDER_POSTS, label: "Posts", icon: Image },
  { href: ROUTES.PROVIDER_REELS, label: "Reels", icon: Film },
  { href: ROUTES.PROVIDER_RATINGS, label: "Ratings", icon: Star },
  { href: ROUTES.PROVIDER_CHATS, label: "Chats", icon: MessageCircle },
  { href: ROUTES.PROVIDER_ANALYTICS, label: "Analytics", icon: BarChart3 },
  { href: ROUTES.PROVIDER_SETTINGS, label: "Settings", icon: Settings },
];

const bottomNavItems = [
  { href: ROUTES.PROVIDER_HOME, label: "Home", icon: Home },
  { href: ROUTES.PROVIDER_CHATS, label: "Chats", icon: MessageCircle },
  {
    href: ROUTES.PROVIDER_APPOINTMENTS,
    label: "Schedule",
    icon: Calendar,
    isFab: true,
  },
  { href: ROUTES.PROVIDER_EARNINGS, label: "Earnings", icon: Wallet },
  { href: ROUTES.PROVIDER_SETTINGS, label: "Setting", icon: Settings },
];

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
          <Link href={ROUTES.PROVIDER_HOME} className="text-primary text-xl font-bold">
            Bookento Pro
          </Link>
          <p className="text-muted-foreground mt-1 text-xs">Provider Dashboard</p>
        </div>
        <nav className="scrollbar-hover flex-1 space-y-1 overflow-y-auto p-4">
          {sidebarItems.map(({ href, label, icon: Icon }) => {
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
                <Icon className="size-4" />
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
            <LogOut className="size-4" />
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

  return (
    <nav className="border-border bg-card safe-bottom shadow-card fixed inset-x-0 bottom-0 z-40 border-t lg:hidden">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pt-1 pb-2">
        {bottomNavItems.map(({ href, label, icon: Icon, isFab }) => {
          if (isFab) {
            return (
              <Link
                key={href}
                href={href}
                className="relative -top-4 flex flex-col items-center"
              >
                <span className="gradient-brand shadow-elevated flex size-14 items-center justify-center rounded-full text-white">
                  <Calendar className="size-6" />
                </span>
              </Link>
            );
          }

          const active =
            href === ROUTES.PROVIDER_CHATS
              ? pathname === href || pathname.startsWith(`${href}/`)
              : pathname === href ||
                (href !== ROUTES.PROVIDER_HOME && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors",
                active ? "text-primary font-medium" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("size-5", active && "text-primary")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function ProviderHeader({ title }) {
  const { toggleSidebar, setSidebarOpen } = useUIStore();
  return (
    <header className="border-border bg-card sticky top-0 z-30 border-b">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="hover:bg-muted rounded-lg p-2 lg:hidden"
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
