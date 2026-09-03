"use client";

import { SearchIcon } from "@/components/icons/search-icon";

import { AddAddressButton } from "@/components/addresses/add-address-button";
import { AddressListView } from "@/components/addresses/address-list-view";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";

function LocationMapPreview({ latitude, longitude, label }) {
  const delta = 0.012;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <ResponsiveCard className="sticky top-24 overflow-hidden !p-0">
      <div className="border-border border-b px-5 py-4">
        <h2 className="text-foreground text-sm font-semibold">Map preview</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">{label}</p>
      </div>
      <div className="relative aspect-[4/3] w-full bg-[#111827]">
        <iframe
          title="Address location map"
          src={mapEmbedUrl}
          className="size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </ResponsiveCard>
  );
}

export function LocationDesktop({
  sortedAddresses,
  onEdit,
  onDelete,
  onSearchFocus,
  onUseCurrentLocation,
  currentLocationPreview,
  onAddFlow,
  mapLatitude,
  mapLongitude,
  mapLabel,
}) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={
        <DesktopBreadcrumbBar
          backHref={ROUTES.PROFILE}
          backLabel="Back to Profile"
          currentLabel="My Addresses"
          rightAction={<AddAddressButton onClick={onAddFlow} />}
        />
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Select Location</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage saved addresses for bookings and home visits
            </p>
          </div>

          <button
            type="button"
            onClick={onSearchFocus}
            className="border-border/70 bg-background shadow-card flex h-11 w-full max-w-xl items-center gap-3 rounded-full border px-4 text-left"
          >
            <SearchIcon className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground truncate text-sm">
              Search an area or address
            </span>
          </button>

          <AddressListView
            addresses={sortedAddresses}
            onEdit={onEdit}
            onDelete={onDelete}
            onSearchFocus={onSearchFocus}
            onUseCurrentLocation={onUseCurrentLocation}
            currentLocationPreview={currentLocationPreview}
          />
        </div>

        <aside className="hidden lg:block">
          <LocationMapPreview
            latitude={mapLatitude}
            longitude={mapLongitude}
            label={mapLabel}
          />
        </aside>
      </div>
    </DesktopLayout>
  );
}
