"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Plus, Wallet } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/format.utils";

export function formatWalletBalance(amount) {
  return formatCurrency(amount).replace("₹", "₹ ");
}

export function WalletTransactionRow({ txn }) {
  const isCredit = txn.type === "credit";

  return (
    <div className="flex items-center gap-4 py-4 md:gap-5 md:py-5">
      <div
        className={cn(
          "flex size-[46px] shrink-0 items-center justify-center rounded-full md:size-[54px]",
          isCredit ? "bg-[#E8F7EE]" : "bg-[#FDEBEB]",
        )}
      >
        {isCredit ? (
          <ArrowDown className="size-[22px] text-[#16A34A]" strokeWidth={2.5} />
        ) : (
          <ArrowUp className="size-[22px] text-[#DC2626]" strokeWidth={2.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-foreground md:text-[17px]">{txn.title}</p>
        <p className="mt-0.5 truncate text-[13px] text-muted-foreground md:text-[14px]">{txn.subtitle}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className={cn("text-[16px] font-bold md:text-[18px]", isCredit ? "text-[#16A34A]" : "text-[#DC2626]")}>
          {isCredit ? "+" : "-"}
          {formatCurrency(txn.amount)}
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground md:text-[14px]">
          {formatDate(txn.createdAt, "dd/MM/yyyy")}
        </p>
      </div>
    </div>
  );
}

export function WalletBalanceCard({ balance }) {
  return (
    <div
      className="relative isolate overflow-hidden rounded-[20px] bg-cover bg-center bg-no-repeat shadow-[0_8px_24px_rgba(24,101,234,0.25)]"
      style={{ backgroundImage: "url('/images/wallet-balance-bg.png')" }}
    >
      <div className="relative z-10 flex min-h-[168px] items-stretch p-5 md:min-h-[180px] md:p-6">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
          <div>
            <p className="text-sm text-white/85">Wallet Balance</p>
            <p className="mt-2 text-[2rem] font-bold leading-none tracking-tight text-white md:text-[2.25rem]">
              {formatWalletBalance(balance)}
            </p>
          </div>

          <Link
            href={ROUTES.WALLET_ADD_MONEY}
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-background px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-opacity hover:opacity-95"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Add Money
          </Link>
        </div>

        <div className="ml-4 flex items-center gap-4 md:ml-6 md:gap-5">
          <div className="hidden h-[calc(100%-8px)] border-l border-dotted border-white/45 sm:block" aria-hidden />
          <div className="flex shrink-0 items-end justify-center self-end pb-1">
            <Image
              src="/images/wallet-balance.png"
              alt=""
              width={140}
              height={140}
              className="h-[100px] w-auto object-contain md:h-[120px]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletTransactionsSection({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div>
        <h2 className="mb-1 text-base font-bold text-foreground md:text-lg">Recent Transactions</h2>
        <EmptyState
          icon={Wallet}
          title="No transactions yet"
          description="Add money to your wallet or complete a booking to see activity here."
          actionLabel="Add Money"
          onAction={() => {
            window.location.href = ROUTES.WALLET_ADD_MONEY;
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-base font-bold text-foreground md:text-lg">Recent Transactions</h2>
      <div className="divide-y divide-border/70 rounded-2xl bg-card px-5 md:px-6">
        {transactions.map((txn) => (
          <WalletTransactionRow key={txn.id} txn={txn} />
        ))}
      </div>
    </div>
  );
}
