"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";

import { ReferralsContent } from "./referrals-parts";

export function ReferralsMobile(props) {
  return (
    <UserPageShell title="Refer & Earn" containerVariant="narrow" mainClassName="space-y-6">
      <ReferralsContent {...props} />
    </UserPageShell>
  );
}
