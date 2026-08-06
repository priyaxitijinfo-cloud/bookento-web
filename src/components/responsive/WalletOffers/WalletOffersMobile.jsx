"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";

import { OffersList, OffersSearchForm } from "./wallet-offers-parts";

export function WalletOffersMobile({ couponCode, onCouponChange, onSubmit, offers, onApplyOffer }) {
  return (
    <UserPageShell
      title="Available Offers"
      backHref={ROUTES.WALLET_ADD_MONEY}
      backLabel="Back to Add Money"
      breadcrumbTrail={[
        { label: "My Wallet", href: ROUTES.WALLET },
        { label: "Add Money", href: ROUTES.WALLET_ADD_MONEY },
      ]}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="space-y-4"
    >
      <OffersSearchForm couponCode={couponCode} onCouponChange={onCouponChange} onSubmit={onSubmit} />
      <OffersList offers={offers} couponCode={couponCode} onApplyOffer={onApplyOffer} />
    </UserPageShell>
  );
}
