"use client";

import { ChatEmptyPane } from "@/components/chats/chat-empty-pane";
import { ChatSplitShell } from "@/components/chats/chat-workspace";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ROUTES } from "@/constants/routes.constants";

export function ChatsDesktop({ inbox }) {
  return (
    <DesktopLayout
      maxWidth="wide"
      showHeaderBorder={false}
      className="h-dvh overflow-hidden"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden !py-0"
      containerClassName="flex min-h-0 flex-1 flex-col overflow-hidden !pt-0 pb-5 md:!pt-0"
      header={
        <>
          <HomeHeader embedded />
          <DesktopBreadcrumbBar
            backHref={ROUTES.PROFILE}
            backLabel="Back to Profile"
            currentLabel="Chat"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatSplitShell inbox={inbox} className="min-h-0 flex-1" showInboxTitle>
          <ChatEmptyPane />
        </ChatSplitShell>
      </div>
    </DesktopLayout>
  );
}
