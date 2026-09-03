import { useProviderAuthStore } from "./provider-auth.store";
import {
  useProviderProfileStore,
  useProviderSettingsStore,
} from "./provider-profile.store";
import { useSettingsStore } from "./profile.store";
import { useRecentSearchesStore } from "./recent-searches.store";
import { useSavedProvidersStore } from "./saved-providers.store";
import { useSavedReelsStore } from "./saved-reels.store";
import { useThemeStore, useUIStore } from "./ui.store";
import { useUserAuthStore } from "./user-auth.store";
import { useUserProfileStore } from "./user-profile.store";

const persistedStores = [
  useSavedReelsStore,
  useSavedProvidersStore,
  useRecentSearchesStore,
  useUserProfileStore,
  useSettingsStore,
  useProviderProfileStore,
  useProviderSettingsStore,
  useProviderAuthStore,
  useUserAuthStore,
  useThemeStore,
  useUIStore,
];

export function rehydratePersistedStores() {
  persistedStores.forEach((store) => {
    store.persist.rehydrate();
  });
}
