"use client";

import { cn } from "@/lib/utils";
import { DeleteAddressPopupIllustration } from "@/components/icons/address-action-icons";

export function DeleteAddressModal({ open, onClose, onConfirm, loading = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close delete dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-address-title"
        className="bg-background relative w-full max-w-[26rem] rounded-[1.75rem] px-6 pt-7 pb-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <DeleteAddressPopupIllustration className="mx-auto h-[9.375rem] w-[9.625rem] max-w-full" />

        <h2
          id="delete-address-title"
          className="text-foreground mt-5 text-center text-xl font-bold"
        >
          <span className="md:hidden">Delete Service Location</span>
          <span className="hidden md:inline">Delete Address</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
          <span className="md:hidden">
            Are you sure you want to remove this Service Location?
          </span>
          <span className="hidden md:inline">
            Are you sure you want to remove this Address?
          </span>
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-muted hover:bg-muted h-12 rounded-xl text-sm font-medium text-[#374151] transition-colors disabled:opacity-60 md:font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "h-12 rounded-xl bg-gradient-to-r from-[#FF6766] to-[#EB1D26] text-sm font-medium text-white transition-opacity hover:opacity-95 md:font-semibold",
              loading && "opacity-70",
            )}
          >
            <span className="md:hidden">Delete</span>
            <span className="hidden md:inline">
              {loading ? "Deleting..." : "Delete"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
