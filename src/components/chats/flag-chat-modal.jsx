"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export const FLAG_REASONS = [
  { id: "disrespectful", label: "Disrespectful behavior" },
  { id: "inappropriate", label: "Inappropriate communication" },
  { id: "harassment", label: "Harassment or bullying" },
  { id: "spam", label: "Spam or unwanted messages" },
  { id: "hate_speech", label: "Hate speech or discrimination" },
];

const MAX_DESCRIPTION_LENGTH = 500;

export function FlagChatModal({ open, onClose, onSubmit, className }) {
  const [mounted, setMounted] = useState(false);
  const [reasonId, setReasonId] = useState("");
  const [description, setDescription] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setReasonId("");
      setDescription("");
      setReasonOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!reasonOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setReasonOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [reasonOpen]);

  if (!open || !mounted) return null;

  const selectedReason = FLAG_REASONS.find((item) => item.id === reasonId);
  const canSubmit = Boolean(reasonId);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({
      reason: reasonId,
      reasonLabel: selectedReason?.label ?? "",
      description: description.trim(),
    });
  };

  return createPortal(
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
        aria-label="Close flag dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="flag-chat-title"
        className="relative w-full max-w-[22rem] rounded-[1.75rem] bg-white px-5 pt-5 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:max-w-[26rem] md:px-6 md:pt-6 md:pb-6"
      >
        <h2
          id="flag-chat-title"
          className="text-foreground text-center text-lg font-bold md:text-xl"
        >
          Flag
        </h2>
        <div className="mx-auto mt-4 h-px w-full bg-[#E5E7EB]" />

        <div className="mt-5 space-y-4">
          <div ref={dropdownRef} className="relative">
            <label
              htmlFor="flag-reason-trigger"
              className="text-foreground text-sm font-semibold"
            >
              Select Reason
            </label>
            <button
              id="flag-reason-trigger"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={reasonOpen}
              onClick={() => setReasonOpen((prev) => !prev)}
              className={cn(
                "mt-2 flex h-12 w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 text-left text-sm transition-colors",
                "focus-visible:border-primary/40 focus-visible:ring-primary/20 hover:border-[#CBD5E1] focus-visible:ring-2 focus-visible:outline-none",
                reasonOpen && "border-primary/40",
              )}
            >
              <span
                className={cn(selectedReason ? "text-foreground" : "text-[#9CA3AF]")}
              >
                {selectedReason?.label ?? "Select Reason"}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-[#9CA3AF] transition-transform",
                  reasonOpen && "rotate-180",
                )}
                strokeWidth={2.25}
              />
            </button>

            {reasonOpen ? (
              <ul
                role="listbox"
                aria-labelledby="flag-reason-trigger"
                className="absolute top-[calc(100%+0.5rem)] left-0 z-10 max-h-60 w-full overflow-auto rounded-xl border border-[#E5E7EB] bg-white py-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
              >
                {FLAG_REASONS.map((option) => {
                  const selected = option.id === reasonId;
                  return (
                    <li key={option.id} role="option" aria-selected={selected}>
                      <button
                        type="button"
                        onClick={() => {
                          setReasonId(option.id);
                          setReasonOpen(false);
                        }}
                        className={cn(
                          "mx-1.5 flex w-[calc(100%-0.75rem)] rounded-lg px-3 py-2.5 text-left text-sm text-[#111827] transition-colors",
                          selected ? "bg-[#EFF6FF] font-medium" : "hover:bg-[#F8FAFC]",
                        )}
                      >
                        {option.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="flag-description"
              className="text-foreground text-sm font-semibold"
            >
              Description
            </label>
            <div className="relative mt-2">
              <textarea
                id="flag-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value.slice(0, MAX_DESCRIPTION_LENGTH))
                }
                placeholder="ABC..."
                rows={5}
                className={cn(
                  "text-foreground w-full resize-none rounded-xl border border-[#E5E7EB] bg-white placeholder:text-[#9CA3AF]",
                  "focus-visible:border-primary/40 focus-visible:ring-primary/20 px-4 py-3 pb-8 text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none",
                )}
              />
              <span className="absolute right-3 bottom-3 text-xs text-[#9CA3AF]">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="gradient-brand mt-6 h-11 w-full rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 md:font-semibold"
        >
          Submit Report
        </button>
      </div>
    </div>,
    document.body,
  );
}
