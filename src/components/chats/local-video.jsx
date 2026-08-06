"use client";

import Image from "next/image";
import { VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";

export function LocalVideo({
  src,
  alt = "You",
  videoOff = false,
  className,
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-white/35 bg-[#1E293B] shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      {videoOff || !src ? (
        <div className="flex size-full items-center justify-center bg-[#1E293B]">
          <VideoOff className="size-7 text-white/50" />
        </div>
      ) : (
        <div className="relative size-full">
          <Image src={src} alt={alt} fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
