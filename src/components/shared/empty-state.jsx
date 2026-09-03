"use client";

import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-2xl max-md:mb-1.5">
        <Icon className="text-muted-foreground icon-lg" />
      </div>
      <div className="max-md:space-y-1.5">
        <h3 className="text-card-title max-md:text-[18px] max-md:leading-7 max-md:font-semibold max-md:tracking-normal max-md:text-[#111827]">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed max-md:mt-0 max-md:max-w-[18.5rem] max-md:text-[13px] max-md:text-[#64748B]">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
