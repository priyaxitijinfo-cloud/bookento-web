"use client";

import { useChatInbox } from "@/components/chats/chat-workspace";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";

import { ChatsDesktop } from "./ChatsDesktop";
import { ChatsMobile } from "./ChatsMobile";
import { ChatsTablet } from "./ChatsTablet";

export function ChatsResponsive() {
  const inbox = useChatInbox();

  return (
    <ResponsiveView
      mobile={<ChatsMobile inbox={inbox} />}
      tablet={<ChatsTablet inbox={inbox} />}
      desktop={<ChatsDesktop inbox={inbox} />}
    />
  );
}

export default ChatsResponsive;
