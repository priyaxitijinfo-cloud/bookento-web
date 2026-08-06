"use client";

import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

export function BottomSheet({ open, onOpenChange, children, title }) {
  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DrawerPrimitive.Content className="bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-xl border-t">
          <div className="bg-muted mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full" />
          {title && (
            <DrawerPrimitive.Title className="px-6 py-4 text-lg font-semibold">
              {title}
            </DrawerPrimitive.Title>
          )}
          <div className="overflow-y-auto px-6 pb-6">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

export function SideDrawer({ open, onOpenChange, children, title, side = "right" }) {
  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} direction={side}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DrawerPrimitive.Content
          className={cn(
            "bg-background fixed z-50 flex h-full w-80 flex-col border",
            side === "right" && "inset-y-0 right-0",
            side === "left" && "inset-y-0 left-0",
          )}
        >
          {title && (
            <DrawerPrimitive.Title className="border-b px-6 py-4 text-lg font-semibold">
              {title}
            </DrawerPrimitive.Title>
          )}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
