"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ResponsiveSheet } from "@/components/responsive/primitives/ResponsiveSheet";
import { PrimaryButton } from "@/components/responsive/primitives/PrimaryButton";
import { REEL_REPORT_REASONS } from "@/mock/reels-comments";
import { cn } from "@/lib/utils";
import { RadioIndicator } from "@/components/ui/radio-indicator";

function ReportReasonOption({ active, label, description, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
        active ? "border-primary bg-[#EFF6FF]" : "border-border/60 bg-background",
      )}
    >
      <RadioIndicator selected={active} />
      <span className="min-w-0 flex-1">
        <span className="text-foreground block text-sm leading-snug font-semibold">
          {label}
        </span>
        <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
          {description}
        </span>
      </span>
    </button>
  );
}

export function ReportSheetResponsive({ open, onOpenChange, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState("");

  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedReason(null);
      setDescription("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (step === 1) {
      if (!selectedReason) {
        toast.error("Please select a reason for reporting.");
        return;
      }

      if (selectedReason === "other") {
        setStep(2);
        return;
      }

      toast.success("Report submitted. We'll review it shortly.");
      handleClose();
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a description.");
      return;
    }

    toast.success("Report submitted. We'll review it shortly.");
    handleClose();
  };

  const footerLabel =
    step === 2 ? "Submit" : selectedReason === "other" ? "Next" : "Submit";

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange?.(next);
        if (!next) onClose?.();
      }}
      title="Report"
      footer={
        <PrimaryButton fullWidth onClick={handleSubmit}>
          {footerLabel}
        </PrimaryButton>
      }
    >
      {step === 1 ? (
        <div className="space-y-3" role="radiogroup" aria-label="Report reason">
          <p className="text-foreground text-sm font-medium">
            Please select a reason for reporting
          </p>
          {REEL_REPORT_REASONS.map((reason) => (
            <ReportReasonOption
              key={reason.id}
              active={selectedReason === reason.id}
              label={reason.label}
              description={reason.description}
              onSelect={() => setSelectedReason(reason.id)}
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-foreground mb-4 text-sm">
            Please provide more details about the issue.
          </p>
          <label htmlFor="report-description" className="mb-2 block text-sm font-bold">
            Description
          </label>
          <div className="relative">
            <textarea
              id="report-description"
              value={description}
              onChange={(event) => setDescription(event.target.value.slice(0, 500))}
              placeholder="Describe the issue..."
              rows={5}
              className="border-border/70 ring-primary/20 w-full resize-none rounded-xl border bg-[#F8F9FC] p-4 pb-8 text-sm outline-none focus:ring-2"
            />
            <span className="text-muted-foreground absolute right-3 bottom-3 text-xs">
              {description.length}/500
            </span>
          </div>
        </div>
      )}
    </ResponsiveSheet>
  );
}
