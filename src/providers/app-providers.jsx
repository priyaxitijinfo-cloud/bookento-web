"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";

import { rehydratePersistedStores } from "@/store/rehydrate-persisted-stores";

import { MobilePageBackground } from "@/components/layout/mobile-page-background";

export function AppProviders({ children }) {
  useEffect(() => {
    rehydratePersistedStores();
  }, []);

  return (
    <>
      <MobilePageBackground />
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{ duration: 4000, classNames: { toast: "font-sans" } }}
      />
    </>
  );
}
