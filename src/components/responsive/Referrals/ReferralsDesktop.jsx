"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { ReferralsMobileContent } from "./referrals-parts";

export function ReferralsDesktop({ referralCode, onCopy }) {
  return (
    <UserPageShell
      title="Credits & Referrals"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      showBottomNav={false}
      showDesktopHeader={true}
      showBreadcrumb={true}
      containerVariant="browseWithBreadcrumb"
      className="md:!bg-[#F7F8FC]"
      mainClassName="mx-auto w-full max-w-7xl !pt-0 px-6 pb-12"
    >
      <div className="w-full">
        <ReferralsMobileContent referralCode={referralCode} onCopy={onCopy} />
      </div>
    </UserPageShell>
  );
}
