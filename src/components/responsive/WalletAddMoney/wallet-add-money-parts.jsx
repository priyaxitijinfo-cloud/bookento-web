"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

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
  "flex h-[52px] w-full items-center gap-3 px-4 text-left max-md:h-[64px] md:h-[70px] md:px-5";

const BANK_OPTION_CLASS =
  "flex h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left transition-colors max-md:h-[52px] max-md:rounded-lg md:h-[50px] md:gap-3.5 md:px-3.5";

export function SectionTitle({ children }) {
  return (
    <h2 className="md:text-foreground mb-3 text-[15px] font-semibold text-[#111827] max-md:mb-2.5 max-md:text-[15px] md:text-base">
      {children}
    </h2>
  );
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
      <div className="border-border/60 bg-background shadow-card rounded-2xl border px-4 py-1 max-md:rounded-xl max-md:border-[#E6EAF2] max-md:shadow-none md:px-5 md:py-2">
        <div className="border-border/40 flex items-center justify-between border-b py-3.5 max-md:border-b-0 max-md:pt-2.5 max-md:pb-1 md:py-4">
          <span className="text-muted-foreground text-sm md:text-[15px]">Amount</span>
          <span className="text-foreground text-sm font-medium md:text-[15px]">
            ₹{formatAddMoneyCurrency(amount)}
          </span>
        </div>
        <div className="flex items-center justify-between py-3.5 max-md:pt-1 max-md:pb-2.5 md:py-4">
          <span className="text-sm font-medium text-[#22C55E] md:text-[15px]">
            Discount
          </span>
          <span className="text-sm font-semibold text-[#22C55E] md:text-[15px]">
            -₹{formatAddMoneyCurrency(discount, { decimals: true })}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 md:px-5 md:py-4">
          <span className="text-primary text-sm font-semibold md:text-[15px]">
            Total Payable
          </span>
          <span className="text-primary text-sm font-semibold md:text-[17px] md:font-bold">
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
        <div className="border-border/60 bg-background shadow-card rounded-2xl border px-4 py-5 max-md:flex max-md:h-[64px] max-md:items-center max-md:rounded-xl max-md:border-[#E6EAF2] max-md:bg-white max-md:px-4 max-md:py-0 max-md:shadow-none md:flex md:h-[70px] md:items-center md:px-5 md:py-0">
          <div className="flex items-center gap-2 max-md:w-full max-md:gap-1.5">
            <span className="text-foreground text-[1.75rem] font-semibold max-md:text-[17px] max-md:font-bold max-md:text-[#111827] md:text-[1.375rem]">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount > 0 ? amount : ""}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="0"
              className="text-foreground placeholder:text-muted-foreground/50 w-full bg-transparent text-[1.75rem] font-semibold outline-none max-md:text-[17px] max-md:font-bold max-md:text-[#111827] md:text-[1.375rem]"
              aria-label="Enter amount"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 max-md:mt-3 max-md:gap-2.5 md:mt-4 md:gap-3">
          {WALLET_QUICK_AMOUNTS.map((quickAmount) => {
            const isSelected = amount === quickAmount;

            return (
              <button
                key={quickAmount}
                type="button"
                onClick={() => onQuickAmount(quickAmount)}
                className={cn(
                  "rounded-xl border py-2.5 text-[13px] font-semibold transition-colors max-md:rounded-lg max-md:py-2.5 max-md:pt-[2px] max-md:text-[15px] md:py-3 md:text-sm",
                  isSelected
                    ? "border-transparent text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)] max-md:h-11 max-md:border-0 max-md:bg-gradient-to-b max-md:from-[#4B8DF8] max-md:to-[#1865EA] max-md:shadow-[0_4px_10px_rgba(24,101,234,0.28)] md:border-0 md:bg-gradient-to-b md:from-[#4B8DF8] md:to-[#1865EA] md:shadow-[0_4px_10px_rgba(24,101,234,0.28)]"
                    : "border-border/70 bg-background text-foreground hover:border-primary/30 max-md:h-11 max-md:border-[#E6EAF2] max-md:bg-white max-md:text-[#4D5972]",
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
          className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF8A00] via-[#FF6B00] to-[#FF4D00] px-4 py-4 text-left shadow-[0_4px_16px_rgba(255,107,0,0.28)] transition-opacity hover:opacity-95 max-md:gap-3 max-md:rounded-xl max-md:bg-none max-md:px-3.5 max-md:py-3.5 max-md:shadow-[0_4px_14px_rgba(255,107,0,0.22)] md:gap-4 md:bg-none md:px-5 md:py-5"
        >
          <Image
            src="/icons/money-banner.png"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 0px"
            className="pointer-events-none object-cover md:hidden"
            unoptimized
            priority
          />
          <Image
            src="/icons/bg03.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 1232px, 0px"
            className="pointer-events-none hidden object-cover md:block"
            unoptimized
            priority
          />
          <img
            src="/icons/percent.svg"
            alt=""
            className="relative z-10 size-14 shrink-0 object-contain md:hidden"
            draggable={false}
            aria-hidden
          />
          <img
            src="/icons/coupon.svg"
            alt=""
            className="relative z-10 hidden size-11 shrink-0 object-contain md:block md:size-12"
            draggable={false}
            aria-hidden
          />
          <span className="relative z-10 min-w-0 flex-1">
            <span className="block text-sm font-bold text-white max-md:text-[14px] max-md:font-semibold md:text-base">
              Apply Coupon / Offer
            </span>
            <span className="mt-0.5 block text-xs text-white/90 max-md:text-[11px] max-md:leading-snug md:text-[13px]">
              Get exclusive discounts offer &amp; cashback rewards
            </span>
          </span>
          <svg
            width="42"
            height="26"
            viewBox="0 0 42 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 h-[18px] w-[29px] shrink-0 md:hidden"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.51183 21.7427C3.92375 21.3377 3.8284 20.599 4.29886 20.0927L10.8901 13L4.29886 5.90728C3.8284 5.40102 3.92375 4.66229 4.51183 4.25728C5.09991 3.85227 5.95803 3.93436 6.4285 4.44062L13.7012 12.2667C14.0996 12.6954 14.0996 13.3046 13.7012 13.7333L6.4285 21.5594C5.95803 22.0656 5.09991 22.1477 4.51183 21.7427Z"
              fill="white"
            />
            <path
              opacity="0.6"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5118 21.7427C15.9237 21.3377 15.8284 20.599 16.2989 20.0927L22.8901 13L16.2989 5.90728C15.8284 5.40102 15.9237 4.66229 16.5118 4.25728C17.0999 3.85227 17.958 3.93436 18.4285 4.44062L25.7012 12.2667C26.0996 12.6954 26.0996 13.3046 25.7012 13.7333L18.4285 21.5594C17.958 22.0656 17.0999 22.1477 16.5118 21.7427Z"
              fill="white"
            />
            <path
              opacity="0.3"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M28.5118 21.7427C27.9237 21.3377 27.8284 20.599 28.2989 20.0927L34.8901 13L28.2989 5.90728C27.8284 5.40102 27.9237 4.66229 28.5118 4.25728C29.0999 3.85227 29.958 3.93436 30.4285 4.44062L37.7012 12.2667C38.0996 12.6954 38.0996 13.3046 37.7012 13.7333L30.4285 21.5594C29.958 22.0656 29.0999 22.1477 28.5118 21.7427Z"
              fill="white"
            />
          </svg>
          <img
            src="/icons/3arrow.svg"
            alt=""
            className="relative z-10 hidden h-5 w-[34px] shrink-0 object-contain md:block"
            draggable={false}
            aria-hidden
          />
          <span
            className="bg-background/10 pointer-events-none absolute top-3 -right-3 size-16 rounded-full max-md:hidden"
            aria-hidden
          />
        </Link>
      ) : null}

      <section>
        <SectionTitle>Payment Gateway</SectionTitle>
        <div className="space-y-3 max-md:space-y-2.5">
          <button
            type="button"
            onClick={onBanksToggle}
            aria-expanded={banksOpen}
            aria-haspopup="listbox"
            className={cn(
              BANK_TRIGGER_CLASS,
              "border-border/60 bg-background shadow-card hover:border-primary/20 justify-between rounded-2xl border transition-colors max-md:rounded-xl max-md:border-[#E6EAF2] max-md:bg-white max-md:shadow-none",
            )}
          >
            {banksOpen ? (
              <span className="text-muted-foreground text-sm max-md:text-[14px] max-md:text-[#94A3B8] md:text-[15px]">
                Select Bank
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-3">
                <BankLogo bank={selectedBank} />
                <span className="text-foreground truncate text-sm font-medium max-md:text-[14px] max-md:text-[#111827] md:text-[15px]">
                  {selectedBank.name}
                </span>
              </span>
            )}
            <ChevronDown
              className={cn(
                "text-muted-foreground size-5 shrink-0 transition-transform max-md:text-[#111827]",
                banksOpen && "rotate-180",
              )}
            />
          </button>

          {banksOpen ? (
            <div
              role="listbox"
              aria-label="Select bank"
              className="border-border/60 bg-background shadow-card rounded-2xl border p-2 max-md:rounded-xl max-md:border-[#E6EAF2] max-md:bg-white max-md:p-1.5 max-md:shadow-none md:p-2.5"
            >
              <div className="flex flex-col gap-1 max-md:gap-0.5">
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
                        isSelected
                          ? "bg-[#EFF6FF] max-md:bg-[#EAF2FF]"
                          : "hover:bg-[#F8FAFC] max-md:hover:bg-[#F8FAFC]",
                      )}
                    >
                      <BankLogo bank={bank} className="max-md:size-6" />
                      <span className="text-[15px] font-medium text-[#334155] max-md:text-[14px] max-md:text-[#111827]">
                        {bank.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {hasAppliedCoupon ? (
        <PaymentSummaryCard
          amount={amount}
          discount={discount}
          totalPayable={totalPayable}
        />
      ) : null}
    </>
  );
}

export function AddMoneyPayBar({
  paying,
  amount,
  hasAppliedCoupon,
  formattedAmount,
  formattedPayable,
  onPay,
  fixed = true,
}) {
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
      className="md:gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-sm font-medium text-white shadow-[0_4px_14px_rgba(24,101,234,0.35)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 max-md:h-[52px] max-md:rounded-xl max-md:bg-[#1865EA] max-md:text-[15px] max-md:font-semibold max-md:shadow-none md:h-[3.25rem] md:text-base md:font-semibold"
    >
      {label}
    </button>
  );

  if (!fixed) return bar;

  return (
    <div className="border-border/60 bg-background/95 fixed inset-x-0 bottom-16 z-20 border-t px-4 py-3 backdrop-blur-sm max-md:bottom-0 max-md:border-[#EEF2F7] max-md:bg-white max-md:px-4 max-md:pt-3 max-md:pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] max-md:backdrop-blur-none md:bottom-0 md:px-6">
      <div className="mx-auto w-full max-w-lg md:max-w-7xl">{bar}</div>
    </div>
  );
}
