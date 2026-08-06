"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";

import { ReferralsContent } from "./referrals-parts";

export function ReferralsTablet(props) {
  return (
    <UserPageShell
      title="Refer & Earn"
      containerVariant="narrow"
      mainClassName="mx-auto max-w-2xl space-y-6"
    >
      <ReferralsContent {...props} />
    </UserPageShell>
  );
}
