"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";

import {
  FilterActiveBar,
  FilterProviderResults,
  FilterSpecialtyChips,
} from "./filter-parts";

export function FilterMobile({
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
      mainClassName="space-y-4"
    >
      <FilterSpecialtyChips
        filters={specialtyFilters}
        activeFilter={activeSpecialty}
        onChange={onSpecialtyChange}
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
        variant="mobile"
        onResetFilters={onResetFilters}
      />
    </UserPageShell>
  );
}
