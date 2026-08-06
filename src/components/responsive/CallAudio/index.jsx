"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { chatDetailRoute, ROUTES } from "@/constants/routes.constants";
import { getProviderById, mockProviders } from "@/mock/providers";

import { CallAudioDesktop } from "./CallAudioDesktop";
import { CallAudioMobile, CallAudioTablet } from "./CallAudioMobile";

function CallAudioContent() {
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider");
  const fromChatId = searchParams.get("from");

  const provider = (providerId && getProviderById(providerId)) || mockProviders[0];
  const endHref = fromChatId ? chatDetailRoute(fromChatId) : ROUTES.CHATS;

  const viewProps = {
    participantName: provider.businessName,
    participantAvatar: provider.avatar,
    participantCover: provider.coverImage,
    specialty: provider.specialty,
    endHref,
  };

  return (
    <ResponsiveView
      mobile={<CallAudioMobile {...viewProps} />}
      tablet={<CallAudioTablet {...viewProps} />}
      desktop={<CallAudioDesktop {...viewProps} />}
    />
  );
}

export function CallAudioResponsive() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-[#0B1220] text-white">
          Connecting...
        </div>
      }
    >
      <CallAudioContent />
    </Suspense>
  );
}

export default CallAudioResponsive;
