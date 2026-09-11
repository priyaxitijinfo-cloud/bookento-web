"use client";

import { usePathname } from "next/navigation";

const FULL_BLEED_PATHS = new Set(["/login", "/verify-otp", "/register"]);

export function AuthLayoutShell({ children }) {
  const pathname = usePathname();

  if (FULL_BLEED_PATHS.has(pathname)) {
    return <div className="min-h-dvh bg-white">{children}</div>;
  }

  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
