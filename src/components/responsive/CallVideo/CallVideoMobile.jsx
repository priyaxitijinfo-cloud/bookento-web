"use client";

import Image from "next/image";
import Link from "next/link";
import { Mic, MicOff, PhoneOff, SwitchCamera, Video, VideoOff } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { selfVideoUrl } from "@/mock/helpers";

export function CallVideoMobile({
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
    <div className="relative h-dvh overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src={provider.coverImage}
          alt={provider.businessName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="safe-top absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={provider.avatar}
            name={provider.businessName}
            size="sm"
            className="border-2 border-white"
          />
          <div>
            <p className="font-semibold text-white">{provider.businessName}</p>
            <p className="text-xs text-white/70">
              {connected ? durationLabel : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-4 z-10 h-36 w-28 overflow-hidden rounded-2xl border-2 border-white/30 shadow-lg">
        {videoOff ? (
          <div className="flex size-full items-center justify-center bg-gray-800">
            <VideoOff className="size-8 text-white/50" />
          </div>
        ) : (
          <Image src={selfVideoUrl()} alt="You" fill className="object-cover" />
        )}
      </div>

      {!connected ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60">
          <Avatar
            src={provider.avatar}
            name={provider.businessName}
            size="xl"
            className="size-24 border-4 border-white/30"
          />
          <p className="mt-4 text-lg font-semibold text-white">
            Calling {provider.businessName}...
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

      <div className="safe-bottom absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-4 p-8">
        <Button
          variant="secondary"
          size="icon"
          className="size-14 rounded-full bg-background/20 text-white backdrop-blur hover:bg-background/30"
          onClick={onToggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-14 rounded-full bg-background/20 text-white backdrop-blur hover:bg-background/30"
          onClick={onToggleVideo}
          aria-label={videoOff ? "Turn camera on" : "Turn camera off"}
        >
          {videoOff ? <VideoOff className="size-6" /> : <Video className="size-6" />}
        </Button>
        <Link href={endHref}>
          <Button
            variant="destructive"
            size="icon"
            className="size-16 rounded-full"
            aria-label="End call"
          >
            <PhoneOff className="size-7" />
          </Button>
        </Link>
        <Button
          variant="secondary"
          size="icon"
          className="size-14 rounded-full bg-background/20 text-white backdrop-blur hover:bg-background/30"
          aria-label="Switch camera"
        >
          <SwitchCamera className="size-6" />
        </Button>
      </div>
    </div>
  );
}

export function CallVideoTablet(props) {
  return <CallVideoMobile {...props} />;
}
