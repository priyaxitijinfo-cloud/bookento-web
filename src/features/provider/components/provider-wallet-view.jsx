"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { VerifiedCheck } from "@/features/provider/components/provider-earnings-shared";
import { ROUTES } from "@/constants/routes.constants";
import { earningsSummary, paymentGateways } from "@/mock/earnings";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";

export function ProviderWalletView() {
  const summary = earningsSummary;
  const [amount, setAmount] = useState("500");
  const [gatewayId, setGatewayId] = useState(paymentGateways[0]?.id || "gpay");
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [payNumber, setPayNumber] = useState("96525 96582");
  const [submitting, setSubmitting] = useState(false);

  const selectedGateway =
    paymentGateways.find((item) => item.id === gatewayId) || paymentGateways[0];

  const handleWithdraw = (event) => {
    event.preventDefault();
    const value = Number(String(amount).replace(/,/g, ""));

    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (value < summary.minimumWithdraw) {
      toast.error(`Minimum withdraw is ${formatCurrency(summary.minimumWithdraw)}`);
      return;
    }
    if (value > summary.walletBalance) {
      toast.error("Amount exceeds wallet balance");
      return;
    }
    if (!payNumber.trim()) {
      toast.error(`Enter your ${selectedGateway.label} number`);
      return;
    }

    setSubmitting(true);
    toast.success(
      `Withdrawal of ${formatCurrency(value)} initiated via ${selectedGateway.label}`,
    );
    setTimeout(() => setSubmitting(false), 400);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 lg:px-6">
          <Link
            href={ROUTES.PROVIDER_EARNINGS}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="flex-1 truncate text-lg font-bold text-[#111827]">
            My Wallet
          </h1>
          <span className="size-10 shrink-0" aria-hidden />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <form
          onSubmit={handleWithdraw}
          className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pt-4 lg:px-6"
        >
          <div className="relative isolate mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1865EA] to-[#0B3FA8] p-4 shadow-[0_8px_24px_rgba(24,101,234,0.28)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(circle at 90% 30%, rgba(255,255,255,0.25), transparent 35%)",
              }}
            />
            <div className="relative z-10 flex items-stretch gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/90">Wallet Balance</p>
                <p className="mt-1.5 text-[1.75rem] font-bold tracking-tight text-white">
                  {formatCurrency(summary.walletBalance).replace("₹", "₹ ")}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#D97706] shadow-sm">
                  <span>
                    {summary.coinConversionUnit} Coin ={" "}
                    <span className="inline-flex items-center gap-0.5">
                      <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] text-[7px] text-white">
                        ₹
                      </span>
                      {formatCurrency(summary.coinConversionRate)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="relative flex w-[100px] shrink-0 items-center justify-center border-l border-dashed border-white/40 pl-2">
                <Image
                  src="/icons/wallet.png"
                  alt=""
                  width={88}
                  height={88}
                  className="drop-shadow-md"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="withdraw-amount"
                className="mb-2 block text-sm font-semibold text-[#111827]"
              >
                Enter Amount
              </label>
              <div className="flex h-12 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                <span className="flex size-12 shrink-0 items-center justify-center bg-[#1865EA] text-lg font-bold text-white">
                  ₹
                </span>
                <input
                  id="withdraw-amount"
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value.replace(/[^\d]/g, ""))
                  }
                  className="min-w-0 flex-1 bg-transparent px-3 text-base font-semibold text-[#111827] outline-none"
                  placeholder="0"
                />
              </div>
              <p className="mt-1.5 text-right text-xs font-medium text-[#EF4444]">
                *Minimum Withdraw {formatCurrency(summary.minimumWithdraw)}
              </p>
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Select Payment Gateway
              </label>
              <button
                type="button"
                onClick={() => setGatewayOpen((open) => !open)}
                className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 text-left transition-colors hover:bg-[#F8FAFC]"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F5F9] text-sm font-bold text-[#1865EA]">
                  {selectedGateway?.logo}
                </span>
                <span className="flex-1 text-sm font-semibold text-[#111827]">
                  {selectedGateway?.label}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-[#94A3B8] transition-transform",
                    gatewayOpen && "rotate-180",
                  )}
                />
              </button>
              {gatewayOpen ? (
                <div className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                  {paymentGateways.map((gateway) => (
                    <button
                      key={gateway.id}
                      type="button"
                      onClick={() => {
                        setGatewayId(gateway.id);
                        setGatewayOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#F4F7FF]",
                        gateway.id === gatewayId
                          ? "bg-[#E8F1FF] text-[#1865EA]"
                          : "text-[#374151]",
                      )}
                    >
                      <span className="flex size-7 items-center justify-center rounded-md bg-[#F1F5F9] text-xs font-bold">
                        {gateway.logo}
                      </span>
                      {gateway.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="pay-number"
                className="mb-2 block text-sm font-semibold text-[#111827]"
              >
                Enter {selectedGateway?.label} Number
              </label>
              <div className="flex h-12 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3">
                <input
                  id="pay-number"
                  type="text"
                  value={payNumber}
                  onChange={(event) => setPayNumber(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#111827] outline-none"
                  placeholder="Enter number"
                />
                {payNumber.trim().length >= 8 ? <VerifiedCheck /> : null}
              </div>
            </div>
          </div>

          <div className="safe-bottom sticky bottom-0 mt-auto bg-[#F4F7FF] pt-8 pb-4">
            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-[#1865EA] text-base font-semibold text-white shadow-[0_8px_20px_rgba(24,101,234,0.3)] transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              Withdraw
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
