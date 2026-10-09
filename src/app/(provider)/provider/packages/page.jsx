"use client";

import { Suspense } from "react";

import { ProviderPackagesView } from "@/features/provider/components/provider-packages-view";

export default function ProviderPackagesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1 bg-[#F4F7FF]" />}>
        <ProviderPackagesView />
      </Suspense>
    </div>
  );
}
