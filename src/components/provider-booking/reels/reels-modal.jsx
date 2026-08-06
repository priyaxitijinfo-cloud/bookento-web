"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export function ReelsModal({ open, onClose, title, children, footer, className, titleCenter = false }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className={cn("relative w-full max-w-md overflow-hidden rounded-2xl bg-background shadow-2xl", className)}>
        <div className={cn("relative border-b border-border/60 px-5 py-4", titleCenter && "text-center")}>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
        {footer}
      </div>
    </div>,
    document.body,
  );
}
