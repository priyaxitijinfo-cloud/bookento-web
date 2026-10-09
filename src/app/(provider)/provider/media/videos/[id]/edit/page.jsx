"use client";

import { use } from "react";

import { ProviderVideoFormView } from "@/features/provider/components/provider-video-form-view";

export default function ProviderMediaVideoEditPage({ params }) {
  const { id } = use(params);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ProviderVideoFormView videoId={id} />
    </div>
  );
}
