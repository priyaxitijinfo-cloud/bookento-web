"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plane,
} from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getEarningsReportFileName } from "@/mock/earnings";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, getInitials } from "@/utils/format.utils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function EarningsSectionHeader({ title, href, onSeeAll }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-4 w-1 shrink-0 rounded-full bg-[#1865EA]" aria-hidden />
        <h2 className="truncate text-base font-bold text-[#1F2937]">{title}</h2>
      </div>
      {onSeeAll ? (
        <button
          type="button"
          onClick={onSeeAll}
          className="shrink-0 text-sm font-semibold text-[#1865EA] hover:underline"
        >
          See all &gt;
        </button>
      ) : href ? (
        <Link
          href={href}
          className="shrink-0 text-sm font-semibold text-[#1865EA] hover:underline"
        >
          See all &gt;
        </Link>
      ) : null}
    </div>
  );
}

export function EarningsEmptyIllustration({ variant = "earnings" }) {
  return (
    <div className="relative mx-auto mb-5 flex h-44 w-52 items-end justify-center">
      <span className="absolute top-6 left-6 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-10 right-8 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute top-16 left-12 size-1 rounded-full bg-[#93C5FD]" />
      <span className="absolute right-10 bottom-24 size-1.5 rounded-full bg-[#BFDBFE]" />

      {variant === "transactions" ? (
        <>
          <Plane
            className="absolute top-4 right-6 size-7 rotate-12 text-[#1865EA]"
            fill="currentColor"
            strokeWidth={0}
          />
          <svg
            className="absolute top-10 right-10 text-[#93C5FD]"
            width="36"
            height="28"
            viewBox="0 0 36 28"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 26C8 18 14 10 22 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              strokeLinecap="round"
            />
          </svg>
        </>
      ) : null}

      <div className="absolute bottom-8 left-4 flex flex-col items-center">
        <div className="mb-0.5 flex gap-0.5">
          <span className="h-5 w-2.5 rounded-t-full bg-[#4ADE80]" />
          <span className="h-6 w-2.5 rounded-t-full bg-[#22C55E]" />
        </div>
        <div className="h-4 w-6 rounded-b-md bg-[#BFDBFE]" />
      </div>

      <div className="relative z-10 mb-2">
        <Image
          src="/icons/wallet.png"
          alt=""
          width={120}
          height={120}
          className="drop-shadow-md"
          unoptimized
        />
      </div>

      {variant === "earnings" ? (
        <div className="absolute right-6 bottom-4 flex -space-x-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            $
          </span>
          <span className="mt-3 flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
            $
          </span>
        </div>
      ) : (
        <span className="absolute right-8 bottom-5 flex size-9 items-center justify-center rounded-full bg-[#1865EA] text-xs font-bold text-white shadow-sm ring-2 ring-white">
          ₹
        </span>
      )}
    </div>
  );
}

