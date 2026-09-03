"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

/** Logout popup — from /icons/logout.svg */
function LogoutPopupIllustration({ className }) {
  return (
    <img
      src="/icons/logout.svg"
      alt=""
      width={154}
      height={150}
      className={cn("mx-auto h-[150px] w-[154px] object-contain", className)}
      draggable={false}
      aria-hidden
    />
  );
}

function LogoutActions({ onClose, onConfirm, loading }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="h-[51px] rounded-[10px] bg-[#F2F6FC] text-[15px] font-medium text-[#111827] transition-colors hover:bg-[#E2E8F0] disabled:opacity-60 md:h-12 md:rounded-xl md:font-semibold"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={() => {
          if (loading) return;
          onConfirm?.();
        }}
        disabled={loading}
        className={cn(
          "h-[51px] rounded-[10px] bg-gradient-to-r from-[#58A1FF] to-[#1E57EA] text-[15px] font-medium text-white transition-opacity hover:opacity-95 md:h-12 md:rounded-xl md:font-semibold",
          loading && "opacity-70",
        )}
      >
        Logout
      </button>
    </div>
  );
}

export function LogoutConfirmModal({ open, onClose, onConfirm, loading = false }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const modal = (
    <>
      {/* App / mobile — design popup */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 md:hidden">
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-[12px]"
          onClick={onClose}
          aria-label="Close logout dialog"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title-mobile"
          className="relative flex h-[347px] w-full max-w-[396px] flex-col rounded-[24px] bg-white px-4 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.16)]"
        >
          <LogoutPopupIllustration />

          <h2
            id="logout-confirm-title-mobile"
            className="mt-4 text-center text-[22px] leading-none font-semibold text-[#111827]"
          >
            Logout?
          </h2>
          <p className="mx-auto mt-2.5 max-w-[280px] text-center text-[16px] leading-[1.45] text-[#64748B]">
            Are you sure you want to log out of your account?
          </p>

          <div className="mt-auto">
            <LogoutActions onClose={onClose} onConfirm={onConfirm} loading={loading} />
          </div>
        </div>
      </div>

      {/* Web — centered dialog (spacing matches other confirm popups) */}
      <div className="fixed inset-0 z-[80] hidden items-center justify-center p-5 md:flex">
        <button
          type="button"
          className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
          onClick={onClose}
          aria-label="Close logout dialog"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title-desktop"
          className="relative w-full max-w-[26rem] overflow-hidden rounded-[1.75rem] bg-white px-6 pt-7 pb-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center">
            <LogoutPopupIllustration className="h-[9.375rem] w-[9.625rem] max-w-full" />

            <h2
              id="logout-confirm-title-desktop"
              className="mt-5 text-xl font-bold text-[#111827]"
            >
              Logout?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Are you sure you want to log out of your account?
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-12 rounded-xl bg-[#F3F4F6] text-sm font-semibold text-[#111827] transition-colors hover:bg-[#E5E7EB] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (loading) return;
                onConfirm?.();
              }}
              disabled={loading}
              className={cn(
                "h-12 rounded-xl bg-gradient-to-r from-[#58A1FF] to-[#1E57EA] text-sm font-semibold text-white transition-opacity hover:opacity-95",
                loading && "opacity-70",
              )}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
