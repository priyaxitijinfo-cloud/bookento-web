"use client";

import { use } from "react";

import { ProviderServiceFormView } from "@/features/provider/components/provider-service-form-view";

export default function ProviderServiceEditPage({ params }) {
  const { id } = use(params);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ProviderServiceFormView serviceId={id} />
    </div>
  );
}
