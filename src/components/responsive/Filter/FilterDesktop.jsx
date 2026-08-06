"use client";

import { SlidersHorizontal } from "lucide-react";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";

import {
  FilterActiveBar,
  FilterPanelHeader,
  FilterProviderResults,
  FilterSpecialtyChips,
} from "./filter-parts";

export function FilterDesktop({
  title,
  backHref,
  backLabel,
  specialtyFilters,
  activeSpecialty,
  onSpecialtyChange,
  sheetFilters,
  onRemoveSheetFilter,
  onClearSheetFilters,
  providers,
  onResetFilters,
  onMoreFilters,
}) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={backHref}
          backLabel={backLabel}
          currentLabel={title}
        />
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <ResponsiveCard className="sticky top-24 hidden space-y-4 lg:block">
          <FilterPanelHeader />
          <FilterSpecialtyChips
            filters={specialtyFilters}
            activeFilter={activeSpecialty}
            onChange={onSpecialtyChange}
            contained
          />
          {onMoreFilters ? (
            <button
              type="button"
              onClick={onMoreFilters}
              className="text-primary flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-surface-page"
            >
              <SlidersHorizontal className="size-4" />
              More filters
            </button>
          ) : null}
        </ResponsiveCard>

        <div className="min-w-0 space-y-6">
          <div className="lg:hidden">
            <FilterSpecialtyChips
              filters={specialtyFilters}
              activeFilter={activeSpecialty}
              onChange={onSpecialtyChange}
            />
          </div>

          {sheetFilters ? (
            <FilterActiveBar
              filters={sheetFilters}
              onRemove={onRemoveSheetFilter}
              onClearAll={onClearSheetFilters}
            />
          ) : null}

          <FilterProviderResults
            providers={providers}
            variant="desktop"
            onResetFilters={onResetFilters}
          />
        </div>
      </div>
    </DesktopLayout>
  );
}
