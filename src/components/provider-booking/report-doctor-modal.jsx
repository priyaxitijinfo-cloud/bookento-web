"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { RadioIndicator } from "@/components/ui/radio-indicator";

const REPORT_REASONS = [
  {
    id: "inappropriate",
    title: "Inappropriate behavior",
    subtitle: "Rude, abusive or unprofessional",
  },
  {
    id: "spam",
    title: "Spam or misleading information",
    subtitle: "False info or promotional content",
  },
  {
    id: "irrelevant",
    title: "Irrelevant content",
    subtitle: "Not related to healthcare",
  },
  {
    id: "other",
    title: "Other",
    subtitle: "Please specify the issue",
  },
];

const MAX_DESCRIPTION_LENGTH = 500;

function ReportRadioOption({ active, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl py-1 text-left transition-colors"
    >
      <RadioIndicator selected={active} className="mt-0.5" />
      <span className="min-w-0">
        <span className="text-foreground block text-[15px] leading-snug font-semibold">
          {title}
        </span>
        <span className="text-muted-foreground mt-0.5 block text-sm leading-snug">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

export function ReportDoctorModal({ open, onClose, onSubmit, className }) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("other");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) {
      setStep(1);
      setReason("other");
      setDescription("");
    }
  }, [open]);

  if (!open) return null;

  const handleNext = () => {
    if (reason === "other") {
      setStep(2);
      return;
    }

    onSubmit?.({ reason, description: "" });
  };

  const handleSubmit = () => {
    onSubmit?.({ reason, description: description.trim() });
  };

  const canSubmitDetails = description.trim().length > 0;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center p-5",
        className,
      )}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close report dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-doctor-title"
        className="bg-background relative w-full max-w-[22rem] rounded-2xl px-5 pt-5 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:max-w-[28rem]"
      >
        <h2
          id="report-doctor-title"
          className="text-foreground text-center text-lg font-bold"
        >
          Report
        </h2>
        <div className="mx-auto mt-4 h-px w-full bg-[#E5E7EB]" />

        {step === 1 ? (
          <>
            <p className="text-muted-foreground mt-4 text-center text-sm leading-relaxed">
              Please select a reason for reporting.
            </p>

            <div className="mt-5 space-y-4">
              {REPORT_REASONS.map((option) => (
                <ReportRadioOption
                  key={option.id}
                  active={reason === option.id}
                  title={option.title}
                  subtitle={option.subtitle}
                  onClick={() => setReason(option.id)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="gradient-brand mt-6 h-11 w-full rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95 md:font-semibold"
            >
              Next
            </button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mt-4 text-center text-sm leading-relaxed">
              Please provide more details about the issue.
            </p>

            <div className="mt-5">
              <label
                htmlFor="report-description"
                className="text-foreground text-sm font-semibold"
              >
                Description
              </label>
              <div className="relative mt-2">
                <textarea
                  id="report-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value.slice(0, MAX_DESCRIPTION_LENGTH))
                  }
                  placeholder="Describe the issue..."
                  rows={5}
                  className={cn(
                    "border-border text-foreground placeholder:text-muted-foreground bg-background w-full resize-none rounded-xl border",
                    "focus-visible:border-primary/40 focus-visible:ring-primary/20 px-4 py-3 text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none",
                  )}
                />
                <span className="text-muted-foreground absolute right-3 bottom-3 text-xs">
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmitDetails}
              className="gradient-brand mt-6 h-11 w-full rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 md:font-semibold"
            >
              Submit Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
