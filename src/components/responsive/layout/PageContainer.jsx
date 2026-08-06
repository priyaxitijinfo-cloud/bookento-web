"use client";

import { cn } from "@/lib/utils";
import { PAGE_CONTAINER_VARIANTS } from "@/lib/layout/page-layout.constants";

const VARIANT_MAP = {
  default: "wide",
  browse: "browse",
  narrow: "narrow",
  wide: "wide",
  full: "flush",
  flush: "flush",
  profile: "profile",
  provider: "provider",
  auth: "auth",
};

export function PageContainer({
  children,
  className,
  variant = "default",
  as: Comp = "div",
}) {
  const tokenVariant = VARIANT_MAP[variant] ?? variant;
  const layoutClass =
    PAGE_CONTAINER_VARIANTS[tokenVariant] ??
    PAGE_CONTAINER_VARIANTS.wide;

  return <Comp className={cn(layoutClass, className)}>{children}</Comp>;
}
