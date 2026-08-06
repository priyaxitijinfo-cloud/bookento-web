"use client";

import Image from "next/image";
import Link from "next/link";
import { Mic, MicOff, PhoneOff, SwitchCamera, Video, VideoOff } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { selfVideoUrl } from "@/mock/helpers";
import { cn } from "@/lib/utils";

export function CallVideoDesktop({
  provider,
  muted,
  videoOff,
  connected,
  durationLabel,
  onToggleMute,
  onToggleVideo,
  endHref = ROUTES.CHATS,
}) {
  return (
    <div className="flex h-dvh items-center justify-center bg-[#05070D] p-6 lg:p-10">
      <div className="grid h-full max-h-[860px] w-full max-w-6xl grid-cols-[1.4fr_0.8fr] overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
        <div className="relative">
          <Image
            src={provider.coverImage}
            alt={provider.businessName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-6 left-6 flex items-center gap-3 rounded-2xl bg-black/40 px-4 py-3 backdrop-blur-md">
            <Avatar
              src={provider.avatar}
              name={provider.businessName}
              size="sm"
              className="border-2 border-white/50"
            />
            <div>
              <p className="font-semibold text-white">{provider.businessName}</p>
              <p className="text-xs text-white/70">
                {connected ? durationLabel : "Connecting..."}
              </p>
            </div>
          </div>

          <div className="absolute right-6 bottom-6 h-48 w-36 overflow-hidden rounded-2xl border-2 border-white/35 shadow-xl">
            {videoOff ? (
              <div className="flex size-full items-center justify-center bg-gray-800">
                <VideoOff className="size-10 text-white/50" />
              </div>
            ) : (
              <Image src={selfVideoUrl()} alt="You" fill className="object-cover" />
            )}
          </div>

          {!connected ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55">
              <Avatar
                src={provider.avatar}
                name={provider.businessName}
                size="xl"
                className="size-28 border-4 border-white/30"
              />
              <p className="mt-5 text-xl font-semibold text-white">
                Calling {provider.businessName}...
              </p>
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col justify-between border-l border-white/10 bg-[#0B1220] p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white/45 uppercase">
              Video consultation
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{provider.businessName}</h2>
            <p className="mt-2 text-sm text-white/60">{provider.specialty}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DesktopControl
              label={muted ? "Unmute" : "Mute"}
              active={muted}
              onClick={onToggleMute}
              icon={muted ? MicOff : Mic}
            />
            <DesktopControl
              label={videoOff ? "Camera on" : "Camera off"}
              active={videoOff}
              onClick={onToggleVideo}
              icon={videoOff ? VideoOff : Video}
            />
            <DesktopControl label="Flip cam" icon={SwitchCamera} />
            <Link href={endHref} className="contents">
              <Button
                variant="destructive"
                className="h-auto flex-col gap-2 rounded-2xl py-5"
                aria-label="End call"
              >
                <PhoneOff className="size-6" />
                <span className="text-xs font-medium">End call</span>
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/5 px-4 py-3 text-sm text-white/65">
            Desktop layout keeps the consultation feed large with controls in a dedicated panel.
          </div>
        </aside>
      </div>
    </div>
  );
}

function DesktopControl({ label, active = false, onClick, icon: Icon }) {
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
