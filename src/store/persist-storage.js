import { createJSONStorage } from "zustand/middleware";

const serverStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function getStorage() {
  if (typeof window === "undefined") {
    return serverStorage;
  }

  return window.localStorage;
}

export const persistStorage = createJSONStorage(getStorage);

export function createPersistOptions(options) {
  return {
    storage: persistStorage,
    skipHydration: true,
    ...options,
  };
}
