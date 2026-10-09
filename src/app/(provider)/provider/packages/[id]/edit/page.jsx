"use client";

import { use } from "react";

import { ProviderPackageFormView } from "@/features/provider/components/provider-package-form-view";

export default function ProviderPackageEditPage({ params }) {
  const { id } = use(params);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ProviderPackageFormView packageId={id} />
    </div>
  );
}
