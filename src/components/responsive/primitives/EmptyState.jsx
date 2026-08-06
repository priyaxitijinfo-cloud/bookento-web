"use client";

import { cn } from "@/lib/utils";

export function EmptyState({
  illustration,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
      role="status"
    >
      {illustration ? (
        <div className="mb-6 flex max-w-[220px] items-center justify-center">{illustration}</div>
      ) : null}
      {title ? (
        <h2 className="text-lg font-semibold text-[#1A1A2E] sm:text-xl">{title}</h2>
      ) : null}
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
