"use client";

import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-2xl">
        <Icon className="text-muted-foreground icon-lg" />
      </div>
      <h3 className="text-card-title">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
