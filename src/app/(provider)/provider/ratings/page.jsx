"use client";

import { Suspense } from "react";

import { ProviderRatingsView } from "@/features/provider/components/provider-ratings-view";

export default function ProviderRatingsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1 bg-[#F4F7FF]" />}>
        <ProviderRatingsView />
      </Suspense>
    </div>
  );
}
