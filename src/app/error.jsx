"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md text-sm">{error?.message || "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="gradient-brand rounded-xl px-6 py-2.5 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
