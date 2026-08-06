"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";

import {
  FilterActiveBar,
  FilterProviderResults,
  FilterSpecialtyChips,
} from "./filter-parts";

export function FilterTablet({
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
}) {
  return (
    <UserPageShell
      title={title}
      backHref={backHref}
      backLabel={backLabel}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="mx-auto max-w-3xl space-y-4"
    >
      <FilterSpecialtyChips
        filters={specialtyFilters}
        activeFilter={activeSpecialty}
        onChange={onSpecialtyChange}
        contained
      />
      {sheetFilters ? (
        <FilterActiveBar
          filters={sheetFilters}
          onRemove={onRemoveSheetFilter}
          onClearAll={onClearSheetFilters}
        />
      ) : null}
      <FilterProviderResults
        providers={providers}
        variant="tablet"
        onResetFilters={onResetFilters}
      />
    </UserPageShell>
  );
}
