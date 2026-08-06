"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";

import { UserBottomNav, UserHeader } from "@/components/layout/user-nav";
import { ProviderCard } from "@/components/shared/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { mockProviders } from "@/mock/providers";
import { savedProviders } from "@/mock/users";

export default function SavedPage() {
  const providers = useMemo(() => {
    const providerMap = new Map(mockProviders.map((p) => [p.id, p]));
    return savedProviders
      .map((saved) => providerMap.get(saved.providerId))
      .filter(Boolean);
  }, []);

  return (
    <div className="bg-background min-h-dvh pb-20 md:pb-6">
      <UserHeader title="Saved Providers" />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-muted-foreground mb-6 text-sm">
          {providers.length} saved provider{providers.length !== 1 ? "s" : ""}
        </p>

        {providers.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved providers"
            description="Tap the heart icon on any provider to save them here."
            actionLabel="Explore providers"
            onAction={() => { window.location.href = ROUTES.PROVIDERS; }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </main>
      <UserBottomNav />
    </div>
  );
}
