"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronsRight } from "lucide-react";
import { toast } from "sonner";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import {
  WALLET_BANKS,
  WALLET_QUICK_AMOUNTS,
  WALLET_ADD_MONEY_OFFERS,
  getWalletOfferDiscount,
  getWalletPayableTotal,
} from "@/constants/wallet.constants";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store";

function BankLogo({ bank, className }) {
  return (
    <img
      src={bank.icon}
      alt=""
      className={cn("size-7 shrink-0 object-contain", className)}
      draggable={false}
    />
  );
}

const BANK_TRIGGER_CLASS =
  "flex h-[52px] w-full items-center gap-3 px-4 text-left md:h-[55px] md:px-5";

const BANK_OPTION_CLASS =
  "flex h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left transition-colors md:h-[50px] md:gap-3.5 md:px-3.5";

function SectionTitle({ children }) {
  return <h2 className="mb-3 text-[15px] font-semibold text-foreground md:text-base">{children}</h2>;
}

function formatCurrency(value, { decimals = false } = {}) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
}

function CouponSuccessBanner({ discount }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3.5 md:gap-4 md:px-5 md:py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#22C55E] md:size-11">
        <CheckCircle2 className="size-5 text-white md:size-[1.35rem]" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#15803D] md:text-[15px]">Coupon Applied Successfully!</p>
        <p className="mt-0.5 text-xs text-[#64748B] md:text-[13px]">
          You saved ₹{formatCurrency(discount, { decimals: true })} on this payment
        </p>
      </div>
    </div>
  );
}

function PaymentSummaryCard({ amount, discount, totalPayable }) {
  return (
    <section>
      <div className="rounded-2xl border border-border/60 bg-white px-4 py-1 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:px-5 md:py-2">
        <div className="flex items-center justify-between border-b border-border/40 py-3.5 md:py-4">
          <span className="text-sm text-muted-foreground md:text-[15px]">Amount</span>
          <span className="text-sm font-medium text-foreground md:text-[15px]">₹{formatCurrency(amount)}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border/40 py-3.5 md:py-4">
          <span className="text-sm font-medium text-[#22C55E] md:text-[15px]">Discount</span>
          <span className="text-sm font-semibold text-[#22C55E] md:text-[15px]">
            -₹{formatCurrency(discount, { decimals: true })}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 md:px-5 md:py-4">
          <span className="text-sm font-semibold text-primary md:text-[15px]">Total Payable</span>
          <span className="text-base font-bold text-primary md:text-[17px]">
            ₹{formatCurrency(totalPayable, { decimals: true })}
          </span>
        </div>
      </div>
    </section>
  );
}

