"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

export function RemoteVideo({
  src,
  alt = "Remote video",
  videoOff = false,
  className,
  children,
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-[#0F172A]", className)}>
      {videoOff || !src ? (
        <div className="flex size-full items-center justify-center bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
          {children}
        </div>
      ) : (
        <>
          <Image src={src} alt={alt} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
        </>
      )}
    </div>
  );
}
