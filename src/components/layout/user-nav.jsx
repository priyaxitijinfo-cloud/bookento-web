"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";

import { MobileHeaderBar } from "@/components/layout/mobile-header";
import {
  MOBILE_HEADER_CLASS,
  MOBILE_HEADER_DESKTOP_CLASS,
} from "@/lib/layout/mobile-header.constants";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: ROUTES.HOME, label: "Home", icon: "/icons/nav/12.svg" },
  { href: ROUTES.REELS, label: "Shorts", icon: "/icons/nav/13.svg" },
  { href: ROUTES.CHATS, label: "Chats", icon: "/icons/nav/15.svg" },
  { href: ROUTES.PROFILE, label: "Profile", icon: "/icons/nav/16.svg" },
];

function NavIcon({ src, active, className }) {
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

function isActive(pathname, href) {
  if (href === ROUTES.HOME) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function UserBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="pointer-events-auto relative mx-auto w-full max-w-lg">
        <div className="bg-background relative rounded-t-[1.75rem] px-1 pt-2.5 pb-1.5 shadow-[0_-4px_24px_rgba(15,23,42,0.07)]">
          <div className="grid grid-cols-5 items-end">
            {NAV_ITEMS.slice(0, 2).map(({ href, label, icon }) => {
              const active = isActive(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex min-h-[3.25rem] -translate-y-2.5 flex-col items-center justify-end gap-1 px-1 pb-0.5 text-xs font-normal transition-colors",
                    active ? "text-primary" : "text-[var(--nav-inactive)]",
                  )}
                >
                  <NavIcon src={icon} active={active} className="size-6 shrink-0" />
                  <span className="leading-none">{label}</span>
                </Link>
              );
            })}

            <div className="flex justify-center pb-0.5">
              <Link
                href={ROUTES.APPOINTMENTS}
                aria-label="Bookings"
                className="relative -top-[calc(1rem+2.5px)] flex flex-col items-center"
              >
                <span className="gradient-brand flex size-[3.75rem] items-center justify-center rounded-full text-white ring-4 ring-white">
                  <img
                    src="/icons/nav/14.svg"
                    alt=""
                    className="size-7"
                    draggable={false}
                  />
                </span>
              </Link>
            </div>

            {NAV_ITEMS.slice(2).map(({ href, label, icon }) => {
              const active = isActive(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex min-h-[3.25rem] -translate-y-2.5 flex-col items-center justify-end gap-1 px-1 pb-0.5 text-xs font-normal transition-colors",
                    active ? "text-primary" : "text-[var(--nav-inactive)]",
                  )}
                >
                  <NavIcon src={icon} active={active} className="size-6 shrink-0" />
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

export function UserHeader({
  title,
  backHref,
  showBack = false,
  hideActions = false,
  onBack,
  rightAction,
  className,
  titleCentered = false,
  backLabel,
}) {
  const defaultRightAction =
    !hideActions && !rightAction ? (
      <div className="flex items-center gap-1">
        <Link
          href={ROUTES.SAVED}
          className="text-muted-foreground hover:text-foreground rounded-xl p-2 transition-colors"
        >
          <HeroHeartIcon tone="dark" className="size-5" />
        </Link>
        <Link
          href={ROUTES.NOTIFICATIONS}
          className="text-muted-foreground hover:text-foreground relative rounded-xl p-2 transition-colors"
        >
          <Calendar className="size-5" />
          <span className="bg-destructive absolute top-1.5 right-1.5 size-2 rounded-full" />
        </Link>
      </div>
    ) : null;

  return (
    <header className={cn(MOBILE_HEADER_CLASS, MOBILE_HEADER_DESKTOP_CLASS, className)}>
      <MobileHeaderBar
        title={title}
        backHref={backHref}
        showBack={showBack}
        onBack={onBack}
        backLabel={backLabel}
        titleCentered={titleCentered}
        rightAction={rightAction ?? defaultRightAction}
      />
    </header>
  );
}
