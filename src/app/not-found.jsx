import Link from "next/link";

import { ROUTES } from "@/constants/routes.constants";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href={ROUTES.HOME} className="gradient-brand rounded-xl px-6 py-2.5 text-sm font-medium text-white">
        Go Home
      </Link>
    </div>
  );
}
