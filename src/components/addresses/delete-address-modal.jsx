"use client";

import { cn } from "@/lib/utils";

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
        className="relative w-full max-w-[26rem] rounded-[1.75rem] bg-background px-6 pb-6 pt-7 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative mx-auto flex size-28 items-center justify-center">
          <span className="absolute left-1 top-2 text-xl font-light leading-none text-[#FF6766]">+</span>
          <span className="absolute right-1 top-3 size-2.5 rounded-full border-2 border-[#FF6766]" />
          <span className="absolute bottom-2 left-2 size-2.5 rounded-full border-2 border-[#FF6766]" />
          <span className="absolute bottom-3 right-1 text-xl font-light leading-none text-[#FF6766]">+</span>

          <div className="flex size-24 items-center justify-center rounded-full border-4 border-[#FECACA] bg-[#FEE2E2]">
            <span className="flex size-[5.5rem] items-center justify-center rounded-full bg-gradient-to-br from-[#FF6766] to-[#EB1D26] text-white shadow-[0_8px_20px_rgba(235,29,38,0.35)]">
              <img
                src="/icons/delete-address-trash.png"
                alt=""
                width={48}
                height={48}
                className="size-12 mix-blend-screen"
                aria-hidden
              />
            </span>
          </div>
        </div>

        <h2 id="delete-address-title" className="text-foreground mt-5 text-center text-xl font-bold">
          <span className="md:hidden">Delete Service Location</span>
          <span className="hidden md:inline">Delete Address</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
          <span className="md:hidden">Are you sure you want to remove this Service Location?</span>
          <span className="hidden md:inline">Are you sure you want to remove this Address?</span>
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-12 rounded-xl bg-muted text-sm font-semibold text-[#374151] transition-colors hover:bg-muted disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "h-12 rounded-xl bg-gradient-to-r from-[#FF6766] to-[#EB1D26] text-sm font-semibold text-white transition-opacity hover:opacity-95",
              loading && "opacity-70",
            )}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
