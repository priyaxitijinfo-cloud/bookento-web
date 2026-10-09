"use client";

import { Suspense } from "react";

import { ProviderEarningsView } from "@/features/provider/components/provider-earnings-view";

export default function ProviderEarningsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1 bg-[#F4F7FF]" />}>
        <ProviderEarningsView />
      </Suspense>
    </div>
  );
}
