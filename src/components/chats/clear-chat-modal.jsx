"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { DeleteAddressPopupIllustration } from "@/components/icons/address-action-icons";
import { cn } from "@/lib/utils";

export function ClearChatModal({ open, onClose, onConfirm, className }) {
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
        "fixed inset-0 z-[70] flex items-center justify-center p-5",
        className,
      )}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close clear chat dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-chat-title"
        className="bg-background relative w-full max-w-[26rem] rounded-[1.75rem] px-6 pt-7 pb-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <DeleteAddressPopupIllustration className="mx-auto h-[9.375rem] w-[9.625rem] max-w-full" />

        <h2
          id="clear-chat-title"
          className="text-foreground mt-5 text-center text-xl font-bold"
        >
          Clear this chat?
        </h2>
        <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
          This will remove all messages from this conversation for you. This action
          can&apos;t be undone.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-muted hover:bg-muted h-12 rounded-xl text-sm font-medium text-[#374151] transition-colors md:font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-xl bg-gradient-to-r from-[#FF6766] to-[#EB1D26] text-sm font-medium text-white transition-opacity hover:opacity-95 md:font-semibold"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
