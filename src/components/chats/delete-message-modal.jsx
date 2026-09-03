"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { DeleteAddressPopupIllustration } from "@/components/icons/address-action-icons";
import { cn } from "@/lib/utils";

export function DeleteMessageModal({
  open,
  onClose,
  onDeleteForMe,
  onDeleteForEveryone,
  canDeleteForEveryone = true,
  className,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[90] flex items-center justify-center p-5",
        className,
      )}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] md:bg-black/40 md:backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close delete message dialog"
      />

      {/* Mobile — Figma stacked dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-message-title-mobile"
        className="relative w-full max-w-[20rem] rounded-[1.5rem] bg-white px-5 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 flex size-8 items-center justify-center rounded-full bg-[#F3F4F6] text-[#4D5972] transition-colors hover:bg-[#E5E7EB]"
        >
          <X className="size-4" strokeWidth={2.25} />
        </button>

        <DeleteAddressPopupIllustration className="mx-auto h-[7.5rem] w-[7.75rem] max-w-full" />

        <h2
          id="delete-message-title-mobile"
          className="mt-4 text-center text-[1.0625rem] leading-snug font-bold text-[#111827]"
        >
          Delete Message?
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-[#6B7280]">
          This message will be deleted for everyone in the chat.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onDeleteForMe}
            className="h-12 w-full rounded-xl bg-[#F3F4F6] text-[15px] font-semibold text-[#111827] transition-colors hover:bg-[#E5E7EB]"
          >
            Delete for me
          </button>
          {canDeleteForEveryone ? (
            <button
              type="button"
              onClick={onDeleteForEveryone}
              className="h-12 w-full rounded-xl bg-[#EF4444] text-[15px] font-semibold text-white transition-opacity hover:opacity-95"
            >
              Delete for everyone
            </button>
          ) : null}
        </div>
      </div>

      {/* Web — centered webview modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-message-title-web"
        className="bg-background relative hidden w-full max-w-[26rem] rounded-[1.75rem] px-6 pt-7 pb-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:block"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#4D5972] transition-colors hover:bg-[#E5E7EB]"
        >
          <X className="size-4" strokeWidth={2.25} />
        </button>

        <DeleteAddressPopupIllustration className="mx-auto h-[9.375rem] w-[9.625rem] max-w-full" />

        <h2
          id="delete-message-title-web"
          className="text-foreground mt-5 text-center text-xl font-bold"
        >
          Delete Message?
        </h2>
        <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
          This message will be deleted for everyone in the chat.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onDeleteForMe}
            className="bg-muted h-12 w-full rounded-xl text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E5E7EB]"
          >
            Delete for me
          </button>
          {canDeleteForEveryone ? (
            <button
              type="button"
              onClick={onDeleteForEveryone}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-[#FF6766] to-[#EB1D26] text-sm font-semibold text-white transition-opacity hover:opacity-95"
            >
              Delete for everyone
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
