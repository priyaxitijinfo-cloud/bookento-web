"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronDown } from "lucide-react";
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

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="size-28 shrink-0" aria-hidden />,
});

const LOTTIE_SRC = "/lottie/successful.json";

function isMobileViewport() {
  return (
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
}

function PaymentSuccessModal({ open, amountLabel, onDone }) {
  const lottieRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setAnimationData(null);
    setLoadFailed(false);

    fetch(LOTTIE_SRC)
      .then((response) => {
        if (!response.ok) throw new Error("Lottie file not found");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const startAnimation = useCallback(() => {
    lottieRef.current?.stop();
    lottieRef.current?.goToAndPlay(0, true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-5 md:hidden">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-payment-success-title"
        className="relative w-full max-w-[20.5rem] overflow-hidden rounded-[1.5rem] px-5 pt-6 pb-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.22)]"
      >
        <Image
          src="/icons/dailog-bg.png"
          alt=""
          fill
          sizes="328px"
          className="pointer-events-none object-cover"
          unoptimized
          priority
        />
        <div className="relative z-10">
          <div className="mx-auto flex h-[7.5rem] items-center justify-center">
            {animationData ? (
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop
                autoplay={false}
                onDOMLoaded={startAnimation}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                style={{ width: "7.5rem", height: "7.5rem" }}
                className="pointer-events-none"
              />
            ) : loadFailed ? (
              <CheckCircle2
                className="size-20 text-[#22C55E]"
                strokeWidth={1.75}
                aria-hidden
              />
            ) : (
              <div
                className="size-20 animate-pulse rounded-full bg-[#E8F7EE]"
                aria-hidden
              />
            )}
          </div>

          <h2
            id="wallet-payment-success-title"
            className="mt-1 text-[1.25rem] leading-tight font-bold text-[#111827]"
          >
            Payment Successfully
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-[#64748B]">
            ₹{amountLabel} has been added successfully to your wallet.
          </p>

          <button
            type="button"
            onClick={onDone}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#4B8DF8] to-[#1865EA] text-[15px] font-semibold text-white transition-opacity hover:opacity-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
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
  "flex h-[52px] w-full items-center gap-3 px-4 text-left max-md:h-[64px] md:h-[70px] md:px-5";

const BANK_OPTION_CLASS =
  "flex h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left transition-colors md:h-[50px] md:gap-3.5 md:px-3.5";

function SectionTitle({ children }) {
  return (
    <h2 className="text-foreground mb-3 text-[15px] font-semibold md:text-base">
      {children}
    </h2>
  );
}

function formatCurrency(value, { decimals = false } = {}) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
}

function CouponSuccessBanner({ discount }) {
  const formattedDiscount = formatCurrency(discount, { decimals: true });

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3.5 max-md:border-0 max-md:bg-[#E0F5EA]",
        "md:gap-4 md:rounded-xl md:border md:border-[#C8E6C9] md:bg-[#EBF9ED] md:px-5 md:py-4",
      )}
    >
      <img
        src="/icons/Successfully.svg"
        alt=""
        className="size-10 shrink-0 object-contain md:size-11"
        draggable={false}
      />
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#15803D] max-md:text-[#0F9250] md:text-base">
          Coupon Applied Successfully!
        </p>
        <p className="mt-0.5 text-xs text-[#64748B] max-md:mt-1.5 max-md:text-[#202020] md:hidden">
          You saved{" "}
          <span className="font-semibold text-[#0F9250]">₹{formattedDiscount}</span> on
          this payment
        </p>
        <p className="mt-1 hidden text-sm leading-snug md:block">
          <span className="text-[#111827]">You saved </span>
          <span className="font-bold text-[#15803D]">₹{formattedDiscount}</span>
          <span className="text-[#111827]"> on this payment</span>
        </p>
      </div>
    </div>
  );
}

function PaymentSummaryCard({ amount, discount, totalPayable }) {
  return (
    <section className="md:mb-2">
      <div className="border-border/60 rounded-2xl border bg-white px-4 py-1 shadow-[0_2px_12px_rgba(15,23,42,0.04)] max-md:pb-3 md:px-5 md:pt-2 md:pb-5">
        <div className="border-border/40 flex items-center justify-between border-b py-3.5 max-md:border-b-0 max-md:pt-2.5 max-md:pb-1 md:py-4">
          <span className="text-muted-foreground text-sm md:text-[15px]">Amount</span>
          <span className="text-foreground text-sm font-medium md:text-[15px]">
            ₹{formatCurrency(amount)}
          </span>
        </div>
        <div className="border-border/40 flex items-center justify-between border-b py-3.5 max-md:border-b-0 max-md:pt-1 max-md:pb-2.5 md:py-4">
          <span className="text-sm font-medium text-[#22C55E] md:text-[15px]">
            Discount
          </span>
          <span className="text-sm font-semibold text-[#22C55E] md:text-[15px]">
            -₹{formatCurrency(discount, { decimals: true })}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 max-md:mt-1 md:px-5 md:py-4">
          <span className="text-primary text-sm font-semibold md:text-[15px]">
            Total Payable
          </span>
          <span className="text-primary text-sm font-semibold md:text-[17px] md:font-bold">
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
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAmountLabel, setSuccessAmountLabel] = useState("");

  const selectedBank = useMemo(
    () => WALLET_BANKS.find((bank) => bank.id === selectedBankId) ?? WALLET_BANKS[0],
    [selectedBankId],
  );

  const appliedOffer = useMemo(
    () =>
      WALLET_ADD_MONEY_OFFERS.find((offer) => offer.code === appliedCouponCode) ?? null,
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
      if (isMobileViewport()) {
        setSuccessAmountLabel(formattedAmount);
        setSuccessOpen(true);
      } else {
        toast.success(`₹${formattedAmount} added to your wallet`);
        router.push(ROUTES.WALLET);
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    router.push(ROUTES.WALLET);
  };

  return (
    <UserPageShell
      title="Add Money"
      backHref={ROUTES.WALLET}
      backLabel="Back to Wallet"
      breadcrumbTrail={[{ label: "My Wallet", href: ROUTES.WALLET }]}
      containerVariant="browseWithBreadcrumb"
      showBottomNav={false}
      className="bg-surface-page max-md:!pb-6 md:!bg-[#F7F8FC]"
      mainClassName="space-y-6 pb-28 md:space-y-8 md:pb-28"
    >
      {hasAppliedCoupon ? <CouponSuccessBanner discount={discount} /> : null}

      {/* Enter amount */}
      <section>
        <h2 className="text-foreground mb-3 text-[15px] font-semibold max-md:mb-2.5 max-md:font-semibold max-md:text-[#111827] md:text-base">
          Enter Amount
        </h2>
        <div className="border-border/60 rounded-2xl border bg-white px-4 py-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] max-md:flex max-md:h-[64px] max-md:items-center max-md:rounded-2xl max-md:border-[#E6EAF2] max-md:px-4 max-md:py-0 max-md:shadow-none md:flex md:h-[70px] md:items-center md:px-5 md:py-0">
          <div className="flex items-center gap-2 max-md:w-full max-md:gap-1.5">
            <span className="text-foreground text-[1.75rem] font-semibold max-md:text-[17px] max-md:font-bold max-md:text-[#111827] md:text-[1.375rem]">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount > 0 ? amount : ""}
              onChange={(event) => handleAmountChange(event.target.value)}
              placeholder="0"
              className="text-foreground placeholder:text-muted-foreground/50 w-full bg-transparent text-[1.75rem] font-semibold outline-none max-md:text-[17px] max-md:font-bold max-md:tracking-tight max-md:text-[#111827] md:text-[1.375rem]"
              aria-label="Enter amount"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 max-md:mt-3.5 max-md:gap-2.5 md:mt-4 md:gap-3">
          {WALLET_QUICK_AMOUNTS.map((quickAmount) => {
            const isSelected = amount === quickAmount;

            return (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount)}
                className={cn(
                  "rounded-xl border py-2.5 text-[13px] font-semibold transition-colors max-md:h-11 max-md:rounded-xl max-md:py-0 max-md:pt-[2px] max-md:text-[15px] md:py-3 md:text-sm",
                  isSelected
                    ? "border-transparent text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)] max-md:border-0 max-md:bg-gradient-to-b max-md:from-[#4B8DF8] max-md:to-[#1865EA] max-md:shadow-[0_4px_10px_rgba(24,101,234,0.28)] md:border-0 md:bg-gradient-to-b md:from-[#4B8DF8] md:to-[#1865EA] md:shadow-[0_4px_10px_rgba(24,101,234,0.28)]"
                    : "border-border/70 text-foreground hover:border-primary/30 bg-white max-md:border-[#E6EAF2] max-md:text-[#4D5972]",
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
          className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF8A00] via-[#FF6B00] to-[#FF4D00] px-4 py-4 text-left shadow-[0_4px_16px_rgba(255,107,0,0.28)] transition-opacity hover:opacity-95 max-md:bg-none max-md:shadow-[0_4px_14px_rgba(255,107,0,0.22)] md:gap-4 md:bg-none md:px-5 md:py-5"
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
            <span className="block text-sm font-bold text-white max-md:font-semibold md:text-base">
              Apply Coupon / Offer
            </span>
            <span className="mt-0.5 block text-xs text-white/90 md:text-[13px]">
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
            className="pointer-events-none absolute top-3 -right-3 size-16 rounded-full bg-white/10 max-md:hidden md:block"
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
              "border-border/60 hover:border-primary/20 justify-between rounded-2xl border bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-colors",
            )}
          >
            {banksOpen ? (
              <span className="text-muted-foreground text-sm md:text-[15px]">
                Select Bank
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-3">
                <BankLogo bank={selectedBank} />
                <span className="text-foreground truncate text-sm font-medium md:text-[15px]">
                  {selectedBank.name}
                </span>
              </span>
            )}
            <ChevronDown
              className={cn(
                "text-muted-foreground size-5 shrink-0 transition-transform",
                banksOpen && "rotate-180",
              )}
            />
          </button>

          {banksOpen ? (
            <div
              role="listbox"
              aria-label="Select bank"
              className="border-border/60 rounded-2xl border bg-white p-2 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-2.5"
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
                      <span className="text-[15px] font-medium text-[#334155]">
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

      {/* Pay button */}
      <div className="border-border/60 fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 px-4 py-3 backdrop-blur-sm max-md:pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:border-t-0 md:px-6 md:py-4">
        <div className="mx-auto w-full max-w-lg md:max-w-7xl">
          <button
            type="button"
            onClick={handlePay}
            disabled={paying || amount <= 0}
            className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-sm font-medium text-white shadow-[0_4px_14px_rgba(24,101,234,0.35)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 md:h-[3.25rem] md:text-base md:font-semibold"
          >
            {paying
              ? "Processing..."
              : hasAppliedCoupon
                ? `Pay ₹${formattedPayable} Securely`
                : `Pay ₹${formattedAmount} Securely`}
          </button>
        </div>
      </div>

      <PaymentSuccessModal
        open={successOpen}
        amountLabel={successAmountLabel}
        onDone={handleSuccessDone}
      />
    </UserPageShell>
  );
}
