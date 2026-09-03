"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { categories } from "@/mock/categories";
import { cn } from "@/lib/utils";

const VISIT_OPTIONS = [
  { value: "all", label: "All Visit Types" },
  { value: "in_clinic", label: "In Clinic" },
  { value: "home_visit", label: "Home Visit" },
  { value: "online", label: "Online" },
];

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors",
        active
          ? "profile-tab-active !text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)]"
          : "bg-card text-muted-foreground ring-border hover:bg-background hover:text-foreground hover:ring-primary/30 ring-1 ring-inset",
      )}
    >
      {children}
    </button>
  );
}

function FilterSection({ title, children }) {
  return (
    <section className="space-y-3">
      <p className="text-foreground text-[15px] leading-none font-semibold">{title}</p>
      {children}
    </section>
  );
}

function FilterFields({ draft, setDraft }) {
  return (
    <div className="space-y-6">
      <FilterSection title="Visit Type">
        <div className="flex flex-wrap gap-2">
          {VISIT_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              active={(draft.visitType || "all") === option.value}
              onClick={() =>
                setDraft((current) => ({ ...current, visitType: option.value }))
              }
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={!draft.categoryId}
            onClick={() => setDraft((current) => ({ ...current, categoryId: null }))}
          >
            All Categories
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              active={draft.categoryId === category.id}
              onClick={() =>
                setDraft((current) => ({ ...current, categoryId: category.id }))
              }
            >
              {category.name}
            </FilterChip>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

export function ProvidersFilterSheet({
  open,
  onClose,
  visitType,
  categoryId,
  onApply,
}) {
  const [draft, setDraft] = useState({
    visitType: visitType || "all",
    categoryId: categoryId || null,
  });

  useEffect(() => {
    if (open) {
      setDraft({
        visitType: visitType || "all",
        categoryId: categoryId || null,
      });
    }
  }, [open, visitType, categoryId]);

  if (!open) return null;

  const handleApply = () => {
    onApply({
      visitType: draft.visitType === "all" ? null : draft.visitType,
      categoryId: draft.categoryId,
    });
    onClose();
  };

  const handleReset = () => {
    setDraft({ visitType: "all", categoryId: null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] md:backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close filters"
      />

      <div className="bg-background relative flex w-full max-w-lg flex-col rounded-t-[1.375rem] shadow-[0_-8px_40px_rgba(15,23,42,0.12)] md:max-h-[85vh] md:rounded-2xl md:shadow-2xl">
        <div className="flex shrink-0 justify-center pt-3 pb-1 md:hidden">
          <span aria-hidden className="h-1 w-[2.75rem] rounded-full bg-[#D1D5DB]" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2 pb-5 md:border-b md:px-6 md:py-4">
          <h2 className="text-foreground text-[1.125rem] leading-none font-bold md:text-lg">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-muted text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="size-[1.125rem]" strokeWidth={2.25} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-2 md:px-6 md:py-5">
          <FilterFields draft={draft} setDraft={setDraft} />
        </div>

        <div className="safe-bottom shrink-0 space-y-3 px-5 pt-5 pb-6 md:border-t md:px-6 md:py-5">
          <button
            type="button"
            onClick={handleApply}
            className="gradient-brand h-[3.25rem] w-full rounded-xl text-[15px] font-medium text-white transition-opacity hover:opacity-95 md:font-semibold"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground h-10 w-full text-sm font-medium transition-colors"
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}

export function hasActiveProviderFilters({ visitTypeFilter, categoryFilter }) {
  return Boolean(visitTypeFilter || categoryFilter);
}
