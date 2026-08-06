"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { usePersistStoreHydration } from "@/hooks/use-persist-store-hydration";
import { mockProviders } from "@/mock/providers";
import { useSavedProvidersStore } from "@/store";

import { SavedDesktop } from "./SavedDesktop";
import { SavedMobile } from "./SavedMobile";
import { SavedTablet } from "./SavedTablet";

function toListingProvider(provider) {
  return {
    id: provider.id,
    listingKey: `saved-${provider.id}`,
    businessName: provider.businessName,
    specialty: provider.specialty,
    avatar: provider.avatar,
    rating: provider.rating,
    distance: provider.distance,
    startingPrice: provider.startingPrice,
    serviceModes: provider.serviceModes?.length
      ? provider.serviceModes
      : ["in_clinic", "online"],
  };
}

export function SavedResponsive() {
  const savedIds = useSavedProvidersStore((state) => state.savedIds);
  const toggleSaved = useSavedProvidersStore((state) => state.toggleSaved);
  const hasHydrated = usePersistStoreHydration(useSavedProvidersStore);

  const providers = useMemo(() => {
    const providerMap = new Map(mockProviders.map((provider) => [provider.id, provider]));
    return savedIds
      .map((providerId) => providerMap.get(providerId))
      .filter(Boolean)
      .map(toListingProvider);
  }, [savedIds]);

  const handleWishlistToggle = useCallback(
    (providerId) => {
      const isNowSaved = toggleSaved(providerId);
      toast.message(isNowSaved ? "Added to saved" : "Removed from saved");
    },
    [toggleSaved],
  );

  const sharedProps = {
    hasHydrated,
    providers,
    savedIds,
    onWishlistToggle: handleWishlistToggle,
  };

  return (
    <ResponsiveView
      mobile={<SavedMobile {...sharedProps} />}
      tablet={<SavedTablet {...sharedProps} />}
      desktop={<SavedDesktop {...sharedProps} />}
    />
  );
}

export default SavedResponsive;
