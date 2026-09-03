"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  BookingDateRangeSheet,
  isAppointmentInDateRange,
} from "@/components/appointments/booking-date-range-sheet";
import { UserPageShell } from "@/components/layout/user-page-shell";
import {
  WalletTransactionRow,
  WalletEmptyStateMobile,
} from "@/components/responsive/Wallet/wallet-parts";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { walletTransactions } from "@/mock/users";
import { getLocalDateKey } from "@/utils/format.utils";

function TransactionsCalendarButton({ active, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Filter by date"
      aria-pressed={active}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-colors max-md:-mr-1",
        active ? "bg-[#E4EEFF] text-[#1865EA]" : "text-[#1865EA] hover:bg-[#F3F4F6]",
      )}
    >
      <img
        src="/icons/calender01.svg"
        alt=""
        className="size-5"
        aria-hidden
        draggable={false}
      />
    </button>
  );
}

export default function WalletTransactionsPage() {
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const filteredTransactions = useMemo(() => {
    const list = walletTransactions.filter((txn) => {
      const dateKey = getLocalDateKey(txn.createdAt) || txn.createdAt?.slice(0, 10);
      return isAppointmentInDateRange(dateKey, dateRange);
    });

    return [...list].sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    );
  }, [dateRange]);

  const hasDateFilter = Boolean(dateRange?.start);

  return (
    <>
      <UserPageShell
        title="Transactions"
        backHref={ROUTES.WALLET}
        backLabel="Back to Wallet"
        showBottomNav={false}
        containerVariant="browseWithBreadcrumb"
        className="bg-surface-page md:bg-surface-page max-md:!pb-6"
        mainClassName="max-md:!pt-1 max-md:pb-6"
        rightAction={
          <div className="md:hidden">
            <TransactionsCalendarButton
              active={hasDateFilter}
              onOpen={() => setDateRangeOpen(true)}
            />
          </div>
        }
      >
        {/* Mobile transactions list */}
        <div className="md:hidden">
          {filteredTransactions.length === 0 ? (
            <WalletEmptyStateMobile
              title={hasDateFilter ? "No Transactions Yet" : undefined}
              description={
                hasDateFilter
                  ? "No transactions found for the selected dates."
                  : undefined
              }
            />
          ) : (
            <div className="divide-y divide-[#E9E9E9]">
              {filteredTransactions.map((txn) => (
                <WalletTransactionRow key={txn.id} txn={txn} />
              ))}
            </div>
          )}
        </div>

        {/* Desktop/tablet: keep a simple list (route is mobile-led) */}
        <div className="hidden md:block">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-bold">All Transactions</h2>
            <button
              type="button"
              onClick={() => toast.message("Date filter is available on mobile")}
              className="text-primary text-sm font-semibold"
            >
              Filter
            </button>
          </div>
          <div className="divide-border/70 bg-card divide-y rounded-2xl px-5">
            {walletTransactions.map((txn) => (
              <WalletTransactionRow key={txn.id} txn={txn} />
            ))}
          </div>
        </div>
      </UserPageShell>

      <BookingDateRangeSheet
        open={dateRangeOpen}
        onClose={() => setDateRangeOpen(false)}
        value={dateRange}
        onApply={setDateRange}
      />
    </>
  );
}
