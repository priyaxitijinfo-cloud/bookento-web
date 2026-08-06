"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

import { WalletBalanceCard, WalletTransactionsSection } from "./wallet-parts";

export function WalletDesktop({ balance, transactions }) {
  return (
    <DesktopLayout
      maxWidth="narrow"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.PROFILE}
          backLabel="Back to Profile"
          currentLabel="My Wallet"
        />
      )}
    >
      <div className="space-y-6">
        <WalletBalanceCard balance={balance} />
        <ResponsiveCard>
          <WalletTransactionsSection transactions={transactions} />
        </ResponsiveCard>
      </div>
    </DesktopLayout>
  );
}
