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
      mainClassName="mx-auto w-full max-w-[calc(96rem-60px)] px-[4.875rem] xl:px-[5.875rem] !pt-0 pb-12"
    >
      <div className="w-full">
        <ReferralsMobileContent referralCode={referralCode} onCopy={onCopy} />
      </div>
    </UserPageShell>
  );
}
