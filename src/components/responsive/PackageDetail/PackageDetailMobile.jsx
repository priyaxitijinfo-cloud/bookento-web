"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";

import { ProviderBookingSummaryBar } from "@/components/provider-booking/provider-booking-summary";
import { cn } from "@/lib/utils";

import {
  DatePickerRow,
  MonthNavigator,
  PackageInfoCard,
  PackageSectionPanel,
  PackageSectionTitle,
  TimePickerGrid,
  VisitTypePicker,
} from "./package-detail-parts";

export function PackageDetailMobile({
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
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-surface-page pb-36">
        <header className="safe-top sticky top-0 z-30 border-b border-border/60 bg-background">
          <div className="flex h-14 w-full items-center gap-2 px-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="min-w-0 flex-1 text-center text-base font-bold">Packages Details</h1>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={onToggleSaved}
                className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                aria-label={saved ? "Unsave package" : "Save package"}
              >
                <Heart className={cn("size-5", saved && "fill-rose-500 text-rose-500")} />
              </button>
              <button
                type="button"
                onClick={onShare}
                className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                aria-label="Share package"
              >
                <Share2 className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full space-y-5 px-4 py-4">
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
                columns="grid-cols-4"
              />
            </PackageSectionPanel>
          </section>
        </main>

        <ProviderBookingSummaryBar
          flat
          provider={flowProvider}
          bookingPackage={pkg}
          categorySlug={categorySlug}
          actionLabel="Continue"
        />
      </div>
    </div>
  );
}
