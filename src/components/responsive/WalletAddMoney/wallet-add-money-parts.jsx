"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronsRight } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { WALLET_BANKS, WALLET_QUICK_AMOUNTS } from "@/constants/wallet.constants";
import { cn } from "@/lib/utils";

export function BankLogo({ bank, className }) {
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

export function SectionTitle({ children }) {
  return <h2 className="mb-3 text-[15px] font-semibold text-foreground md:text-base">{children}</h2>;
}

export function formatAddMoneyCurrency(value, { decimals = false } = {}) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
}

export function PaymentSummaryCard({ amount, discount, totalPayable }) {
  return (
    <section>
      <div className="rounded-2xl border border-border/60 bg-background px-4 py-1 shadow-card md:px-5 md:py-2">
        <div className="flex items-center justify-between border-b border-border/40 py-3.5 md:py-4">
          <span className="text-sm text-muted-foreground md:text-[15px]">Amount</span>
          <span className="text-sm font-medium text-foreground md:text-[15px]">₹{formatAddMoneyCurrency(amount)}</span>
        </div>
        <div className="flex items-center justify-between py-3.5 md:py-4">
          <span className="text-sm font-medium text-[#22C55E] md:text-[15px]">Discount</span>
          <span className="text-sm font-semibold text-[#22C55E] md:text-[15px]">
            -₹{formatAddMoneyCurrency(discount, { decimals: true })}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 md:px-5 md:py-4">
          <span className="text-sm font-semibold text-primary md:text-[15px]">Total Payable</span>
          <span className="text-base font-bold text-primary md:text-[17px]">
            ₹{formatAddMoneyCurrency(totalPayable, { decimals: true })}
          </span>
        </div>
      </div>
    </section>
  );
}

export function AddMoneyFormContent({
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
}) {
  return (
    <>
      <section>
        <SectionTitle>Enter Amount</SectionTitle>
        <div className="rounded-2xl border border-border/60 bg-background px-4 py-5 shadow-card md:px-5 md:py-6">
          <div className="flex items-center gap-2">
            <span className="text-[1.75rem] font-semibold text-foreground md:text-[2rem]">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount > 0 ? amount : ""}
              onChange={(event) => onAmountChange(event.target.value)}
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
                onClick={() => onQuickAmount(quickAmount)}
                className={cn(
                  "rounded-xl border py-2.5 text-[13px] font-semibold transition-colors md:py-3 md:text-sm",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)]"
                    : "border-border/70 bg-background text-foreground hover:border-primary/30",
                )}
              >
                ₹ {quickAmount.toLocaleString("en-IN")}
              </button>
            );
          })}
        </div>
      </section>

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
            className="pointer-events-none absolute -right-3 top-3 size-16 rounded-full bg-background/10"
            aria-hidden
          />
        </Link>
      ) : null}

      <section>
        <SectionTitle>Payment Gateway</SectionTitle>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onBanksToggle}
            aria-expanded={banksOpen}
            aria-haspopup="listbox"
            className={cn(
              BANK_TRIGGER_CLASS,
              "justify-between rounded-2xl border border-border/60 bg-background shadow-card transition-colors hover:border-primary/20",
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
              className="rounded-2xl border border-border/60 bg-background p-2 shadow-card md:p-2.5"
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
                      onClick={() => onBankSelect(bank.id)}
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
    </>
  );
}

export function AddMoneyPayBar({ paying, amount, hasAppliedCoupon, formattedAmount, formattedPayable, onPay, fixed = true }) {
  const label = paying
    ? "Processing..."
    : hasAppliedCoupon
      ? `Pay ₹${formattedPayable} Securely`
      : `Pay ₹${formattedAmount} Securely`;

  const bar = (
    <button
      type="button"
      onClick={onPay}
      disabled={paying || amount <= 0}
      className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-white shadow-[0_4px_14px_rgba(24,101,234,0.35)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 md:h-[3.25rem] md:text-base"
    >
      {label}
    </button>
  );

  if (!fixed) return bar;

  return (
    <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm md:bottom-0 md:px-6">
      <div className="mx-auto w-full max-w-lg md:max-w-7xl">{bar}</div>
    </div>
  );
}
