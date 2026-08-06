"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  CalendarDays,
  Home,
  LayoutGrid,
  MessageCircle,
  Search,
  UserRound,
  Wallet,
  Clapperboard,
} from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { layout } from "@/theme/layout";

const SIDEBAR_ITEMS = [
  { href: ROUTES.HOME, label: "Home", icon: Home },
  { href: ROUTES.SEARCH, label: "Search", icon: Search },
  { href: ROUTES.CATEGORIES, label: "Categories", icon: LayoutGrid },
  { href: ROUTES.REELS, label: "Shorts", icon: Clapperboard },
  { href: ROUTES.APPOINTMENTS, label: "Bookings", icon: CalendarDays },
  { href: ROUTES.CHATS, label: "Chats", icon: MessageCircle },
  { href: ROUTES.WALLET, label: "Wallet", icon: Wallet },
  { href: ROUTES.SAVED, label: "Saved", icon: Bookmark },
  { href: ROUTES.NOTIFICATIONS, label: "Notifications", icon: Bell },
  { href: ROUTES.PROFILE, label: "Profile", icon: UserRound },
];

function isActive(pathname, href) {
  if (href === ROUTES.HOME) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopSidebar({ className, collapsed = false }) {
  const pathname = usePathname();
  const width = collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth;

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-dvh shrink-0 flex-col border-r border-border bg-background",
        className
      )}
      style={{ width }}
      aria-label="Main navigation"
    >
      <div className="flex h-[68px] items-center gap-3 border-b border-border px-5">
        <div className="gradient-brand flex size-9 items-center justify-center rounded-xl text-sm font-bold text-white">
          B
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">Bookento</p>
            <p className="truncate text-xs text-muted-foreground">Book services nearby</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#EAF3FF] text-primary"
                  : "text-muted-foreground hover:bg-surface-page hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  active ? "text-primary" : "text-[#9CA3AF] group-hover:text-foreground"
                )}
                aria-hidden
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href={ROUTES.BOOKING}
          className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(24,101,234,0.35)] transition-opacity hover:opacity-95"
        >
          <CalendarDays className="size-4" aria-hidden />
          {!collapsed && "Book appointment"}
        </Link>
      </div>
    </aside>
  );
}
