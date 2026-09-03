"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { shouldUseMobileUserPageBg } from "@/lib/layout/mobile-page-bg";

const BODY_CLASS = "mobile-user-page-bg";

export function MobilePageBackground() {
  const pathname = usePathname();
  const enabled = shouldUseMobileUserPageBg(pathname);

  useEffect(() => {
    if (enabled) {
      document.body.classList.add(BODY_CLASS);
    } else {
      document.body.classList.remove(BODY_CLASS);
    }

    return () => {
      document.body.classList.remove(BODY_CLASS);
    };
  }, [enabled]);

  return null;
}
