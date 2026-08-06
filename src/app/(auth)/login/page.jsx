"use client";

import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/login-form";
import { PageLoader } from "@/components/ui/skeleton";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginForm />
    </Suspense>
  );
}
