"use client";

import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
} from "lucide-react";

import { cn } from "@/lib/utils";

function ControlButton({ active, danger, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-12 items-center justify-center rounded-full text-white transition-all md:size-14",
        danger
          ? "bg-[#EF4444] shadow-[0_8px_24px_rgba(239,68,68,0.4)] hover:bg-[#DC2626]"
          : active
            ? "bg-background text-[#0F172A] hover:bg-background/90"
            : "bg-background/15 backdrop-blur-md hover:bg-background/25",
      )}
    >
      {children}
    </button>
  );
}

export function CallControls({
  muted,
  videoOff,
  speakerOn,
  onToggleMute,
  onToggleVideo,
  onToggleSpeaker,
  onEndCall,
  className,
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 rounded-full bg-black/35 px-5 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl md:gap-5 md:px-6 md:py-4",
        className,
      )}
    >
      <ControlButton active={muted} onClick={onToggleMute} label={muted ? "Unmute" : "Mute"}>
        {muted ? <MicOff className="size-5 md:size-6" /> : <Mic className="size-5 md:size-6" />}
      </ControlButton>

      <ControlButton
        active={videoOff}
        onClick={onToggleVideo}
        label={videoOff ? "Turn camera on" : "Turn camera off"}
      >
        {videoOff ? <VideoOff className="size-5 md:size-6" /> : <Video className="size-5 md:size-6" />}
      </ControlButton>

      <ControlButton danger onClick={onEndCall} label="End call">
        <PhoneOff className="size-5 md:size-6" />
      </ControlButton>

      <ControlButton
        active={!speakerOn}
        onClick={onToggleSpeaker}
        label={speakerOn ? "Mute speaker" : "Unmute speaker"}
      >
        {speakerOn ? <Volume2 className="size-5 md:size-6" /> : <VolumeX className="size-5 md:size-6" />}
      </ControlButton>
    </div>
  );
}
