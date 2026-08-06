"use client";

import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { currentUser, referrals } from "@/mock/users";

import { ReferralsDesktop } from "./ReferralsDesktop";
import { ReferralsMobile } from "./ReferralsMobile";
import { ReferralsTablet } from "./ReferralsTablet";

export function ReferralsResponsive() {
  const completedReferrals = referrals.filter((item) => item.status === "completed");
  const totalEarned = completedReferrals.reduce((sum, item) => sum + item.reward, 0);
  const pendingCount = referrals.filter((item) => item.status === "pending").length;

  const copyCode = () => {
    navigator.clipboard?.writeText(currentUser.referralCode);
    toast.success("Referral code copied!");
  };

  const shareLink = () => {
    const link = `https://bookento.app/join?ref=${currentUser.referralCode}`;
    navigator.clipboard?.writeText(link);
    toast.success("Referral link copied!");
  };

  const sharedProps = {
    referralCode: currentUser.referralCode,
    referrals,
    totalInvited: referrals.length,
    joinedCount: completedReferrals.length,
    totalEarned,
    pendingCount,
    onCopy: copyCode,
    onShare: shareLink,
  };

  return (
    <ResponsiveView
      mobile={<ReferralsMobile {...sharedProps} />}
      tablet={<ReferralsTablet {...sharedProps} />}
      desktop={<ReferralsDesktop {...sharedProps} />}
    />
  );
}

export default ReferralsResponsive;
