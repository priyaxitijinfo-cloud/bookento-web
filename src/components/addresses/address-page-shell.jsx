"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { PAGE_MAIN_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

export function AddressPageShell({
  title,
  onBack,
  backHref = ROUTES.PROFILE,
  backLabel = "Back to Profile",
  breadcrumbCurrentLabel,
  rightAction,
  children,
  footer,
  showBottomNav = true,
  titleCentered = false,
  hideMobileHeader = false,
  shellClassName,
  mainClassName = PAGE_MAIN_CLASS,
}) {
  return (
    <UserPageShell
      title={title}
      backHref={onBack ? undefined : backHref}
      backLabel={backLabel}
      onBack={onBack}
      breadcrumbCurrentLabel={breadcrumbCurrentLabel}
      rightAction={rightAction}
      footer={footer}
      showBottomNav={showBottomNav}
      titleCentered={titleCentered}
      hideMobileHeader={hideMobileHeader}
      containerVariant="browseWithBreadcrumb"
      mainClassName={cn(PAGE_MAIN_CLASS, "md:!pt-2", mainClassName)}
      className={cn(
        "address-page-shell-mobile bg-surface-page md:bg-surface-page",
        shellClassName,
      )}
    >
      {children}
    </UserPageShell>
  );
}

export { PAGE_MAIN_CLASS };
