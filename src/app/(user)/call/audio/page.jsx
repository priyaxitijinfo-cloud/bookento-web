"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Mic, MicOff, PhoneOff, Volume2,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { mockProviders } from "@/mock/providers";

const provider = mockProviders[0];

export default function AudioCallPage() {
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectTimer = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [connected]);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="gradient-brand flex h-dvh flex-col items-center justify-between p-8 text-white">
      <div className="safe-top w-full text-center">
        <p className="text-white/70 text-sm">Audio Call</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Avatar src={provider.avatar} name={provider.businessName} size="xl" className="size-32 border-4 border-white/30" />
          {!connected && (
            <span className="absolute inset-0 animate-ping rounded-full border-2 border-white/40" />
          )}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{provider.businessName}</h1>
          <p className="text-white/70 mt-1">{provider.specialty}</p>
          <p className="mt-4 text-lg">
            {connected ? formatDuration(duration) : "Connecting..."}
          </p>
        </div>

        {/* Waveform animation */}
        {connected && (
          <div className="flex items-end gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 animate-pulse rounded-full bg-white/60"
                style={{
                  height: `${12 + Math.sin(i * 0.8) * 16}px`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="safe-bottom flex w-full max-w-sm items-center justify-center gap-6">
        <Button
          variant="secondary"
          size="icon"
          className="size-14 rounded-full bg-white/20 text-white hover:bg-white/30"
          onClick={() => setMuted(!muted)}
        >
          {muted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
        </Button>
        <Link href={ROUTES.CHATS}>
          <Button
            variant="destructive"
            size="icon"
            className="size-16 rounded-full"
          >
            <PhoneOff className="size-7" />
          </Button>
        </Link>
        <Button
          variant="secondary"
          size="icon"
          className="size-14 rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <Volume2 className="size-6" />
        </Button>
      </div>
    </div>
  );
}