export function ProviderTransactionCard({ transaction, compact = false }) {
  if (!transaction) return null;

  const tone = transaction.avatarTone || {
    bg: "bg-[#E8F1FF]",
    text: "text-[#1865EA]",
  };

  return (
    <article className="rounded-2xl border border-[#EEF2F7] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            tone.bg,
            tone.text,
          )}
          aria-hidden
        >
          {getInitials(transaction.userName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-[#111827]">
                {transaction.userName}
              </p>
              <p className="mt-0.5 truncate text-sm text-[#94A3B8]">
                {transaction.serviceName}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-semibold text-[#1865EA]">
                {formatCurrency(transaction.grossAmount)}
              </p>
              <p className="mt-0.5 text-sm font-medium text-[#EF4444]">
                -{formatCurrency(transaction.commission)}
              </p>
            </div>
          </div>

          {!compact ? (
            <div className="mt-3 border-t border-[#F1F5F9] pt-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-[#94A3B8]">
                  {transaction.scheduledLabel || transaction.displayDate}
                </p>
                <p className="text-sm font-bold text-[#111827]">
                  {formatCurrency(transaction.netEarnings)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-[#94A3B8]">
                {transaction.scheduledLabel ||
                  transaction.displayDate ||
                  formatDate(transaction.createdAt, "dd MMM yyyy")}
              </p>
              <p className="text-sm font-bold text-[#111827]">
                {formatCurrency(transaction.netEarnings)}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

const PAYOUT_STATUS_STYLES = {
  completed: "bg-[#E8F7EE] text-[#16A34A]",
  processing: "bg-[#FFF7E8] text-[#D97706]",
  pending: "bg-[#F1F5F9] text-[#64748B]",
  failed: "bg-[#FEE2E2] text-[#EF4444]",
};

export function ProviderPayoutCard({ payout }) {
  if (!payout) return null;

  const statusKey = payout.status || "completed";
  const statusClass = PAYOUT_STATUS_STYLES[statusKey] || PAYOUT_STATUS_STYLES.completed;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EEF2F7] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-[#111827]">
            {payout.payoutCode || payout.id}
          </p>
          <p className="mt-1 text-xs text-[#94A3B8]">
            TXN: {payout.txnId || payout.transactionId}
          </p>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {formatDate(payout.createdAt, "dd MMM yyyy")}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            statusClass,
          )}
        >
          {payout.statusLabel || statusKey}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#1865EA]">
            <Building2 className="size-4" />
          </span>
          <p className="truncate text-sm font-medium text-[#374151]">
            {payout.bankLabel ||
              (payout.upiId
                ? `UPI: ${payout.upiId}`
                : `Bank: ${payout.bankName || ""} ${payout.bankMask || payout.bankAccount || ""}`.trim())}
          </p>
        </div>
        <p className="shrink-0 text-[15px] font-bold text-[#111827]">
          {formatCurrency(payout.amount)}
        </p>
      </div>
    </article>
  );
}

export function ServiceBookingChart({
  data = [],
  periodLabel = "April 2026",
  periods = [],
  onPeriodChange,
  activeIndex,
}) {
  const [open, setOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(
    typeof activeIndex === "number" ? activeIndex : Math.max(0, data.length - 3),
  );

  const chart = useMemo(() => {
    if (!data.length) return null;

    const width = 320;
    const height = 180;
    const padX = 28;
    const padTop = 20;
    const padBottom = 28;
    const plotW = width - padX * 2;
    const plotH = height - padTop - padBottom;
    const maxY = 100;

    const points = data.map((item, index) => {
      const x =
        data.length === 1 ? width / 2 : padX + (index / (data.length - 1)) * plotW;
      const y = padTop + plotH - (Math.min(item.value, maxY) / maxY) * plotH;
      return { ...item, x, y, index };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`;

    const yTicks = [0, 20, 40, 60, 80, 100];

    return {
      width,
      height,
      padX,
      padTop,
      padBottom,
      plotH,
      points,
      linePath,
      areaPath,
      yTicks,
    };
  }, [data]);

  if (!chart) return null;

  const active = chart.points[Math.min(hoverIndex, chart.points.length - 1)];

  return (
    <section className="rounded-2xl border border-[#EEF2F7] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#111827]">Service Booking</h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#374151] transition-colors hover:bg-[#F8FAFC]"
          >
            {periodLabel}
            <ChevronDown className="size-3.5 text-[#94A3B8]" />
          </button>
          {open && periods.length > 0 ? (
            <div className="absolute top-full right-0 z-20 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
              {periods.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => {
                    onPeriodChange?.(period);
                    setOpen(false);
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-[#F4F7FF]",
                    period.label === periodLabel
                      ? "bg-[#E8F1FF] text-[#1865EA]"
                      : "text-[#374151]",
                  )}
                >
                  {period.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Service booking chart"
        >
          <defs>
            <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1865EA" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1865EA" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {chart.yTicks.map((tick) => {
            const y = chart.padTop + chart.plotH - (tick / 100) * chart.plotH;
            return (
              <g key={tick}>
                <line
                  x1={chart.padX}
                  x2={chart.width - chart.padX}
                  y1={y}
                  y2={y}
                  stroke="#E8EEF8"
                  strokeWidth="1"
                />
                <text
                  x={chart.padX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[#94A3B8]"
                  fontSize="9"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={chart.areaPath} fill="url(#bookingFill)" />
          <path
            d={chart.linePath}
            fill="none"
            stroke="#1865EA"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {active ? (
            <>
              <line
                x1={active.x}
                x2={active.x}
                y1={chart.padTop}
                y2={chart.padTop + chart.plotH}
                stroke="#1865EA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              <circle
                cx={active.x}
                cy={active.y}
                r="5"
                fill="#1865EA"
                stroke="white"
                strokeWidth="2"
              />
            </>
          ) : null}

          {chart.points.map((point) => (
            <text
              key={point.month}
              x={point.x}
              y={chart.height - 8}
              textAnchor="middle"
              className="fill-[#94A3B8]"
              fontSize="10"
            >
              {point.month}
            </text>
          ))}

          {chart.points.map((point) => (
            <rect
              key={`hit-${point.month}`}
              x={point.x - 18}
              y={chart.padTop}
              width="36"
              height={chart.plotH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(point.index)}
              onFocus={() => setHoverIndex(point.index)}
              onClick={() => setHoverIndex(point.index)}
            />
          ))}
        </svg>

        {active ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-[#111827] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-white shadow-md"
            style={{
              left: `${(active.x / chart.width) * 100}%`,
              top: `${(active.y / chart.height) * 100}%`,
              marginTop: "-10px",
            }}
          >
            Bookings {active.bookings?.toLocaleString("en-IN") ?? active.value}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function DownloadReportModal({ open, onOpenChange }) {
  const [year, setYear] = useState(2026);
  const [monthIndex, setMonthIndex] = useState(1);

  const handleDownload = () => {
    const fileName = getEarningsReportFileName(year, monthIndex);
    toast.success(`Downloading ${fileName}`);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="max-w-[340px] gap-0 rounded-2xl border-0 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.18)] sm:max-w-[360px]"
      >
        <DialogTitle className="mb-5 text-center text-lg font-bold text-[#111827]">
          Download Report
        </DialogTitle>

        <div className="mb-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setYear((value) => value - 1)}
            className="flex size-9 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#374151] transition-colors hover:bg-[#E2E8F0]"
            aria-label="Previous year"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-[4rem] text-center text-base font-bold text-[#111827]">
            {year}
          </span>
          <button
            type="button"
            onClick={() => setYear((value) => value + 1)}
            className="flex size-9 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#374151] transition-colors hover:bg-[#E2E8F0]"
            aria-label="Next year"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2.5">
          {MONTHS.map((month, index) => {
            const selected = index === monthIndex;
            return (
              <button
                key={month}
                type="button"
                onClick={() => setMonthIndex(index)}
                className={cn(
                  "h-10 rounded-xl text-sm font-semibold transition-colors",
                  selected
                    ? "bg-[#1865EA] text-white"
                    : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F8FAFC]",
                )}
              >
                {month}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            className="h-11 rounded-xl bg-[#F1F5F9] text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E2E8F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="h-11 rounded-xl bg-[#1865EA] text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Download
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VerifiedCheck() {
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-[#16A34A] text-white">
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  );
}
