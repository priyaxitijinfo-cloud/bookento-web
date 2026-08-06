"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

import { AddMoneyFormContent, AddMoneyPayBar } from "./wallet-add-money-parts";

export function WalletAddMoneyDesktop(props) {
  const {
    amount,
    onAmountChange,
    onQuickAmount,
    hasAppliedCoupon,
    selectedBank,
    selectedBankId,
    banksOpen,
    onBanksToggle,
    onBankSelect,
    discount,
    totalPayable,
    paying,
    formattedAmount,
    formattedPayable,
    onPay,
  } = props;

  return (
    <DesktopLayout
      maxWidth="narrow"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.WALLET}
          backLabel="Back to Wallet"
          currentLabel="Add Money"
          trail={[{ label: "My Wallet", href: ROUTES.WALLET }]}
        />
      )}
      contentClassName="pb-24"
    >
      <ResponsiveCard className="space-y-6">
        <AddMoneyFormContent
          amount={amount}
          onAmountChange={onAmountChange}
          onQuickAmount={onQuickAmount}
          hasAppliedCoupon={hasAppliedCoupon}
          selectedBank={selectedBank}
          selectedBankId={selectedBankId}
          banksOpen={banksOpen}
          onBanksToggle={onBanksToggle}
          onBankSelect={onBankSelect}
          discount={discount}
          totalPayable={totalPayable}
        />
        <AddMoneyPayBar
          paying={paying}
          amount={amount}
          hasAppliedCoupon={hasAppliedCoupon}
          formattedAmount={formattedAmount}
          formattedPayable={formattedPayable}
          onPay={onPay}
          fixed={false}
        />
      </ResponsiveCard>
    </DesktopLayout>
  );
}
