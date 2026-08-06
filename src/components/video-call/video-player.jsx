"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

export function VideoPlayer({
  src,
  alt,
  videoOff = false,
  offLabel = "Camera off",
  children,
  className,
}) {
  return (
    <div className={cn("relative size-full overflow-hidden bg-foreground", className)}>
      {videoOff ? (
        <div className="flex size-full items-center justify-center bg-muted">
          <p className="text-muted-foreground text-sm font-medium">{offLabel}</p>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1280px"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />

      {children}
    </div>
  );
}
