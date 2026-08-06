import Link from "next/link";

import { ROUTES } from "@/constants/routes.constants";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="border-primary size-10 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link href={ROUTES.HOME} className="gradient-brand rounded-xl px-6 py-2.5 text-sm font-medium text-white">
        Go Home
      </Link>
    </div>
  );
}
