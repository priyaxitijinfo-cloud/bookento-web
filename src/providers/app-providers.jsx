"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";

import { rehydratePersistedStores } from "@/store/rehydrate-persisted-stores";

export function AppProviders({ children }) {
  useEffect(() => {
    rehydratePersistedStores();
  }, []);

  return (
    <>
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
