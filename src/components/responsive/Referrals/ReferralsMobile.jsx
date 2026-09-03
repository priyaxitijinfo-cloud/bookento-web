"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ReferralsMobileContent } from "./referrals-parts";

export function ReferralsMobile({ referralCode, onCopy }) {
  return (
    <UserPageShell
      title="Credits & Referrals"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page max-md:!pb-6"
      mainClassName="max-md:!pt-4"
      showBottomNav={false}
    >
      <ReferralsMobileContent referralCode={referralCode} onCopy={onCopy} />
    </UserPageShell>
  );
}
