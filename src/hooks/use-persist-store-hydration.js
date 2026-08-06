"use client";

import { useEffect, useState } from "react";

export function usePersistStoreHydration(store) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = store.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    setHasHydrated(store.persist.hasHydrated());

    return unsubscribe;
  }, [store]);

  return hasHydrated;
}
