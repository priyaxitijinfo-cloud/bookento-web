"use client";

import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/login-form";
import { PageLoader } from "@/components/ui/skeleton";
import { USER_ROLES } from "@/constants/status.constants";

export default function ProviderLoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginForm role={USER_ROLES.PROVIDER} />
    </Suspense>
  );
}
