"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { WalletBalanceCard, WalletTransactionsSection } from "./wallet-parts";

export function WalletTablet({ balance, transactions }) {
  return (
    <UserPageShell
      title="My Wallet"
      backHref={ROUTES.PROFILE}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="mx-auto max-w-2xl space-y-6"
    >
      <WalletBalanceCard balance={balance} />
      <WalletTransactionsSection transactions={transactions} />
    </UserPageShell>
  );
}
