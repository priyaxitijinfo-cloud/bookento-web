"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

import { ReferralsContent } from "./referrals-parts";

export function ReferralsDesktop(props) {
  return (
    <DesktopLayout
      maxWidth="narrow"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.PROFILE}
          backLabel="Back to Profile"
          currentLabel="Refer & Earn"
        />
      )}
    >
      <ResponsiveCard>
        <ReferralsContent {...props} />
      </ResponsiveCard>
    </DesktopLayout>
  );
}
