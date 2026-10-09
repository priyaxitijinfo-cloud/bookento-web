"use client";

import { Suspense } from "react";

import { ProviderChatsView } from "@/features/provider/components/provider-chats-view";

export default function ProviderChatsPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-[#F4F7FF]" />}>
      <ProviderChatsView />
    </Suspense>
  );
}
