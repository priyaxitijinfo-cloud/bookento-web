"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCallDuration } from "@/lib/chats/chat.utils";
import { cn } from "@/lib/utils";

export function CallAudioDesktop({
  participantName,
  participantAvatar,
  participantCover,
  specialty,
  endHref,
}) {
  const router = useRouter();
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectTimer = setTimeout(() => setConnected(true), 1800);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (!connected) return undefined;
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [connected]);

  return (
    <div className="flex h-dvh items-center justify-center bg-[#0B1220] p-8">
      <div className="grid w-full max-w-5xl grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl">
        <div
          className="relative min-h-[560px] bg-cover bg-center"
          style={{ backgroundImage: `url(${participantCover})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/55 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <Avatar
              src={participantAvatar}
              name={participantName}
              size="xl"
              className="size-36 border-4 border-white/25"
            />
            <h1 className="mt-6 text-3xl font-semibold text-white">{participantName}</h1>
            {specialty ? <p className="mt-2 text-sm text-white/70">{specialty}</p> : null}
            <p className="mt-3 text-base font-medium text-white/90">
              {connected ? formatCallDuration(duration) : "Connecting..."}
            </p>
            {!connected ? (
              <div className="mt-5 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-2 animate-bounce rounded-full bg-background"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-between p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white/45 uppercase">
              Voice call
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Call controls</h2>
            <p className="mt-2 text-sm text-white/60">
              Manage mute and speaker while staying on the line with {participantName}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <ControlButton
              label={muted ? "Unmute" : "Mute"}
              active={muted}
              onClick={() => setMuted((v) => !v)}
              icon={muted ? MicOff : Mic}
            />
            <ControlButton
              label={speakerOn ? "Speaker" : "Earpiece"}
              active={!speakerOn}
              onClick={() => setSpeakerOn((v) => !v)}
              icon={speakerOn ? Volume2 : VolumeX}
            />
            <Button
              variant="destructive"
              className="h-auto flex-col gap-2 rounded-2xl py-5"
              onClick={() => router.push(endHref)}
              aria-label="End call"
            >
              <PhoneOff className="size-6" />
              <span className="text-xs font-medium">End</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/5 px-4 py-3 text-sm text-white/70">
            Tip: Use keyboard focus on controls. Esc ends the call from chat return.
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ label, active, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 text-white transition",
        active
          ? "border-white/40 bg-background/20"
          : "border-white/10 bg-background/5 hover:bg-background/10",
      )}
      aria-pressed={active}
      aria-label={label}
    >
      <Icon className="size-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
