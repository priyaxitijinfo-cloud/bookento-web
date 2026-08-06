"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { ROUTES } from "@/constants/routes.constants";
import {
  WALLET_ADD_MONEY_OFFERS,
  WALLET_BANKS,
  getWalletOfferDiscount,
  getWalletPayableTotal,
} from "@/constants/wallet.constants";
import { useProfileStore } from "@/store";

import { formatAddMoneyCurrency } from "./wallet-add-money-parts";
import { WalletAddMoneyDesktop } from "./WalletAddMoneyDesktop";
import { WalletAddMoneyMobile } from "./WalletAddMoneyMobile";
import { WalletAddMoneyTablet } from "./WalletAddMoneyTablet";

export function WalletAddMoneyResponsive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appliedCouponCode = searchParams.get("coupon")?.trim().toUpperCase() || "";
  const { profile, updateProfile } = useProfileStore();
  const [amount, setAmount] = useState(500);
  const [selectedBankId, setSelectedBankId] = useState(WALLET_BANKS[0].id);
  const [banksOpen, setBanksOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  const selectedBank = useMemo(
    () => WALLET_BANKS.find((bank) => bank.id === selectedBankId) ?? WALLET_BANKS[0],
    [selectedBankId],
  );

  const appliedOffer = useMemo(
    () => WALLET_ADD_MONEY_OFFERS.find((offer) => offer.code === appliedCouponCode) ?? null,
    [appliedCouponCode],
  );

  const discount = useMemo(
    () => (appliedOffer ? getWalletOfferDiscount(appliedOffer, amount) : 0),
    [appliedOffer, amount],
  );

  const totalPayable = useMemo(
    () => (appliedOffer ? getWalletPayableTotal(amount, discount) : amount),
    [appliedOffer, amount, discount],
  );

  const hasAppliedCoupon = Boolean(appliedOffer);
  const formattedAmount = amount > 0 ? formatAddMoneyCurrency(amount) : "0";
  const formattedPayable = totalPayable > 0 ? formatAddMoneyCurrency(totalPayable) : "0";

  const handleAmountChange = (value) => {
    const parsed = Number.parseInt(value.replace(/\D/g, ""), 10);
    setAmount(Number.isFinite(parsed) ? parsed : 0);
  };

  const handleBankSelect = (bankId) => {
    setSelectedBankId(bankId);
    setBanksOpen(false);
  };

  const handlePay = async () => {
    if (amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setPaying(true);
    try {
      await updateProfile({ walletBalance: profile.walletBalance + amount });
      toast.success(`₹${formattedAmount} added to your wallet`);
      router.push(ROUTES.WALLET);
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const sharedProps = {
    amount,
    onAmountChange: handleAmountChange,
    onQuickAmount: setAmount,
    hasAppliedCoupon,
    selectedBank,
    selectedBankId,
    banksOpen,
    onBanksToggle: () => setBanksOpen((open) => !open),
    onBankSelect: handleBankSelect,
    discount,
    totalPayable,
    paying,
    formattedAmount,
    formattedPayable,
    onPay: handlePay,
  };

  return (
    <ResponsiveView
      mobile={<WalletAddMoneyMobile {...sharedProps} />}
      tablet={<WalletAddMoneyTablet {...sharedProps} />}
      desktop={<WalletAddMoneyDesktop {...sharedProps} />}
    />
  );
}

export default WalletAddMoneyResponsive;
