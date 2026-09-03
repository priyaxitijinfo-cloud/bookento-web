"use client";

import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";

import { ProviderBookingSummaryBar } from "@/components/provider-booking/provider-booking-summary";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PAGE_SHELL_CLASS_TALL } from "@/lib/layout/page-layout.constants";
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
    <div className={cn(PAGE_SHELL_CLASS_TALL, "md:bg-surface-page")}>
      <div className="md:bg-surface-page mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-36 md:max-w-5xl md:pb-32">
        <MobileHeader
          mobileOnly
          title="Packages Details"
          titleCentered
          showBack
          onBack={() => router.back()}
          rightAction={
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={onToggleSaved}
                className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
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
                className="text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label="Share package"
              >
                <Share2 className="size-5" />
              </button>
            </div>
          }
        />

        <main className="w-full flex-1 space-y-5 px-4 py-4">
          <PackageInfoCard pkg={pkg} theme={theme} />

          <section>
            <PackageSectionTitle>Visit type</PackageSectionTitle>
            <VisitTypePicker visitType={visitType} onSelect={setVisitType} />
          </section>

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
