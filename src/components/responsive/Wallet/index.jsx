"use client";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { walletTransactions } from "@/mock/users";
import { useProfileStore } from "@/store";

import { WalletDesktop } from "./WalletDesktop";
import { WalletMobile } from "./WalletMobile";
import { WalletTablet } from "./WalletTablet";

const RECENT_LIMIT = 8;

export function WalletResponsive() {
  const { profile } = useProfileStore();
  const visibleTransactions = walletTransactions.slice(0, RECENT_LIMIT);

  const sharedProps = {
    balance: profile.walletBalance,
    transactions: visibleTransactions,
  };

  return (
    <ResponsiveView
      mobile={<WalletMobile {...sharedProps} />}
      tablet={<WalletTablet {...sharedProps} />}
      desktop={<WalletDesktop {...sharedProps} />}
    />
  );
}

export default WalletResponsive;
