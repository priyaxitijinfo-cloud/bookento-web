"use client";

import { Suspense } from "react";

import { ProviderDetailResponsive } from "@/components/responsive/ProviderDetail";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";

function ProviderDetailFallback() {
  return (
    <div className="bg-surface-page flex min-h-dvh items-center justify-center p-6">
      <EmptyState
        title="Loading profile..."
        description="Fetching provider details."
        actionLabel="Browse providers"
        onAction={() => {
          window.location.href = ROUTES.PROVIDERS;
        }}
      />
    </div>
  );
}

export default function ProviderDetailPage() {
  return (
    <Suspense fallback={<ProviderDetailFallback />}>
      <ProviderDetailResponsive />
    </Suspense>
  );
}
