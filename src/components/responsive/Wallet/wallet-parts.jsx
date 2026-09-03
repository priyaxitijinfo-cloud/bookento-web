"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp, Plus, Wallet } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/format.utils";

export function formatWalletBalance(amount) {
  return formatCurrency(amount).replace("₹", "₹ ");
}

export function WalletTransactionRow({ txn }) {
  const isCredit = txn.type === "credit";

  return (
    <div className="flex items-center gap-3 py-3.5 max-md:gap-3.5 md:gap-5 md:py-5">
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full md:size-[54px]",
          isCredit ? "bg-[#E8F7EE]" : "bg-[#FDEBEB]",
        )}
      >
        {isCredit ? (
          <ArrowDown
            className="size-5 text-[#16A34A] md:size-[22px]"
            strokeWidth={2.5}
          />
        ) : (
          <ArrowUp className="size-5 text-[#DC2626] md:size-[22px]" strokeWidth={2.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="md:text-foreground truncate text-[15px] font-semibold text-[#111827] md:text-[17px]">
          {txn.title}
        </p>
        <p className="md:text-muted-foreground mt-0.5 truncate text-[13px] text-[#94A3B8] md:text-[14px]">
          {txn.subtitle}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-[15px] font-bold md:text-[18px]",
            isCredit ? "text-[#16A34A]" : "text-[#DC2626]",
          )}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(txn.amount)}
        </p>
        <p className="md:text-muted-foreground mt-0.5 text-[12px] text-[#94A3B8] md:mt-1 md:text-[14px]">
          {formatDate(txn.createdAt, "dd/MM/yyyy")}
        </p>
      </div>
    </div>
  );
}

export function WalletBalanceCard({ balance }) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[1.25rem] bg-no-repeat shadow-[0_8px_24px_rgba(24,101,234,0.25)] max-md:rounded-2xl md:rounded-[20px] md:bg-[url('/images/wallet-balance-bg.png')] md:bg-cover md:bg-center",
        "max-md:min-h-[158px] md:min-h-[180px]",
      )}
    >
      {/* Mobile: full card background from icons/wallet.png */}
      <Image
        src="/icons/wallet.png?v=2"
        alt=""
        fill
        sizes="(max-width: 767px) 100vw, 0px"
        className="pointer-events-none object-fill md:hidden"
        priority
        unoptimized
      />

      <div className="relative z-10 flex h-full min-h-[158px] items-stretch p-4 max-md:pr-3 md:min-h-[180px] md:p-6">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 py-0.5 max-md:mt-2 max-md:max-w-[52%] max-md:justify-start max-md:gap-1 md:gap-5">
          <div>
            <p className="text-[13px] font-medium text-white/90 md:text-sm md:text-white/85">
              Wallet Balance
            </p>
            <p className="mt-1.5 text-[1.75rem] leading-none font-semibold tracking-tight text-white md:mt-2 md:text-[2.25rem] md:font-bold">
              {formatWalletBalance(balance)}
            </p>
          </div>

          <Link
            href={ROUTES.WALLET_ADD_MONEY}
            className="md:bg-background md:text-primary inline-flex w-fit items-center gap-1 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-[#1865EA] shadow-sm transition-opacity hover:opacity-95 max-md:mt-[14px] md:gap-1.5 md:px-4 md:py-2.5 md:text-sm"
          >
            <Plus className="size-3.5 md:size-4" strokeWidth={2.5} />
            Add Money
          </Link>
        </div>

        {/* Desktop/tablet: separate illustration */}
        <div className="ml-2 hidden items-center gap-3 self-stretch md:ml-6 md:flex md:gap-5">
          <div
            className="h-[calc(100%-8px)] self-center border-l border-dotted border-white/45"
            aria-hidden
          />
          <div className="flex shrink-0 items-end justify-center self-end pb-1">
            <Image
              src="/images/wallet-balance.png"
              alt=""
              width={140}
              height={140}
              className="h-[120px] w-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletEmptyStateMobile({
  title = "No Transactions Yet",
  description = (
    <>
      <span className="block">You haven&apos;t made any transactions yet.</span>
      <span className="block">Add money to your wallet to see activity here.</span>
    </>
  ),
  className,
}) {
  return (
    <IllustrationEmptyState
      src="/icons/01.png"
      title={title}
      description={description}
      className={className}
    />
  );
}

export function WalletTransactionsSection({ transactions, variant = "mobile" }) {
  const isDesktop = variant === "desktop";

  const sectionTitle = isDesktop ? null : (
    <div className="mb-1 flex items-center justify-between gap-3 max-md:mb-2 md:mb-1">
      <h2 className="md:text-foreground text-base font-semibold text-[#111827]">
        Recent Transactions
      </h2>
      <Link
        href={ROUTES.WALLET_TRANSACTIONS}
        className="text-primary inline-flex shrink-0 items-center gap-0.5 text-[13px] font-semibold transition-opacity hover:opacity-80 md:hidden"
      >
        See all
        <ArrowRight className="size-3.5" strokeWidth={2.5} />
      </Link>
    </div>
  );

  if (transactions.length === 0) {
    return (
      <>
        <WalletEmptyStateMobile className="min-h-[calc(100dvh-20rem)] px-0 md:hidden" />
        <div className="hidden md:block">
          {sectionTitle}
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
      </>
    );
  }

  return (
    <div>
      {sectionTitle}
      <div
        className={cn(
          "divide-y",
          isDesktop
            ? "divide-border/70 px-5 md:px-6"
            : "md:divide-border/70 md:bg-card divide-[#E9E9E9] max-md:bg-transparent max-md:px-0 md:rounded-2xl md:px-5",
        )}
      >
        {transactions.map((txn) => (
          <WalletTransactionRow key={txn.id} txn={txn} />
        ))}
      </div>
    </div>
  );
}
