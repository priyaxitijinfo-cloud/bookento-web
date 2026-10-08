"use client";

import { Suspense } from "react";

import { PageLoader } from "@/components/ui/skeleton";
import { ProviderLoginForm } from "@/features/auth/components/provider-login-form";

export default function ProviderLoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProviderLoginForm />
    </Suspense>
  );
}
