"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { AddMoneyFormContent, AddMoneyPayBar } from "./wallet-add-money-parts";

export function WalletAddMoneyMobile(props) {
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
    <UserPageShell
      title="Add Money"
      backHref={ROUTES.WALLET}
      backLabel="Back to Wallet"
      breadcrumbTrail={[{ label: "My Wallet", href: ROUTES.WALLET }]}
      containerVariant="browseWithBreadcrumb"
      showBottomNav={false}
      className="bg-surface-page max-md:!pb-6"
      mainClassName="space-y-5 pb-28 max-md:space-y-5"
    >
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
      />
    </UserPageShell>
  );
}
