"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { PAGE_MAIN_CLASS } from "@/lib/layout/page-layout.constants";

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
      containerVariant="browseWithBreadcrumb"
      mainClassName={mainClassName}
      className="bg-surface-page"
    >
      {children}
    </UserPageShell>
  );
}

export { PAGE_MAIN_CLASS };
