"use client";

import { useRouter } from "next/navigation";
import { Heart, Share2 } from "lucide-react";

import { ProviderBookingSummaryBar } from "@/components/provider-booking/provider-booking-summary";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";

import {
  DatePickerRow,
  MonthNavigator,
  PackageInfoCard,
  PackageSectionPanel,
  PackageSectionTitle,
  TimePickerGrid,
  VisitTypePicker,
} from "./package-detail-parts";

function DesktopPackageHeader({ onToggleSaved, onShare, saved }) {
  return (
    <div className="mx-auto flex h-[68px] w-full max-w-[90rem] items-center justify-between gap-6 px-6 lg:px-8">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Package</p>
        <h1 className="truncate text-xl font-semibold text-foreground">Package Details</h1>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onToggleSaved}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-surface-page"
          aria-label={saved ? "Unsave package" : "Save package"}
        >
          <Heart className={cn("size-5", saved && "fill-rose-500 text-rose-500")} />
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-surface-page"
          aria-label="Share package"
        >
          <Share2 className="size-5" />
        </button>
      </div>
    </div>
  );
}

export function PackageDetailDesktop({
  pkg,
  theme,
  flowProvider,
  categorySlug,
  visitType,
  setVisitType,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  saved,
  onToggleSaved,
  onShare,
  dates,
  monthLabel,
  dateScrollRef,
  handleDateScroll,
  handlePrevDates,
  handleNextDates,
  dateScrollEdges,
}) {
  const router = useRouter();

  return (
    <DesktopLayout
      header={<DesktopPackageHeader saved={saved} onToggleSaved={onToggleSaved} onShare={onShare} />}
      maxWidth="wide"
    >
      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <PackageInfoCard pkg={pkg} theme={theme} />

          <section>
            <PackageSectionTitle>Visit type</PackageSectionTitle>
            <VisitTypePicker visitType={visitType} onSelect={setVisitType} />
          </section>

          <section>
            <PackageSectionTitle
              action={(
                <MonthNavigator
                  monthLabel={monthLabel}
                  onPrev={handlePrevDates}
                  onNext={handleNextDates}
                  disablePrev={!dateScrollEdges.canPrev}
                  disableNext={!dateScrollEdges.canNext}
                />
              )}
            >
              Select Date
            </PackageSectionTitle>
            <PackageSectionPanel>
              <DatePickerRow
                dates={dates}
                selectedDate={scheduledDate}
                onSelect={setScheduledDate}
                scrollRef={dateScrollRef}
                onScroll={handleDateScroll}
              />
            </PackageSectionPanel>
          </section>

          <section>
            <PackageSectionTitle>Select Time</PackageSectionTitle>
            <PackageSectionPanel>
              <TimePickerGrid
                selectedTime={scheduledTime}
                onSelect={setScheduledTime}
                columns="grid-cols-4 sm:grid-cols-6 lg:grid-cols-8"
              />
            </PackageSectionPanel>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <ResponsiveCard>
            <h3 className="text-lg font-semibold text-foreground">Package summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold text-primary">{formatCurrency(pkg.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Original</span>
                <span className="text-muted-foreground line-through">{formatCurrency(pkg.originalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-semibold text-emerald-600">{pkg.discountPercent}% off</span>
              </div>
            </div>
          </ResponsiveCard>

          <ResponsiveCard className="!p-0 overflow-hidden">
            <ProviderBookingSummaryBar
              provider={flowProvider}
              bookingPackage={pkg}
              categorySlug={categorySlug}
              actionLabel="Continue"
              attachedFooter
            />
          </ResponsiveCard>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-page"
          >
            Go back
          </button>
        </aside>
      </div>
    </DesktopLayout>
  );
}
