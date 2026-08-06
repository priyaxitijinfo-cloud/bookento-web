"use client";

import { Check } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { cn } from "@/lib/utils";

export function BranchPickerDialog({ open, onOpenChange, selectedBranchId, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-border/60 border-b px-5 py-4 text-left">
          <DialogTitle>Select Branch</DialogTitle>
        </DialogHeader>

        <div className="max-h-[min(70vh,28rem)] space-y-2.5 overflow-y-auto p-4">
          {PROVIDER_BRANCHES.map((branch) => {
            const selected = selectedBranchId === branch.id;

            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => onSelect(branch)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                  selected
                    ? "border-[#C3F4DC] bg-[#F7FFFB]"
                    : "border-border bg-background hover:border-primary/20",
                )}
              >
                <LocationIcon
                  className={cn(
                    "size-5 shrink-0",
                    selected ? "text-emerald-500" : "text-muted-foreground",
                  )}
                  strokeWidth={2}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{branch.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{branch.address}</p>
                </div>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    selected ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-background",
                  )}
                  aria-hidden
                >
                  {selected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
