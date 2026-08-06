"use client";

import { useEffect, useState } from "react";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { ROUTES } from "@/constants/routes.constants";
import { mockProviders } from "@/mock/providers";

import { CallVideoDesktop } from "./CallVideoDesktop";
import { CallVideoMobile, CallVideoTablet } from "./CallVideoMobile";

const provider = mockProviders[0];

function formatDuration(secs) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function CallVideoResponsive() {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectTimer = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (!connected) return undefined;
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [connected]);

  const viewProps = {
    provider,
    muted,
    videoOff,
    connected,
    durationLabel: formatDuration(duration),
    onToggleMute: () => setMuted((v) => !v),
    onToggleVideo: () => setVideoOff((v) => !v),
    endHref: ROUTES.CHATS,
  };

  return (
    <ResponsiveView
      mobile={<CallVideoMobile {...viewProps} />}
      tablet={<CallVideoTablet {...viewProps} />}
      desktop={<CallVideoDesktop {...viewProps} />}
    />
  );
}

export default CallVideoResponsive;
