"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format, isValid, parseISO } from "date-fns";
import {
  EarningsEmptyIllustration,
  ProviderTransactionCard,
} from "@/features/provider/components/provider-earnings-shared";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { ROUTES } from "@/constants/routes.constants";
import {
  PROVIDER_DESKTOP_GRID,
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { transactions } from "@/mock/transactions";
import { cn } from "@/lib/utils";
import { getLocalDateKey } from "@/utils/format.utils";

function formatGroupLabel(dateKey) {
  if (!dateKey) return "";
  const parsed = parseISO(dateKey);
  if (!isValid(parsed)) return dateKey;
  return format(parsed, "dd/MM/yyyy");
}

function groupTransactionsByDate(items) {
  const groups = new Map();

  for (const txn of items) {
    const key = getLocalDateKey(txn.createdAt) || txn.createdAt || "unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(txn);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, list]) => ({
      dateKey,
      label: list[0]?.dateGroupLabel || formatGroupLabel(dateKey),
      items: list,
    }));
}

export function ProviderTransactionsView() {
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const hasTransactions = !forceEmpty && transactions.length > 0;

  const groups = useMemo(
    () => (hasTransactions ? groupTransactionsByDate(transactions) : []),
    [hasTransactions],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className={PROVIDER_MOBILE_HEADER}>
          <Link
            href={ROUTES.PROVIDER_EARNINGS}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <img
              src={PROVIDER_ICONS.arrowLeft}
              alt=""
              className="size-5 object-contain"
              draggable={false}
            />
          </Link>
          <h1 className="flex-1 truncate text-lg font-bold text-[#111827]">
            Transactions
          </h1>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1865EA] shadow-sm transition-opacity hover:opacity-90"
            aria-label="Filter by date"
          >
            <img
              src={PROVIDER_ICONS.calendar}
              alt=""
              className="size-4 object-contain brightness-0 invert"
              draggable={false}
            />
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className={cn(PROVIDER_PAGE_SHELL, "pt-4 pb-6")}>
          {!hasTransactions ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
              <EarningsEmptyIllustration variant="transactions" />
              <h2 className="text-lg font-bold text-[#111827]">No Transactions Yet</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#94A3B8]">
                Your transactions will appear here once you start earning.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {groups.map((group) => (
                <section key={group.dateKey}>
                  <h2 className="mb-2.5 text-sm font-medium text-[#94A3B8]">
                    {group.label}
                  </h2>
                  <div className={PROVIDER_DESKTOP_GRID}>
                    {group.items.map((txn) => (
                      <ProviderTransactionCard key={txn.id} transaction={txn} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
