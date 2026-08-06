"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="bg-destructive/10 mb-4 flex size-16 items-center justify-center rounded-2xl">
        <AlertTriangle className="text-destructive size-8" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-2 max-w-sm text-sm">{description}</p>}
      {onRetry && (
        <Button variant="outline" className="mt-6 gap-2" onClick={onRetry}>
          <RefreshCw className="size-4" /> Try Again
        </Button>
      )}
    </div>
  );
}
