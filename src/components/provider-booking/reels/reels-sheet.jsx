"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export function ReelsSheet({ open, onClose, title, children, footer, className, contained = false }) {
  if (!open) return null;

  const sheet = (
    <div
      className={cn(
        "pointer-events-auto z-[160] flex items-end",
        contained ? "absolute inset-0" : "fixed inset-0 justify-center",
      )}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close sheet"
      />
      <div
        className={cn(
          "relative z-10 flex w-full shrink-0 flex-col rounded-t-xl bg-background shadow-2xl",
          !contained && "max-w-[420px]",
          className,
          contained ? "max-h-[85%]" : !className?.includes("max-h") && "max-h-[88vh]",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-[#E5E7EB]" />
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-5 pb-3 pt-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-[#ECECF2] hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 shrink overflow-y-auto overscroll-contain scrollbar-hide">{children}</div>
        {footer}
      </div>
    </div>
  );

  if (contained) return sheet;

  return createPortal(sheet, document.body);
}
