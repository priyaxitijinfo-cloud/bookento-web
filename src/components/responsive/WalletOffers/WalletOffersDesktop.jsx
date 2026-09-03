"use client";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ROUTES } from "@/constants/routes.constants";

import { OffersList, OffersSearchForm } from "./wallet-offers-parts";

export function WalletOffersDesktop({
  couponCode,
  onCouponChange,
  onSubmit,
  offers,
  onApplyOffer,
}) {
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
            backHref={ROUTES.WALLET_ADD_MONEY}
            backLabel="Back to Add Money"
            currentLabel="Available Offers"
            trail={[
              { label: "My Wallet", href: ROUTES.WALLET },
              { label: "Add Money", href: ROUTES.WALLET_ADD_MONEY },
            ]}
          />
        </>
      }
    >
      <div className="space-y-5">
        <OffersSearchForm
          couponCode={couponCode}
          onCouponChange={onCouponChange}
          onSubmit={onSubmit}
        />
        <OffersList
          offers={offers}
          couponCode={couponCode}
          onApplyOffer={onApplyOffer}
        />
      </div>
    </DesktopLayout>
  );
}
