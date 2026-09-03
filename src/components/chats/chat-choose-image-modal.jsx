"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function GalleryOptionIcon() {
  return (
    <span className="flex size-12 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(24,101,234,0.12)]">
      <ImageIcon className="size-6 text-[#1865EA]" strokeWidth={2} />
    </span>
  );
}

function CameraOptionIcon() {
  return (
    <span className="flex size-12 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(249,115,22,0.12)]">
      <Camera className="size-6 text-[#F97316]" strokeWidth={2} />
    </span>
  );
}

/** Mobile-only Choose Image popup (web opens the file picker directly) */
export function ChatChooseImageModal({ open, onClose, onGallery, onTakePhoto }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close choose image dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="choose-image-title"
        className="relative w-full max-w-[320px] rounded-[1.75rem] bg-white px-5 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <h2
          id="choose-image-title"
          className="text-center text-xl font-bold text-[#111827]"
        >
          Choose Image
        </h2>
        <p className="mt-1.5 text-center text-sm text-[#64748B]">
          Choose where to pick your image
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onGallery}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border px-3 py-4 transition-opacity hover:opacity-95",
              "border-[#BFDBFE] bg-[#EFF6FF]",
            )}
          >
            <GalleryOptionIcon />
            <span className="text-sm font-semibold text-[#111827]">Gallery</span>
          </button>

          <button
            type="button"
            onClick={onTakePhoto}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border px-3 py-4 transition-opacity hover:opacity-95",
              "border-[#FED7AA] bg-[#FFF7ED]",
            )}
          >
            <CameraOptionIcon />
            <span className="text-sm font-semibold text-[#111827]">Take Photo</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
