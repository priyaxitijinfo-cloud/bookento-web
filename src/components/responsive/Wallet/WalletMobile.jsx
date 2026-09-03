"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { WalletBalanceCard, WalletTransactionsSection } from "./wallet-parts";

export function WalletMobile({ balance, transactions }) {
  return (
    <UserPageShell
      title="My Wallet"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page max-md:!pb-6"
      mainClassName="space-y-6 max-md:space-y-6"
      showBottomNav={false}
    >
      <WalletBalanceCard balance={balance} />
      <WalletTransactionsSection transactions={transactions} />
    </UserPageShell>
  );
}
