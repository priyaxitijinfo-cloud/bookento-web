"use client";

import { toast } from "sonner";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ReferralsMobile } from "@/components/responsive/Referrals/ReferralsMobile";
import { ReferralsMobileContent } from "@/components/responsive/Referrals/referrals-parts";
import { ROUTES } from "@/constants/routes.constants";
import { currentUser } from "@/mock/users";

export default function ReferralsPage() {
  const copyCode = () => {
    navigator.clipboard?.writeText(currentUser.referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <>
      <div className="md:hidden">
        <ReferralsMobile referralCode={currentUser.referralCode} onCopy={copyCode} />
      </div>

      <div className="hidden md:block">
        <UserPageShell
          title="Credits & Referrals"
          backHref={ROUTES.PROFILE}
          backLabel="Back to Profile"
          showBottomNav={false}
          showDesktopHeader={true}
          showBreadcrumb={true}
          containerVariant="browseWithBreadcrumb"
          className="md:!bg-[#F7F8FC]"
          mainClassName="mx-auto w-full max-w-lg !pt-0 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem] md:!pt-0 md:pb-12"
        >
          <div className="w-full">
            <ReferralsMobileContent
              referralCode={currentUser.referralCode}
              onCopy={copyCode}
            />
          </div>
        </UserPageShell>
      </div>
    </>
  );
}
