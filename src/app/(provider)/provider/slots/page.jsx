"use client";

import { Suspense } from "react";

import { ProviderSlotsView } from "@/features/provider/components/provider-slots-view";

export default function ProviderSlotsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1 bg-[#F4F7FF]" />}>
        <ProviderSlotsView />
      </Suspense>
    </div>
  );
}
