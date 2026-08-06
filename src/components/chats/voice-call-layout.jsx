"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CallControls } from "@/components/chats/call-controls";
import { LocalVideo } from "@/components/chats/local-video";
import { RemoteVideo } from "@/components/chats/remote-video";
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { formatCallDuration } from "@/lib/chats/chat.utils";
import { selfVideoUrl } from "@/mock/helpers";
import { cn } from "@/lib/utils";

export function VoiceCallLayout({
  participantName,
  participantAvatar,
  participantCover,
  specialty,
  endHref = ROUTES.CHATS,
  className,
}) {
  const router = useRouter();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
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

  const handleEndCall = () => {
    router.push(endHref);
  };

  return (
    <div className={cn("relative h-dvh overflow-hidden bg-[#0B1220]", className)}>
      <RemoteVideo
        src={participantCover}
        alt={participantName}
        videoOff={false}
      >
        <Avatar
          src={participantAvatar}
          name={participantName}
          size="xl"
          className="size-28 border-4 border-white/20 md:size-32"
        />
      </RemoteVideo>

      {/* Top info */}
      <div className="safe-top absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4 md:p-6">
        <div className="rounded-2xl bg-black/35 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Avatar
              src={participantAvatar}
              name={participantName}
              size="sm"
              className="size-10 border-2 border-white/40"
            />
            <div>
              <p className="text-sm font-semibold text-white md:text-base">{participantName}</p>
              {specialty ? (
                <p className="text-xs text-white/70 md:text-sm">{specialty}</p>
              ) : null}
              <p className="mt-0.5 text-xs font-medium text-white/85 md:text-sm">
                {connected ? formatCallDuration(duration) : "Connecting..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Local preview */}
      <LocalVideo
        src={selfVideoUrl()}
        videoOff={videoOff}
        className="absolute right-4 top-24 z-20 h-36 w-28 md:right-6 md:top-28 md:h-44 md:w-32"
      />

      {/* Connecting overlay */}
      {!connected ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px]">
          <Avatar
            src={participantAvatar}
            name={participantName}
            size="xl"
            className="size-24 border-4 border-white/30 md:size-28"
          />
          <p className="mt-5 text-lg font-semibold text-white md:text-xl">
            Calling {participantName}...
          </p>
          <div className="mt-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-2 animate-bounce rounded-full bg-background"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Bottom controls */}
      <div className="safe-bottom absolute inset-x-0 bottom-0 z-20 flex justify-center p-5 md:p-8">
        <CallControls
          muted={muted}
          videoOff={videoOff}
          speakerOn={speakerOn}
          onToggleMute={() => setMuted((v) => !v)}
          onToggleVideo={() => setVideoOff((v) => !v)}
          onToggleSpeaker={() => setSpeakerOn((v) => !v)}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
}
