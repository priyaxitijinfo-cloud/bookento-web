"use client";

import { Suspense } from "react";

import { HelpView } from "@/components/profile/help-view";

export default function HelpPage() {
  return (
    <Suspense fallback={null}>
      <HelpView />
    </Suspense>
  );
}
