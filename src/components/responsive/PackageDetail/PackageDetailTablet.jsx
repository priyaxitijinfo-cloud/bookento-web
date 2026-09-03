"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";

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

export function PackageDetailTablet({
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
    <div className="min-h-dvh bg-[#ECEEF2]">
      <div className="bg-surface-page mx-auto flex min-h-dvh w-full max-w-5xl flex-col pb-32">
        <header className="safe-top border-border/60 bg-background sticky top-0 z-30 border-b">
          <div className="flex h-14 w-full items-center gap-2 px-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-foreground hover:bg-muted flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="min-w-0 flex-1 text-base font-semibold md:text-left md:font-bold">
              Packages Details
            </h1>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={onToggleSaved}
                className="text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label={saved ? "Unsave package" : "Save package"}
              >
                <HeroHeartIcon
                  tone="dark"
                  filled={saved}
                  className="text-foreground size-5"
                />
              </button>
              <button
                type="button"
                onClick={onShare}
                className="text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
                aria-label="Share package"
              >
                <Share2 className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="w-full flex-1 space-y-6 px-6 py-6">
          <PackageInfoCard pkg={pkg} theme={theme} />

          <div className="grid gap-6 md:grid-cols-2">
            <section>
              <PackageSectionTitle>Visit type</PackageSectionTitle>
              <VisitTypePicker visitType={visitType} onSelect={setVisitType} />
            </section>

            <section>
              <PackageSectionTitle>Select Time</PackageSectionTitle>
              <PackageSectionPanel>
                <TimePickerGrid
                  selectedTime={scheduledTime}
                  onSelect={setScheduledTime}
                  columns="grid-cols-4 md:grid-cols-4"
                />
              </PackageSectionPanel>
            </section>
          </div>

          <section>
            <PackageSectionTitle
              action={
                <MonthNavigator
                  monthLabel={monthLabel}
                  onPrev={handlePrevDates}
                  onNext={handleNextDates}
                  disablePrev={!dateScrollEdges.canPrev}
                  disableNext={!dateScrollEdges.canNext}
                />
              }
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
