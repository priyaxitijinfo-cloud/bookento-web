"use client";

import { use } from "react";

import { ProviderSlotFormView } from "@/features/provider/components/provider-slot-form-view";

export default function ProviderSlotEditPage({ params }) {
  const { id } = use(params);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ProviderSlotFormView slotId={id} />
    </div>
  );
}
