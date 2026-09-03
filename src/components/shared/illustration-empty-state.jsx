"use client";

import { cn } from "@/lib/utils";

export function IllustrationEmptyState({
  src,
  title,
  description,
  className,
  imageClassName,
}) {
  return (
    <div
      className={cn(
        "flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center px-6 py-10 text-center",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        width={194}
        height={194}
        className={cn("size-[194px] shrink-0 object-contain", imageClassName)}
        aria-hidden
      />
      <div className="space-y-1.5">
        <h3 className="text-[18px] leading-7 font-semibold text-[#111827]">{title}</h3>
        {description ? (
          <p className="max-w-[18.5rem] text-[13px] leading-relaxed text-[#64748B]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
