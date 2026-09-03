"use client";

import { X } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadioIndicator } from "@/components/ui/radio-indicator";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { useIsMobile } from "@/hooks/responsive/use-media-query";
import { cn } from "@/lib/utils";

function BranchRadioIndicator({ active }) {
  return <RadioIndicator selected={active} />;
}

function BranchOption({ branch, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(branch)}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors md:p-4",
        selected
          ? "border-[#B5CEF8] bg-[#EEF4FD] shadow-[0_0_0_1px_rgba(24,101,234,0.08)]"
          : "border-border/70 bg-background hover:border-primary/20",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center md:size-10">
        <LocationIcon
          className={cn(
            "size-[22px] md:size-6",
            selected ? "text-primary" : "text-[#4D5972]",
          )}
          strokeWidth={2}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-semibold md:text-base">
          {branch.name}
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed md:text-sm">
          {branch.address}
        </p>
      </div>
      <BranchRadioIndicator active={selected} />
    </button>
  );
}

function BranchPickerSheet({ open, onOpenChange, selectedBranchId, onSelect }) {
  if (!open) return null;

  const handleClose = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close branch picker"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-picker-title-mobile"
        className="bg-background relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[1.25rem] shadow-[0_-8px_32px_rgba(15,23,42,0.16)]"
      >
        <div className="flex justify-center pt-3">
          <span className="bg-border/80 h-1 w-10 rounded-full" aria-hidden />
        </div>

        <div className="flex items-center justify-between px-4 pt-1 pb-0">
          <h2
            id="branch-picker-title-mobile"
            className="text-foreground text-base font-semibold"
          >
            Select Branch
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="scrollbar-hide flex-1 space-y-2.5 overflow-y-auto px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          {PROVIDER_BRANCHES.map((branch) => (
            <BranchOption
              key={branch.id}
              branch={branch}
              selected={selectedBranchId === branch.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BranchPickerModal({ open, onOpenChange, selectedBranchId, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <div className="border-border/60 border-b px-5 py-4 text-left">
          <DialogTitle>Select Branch</DialogTitle>
        </div>

        <div className="max-h-[min(70vh,28rem)] space-y-2.5 overflow-y-auto p-4">
          {PROVIDER_BRANCHES.map((branch) => (
            <BranchOption
              key={branch.id}
              branch={branch}
              selected={selectedBranchId === branch.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BranchPickerDialog({ open, onOpenChange, selectedBranchId, onSelect }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <BranchPickerSheet
        open={open}
        onOpenChange={onOpenChange}
        selectedBranchId={selectedBranchId}
        onSelect={onSelect}
      />
    );
  }

  return (
    <BranchPickerModal
      open={open}
      onOpenChange={onOpenChange}
      selectedBranchId={selectedBranchId}
      onSelect={onSelect}
    />
  );
}
