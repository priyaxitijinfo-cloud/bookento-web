"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ResponsiveSheet } from "@/components/responsive/primitives/ResponsiveSheet";
import { PrimaryButton } from "@/components/responsive/primitives/PrimaryButton";
import { REEL_REPORT_REASONS } from "@/mock/reels-comments";
import { cn } from "@/lib/utils";

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
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          active ? "border-primary bg-primary" : "border-border bg-background",
        )}
        aria-hidden
      >
        {active ? <span className="size-2 rounded-full bg-background" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-foreground">{label}</span>
        <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">{description}</span>
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

  const footerLabel = step === 2 ? "Submit" : selectedReason === "other" ? "Next" : "Submit";

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange?.(next);
        if (!next) onClose?.();
      }}
      title="Report"
      footer={(
        <PrimaryButton fullWidth onClick={handleSubmit}>
          {footerLabel}
        </PrimaryButton>
      )}
    >
      {step === 1 ? (
        <div className="space-y-3" role="radiogroup" aria-label="Report reason">
          <p className="text-sm font-medium text-foreground">Please select a reason for reporting</p>
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
          <p className="mb-4 text-sm text-foreground">
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
              className="w-full resize-none rounded-xl border border-border/70 bg-[#F8F9FC] p-4 pb-8 text-sm outline-none ring-primary/20 focus:ring-2"
            />
            <span className="text-muted-foreground absolute bottom-3 right-3 text-xs">
              {description.length}/500
            </span>
          </div>
        </div>
      )}
    </ResponsiveSheet>
  );
}
