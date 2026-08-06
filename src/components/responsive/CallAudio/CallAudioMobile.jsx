"use client";

import { VoiceCallLayout } from "@/components/chats/voice-call-layout";

export function CallAudioMobile({
  participantName,
  participantAvatar,
  participantCover,
  specialty,
  endHref,
}) {
  return (
    <VoiceCallLayout
      participantName={participantName}
      participantAvatar={participantAvatar}
      participantCover={participantCover}
      specialty={specialty}
      endHref={endHref}
    />
  );
}

export function CallAudioTablet(props) {
  return <CallAudioMobile {...props} />;
}
