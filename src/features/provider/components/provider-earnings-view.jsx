"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, Download, LayoutGrid } from "lucide-react";

import {
  DownloadReportModal,
  EarningsEmptyIllustration,
  EarningsSectionHeader,
  ProviderPayoutCard,
  ProviderTransactionCard,
  ServiceBookingChart,
} from "@/features/provider/components/provider-earnings-shared";
import {
  providerEarningsTransactionsRoute,
  providerEarningsWalletRoute,
} from "@/constants/routes.constants";
import { earningsChartPeriods, earningsSummary } from "@/mock/earnings";
import { payouts } from "@/mock/payouts";
import { transactions } from "@/mock/transactions";
import { formatCurrency } from "@/utils/format.utils";

function SummaryCard({ amount, label, trend, tone }) {
  const tones = {
    earnings: {
      card: "bg-[#FFF0F3]",
      iconWrap: "bg-[#F06292]",
      badge: "bg-white/90 text-[#EC407A]",
    },
    pending: {
      card: "bg-[#E8F1FF]",
      iconWrap: "bg-[#1865EA]",
      badge: "bg-white/90 text-[#1865EA]",
    },
  };
  const styles = tones[tone];

  return (
    <div className={`relative overflow-hidden rounded-2xl p-3.5 ${styles.card}`}>
      <span
        className={`absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles.badge}`}
      >
        ↑ {trend}%
      </span>
      <div
        className={`mb-3 flex size-9 items-center justify-center rounded-xl ${styles.iconWrap}`}
      >
        <Image
          src="/icons/wallet.png"
          alt=""
          width={20}
          height={20}
          className="brightness-0 invert"
          unoptimized
        />
      </div>
      <p className="text-xl font-bold tracking-tight text-[#111827]">
        {formatCurrency(amount)}
      </p>
      <p className="mt-0.5 text-xs text-[#64748B]">{label}</p>
    </div>
  );
}

function WithdrawBanner({ amount }) {
  return (
    <Link
      href={providerEarningsWalletRoute()}
      className="relative isolate block overflow-hidden rounded-2xl bg-gradient-to-r from-[#1865EA] to-[#4B8BF5] p-4 shadow-[0_8px_24px_rgba(24,101,234,0.25)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 70% 90%, rgba(255,255,255,0.15), transparent 35%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-4 bottom-3 grid grid-cols-4 gap-1.5 opacity-40"
        aria-hidden
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className="size-1 rounded-full bg-white" />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white/90">Available to withdraw</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-white">
            {formatCurrency(amount).replace("₹", "₹ ")}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1865EA] shadow-sm">
          <Building2 className="size-4" />
          Withdraw
        </span>
      </div>
    </Link>
  );
}

export function ProviderEarningsView() {
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const hasEarnings = !forceEmpty && transactions.length > 0;

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [period, setPeriod] = useState(earningsChartPeriods[0]);

  const recentTransactions = useMemo(() => transactions.slice(0, 2), []);
  const recentPayouts = useMemo(() => payouts.slice(0, 1), []);
  const summary = earningsSummary;

  // Highlight May (index 4) to match Figma tooltip "Bookings 2,678"
  const chartActiveIndex = 4;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 lg:px-6">
          <h1 className="flex-1 truncate text-lg font-bold text-[#111827]">
            Your Earnings
          </h1>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1865EA] shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-colors hover:bg-[#F8FAFC]"
            aria-label="Calendar"
          >
            <LayoutGrid className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setDownloadOpen(true)}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Download report"
          >
            <Download className="size-5" />
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className="mx-auto w-full max-w-3xl px-4 pt-4 pb-6 lg:px-6">
          {!hasEarnings ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
              <EarningsEmptyIllustration variant="earnings" />
              <h2 className="text-lg font-bold text-[#111827]">No Earnings Yet</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#94A3B8]">
                Complete appointments to start earning. Your wallet balance will update
                automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <SummaryCard
                  amount={summary.totalEarnings}
                  label="Your Earnings"
                  trend={summary.earningsTrend}
                  tone="earnings"
                />
                <SummaryCard
                  amount={summary.pendingSettlement}
                  label="Pending Settlement"
                  trend={summary.settlementTrend}
                  tone="pending"
                />
              </div>

              <WithdrawBanner amount={summary.availableBalance} />

              <ServiceBookingChart
                data={summary.serviceBookingChart}
                periodLabel={period.label}
                periods={earningsChartPeriods}
                onPeriodChange={setPeriod}
                activeIndex={chartActiveIndex}
              />

              <section>
                <EarningsSectionHeader
                  title="Recent Transactions"
                  href={providerEarningsTransactionsRoute()}
                />
                <div className="space-y-3">
                  {recentTransactions.map((txn) => (
                    <ProviderTransactionCard key={txn.id} transaction={txn} compact />
                  ))}
                </div>
              </section>

              <section>
                <EarningsSectionHeader
                  title="Payout History"
                  href={providerEarningsTransactionsRoute()}
                />
                <div className="space-y-3">
                  {recentPayouts.map((payout) => (
                    <ProviderPayoutCard key={payout.id} payout={payout} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <DownloadReportModal open={downloadOpen} onOpenChange={setDownloadOpen} />
    </div>
  );
}
