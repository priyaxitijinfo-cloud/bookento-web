"use client";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { UserBottomNav, UserHeader } from "@/components/layout/user-nav";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
  DESKTOP_STICKY_HEADER_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

export function UserPageShell({
  title,
  backHref,
  backLabel = "Back",
  onBack,
  breadcrumbTrail,
  breadcrumbCurrentLabel,
  rightAction,
  children,
  footer,
  showBottomNav = true,
  showDesktopHeader = true,
  showBreadcrumb = true,
  containerVariant = "browse",
  mainClassName,
  className,
  headerClassName,
}) {
  const hasBreadcrumb = showBreadcrumb && Boolean(title && (backHref || onBack));
  const resolvedVariant = hasBreadcrumb && containerVariant === "browse"
    ? "browseWithBreadcrumb"
    : containerVariant;
  const containerClass = PAGE_CONTAINER_VARIANTS[resolvedVariant] ?? PAGE_CONTAINER_VARIANTS.browse;

  return (
    <div className={cn(PAGE_SHELL_CLASS, className)}>
      <div className="md:hidden">
        <UserHeader
          title={title}
          backHref={onBack ? undefined : backHref}
          onBack={onBack}
          hideActions={!rightAction}
          rightAction={rightAction}
          className={headerClassName}
        />
      </div>

      {showDesktopHeader ? (
        <div className={DESKTOP_STICKY_HEADER_CLASS}>
          <HomeHeader embedded />
          {hasBreadcrumb ? (
            <DesktopBreadcrumbBar
              backHref={backHref}
              backLabel={backLabel}
              onBack={onBack}
              currentLabel={breadcrumbCurrentLabel ?? title}
              trail={breadcrumbTrail}
              rightAction={rightAction}
            />
          ) : null}
        </div>
      ) : null}

      <main className={cn(containerClass, mainClassName)}>{children}</main>

      {footer}

      {showBottomNav ? <UserBottomNav /> : null}
    </div>
  );
}
