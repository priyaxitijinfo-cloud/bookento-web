"use client";

import { Suspense } from "react";

import { ProviderMediaView } from "@/features/provider/components/provider-media-view";

function MediaFallback() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-[#F4F7FF] text-sm text-[#94A3B8]">
      Loading…
    </div>
  );
}

export default function ProviderMediaPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<MediaFallback />}>
        <ProviderMediaView />
      </Suspense>
    </div>
  );
}
