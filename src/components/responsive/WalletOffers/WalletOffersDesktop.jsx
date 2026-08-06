"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

import { OffersList, OffersSearchForm } from "./wallet-offers-parts";

export function WalletOffersDesktop({ couponCode, onCouponChange, onSubmit, offers, onApplyOffer }) {
  return (
    <DesktopLayout
      maxWidth="narrow"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.WALLET_ADD_MONEY}
          backLabel="Back to Add Money"
          currentLabel="Available Offers"
          trail={[
            { label: "My Wallet", href: ROUTES.WALLET },
            { label: "Add Money", href: ROUTES.WALLET_ADD_MONEY },
          ]}
        />
      )}
    >
      <ResponsiveCard className="space-y-5">
        <OffersSearchForm couponCode={couponCode} onCouponChange={onCouponChange} onSubmit={onSubmit} />
        <OffersList offers={offers} couponCode={couponCode} onApplyOffer={onApplyOffer} />
      </ResponsiveCard>
    </DesktopLayout>
  );
}