export default function AddMoneyPage() {
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
  const formattedAmount = amount > 0 ? formatCurrency(amount) : "0";
  const formattedPayable = totalPayable > 0 ? formatCurrency(totalPayable) : "0";

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

  return (
    <UserPageShell
      title="Add Money"
      backHref={ROUTES.WALLET}
      backLabel="Back to Wallet"
      breadcrumbTrail={[{ label: "My Wallet", href: ROUTES.WALLET }]}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="space-y-6 pb-28 md:space-y-8 md:pb-8"
    >
      {hasAppliedCoupon ? <CouponSuccessBanner discount={discount} /> : null}

      {/* Enter amount */}
      <section>
        <SectionTitle>Enter Amount</SectionTitle>
        <div className="rounded-2xl border border-border/60 bg-white px-4 py-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:px-5 md:py-6">
          <div className="flex items-center gap-2">
            <span className="text-[1.75rem] font-semibold text-foreground md:text-[2rem]">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount > 0 ? amount : ""}
              onChange={(event) => handleAmountChange(event.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-[1.75rem] font-semibold text-foreground outline-none placeholder:text-muted-foreground/50 md:text-[2rem]"
              aria-label="Enter amount"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 md:mt-4 md:gap-3">
          {WALLET_QUICK_AMOUNTS.map((quickAmount) => {
            const isSelected = amount === quickAmount;

            return (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount)}
                className={cn(
                  "rounded-xl border py-2.5 text-[13px] font-semibold transition-colors md:py-3 md:text-sm",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)]"
                    : "border-border/70 bg-white text-foreground hover:border-primary/30",
                )}
              >
                ₹ {quickAmount.toLocaleString("en-IN")}
              </button>
            );
          })}
        </div>
      </section>

      {/* Coupon banner — only when no coupon applied */}
      {!hasAppliedCoupon ? (
        <Link
          href={ROUTES.WALLET_ADD_MONEY_OFFERS}
          className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF8A00] via-[#FF6B00] to-[#FF4D00] px-4 py-4 text-left shadow-[0_4px_16px_rgba(255,107,0,0.28)] transition-opacity hover:opacity-95 md:gap-4 md:px-5 md:py-5"
        >
          <Image
            src="/images/wallet-coupon-icon.png"
            alt=""
            width={48}
            height={48}
            className="size-11 shrink-0 object-contain md:size-12"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-white md:text-base">Apply Coupon / Offer</span>
            <span className="mt-0.5 block text-xs text-white/90 md:text-[13px]">
              Get exclusive discounts offer &amp; cashback rewards
            </span>
          </span>
          <ChevronsRight className="size-5 shrink-0 text-white/90 md:size-6" strokeWidth={2.25} />
          <span
            className="pointer-events-none absolute -right-3 top-3 size-16 rounded-full bg-white/10"
            aria-hidden
          />
        </Link>
      ) : null}

      {/* Payment gateway */}
      <section>
        <SectionTitle>Payment Gateway</SectionTitle>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setBanksOpen((open) => !open)}
            aria-expanded={banksOpen}
            aria-haspopup="listbox"
            className={cn(
              BANK_TRIGGER_CLASS,
              "justify-between rounded-2xl border border-border/60 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-colors hover:border-primary/20",
            )}
          >
            {banksOpen ? (
              <span className="text-sm text-muted-foreground md:text-[15px]">Select Bank</span>
            ) : (
              <span className="flex min-w-0 items-center gap-3">
                <BankLogo bank={selectedBank} />
                <span className="truncate text-sm font-medium text-foreground md:text-[15px]">
                  {selectedBank.name}
                </span>
              </span>
            )}
            <ChevronDown
              className={cn(
                "size-5 shrink-0 text-muted-foreground transition-transform",
                banksOpen && "rotate-180",
              )}
            />
          </button>

          {banksOpen ? (
            <div
              role="listbox"
              aria-label="Select bank"
              className="rounded-2xl border border-border/60 bg-white p-2 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-2.5"
            >
              <div className="flex flex-col gap-1">
                {WALLET_BANKS.map((bank) => {
                  const isSelected = bank.id === selectedBankId;

                  return (
                    <button
                      key={bank.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleBankSelect(bank.id)}
                      className={cn(
                        BANK_OPTION_CLASS,
                        isSelected ? "bg-[#EFF6FF]" : "hover:bg-[#F8FAFC]",
                      )}
                    >
                      <BankLogo bank={bank} />
                      <span className="text-[15px] font-medium text-[#334155]">{bank.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {hasAppliedCoupon ? (
        <PaymentSummaryCard amount={amount} discount={discount} totalPayable={totalPayable} />
      ) : null}

      {/* Pay button */}
      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border/60 bg-white/95 px-4 py-3 backdrop-blur-sm md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <button
          type="button"
          onClick={handlePay}
          disabled={paying || amount <= 0}
          className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-white shadow-[0_4px_14px_rgba(24,101,234,0.35)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 md:h-[3.25rem] md:text-base"
        >
          {paying
            ? "Processing..."
            : hasAppliedCoupon
              ? `Pay ₹${formattedPayable} Securely`
              : `Pay ₹${formattedAmount} Securely`}
        </button>
      </div>
    </UserPageShell>
  );
}
