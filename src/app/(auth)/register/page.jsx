"use client";

import { Suspense } from "react";

import { UserRegisterForm } from "@/features/auth/components/user-register-form";
import { PageLoader } from "@/components/ui/skeleton";

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <UserRegisterForm />
    </Suspense>
  );
}
