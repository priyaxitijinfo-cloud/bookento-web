"use client";

import { CallTimer } from "@/components/video-call/call-timer";
import { cn } from "@/lib/utils";

export function CallHeader({
  name,
  subtitle,
  seconds = 0,
  connected = false,
  className,
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-4 md:px-6 md:pt-6", className)}>
      <div className="bg-gradient-to-b from-black/55 via-black/20 to-transparent pb-8 pt-2 md:pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-lg font-bold text-white md:text-xl">{name}</h1>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-white/75 md:text-sm">{subtitle}</p>
          ) : null}
          <CallTimer
            seconds={seconds}
            connected={connected}
            className="mt-1.5 text-white/90 md:mt-2"
          />
        </div>
      </div>
    </div>
  );
}
