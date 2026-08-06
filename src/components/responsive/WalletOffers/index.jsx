"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { ROUTES } from "@/constants/routes.constants";
import { WALLET_ADD_MONEY_OFFERS } from "@/constants/wallet.constants";

import { WalletOffersDesktop } from "./WalletOffersDesktop";
import { WalletOffersMobile } from "./WalletOffersMobile";
import { WalletOffersTablet } from "./WalletOffersTablet";

export function WalletOffersResponsive() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");

  const normalizedQuery = couponCode.trim().toUpperCase();

  const filteredOffers = useMemo(() => {
    if (!normalizedQuery) return WALLET_ADD_MONEY_OFFERS;

    return WALLET_ADD_MONEY_OFFERS.filter(
      (offer) =>
        offer.code.includes(normalizedQuery) ||
        offer.description.toUpperCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const applyCoupon = (offer) => {
    toast.success(`Coupon ${offer.code} applied`);
    router.push(`${ROUTES.WALLET_ADD_MONEY}?coupon=${encodeURIComponent(offer.code)}`);
  };

  const handleApplyCode = (event) => {
    event?.preventDefault();

    if (!normalizedQuery) {
      toast.error("Enter a coupon code");
      return;
    }

    const matched = WALLET_ADD_MONEY_OFFERS.find((offer) => offer.code === normalizedQuery);
    if (matched) {
      applyCoupon(matched);
      return;
    }

    toast.error("Invalid coupon code");
  };

  const sharedProps = {
    couponCode,
    onCouponChange: setCouponCode,
    onSubmit: handleApplyCode,
    offers: filteredOffers,
    onApplyOffer: applyCoupon,
  };

  return (
    <ResponsiveView
      mobile={<WalletOffersMobile {...sharedProps} />}
      tablet={<WalletOffersTablet {...sharedProps} />}
      desktop={<WalletOffersDesktop {...sharedProps} />}
    />
  );
}

export default WalletOffersResponsive;
