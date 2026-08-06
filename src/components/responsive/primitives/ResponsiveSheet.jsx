"use client";

import { useResponsive } from "@/hooks/responsive";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BottomSheet, SideDrawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

/**
 * Mobile/tablet → bottom sheet; desktop → centered dialog (or side panel when `variant="panel"`).
 * Preserves the same children API for both.
 */
export function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  variant = "dialog",
}) {
  const { isDesktop } = useResponsive();

  if (isDesktop && variant === "panel") {
    return (
      <SideDrawer open={open} onOpenChange={onOpenChange} title={title} side="right">
        {description ? (
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{description}</p>
        ) : null}
        <div className={cn(contentClassName, className)}>{children}</div>
        {footer ? <div className="mt-6 flex flex-col gap-3">{footer}</div> : null}
      </SideDrawer>
    );
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("max-w-lg gap-0 p-0 sm:rounded-2xl", className)}>
          {(title || description) && (
            <DialogHeader className="border-b border-[#ECECF2] px-6 py-4 text-left">
              {title ? <DialogTitle>{title}</DialogTitle> : null}
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>
          )}
          <div className={cn("px-6 py-4", contentClassName)}>{children}</div>
          {footer ? (
            <DialogFooter className="border-t border-[#ECECF2] px-6 py-4 sm:justify-stretch">
              {footer}
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={title}>
      {description ? (
        <p className="text-muted-foreground mb-4 text-center text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
      <div className={cn(contentClassName, className)}>{children}</div>
      {footer ? <div className="mt-4 flex flex-col gap-3">{footer}</div> : null}
    </BottomSheet>
  );
}
