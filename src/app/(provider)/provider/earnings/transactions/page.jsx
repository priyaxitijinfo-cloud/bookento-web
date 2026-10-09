"use client";

import { Suspense } from "react";

import { ProviderTransactionsView } from "@/features/provider/components/provider-transactions-view";

export default function ProviderEarningsTransactionsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1 bg-[#F4F7FF]" />}>
        <ProviderTransactionsView />
      </Suspense>
    </div>
  );
}
