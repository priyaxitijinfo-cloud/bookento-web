"use client";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

import { WalletBalanceCard, WalletTransactionsSection } from "./wallet-parts";

export function WalletDesktop({ balance, transactions }) {
  return (
    <DesktopLayout
      maxWidth="wide"
      showHeaderBorder={false}
      contentClassName="md:!pt-0 lg:!pt-0"
      containerClassName="md:!pt-0"
      header={
        <>
          <HomeHeader embedded />
          <DesktopBreadcrumbBar
            backHref={ROUTES.PROFILE}
            backLabel="Back to Profile"
            currentLabel="My Wallet"
          />
        </>
      }
    >
      <div className="space-y-6">
        <WalletBalanceCard balance={balance} />
        <section className="space-y-3">
          <h2 className="text-foreground hidden text-lg font-bold md:block">
            Recent Transactions
          </h2>
          <ResponsiveCard className="!p-0">
            <WalletTransactionsSection transactions={transactions} variant="desktop" />
          </ResponsiveCard>
        </section>
      </div>
    </DesktopLayout>
  );
}
